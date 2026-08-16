export interface AuthorizationContext { userId: string; roles: readonly string[]; }

export function assertSameUser(context: AuthorizationContext, resourceUserId: string): void {
  if (context.userId !== resourceUserId) throw new Error("FORBIDDEN");
}

export function assertRole(context: AuthorizationContext, role: string): void {
  if (!context.roles.includes(role)) throw new Error("FORBIDDEN");
}
