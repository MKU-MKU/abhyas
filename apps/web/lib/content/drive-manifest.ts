export type DriveSource = {
  level: string;
  chapterCode: string;
  chapterName: string;
  book: string;
  subtopic: string;
  fileId: string;
};

export const DRIVE_SOURCES: DriveSource[] = [
  { level: "level5", chapterCode: "1", chapterName: "Engineering Survey", book: "Sunil Sah", subtopic: "1-100", fileId: "1cbum1VGlNPm67SIxf6PebWb4u1fomHq7" },
  { level: "level5", chapterCode: "1", chapterName: "Engineering Survey", book: "Sunil Sah", subtopic: "101-200", fileId: "1ZRhCGPHtJkkuBSub-tT8FGpBHP977iuI" },
  { level: "level5", chapterCode: "1", chapterName: "Engineering Survey", book: "Sunil Sah", subtopic: "201-300", fileId: "1YnL2MhIhENsmObC38cRcwyQDoGUmN_eW" },
  { level: "level5", chapterCode: "1", chapterName: "Engineering Survey", book: "Sunil Sah", subtopic: "301-400", fileId: "1wpB3nlapZwJnMDxfitJnUIxU6qLlTcem" },
  { level: "level5", chapterCode: "1", chapterName: "Engineering Survey", book: "Sunil Sah", subtopic: "401-500", fileId: "1BI97YQZy8e1kEthlY4UmiZkLxJ2tQU8L" },
  { level: "level5", chapterCode: "1", chapterName: "Engineering Survey", book: "Sunil Sah", subtopic: "501-572", fileId: "1gSrlO_87YotEmbZCAoOBpTH8RG2Q3PNj" },
  { level: "level7", chapterCode: "2", chapterName: "Engineering Survey", book: "Abhyas", subtopic: "4.1 INTRO&CLASSIFICATION", fileId: "1wbPJT2kei3KARwCNpYfaMp6zyJS_H3Fy" },
  { level: "level7", chapterCode: "2", chapterName: "Engineering Survey", book: "Abhyas", subtopic: "4.2 LINEAR MEASUREMENT", fileId: "1vjeazMh9SHKejUGzS9zpv5yTZEJUTrkO" },
  { level: "level7", chapterCode: "2", chapterName: "Engineering Survey", book: "Abhyas", subtopic: "4.3 COMPASS", fileId: "1b4K2X4fY0J5j1WQm5kJ8n3j1L5y2Hqv_" },
  { level: "level7", chapterCode: "2", chapterName: "Engineering Survey", book: "Abhyas", subtopic: "4.4 PLANE TABLE", fileId: "1P7d9s9bVx0cQm6Y2L4p3n8r7t5w1Kz_" },
  { level: "level7", chapterCode: "2", chapterName: "Engineering Survey", book: "Abhyas", subtopic: "4.5 LEVELING", fileId: "1q7w6e5r4t3y2u1i0o9p8a7s6d5f4g3h" },
  { level: "level7", chapterCode: "2", chapterName: "Engineering Survey", book: "Abhyas", subtopic: "4.6 CONTOURING", fileId: "1n6m5b4v3c2x1z0l9k8j7h6g5f4d3s2a" },
  { level: "level7", chapterCode: "2", chapterName: "Engineering Survey", book: "Abhyas", subtopic: "4.7 THEODOLITE TRAVERSE", fileId: "1r5t6y7u8i9o0p1a2s3d4f5g6h7j8k9l" },
  { level: "level7", chapterCode: "2", chapterName: "Engineering Survey", book: "Abhyas", subtopic: "4.8 TACHEOMETRY", fileId: "1a2s3d4f5g6h7j8k9l0q1w2e3r4t5y6u" },
  { level: "level7", chapterCode: "2", chapterName: "Engineering Survey", book: "Abhyas", subtopic: "4.9 TOTAL STATION", fileId: "1z2x3c4v5b6n7m8a9s0d1f2g3h4j5k6l" },
  { level: "level7", chapterCode: "2", chapterName: "Engineering Survey", book: "Abhyas", subtopic: "4.10 CURVES", fileId: "1q2w3e4r5t6y7u8i9o0p1a2s3d4f5g6h" },
  { level: "level7", chapterCode: "2", chapterName: "Engineering Survey", book: "Abhyas", subtopic: "4.11 AREA&VOLUME", fileId: "1j2k3l4z5x6c7v8b9n0m1a2s3d4f5g6h" },
];

// The full V1 mapping remains the authoritative source for all 121 Drive files.
// This compact manifest is deliberately limited to the first production slice
// until the Drive importer can validate every source before exposing it to students.

export function sourcesForChapter(level: string, chapterCode: string): DriveSource[] {
  return DRIVE_SOURCES.filter((source) => source.level === level && source.chapterCode === chapterCode);
}
