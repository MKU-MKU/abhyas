import type { SessionAdapter } from "./session";

export function bearerSessionAdapter(resolveToken: (token: string) => Promise<{ id: string; roles: string[] } | null>): SessionAdapter {
  return {
    async getUser(request) {
      const header = request.headers.get("authorization");
      if (!header?.startsWith("Bearer ")) return null;
      const token = header.slice(7).trim();
      if (!token) return null;
      const resolved = await resolveToken(token);
      return resolved ? { id: resolved.id, roles: resolved.roles } : null;
    },
  };
}
