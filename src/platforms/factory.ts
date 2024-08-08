import type { Difficulty, PlatformKey, UpsertPayload } from "@/types";

export interface PlatformAdapter {
  key: PlatformKey; // 'leetcode', 'spoj', etc.
  prefix: string; // 'lc', 'spoj'
  isMatch(url: URL): boolean;
  normalizeUrl(url: URL): string; // canonical problem URL
  extractProblemId(url: URL, doc: Document): string | null;
  extractTitle(doc: Document): string | null;
  extractDifficulty(doc: Document): Difficulty;
  extractTags(doc: Document): string[];
}

function text(el: Element | null | undefined): string | null {
  const t = el?.textContent?.trim();
  return t || null;
}

function fromMeta(doc: Document, name: string, attr: string = "content"): string | null {
  const el = doc.querySelector(`meta[${name.includes(":") ? "property" : "name"}="${name}"]`);
  const v = el?.getAttribute(attr)?.trim();
  return v || null;
}

export const LeetCodeAdapter: PlatformAdapter = {
  key: "leetcode",
  prefix: "lc",
  isMatch(url) {
    return /leetcode\.(com|cn)$/.test(url.hostname) && /\/problems\//.test(url.pathname);
  },
  normalizeUrl(url) {
    // Canonical: origin + /problems/<slug> (no trailing slash, strip /description and query)
    const m = url.pathname.match(/\/problems\/([^/]+)/);
    if (m) return `${url.origin}/problems/${m[1]}`;
    return `${url.origin}${url.pathname}`.replace(/\/$/, "");
  },
  extractProblemId(url, _doc) {
    const m = url.pathname.match(/\/problems\/([^/]+)/);
    return m ? m[1] : null;
  },
  extractTitle(doc) {
    // Try common anchors near the title
    const candidates: (Element | null)[] = [
      doc.querySelector('a[href^="/problems/"][class*="truncate"]'),
      doc.querySelector('a.no-underline[href^="/problems/"]'),
      doc.querySelector('h1[data-cy="question-title"]'),
      doc.querySelector("h1"),
      doc.querySelector("div.text-title-large"),
    ];
    for (const el of candidates) {
      const t = text(el);
      if (t) return t;
    }
    // Meta tags fallback
    const og = fromMeta(doc, "og:title") || fromMeta(doc, "twitter:title") || doc.title;
    if (og) return og.replace(/ - LeetCode.*$/i, "").trim();
    return null;
  },
  extractDifficulty(doc) {
    const d = doc.querySelector("div.text-difficulty-easy, div.text-difficulty-medium, div.text-difficulty-hard");
    const t = d?.textContent?.toLowerCase() || "";
    if (t.includes("easy")) return "Easy";
    if (t.includes("medium")) return "Medium";
    if (t.includes("hard")) return "Hard";
    return "Unknown";
  },
  extractTags(doc) {
    const set = new Set<string>();
    doc.querySelectorAll('a[href^="/tag/"]').forEach((el) => {
      const t = el.textContent?.trim();
      if (t) set.add(t);
    });
    return Array.from(set);
  },
};

export const SpojAdapter: PlatformAdapter = {
  key: "spoj",
  prefix: "spoj",
  isMatch(url) {
    return /spoj\.com$/.test(url.hostname);
  },
  normalizeUrl(url) {
    return `${url.origin}${url.pathname}`.replace(/\/$/, "");
  },
  extractProblemId(url) {
    const m = url.pathname.match(/\/problems\/([^/]+)/);
    return m ? m[1] : null;
  },
  extractTitle(doc) {
    return text(doc.querySelector("h1, h2"));
  },
  extractDifficulty(_doc) {
    return "Unknown";
  },
  extractTags(_doc) {
    return [];
  },
};

export const PlatformFactory = {
  adapters: [LeetCodeAdapter, SpojAdapter],
  forUrl(raw: string): PlatformAdapter | null {
    let u: URL | null = null;
    try {
      u = new URL(raw);
    } catch {
      return null;
    }
    for (const a of this.adapters) if (a.isMatch(u)) return a;
    return null;
  },
};
