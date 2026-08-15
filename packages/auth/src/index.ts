export type UserRole = "student" | "admin" | "content-manager" | "finance";

export type EntitlementStatus = "trial" | "active" | "expired" | "revoked";

export interface AuthUser {
  readonly id: string;
  readonly email: string;
  readonly displayName: string | null;
  readonly roles: readonly UserRole[];
}

export interface Entitlement {
  readonly id: string;
  readonly userId: string;
  readonly status: EntitlementStatus;
  readonly startsAt: Date;
  readonly expiresAt: Date | null;
}

export interface AccessDecision {
  readonly allowed: boolean;
  readonly reason:
    | "active"
    | "trial"
    | "expired"
    | "revoked"
    | "not-entitled";
}

export function hasRole(user: AuthUser, role: UserRole): boolean {
  return user.roles.includes(role);
}

export function canAccessStudyContent(
  entitlements: readonly Entitlement[],
  now = new Date(),
): AccessDecision {
  const current = entitlements
    .filter((item) => item.startsAt.getTime() <= now.getTime())
    .filter((item) => item.expiresAt === null || item.expiresAt.getTime() > now.getTime())
    .sort((a, b) => b.startsAt.getTime() - a.startsAt.getTime())[0];

  if (!current) return { allowed: false, reason: "not-entitled" };
  if (current.status === "revoked") return { allowed: false, reason: "revoked" };
  if (current.status === "expired") return { allowed: false, reason: "expired" };
  if (current.status === "trial") return { allowed: true, reason: "trial" };
  return { allowed: true, reason: "active" };
}

export interface PasswordPolicyResult {
  readonly valid: boolean;
  readonly reasons: readonly string[];
}

export function validatePasswordPolicy(password: string): PasswordPolicyResult {
  const reasons: string[] = [];
  if (password.length < 12) reasons.push("Use at least 12 characters.");
  if (!/[A-Z]/.test(password)) reasons.push("Include an uppercase letter.");
  if (!/[a-z]/.test(password)) reasons.push("Include a lowercase letter.");
  if (!/[0-9]/.test(password)) reasons.push("Include a number.");
  if (!/[^A-Za-z0-9]/.test(password)) reasons.push("Include a special character.");
  return { valid: reasons.length === 0, reasons };
}
