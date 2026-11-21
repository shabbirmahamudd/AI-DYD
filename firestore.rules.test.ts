/**
 * Phase 0 Adversarial Rules Specification Test Suite
 * Documents expected PERMISSION_DENIED outcomes for the Dirty Dozen payloads
 * enforced by firestore.rules.
 */
export const dirtyDozenCases = [
  { id: 1, name: 'Shadow Role Escalation on /users/{uid}', expected: 'PERMISSION_DENIED' },
  { id: 2, name: 'Unverified Email Admin Spoof on /courses', expected: 'PERMISSION_DENIED' },
  { id: 3, name: 'Cross-Tenant PII Get on /users/{otherUid}', expected: 'PERMISSION_DENIED' },
  { id: 4, name: 'Blanket User List Scraping on /users', expected: 'PERMISSION_DENIED' },
  { id: 5, name: 'Self-Approval Create on /applications', expected: 'PERMISSION_DENIED' },
  { id: 6, name: 'Student Status Escalation Update on /applications', expected: 'PERMISSION_DENIED' },
  { id: 7, name: 'Document ID Poisoning (>128 chars or invalid chars)', expected: 'PERMISSION_DENIED' },
  { id: 8, name: 'Shadow Field Injection on /users/{uid}', expected: 'PERMISSION_DENIED' },
  { id: 9, name: 'Oversized String Resource Exhaustion', expected: 'PERMISSION_DENIED' },
  { id: 10, name: 'Blanket Certificate Collection Scraping', expected: 'PERMISSION_DENIED' },
  { id: 11, name: 'Client Timestamp Forgery on Create/Update', expected: 'PERMISSION_DENIED' },
  { id: 12, name: 'Immutable Activity Log Deletion', expected: 'PERMISSION_DENIED' },
] as const;
