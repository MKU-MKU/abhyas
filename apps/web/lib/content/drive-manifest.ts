export type DriveSource = {
  level: string;
  chapterCode: string;
  chapterName: string;
  book: string;
  subtopic: string;
  fileId: string;
};

// Production-validated slice copied from the existing V1 Chapter Data.
// More sources can be enabled after the importer validates them.
export const DRIVE_SOURCES: DriveSource[] = [
  { level: "level7", chapterCode: "2", chapterName: "Engineering Survey", book: "Abhyas", subtopic: "4.1 INTRO&CLASSIFICATION", fileId: "1wbPJT2kei3KARwCNpYfaMp6zyJS_H3Fy" },
  { level: "level7", chapterCode: "2", chapterName: "Engineering Survey", book: "Abhyas", subtopic: "4.2 LINEAR MEASUREMENT", fileId: "1vjeazMh9SHKejUGzS9zpv5yTZEJUTrkO" },
  { level: "level7", chapterCode: "2", chapterName: "Engineering Survey", book: "Abhyas", subtopic: "4.3 COMPASS", fileId: "19Uw3ELNKuxqt5xGYtVnyBBV1Hydzd_2N" },
  { level: "level7", chapterCode: "2", chapterName: "Engineering Survey", book: "Abhyas", subtopic: "4.4 PLANE TABLE", fileId: "1ffYjw6PACS3Ate0E4TBV3Metsaj-9O7O" },
  { level: "level7", chapterCode: "2", chapterName: "Engineering Survey", book: "Abhyas", subtopic: "4.5 LEVELING", fileId: "1g7P_VQ8-sf0WOB4t9AXlUCPCrSkp1kDG" },
  { level: "level7", chapterCode: "2", chapterName: "Engineering Survey", book: "Abhyas", subtopic: "4.6 CONTOURING", fileId: "1EIsFNCEkpDcsMdr-CRC8XGkPriVmWGqc" },
  { level: "level7", chapterCode: "2", chapterName: "Engineering Survey", book: "Abhyas", subtopic: "4.7 THEODOLITE TRAVERSE", fileId: "1aJmlhaUdz1u_60ZEBMV507wWEoJsCNgw" },
  { level: "level7", chapterCode: "2", chapterName: "Engineering Survey", book: "Abhyas", subtopic: "4.8 TACHEOMETRY", fileId: "1tPehSRACcKb39lHQAIyN9qsHk73uXnTi" },
  { level: "level7", chapterCode: "2", chapterName: "Engineering Survey", book: "Abhyas", subtopic: "4.9 TOTAL STATION", fileId: "1A6tik-Wn8jhE6cu3m8Bhy6dRnrGeHe65" },
  { level: "level7", chapterCode: "2", chapterName: "Engineering Survey", book: "Abhyas", subtopic: "4.10 CURVES", fileId: "1CtK008-ohQtBw-qNdGlDljBvv9OnZQvq" },
  { level: "level7", chapterCode: "2", chapterName: "Engineering Survey", book: "Abhyas", subtopic: "4.11 AREA&VOLUME", fileId: "1ywPr6-7BdvgV1vFu6k_MN4r1QdH12VDf" },
  { level: "level7", chapterCode: "3", chapterName: "Construction Materials", book: "Abhyas", subtopic: "5.1 MATERIAL PROPERTIES", fileId: "13dxdpQPDOnP7npN1bdzsaA1OfriW_Ts3" },
  { level: "level7", chapterCode: "3", chapterName: "Construction Materials", book: "Abhyas", subtopic: "5.2 STONES", fileId: "1FeyTH5YX_oaqwkicY3EOAp_yfVSqcoh3" },
  { level: "level7", chapterCode: "3", chapterName: "Construction Materials", book: "Abhyas", subtopic: "5.3 CERAMIC MATERIALS", fileId: "1EJOdjRII6R3I1qTvGSHJxMTseUAKiMW-" },
  { level: "level7", chapterCode: "3", chapterName: "Construction Materials", book: "Abhyas", subtopic: "5.4 CEMENTING MATERIALS", fileId: "1Kn2zkXYtb8QsgrYwlw9SYBsnvNMtSkyu" },
  { level: "level7", chapterCode: "3", chapterName: "Construction Materials", book: "Abhyas", subtopic: "5.5 METALS", fileId: "1-w2GgK5x_BQOXV1L4PmmX--I6pu2-Pjj" },
  { level: "level7", chapterCode: "3", chapterName: "Construction Materials", book: "Abhyas", subtopic: "5.6 TIMBER&WOOD", fileId: "1xm9bJdbLm-9OA-sj0X4Ros8S_5KVB9qx" },
  { level: "level7", chapterCode: "3", chapterName: "Construction Materials", book: "Abhyas", subtopic: "5.7 MISC MATERIALS", fileId: "1yNLIr5MA5MUYljoa29Bdi_1JTsqvI_hj" },
  { level: "level7", chapterCode: "3", chapterName: "Construction Materials", book: "Abhyas", subtopic: "5.8 SOIL PROPERTIES", fileId: "1gyyZj77lsbMRHsKodEJJqzjHmOY5F7R5" },
  { level: "level7", chapterCode: "3", chapterName: "Construction Materials", book: "Abhyas", subtopic: "5.9 LOCAL&MODERN MAT", fileId: "1dF0aR228CrYtLYEg79C9-n8u6yOlU9Sb" },
  { level: "level7", chapterCode: "4", chapterName: "Concrete Technology", book: "Abhyas", subtopic: "6.1 CONCRETE CONSTITUENTS", fileId: "1iazvTuHBDaQxJCENIhxUwnsqzVjCG2Jx" },
  { level: "level7", chapterCode: "4", chapterName: "Concrete Technology", book: "Abhyas", subtopic: "6.2 W-C RATIO", fileId: "1IlHQ-3GXveMhfd_E_hiF-_cdJzaRuoSr" },
  { level: "level7", chapterCode: "4", chapterName: "Concrete Technology", book: "Abhyas", subtopic: "6.3 GRADE&MIX DESIGN", fileId: "1te_KTUkxYfalKxdyVA2s-8Uy2NDok0kI" },
  { level: "level7", chapterCode: "4", chapterName: "Concrete Technology", book: "Abhyas", subtopic: "6.4 MIXING&CURING", fileId: "14yqGXhxO3SGFBVkBNcwTwxPJG-zQYrUC" },
  { level: "level7", chapterCode: "4", chapterName: "Concrete Technology", book: "Abhyas", subtopic: "6.5 ADMIXTURES", fileId: "1fQLh_9juinKD_hV3KLBEcltdd5F-poV3" },
  { level: "level7", chapterCode: "4", chapterName: "Concrete Technology", book: "Abhyas", subtopic: "6.6 HIGH STRENGTH CONC", fileId: "1ee6mpS2WoaIEVxjXW8MiJbDxHVvWDKkx" },
  { level: "level7", chapterCode: "4", chapterName: "Concrete Technology", book: "Abhyas", subtopic: "6.7 PRESTRESSED CONC", fileId: "1kr7oUnuhWKF1eV57RZWc7ZebNIXpZQc5" },
];

export function sourcesForChapter(level: string, chapterCode: string): DriveSource[] {
  return DRIVE_SOURCES.filter((source) => source.level === level && source.chapterCode === chapterCode);
}
