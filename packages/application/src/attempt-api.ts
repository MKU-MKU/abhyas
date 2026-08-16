export interface AttemptApiStore {
  create(input: { userId: string; mode: string; questionIds: readonly string[] }): Promise<{ id: string; startedAt: Date }>;
  get(id: string): Promise<{ id: string; userId: string; mode: string; status: string; questionIds: readonly string[]; answers: readonly { questionId: string; selectedOptionIndexes: readonly number[]; elapsedMs: number }[] } | null>;
}

export function authorizeAttempt(store: AttemptApiStore, userId: string, attemptUserId: string): void {
  if (userId !== attemptUserId) throw new Error("FORBIDDEN");
}
