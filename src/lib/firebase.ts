import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocFromServer,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

let connectionTested = false;

export async function testFirestoreConnection(): Promise<boolean> {
  if (connectionTested) return true;
  connectionTested = true;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Firebase Firestore connection check failed: client is offline.');
    }
    return false;
  }
}

export async function signInWithGoogleFirebase() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signOutFirebase() {
  await signOut(auth);
}

export async function syncStudentProfileToFirestore(profile: {
  uid: string;
  fullName: string;
  email: string;
  phone?: string;
  district?: string;
  education?: string;
  avatarUrl?: string;
}) {
  if (!auth.currentUser || auth.currentUser.uid !== profile.uid) return;
  const path = `users/${profile.uid}`;
  try {
    const ref = doc(db, 'users', profile.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        uid: profile.uid,
        fullName: profile.fullName.slice(0, 120),
        email: profile.email.slice(0, 160),
        phone: (profile.phone || '').slice(0, 30),
        district: (profile.district || '').slice(0, 80),
        education: (profile.education || '').slice(0, 120),
        avatarUrl: (profile.avatarUrl || '').slice(0, 500),
        role: 'student',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(
        ref,
        {
          fullName: profile.fullName.slice(0, 120),
          phone: (profile.phone || '').slice(0, 30),
          district: (profile.district || '').slice(0, 80),
          education: (profile.education || '').slice(0, 120),
          avatarUrl: (profile.avatarUrl || '').slice(0, 500),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function syncApplicationToFirestore(appData: {
  id: string;
  trackingCode: string;
  fullName: string;
  email: string;
  phone: string;
  nidOrBirthReg?: string;
  dateOfBirth?: string;
  educationLevel?: string;
  district: string;
  centerId?: string;
  courseId: string;
}) {
  if (!auth.currentUser) return;
  const path = `applications/${appData.id}`;
  try {
    await setDoc(doc(db, 'applications', appData.id), {
      id: appData.id.slice(0, 128),
      userId: auth.currentUser.uid,
      trackingCode: appData.trackingCode.slice(0, 40),
      fullName: appData.fullName.slice(0, 120),
      email: appData.email.slice(0, 160),
      phone: appData.phone.slice(0, 30),
      nidOrBirthReg: (appData.nidOrBirthReg || '').slice(0, 40),
      dateOfBirth: (appData.dateOfBirth || '').slice(0, 30),
      educationLevel: (appData.educationLevel || '').slice(0, 80),
      district: appData.district.slice(0, 80),
      centerId: (appData.centerId || '').slice(0, 128),
      courseId: appData.courseId.slice(0, 128),
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function verifyCertificateInFirestore(code: string) {
  const cleanId = code.trim();
  if (!/^[a-zA-Z0-9_\-]+$/.test(cleanId) || cleanId.length > 128) return null;
  const path = `certificates/${cleanId}`;
  try {
    const snap = await getDoc(doc(db, 'certificates', cleanId));
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function fetchStudentApplicationsFromFirestore(uid: string) {
  const path = 'applications';
  try {
    const q = query(collection(db, path), where('userId', '==', uid));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function pushAdminSiteSettingsToFirestore(payload: Record<string, unknown>) {
  if (!auth.currentUser) return;
  const path = 'siteSettings/public';
  try {
    await setDoc(doc(db, 'siteSettings', 'public'), {
      id: 'public',
      payload,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
