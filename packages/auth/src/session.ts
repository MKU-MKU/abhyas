export interface AuthenticatedUser {
  readonly id: string;
  readonly roles: readonly string[];
}

export interface SessionAdapter {
  getUser(request: Request): Promise<AuthenticatedUser | null>;
}

export async function requireUser(adapter: SessionAdapter, request: Request): Promise<AuthenticatedUser> {
  const user = await adapter.getUser(request);
  if (!user) throw new Error("AUTHENTICATION_REQUIRED");
  return user;
}
