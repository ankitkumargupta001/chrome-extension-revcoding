import { BgRequest, BgResponse, ProblemEntry, StorageSchema, UpsertPayload } from "@/types";

const STORAGE_KEY = "problems";

async function getState(): Promise<StorageSchema> {
  const data = await chrome.storage.local.get([STORAGE_KEY]);
  return {
    problems: (data[STORAGE_KEY] as Record<string, ProblemEntry>) || {},
  };
}

async function saveState(state: StorageSchema): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEY]: state.problems });
}

function statsFrom(map: Record<string, ProblemEntry>) {
  const all = Object.values(map);
  const byDifficulty = all.reduce(
    (acc, p) => {
      acc[p.difficulty] = (acc[p.difficulty] || 0) as number;
      acc[p.difficulty]++;
      return acc;
    },
    { Easy: 0, Medium: 0, Hard: 0, Unknown: 0 } as Record<string, number>
  );
  return { total: all.length, byDifficulty };
}

function randomId(): string {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

function generateKey(platformPrefix: string, problemId: string): string {
  return `${platformPrefix}-${problemId}-${randomId()}`;
}

function findByUrl(problems: Record<string, ProblemEntry>, url: string): string | null {
  for (const [id, p] of Object.entries(problems)) {
    if (p.url === url) return id;
  }
  return null;
}

function upsert(state: StorageSchema, payload: UpsertPayload): ProblemEntry {
  const now = Date.now();
  const existingId = findByUrl(state.problems, payload.url);

  if (existingId) {
    const prev = state.problems[existingId];
    const updated: ProblemEntry = {
      ...prev,
      ...payload,
      id: prev.id,
      updatedAt: now,
    };
    state.problems[existingId] = updated;
    return updated;
  }

  const id = generateKey(payload.platformPrefix, payload.problemId);
  const created: ProblemEntry = {
    id,
    platform: payload.platform,
    platformPrefix: payload.platformPrefix,
    problemId: payload.problemId,
    title: payload.title,
    url: payload.url,
    difficulty: payload.difficulty,
    tags: payload.tags,
    customTags: payload.customTags,
    notes: payload.notes,
    addedAt: now,
    updatedAt: now,
    inRevisionQueue: payload.inRevisionQueue,
    nextReviewDate: payload.nextReviewDate,
  };
  state.problems[id] = created;
  return created;
}

chrome.runtime.onMessage.addListener((msg: BgRequest, _sender, sendResponse) => {
  (async () => {
    try {
      if (msg.type === "GET_BY_URL") {
        const state = await getState();
        const id = findByUrl(state.problems, msg.url);
        const entry = id ? state.problems[id] : undefined;
        const res: BgResponse = { ok: true, entry };
        sendResponse(res);
        return;
      }

      if (msg.type === "UPSERT_PROBLEM") {
        const state = await getState();
        const saved = upsert(state, msg.payload);
        await saveState(state);
        sendResponse({ ok: true, entry: saved });
        return;
      }

      if (msg.type === "UPDATE_PROBLEM") {
        const state = await getState();
        const existing = state.problems[msg.id];
        if (!existing) {
          sendResponse({ ok: false, error: "Not found" });
          return;
        }
        const updated = { ...existing, ...msg.updates, updatedAt: Date.now() } as ProblemEntry;
        state.problems[msg.id] = updated;
        await saveState(state);
        sendResponse({ ok: true });
        return;
      }

      if (msg.type === "GET_ALL") {
        const state = await getState();
        const all = Object.values(state.problems).sort((a, b) => b.updatedAt - a.updatedAt);
        sendResponse({ ok: true, all } as BgResponse);
        return;
      }

      if (msg.type === "EXPORT") {
        const state = await getState();
        sendResponse({ ok: true, json: state });
        return;
      }

      if (msg.type === "IMPORT") {
        const incoming = msg.data;
        const state = await getState();
        state.problems = { ...state.problems, ...(incoming.problems || {}) };
        await saveState(state);
        sendResponse({ ok: true });
        return;
      }

      if (msg.type === "STATS") {
        const state = await getState();
        sendResponse({ ok: true, stats: statsFrom(state.problems) });
        return;
      }

      if (msg.type === "CLEAR_ALL") {
        const empty: StorageSchema = { problems: {} };
        await saveState(empty);
        sendResponse({ ok: true });
        return;
      }

      sendResponse({ ok: false, error: "Unknown message" });
    } catch (e: any) {
      sendResponse({ ok: false, error: e?.message || String(e) });
    }
  })();
  return true;
});

export {};
