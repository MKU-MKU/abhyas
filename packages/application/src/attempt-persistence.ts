export interface AttemptPersistence {
  create(input: { userId: string; mode: string; questionIds: readonly string[] }): Promise<{ id: string; startedAt: Date }>;
  get(id: string): Promise<{ id: string; userId: string; mode: string; status: "in_progress" | "submitted"; questionIds: readonly string[]; answers: readonly { questionId: string; selectedOptionIndexes: readonly number[]; elapsedMs: number }[] } | null>;
  recordAnswer(input: { attemptId: string; questionId: string; selectedOptionIndexes: readonly number[]; isCorrect: boolean; elapsedMs: number }): Promise<void>;
  submit(input: { attemptId: string; score: number; total: number; durationMs: number }): Promise<void>;
}
