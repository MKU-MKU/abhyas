import type { AuthenticatedUser } from "./session";

export function canAccessUserResource(user: AuthenticatedUser, resourceUserId: string): boolean {
  return user.id === resourceUserId || user.roles.includes("admin");
}

export function canPerform(user: AuthenticatedUser, action: string): boolean {
  if (user.roles.includes("admin")) return true;
  return action === "attempt:read" || action === "attempt:create" || action === "attempt:update";
}
