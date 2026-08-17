import type { DriveSource } from "./drive-manifest";

export type DriveLoadFailure = {
  source: DriveSource;
  message: string;
};

export function describeDriveFailure(source: DriveSource, error: unknown): DriveLoadFailure {
  return {
    source,
    message: error instanceof Error ? error.message : "Question source could not be opened.",
  };
}
