import { index, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "../schema";

export const quizAttempts = pgTable("quiz_attempts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  mode: text("mode").notNull(),
  status: text("status").default("in_progress").notNull(),
  startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
  submittedAt: timestamp("submitted_at", { withTimezone: true }),
  score: integer("score"),
  total: integer("total"),
  durationMs: integer("duration_ms"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
}, (table) => [index("quiz_attempts_user_idx").on(table.userId), index("quiz_attempts_status_idx").on(table.status)]);

export const quizAttemptAnswers = pgTable("quiz_attempt_answers", {
  id: uuid("id").defaultRandom().primaryKey(),
  attemptId: uuid("attempt_id").notNull().references(() => quizAttempts.id, { onDelete: "cascade" }),
  questionId: uuid("question_id").notNull(),
  selectedOptionIndexes: jsonb("selected_option_indexes").$type<number[]>().default([]).notNull(),
  isCorrect: integer("is_correct").notNull(),
  elapsedMs: integer("elapsed_ms").default(0).notNull(),
  answeredAt: timestamp("answered_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [index("quiz_attempt_answers_attempt_idx").on(table.attemptId), index("quiz_attempt_answers_question_idx").on(table.questionId)]);
