# Security Specification — DYD AI Firestore Rules

## 1. Data Invariants
1. **Identity Integrity**: A student `users/{userId}` document may only be read, created, or updated by `request.auth.uid == userId` (with `email_verified == true`) or an authorized `isAdmin()`.
2. **Self-Assigned Role Prevention**: Students creating `users/{userId}` MUST supply `role == 'student'` and may NEVER grant themselves admin privileges or alter `role` on update.
3. **Application Ownership & State Integrity**: Admission applications (`applications/{applicationId}`) require `userId == request.auth.uid` on create and initial `status == 'pending'`. Students cannot approve or reject their own applications (`status` transitions are admin-only).
4. **Catalog & CMS Integrity**: `courses`, `courseModules`, `trainingCenters`, `packages`, `notices`, and `siteSettings` are publicly readable (zero PII) and strictly writable only by `isAdmin()`.
5. **PII & Student Records Isolation**: `notifications`, `admitCards`, and `results` contain student-specific records and only allow `get` and `list` when `resource.data.userId == request.auth.uid` or `isAdmin()`. Blanket `list` is strictly forbidden.
6. **Certificate Verification**: `certificates/{certificateId}` allows single-document `get` by exact certificate code/ID for verification without exposing `list` scraping of all issued certificates.
7. **Audit Log Protection**: `activityLogs` are readable and creatable strictly by `isAdmin()`, and immutable after creation.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Shadow Role Escalation**: Student creates `/users/{uid}` with `{ role: "admin" }`. Expected: `PERMISSION_DENIED`.
2. **Unverified Email Spoof**: User with `email: "shabbirmahamudd@gmail.com"` and `email_verified: false` tries to write `/courses/c1`. Expected: `PERMISSION_DENIED`.
3. **Cross-Tenant PII Read**: Student A tries `get(/users/studentB)`. Expected: `PERMISSION_DENIED`.
4. **Blanket User List Scraping**: Student A runs `list(/users)`. Expected: `PERMISSION_DENIED`.
5. **Self-Approval State Shortcutting**: Student creates `/applications/app1` with `{ status: "approved" }`. Expected: `PERMISSION_DENIED`.
6. **Student Tampering with Status**: Student updates `/applications/app1` changing `status` from `pending` to `approved`. Expected: `PERMISSION_DENIED`.
7. **ID Poisoning**: Attacker writes `/applications/very_long_junk_id_exceeding_128_chars...` or invalid chars `../admin`. Expected: `PERMISSION_DENIED`.
8. **Shadow Field Injection**: Student updates `/users/{uid}` adding `{ isVerified: true, extraQuota: 999 }`. Expected: `PERMISSION_DENIED`.
9. **Resource Exhaustion String**: Applicant submits `fullName` with a 50KB string. Expected: `PERMISSION_DENIED`.
10. **Blanket Certificate Scraping**: Anonymous user calls `list(/certificates)`. Expected: `PERMISSION_DENIED`.
11. **Timestamp Forgery**: Student creates `/applications/app1` with backdated `createdAt` not matching `request.time`. Expected: `PERMISSION_DENIED`.
12. **Audit Log Deletion**: Non-admin or compromised editor attempts `delete(/activityLogs/log1)`. Expected: `PERMISSION_DENIED`.
