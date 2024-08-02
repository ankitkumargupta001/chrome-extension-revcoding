export type Difficulty = "Easy" | "Medium" | "Hard" | "Unknown";

export type PlatformKey = "leetcode" | "spoj" | string;

export interface ProblemEntry {
  id: string; // lc-<problemId>-<rand5>
  platform: PlatformKey; // e.g., 'leetcode'
  platformPrefix: string; // e.g., 'lc'
  problemId: string; // e.g., 'median-of-two-sorted-arrays'
  title: string;
  url: string; // canonical problem URL (no query/description)
  difficulty: Difficulty;
  tags: string[]; // scraped tags
  customTags: string[]; // user-added tags
  notes: string;
  addedAt: number;
  updatedAt: number;
  inRevisionQueue: boolean;
  nextReviewDate?: string; // ISO date (YYYY-MM-DD)
}

export interface StorageSchema {
  problems: Record<string, ProblemEntry>;
}

export type UpsertPayload = {
  platform: PlatformKey;
  platformPrefix: string;
  problemId: string;
  url: string;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  customTags: string[];
  notes: string;
  inRevisionQueue: boolean;
  nextReviewDate?: string;
};

export type BgRequest =
  | { type: "GET_BY_URL"; url: string }
  | { type: "UPSERT_PROBLEM"; payload: UpsertPayload }
  | { type: "UPDATE_PROBLEM"; id: string; updates: Partial<ProblemEntry> }
  | { type: "GET_ALL" }
  | { type: "EXPORT" }
  | { type: "IMPORT"; data: StorageSchema }
  | { type: "STATS" }
  | { type: "CLEAR_ALL" };

export type BgResponse = { ok: true; entry?: ProblemEntry; all?: ProblemEntry[]; json?: StorageSchema; stats?: any } | { ok: false; error: string };
