import type { ProblemEntry, Difficulty, UpsertPayload } from "@/types";
import { PlatformFactory } from "@/platforms/factory";
// import { chrome } from "chrome";

const STYLES = {
  button: {
    position: "fixed" as const,
    right: "20px",
    bottom: "20px",
    zIndex: "2147483647",
    padding: "6px 12px",
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    color: "#475569",
    fontSize: "12px",
    fontWeight: "500",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backdropFilter: "blur(8px)",
    minWidth: "auto",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    letterSpacing: "0.025em",
  },
  overlay: {
    position: "fixed" as const,
    inset: "0",
    background: "rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(4px)",
    zIndex: "2147483647",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
  },
  modal: {
    width: "min(480px, 100%)",
    maxHeight: "90vh",
    overflow: "auto",
    background: "#ffffff",
    borderRadius: "12px",
    padding: "0",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    border: "1px solid #e5e7eb",
  },
  header: {
    padding: "20px 20px 16px",
    borderBottom: "1px solid #f3f4f6",
    background: "#fafafa",
    borderRadius: "12px 12px 0 0",
  },
  content: {
    padding: "20px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "13px",
    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
    background: "#ffffff",
    outline: "none",
    color: "#000",
  },
  textarea: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "13px",
    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
    resize: "vertical" as const,
    minHeight: "80px",
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
    background: "#ffffff",
    outline: "none",
    color: "#000",
  },
  primaryButton: {
    padding: "10px 16px",
    borderRadius: "6px",
    border: "1px solid #3b82f6",
    background: "#3b82f6",
    color: "white",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.15s ease",
    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
    outline: "none",
  },
  secondaryButton: {
    padding: "10px 16px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#6b7280",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.15s ease",
    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
    outline: "none",
  },
};

function waitForBody(): Promise<void> {
  return new Promise((resolve) => {
    if (document.body) return resolve();
    const obs = new MutationObserver(() => {
      if (document.body) {
        obs.disconnect();
        resolve();
      }
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  });
}

function getTodayIso(): string {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

function getAdapter() {
  return PlatformFactory.forUrl(location.href);
}

function canonicalUrlAndScrape() {
  const adapter = getAdapter();
  if (!adapter) return null;
  const u = new URL(location.href);
  const canonical = adapter.normalizeUrl(u);
  const problemId = adapter.extractProblemId(u, document) || "";
  let title = adapter.extractTitle(document) || "";
  if (!title && problemId) {
    const human = problemId
      .split("-")
      .map((s) => (s.length ? s[0].toUpperCase() + s.slice(1) : s))
      .join(" ");
    title = human;
  }
  const difficulty = adapter.extractDifficulty(document);
  const tags = adapter.extractTags(document);
  return { adapter, canonical, problemId, title, difficulty, tags } as const;
}

function createButton(): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.id = "lc-revision-btn";
  btn.textContent = "Add to revision";

  btn.style.cssText = `
    position: fixed !important;
    right: 20px !important;
    bottom: 20px !important;
    z-index: 2147483647 !important;
    padding: 6px 12px !important;
    border-radius: 6px !important;
    border: 1px solid #e2e8f0 !important;
    background: #ffffff !important;
    color: #475569 !important;
    font-size: 12px !important;
    font-weight: 500 !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
    cursor: pointer !important;
    transition: all 0.2s ease !important;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
    backdrop-filter: blur(8px) !important;
    min-width: auto !important;
    height: 32px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    letter-spacing: 0.025em !important;
    opacity: 1 !important;
    visibility: visible !important;
    pointer-events: auto !important;
  `;

  btn.addEventListener("mouseenter", () => {
    btn.style.cssText += `
      background: #f8fafc !important;
      border-color: #cbd5e1 !important;
      transform: translateY(-1px) !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12) !important;
      color: #334155 !important;
    `;
  });

  btn.addEventListener("mouseleave", () => {
    btn.style.cssText = `
      position: fixed !important;
      right: 20px !important;
      bottom: 20px !important;
      z-index: 2147483647 !important;
      padding: 6px 12px !important;
      border-radius: 6px !important;
      border: 1px solid #e2e8f0 !important;
      background: #ffffff !important;
      color: #475569 !important;
      font-size: 12px !important;
      font-weight: 500 !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
      cursor: pointer !important;
      transition: all 0.2s ease !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      backdrop-filter: blur(8px) !important;
      min-width: auto !important;
      height: 32px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      letter-spacing: 0.025em !important;
      opacity: 1 !important;
      visibility: visible !important;
      pointer-events: auto !important;
    `;
  });

  return btn;
}

function createModal(): HTMLDivElement {
  const overlay = document.createElement("div");
  overlay.id = "lc-revision-modal";
  Object.assign(overlay.style, STYLES.overlay);

  // Close on overlay click
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });

  const modal = document.createElement("div");
  Object.assign(modal.style, STYLES.modal);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  return overlay;
}

function createTagChip(text: string): HTMLSpanElement {
  const span = document.createElement("span");
  span.textContent = text;
  span.style.fontSize = "11px";
  span.style.background = "#f3f4f6";
  span.style.color = "#4b5563";
  span.style.border = "1px solid #e5e7eb";
  span.style.borderRadius = "4px";
  span.style.padding = "3px 6px";
  span.style.whiteSpace = "nowrap";
  span.style.fontWeight = "500";
  span.style.fontFamily = 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace';
  span.style.letterSpacing = "0.025em";
  return span;
}

function renderForm(overlay: HTMLDivElement, entry: ProblemEntry | null, defaults: Partial<ProblemEntry>) {
  const modal = overlay.firstElementChild as HTMLDivElement;
  modal.innerHTML = "";

  // Header section
  const header = document.createElement("div");
  Object.assign(header.style, STYLES.header);

  const headerContent = document.createElement("div");
  headerContent.style.display = "flex";
  headerContent.style.justifyContent = "space-between";
  headerContent.style.alignItems = "flex-start";
  headerContent.style.gap = "12px";

  const titleSection = document.createElement("div");
  titleSection.style.flex = "1";

  const title = document.createElement("h2");
  title.textContent = entry?.title || defaults.title || "Add Problem";
  title.style.fontSize = "16px";
  title.style.fontWeight = "600";
  title.style.color = "#111827";
  title.style.margin = "0 0 6px 0";
  title.style.fontFamily = 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace';
  title.style.lineHeight = "1.4";
  titleSection.appendChild(title);

  const difficultyBadge = document.createElement("div");
  const difficulty = (entry?.difficulty || defaults.difficulty || "Unknown") as Difficulty;
  difficultyBadge.textContent = difficulty;
  difficultyBadge.style.fontSize = "11px";
  difficultyBadge.style.fontWeight = "500";
  difficultyBadge.style.padding = "3px 6px";
  difficultyBadge.style.borderRadius = "4px";
  difficultyBadge.style.display = "inline-block";
  difficultyBadge.style.fontFamily = 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace';
  difficultyBadge.style.letterSpacing = "0.025em";

  const difficultyColors = {
    Easy: { bg: "#ecfdf5", color: "#065f46" },
    Medium: { bg: "#fef3c7", color: "#92400e" },
    Hard: { bg: "#fef2f2", color: "#991b1b" },
    Unknown: { bg: "#f3f4f6", color: "#6b7280" },
  };

  const colors = difficultyColors[difficulty] || difficultyColors.Unknown;
  difficultyBadge.style.background = colors.bg;
  difficultyBadge.style.color = colors.color;
  titleSection.appendChild(difficultyBadge);

  const closeBtn = document.createElement("button");
  closeBtn.innerHTML = "×";
  closeBtn.style.width = "28px";
  closeBtn.style.height = "28px";
  closeBtn.style.border = "1px solid #d1d5db";
  closeBtn.style.borderRadius = "6px";
  closeBtn.style.background = "#ffffff";
  closeBtn.style.color = "#6b7280";
  closeBtn.style.cursor = "pointer";
  closeBtn.style.display = "flex";
  closeBtn.style.alignItems = "center";
  closeBtn.style.justifyContent = "center";
  closeBtn.style.fontSize = "16px";
  closeBtn.style.transition = "all 0.15s ease";
  closeBtn.style.outline = "none";
  closeBtn.onclick = () => overlay.remove();

  closeBtn.addEventListener("mouseenter", () => {
    closeBtn.style.background = "#f9fafb";
    closeBtn.style.borderColor = "#9ca3af";
  });

  closeBtn.addEventListener("mouseleave", () => {
    closeBtn.style.background = "#ffffff";
    closeBtn.style.borderColor = "#d1d5db";
  });

  headerContent.appendChild(titleSection);
  headerContent.appendChild(closeBtn);
  header.appendChild(headerContent);
  modal.appendChild(header);

  // Content section
  const content = document.createElement("div");
  Object.assign(content.style, STYLES.content);

  // Tags section
  const allTags = Array.from(new Set([...(entry?.tags || defaults.tags || []), ...((entry?.customTags || defaults.customTags || []) as string[])]));

  if (allTags.length > 0) {
    const tagsLabel = document.createElement("div");
    tagsLabel.textContent = "Tags";
    tagsLabel.style.fontSize = "12px";
    tagsLabel.style.fontWeight = "600";
    tagsLabel.style.color = "#374151";
    tagsLabel.style.marginBottom = "6px";
    tagsLabel.style.fontFamily = 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace';
    tagsLabel.style.letterSpacing = "0.025em";
    content.appendChild(tagsLabel);

    const tagsContainer = document.createElement("div");
    tagsContainer.style.display = "flex";
    tagsContainer.style.flexWrap = "wrap";
    tagsContainer.style.gap = "4px";
    tagsContainer.style.marginBottom = "16px";
    allTags.slice(0, 20).forEach((tag) => {
      tagsContainer.appendChild(createTagChip(tag));
    });
    content.appendChild(tagsContainer);
  }

  // Notes field
  const notesLabel = document.createElement("label");
  notesLabel.textContent = "Notes";
  notesLabel.style.display = "block";
  notesLabel.style.fontSize = "12px";
  notesLabel.style.fontWeight = "600";
  notesLabel.style.color = "#374151";
  notesLabel.style.marginBottom = "6px";
  notesLabel.style.fontFamily = 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace';
  notesLabel.style.letterSpacing = "0.025em";
  content.appendChild(notesLabel);

  const notes = document.createElement("textarea");
  notes.value = entry?.notes || defaults.notes || "";
  notes.placeholder = "Solution approach, key insights, or notes...";
  Object.assign(notes.style, STYLES.textarea);
  notes.style.marginBottom = "16px";

  notes.addEventListener("focus", () => {
    notes.style.borderColor = "#3b82f6";
    notes.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
  });

  notes.addEventListener("blur", () => {
    notes.style.borderColor = "#d1d5db";
    notes.style.boxShadow = "none";
  });

  content.appendChild(notes);

  // Custom tags field
  const customTagsLabel = document.createElement("label");
  customTagsLabel.textContent = "Custom Tags";
  customTagsLabel.style.display = "block";
  customTagsLabel.style.fontSize = "12px";
  customTagsLabel.style.fontWeight = "600";
  customTagsLabel.style.color = "#374151";
  customTagsLabel.style.marginBottom = "6px";
  customTagsLabel.style.fontFamily = 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace';
  customTagsLabel.style.letterSpacing = "0.025em";
  content.appendChild(customTagsLabel);

  const customTags = document.createElement("input");
  customTags.type = "text";
  customTags.value = (entry?.customTags || defaults.customTags || []).join(", ");
  customTags.placeholder = "binary-search, two-pointers, dp";
  Object.assign(customTags.style, STYLES.input);
  customTags.style.marginBottom = "16px";

  customTags.addEventListener("focus", () => {
    customTags.style.borderColor = "#3b82f6";
    customTags.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
  });

  customTags.addEventListener("blur", () => {
    customTags.style.borderColor = "#d1d5db";
    customTags.style.boxShadow = "none";
  });

  content.appendChild(customTags);

  const revisionContainer = document.createElement("div");
  revisionContainer.style.display = "flex";
  revisionContainer.style.alignItems = "center";
  revisionContainer.style.gap = "8px";
  revisionContainer.style.marginBottom = "16px";
  revisionContainer.style.padding = "10px";
  revisionContainer.style.background = "#f9fafb";
  revisionContainer.style.borderRadius = "6px";
  revisionContainer.style.border = "1px solid #f3f4f6";

  const revisionCheckbox = document.createElement("input");
  revisionCheckbox.type = "checkbox";
  revisionCheckbox.checked = entry?.inRevisionQueue || defaults.inRevisionQueue || false;
  revisionCheckbox.style.width = "14px";
  revisionCheckbox.style.height = "14px";
  revisionCheckbox.style.accentColor = "#3b82f6";
  // Wrap with custom visual checkbox to ensure light background initially
  const checkboxWrapper = document.createElement("span");
  checkboxWrapper.style.position = "relative";
  checkboxWrapper.style.display = "inline-block";
  checkboxWrapper.style.width = "14px";
  checkboxWrapper.style.height = "14px";

  const customBox = document.createElement("span");
  customBox.style.position = "absolute";
  customBox.style.inset = "0";
  customBox.style.border = "1px solid #d1d5db";
  customBox.style.borderRadius = "3px";
  customBox.style.background = revisionCheckbox.checked ? "#3b82f6" : "#ffffff";
  customBox.style.display = "inline-flex";
  customBox.style.alignItems = "center";
  customBox.style.justifyContent = "center";
  customBox.style.fontSize = "12px";
  customBox.style.lineHeight = "1";
  customBox.style.color = "#ffffff";
  customBox.style.userSelect = "none";

  const updateCustomBox = () => {
    customBox.style.background = revisionCheckbox.checked ? "#3b82f6" : "#ffffff";
    customBox.style.borderColor = revisionCheckbox.checked ? "#2563eb" : "#d1d5db";
    customBox.textContent = revisionCheckbox.checked ? "✓" : "";
  };
  updateCustomBox();

  // Place native input over the custom box for accessibility and keyboard support
  revisionCheckbox.style.position = "absolute";
  revisionCheckbox.style.opacity = "0";
  revisionCheckbox.style.inset = "0";
  revisionCheckbox.style.margin = "0";
  revisionCheckbox.style.cursor = "pointer";
  revisionCheckbox.addEventListener("change", updateCustomBox);
  revisionCheckbox.addEventListener("focus", () => {
    customBox.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.3)";
  });
  revisionCheckbox.addEventListener("blur", () => {
    customBox.style.boxShadow = "none";
  });

  checkboxWrapper.appendChild(customBox);
  checkboxWrapper.appendChild(revisionCheckbox);

  const revisionLabel = document.createElement("label");
  revisionLabel.textContent = "Add to Revision Queue";
  revisionLabel.style.fontSize = "12px";
  revisionLabel.style.fontWeight = "500";
  revisionLabel.style.color = "#374151";
  revisionLabel.style.cursor = "pointer";
  revisionLabel.style.fontFamily = 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace';
  revisionLabel.onclick = () => {
    revisionCheckbox.checked = !revisionCheckbox.checked;
    revisionCheckbox.dispatchEvent(new Event("change", { bubbles: true }));
  };

  revisionContainer.appendChild(checkboxWrapper);
  revisionContainer.appendChild(revisionLabel);
  content.appendChild(revisionContainer);

  // Next review date
  const dateLabel = document.createElement("label");
  dateLabel.textContent = "Next Review Date";
  dateLabel.style.display = "block";
  dateLabel.style.fontSize = "12px";
  dateLabel.style.fontWeight = "600";
  dateLabel.style.color = "#374151";
  dateLabel.style.marginBottom = "6px";
  dateLabel.style.fontFamily = 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace';
  dateLabel.style.letterSpacing = "0.025em";
  content.appendChild(dateLabel);

  const initialDate = entry?.nextReviewDate || defaults.nextReviewDate || getTodayIso();

  // Replace custom popup with a simple native date input
  const nextDateInput = document.createElement("input");
  nextDateInput.type = "date";
  nextDateInput.id = "next-review-date";
  nextDateInput.name = "next-review-date";
  nextDateInput.value = initialDate;
  nextDateInput.min = getTodayIso();
  Object.assign(nextDateInput.style, STYLES.input);
  nextDateInput.style.marginBottom = "20px";
  nextDateInput.addEventListener("focus", () => {
    nextDateInput.style.borderColor = "#3b82f6";
    nextDateInput.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
  });
  nextDateInput.addEventListener("blur", () => {
    nextDateInput.style.borderColor = "#d1d5db";
    nextDateInput.style.boxShadow = "none";
  });

  // Ensure the native calendar icon is visible and rendered in black
  try {
    (nextDateInput.style as any).webkitAppearance = "auto";
    (nextDateInput.style as any).appearance = "auto";
  } catch {}
  nextDateInput.style.backgroundColor = "#ffffff";
  nextDateInput.style.color = "#111827";
  nextDateInput.style.paddingRight = "36px";

  if (!document.getElementById("rc-date-style")) {
    const style = document.createElement("style");
    style.id = "rc-date-style";
    style.textContent = `
#next-review-date { color-scheme: light !important; }
#next-review-date::-webkit-calendar-picker-indicator {
  opacity: 1 !important;
  filter: none !important;
}
#next-review-date::-webkit-datetime-edit-fields-wrapper { color: #111827 !important; }
    `;
    document.head.appendChild(style);
  }
  // Bind label to input for accessibility
  try {
    (dateLabel as HTMLLabelElement).setAttribute("for", "next-review-date");
  } catch {}
  content.appendChild(nextDateInput);

  // Action buttons
  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.gap = "8px";
  buttonContainer.style.justifyContent = "flex-end";

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  Object.assign(cancelBtn.style, STYLES.secondaryButton);
  cancelBtn.onclick = () => overlay.remove();

  cancelBtn.addEventListener("mouseenter", () => {
    cancelBtn.style.background = "#f9fafb";
    cancelBtn.style.borderColor = "#9ca3af";
  });

  cancelBtn.addEventListener("mouseleave", () => {
    cancelBtn.style.background = "#ffffff";
    cancelBtn.style.borderColor = "#d1d5db";
  });

  const saveBtn = document.createElement("button");
  saveBtn.textContent = entry ? "Update" : "Save";
  Object.assign(saveBtn.style, STYLES.primaryButton);

  saveBtn.addEventListener("mouseenter", () => {
    saveBtn.style.background = "#2563eb";
    saveBtn.style.borderColor = "#2563eb";
  });

  saveBtn.addEventListener("mouseleave", () => {
    saveBtn.style.background = "#3b82f6";
    saveBtn.style.borderColor = "#3b82f6";
  });

  saveBtn.onclick = async () => {
    const scrape = canonicalUrlAndScrape();
    if (!scrape) return alert("Unsupported platform");
    const { adapter, canonical, problemId, title, difficulty, tags } = scrape;

    // Show loading state
    saveBtn.textContent = "Saving...";
    saveBtn.style.opacity = "0.6";
    saveBtn.disabled = true;

    const payload: UpsertPayload = {
      platform: adapter.key,
      platformPrefix: adapter.prefix,
      problemId,
      url: canonical,
      title: entry?.title || defaults.title || title || canonical,
      difficulty: (entry?.difficulty || (defaults as any).difficulty || difficulty) as Difficulty,
      tags: entry?.tags?.length ? entry.tags : (defaults as any).tags || tags,
      customTags: customTags.value
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      notes: notes.value.trim(),
      inRevisionQueue: revisionCheckbox.checked,
      nextReviewDate: nextDateInput.value || undefined,
    };

    try {
      const res = await chrome.runtime.sendMessage({ type: "UPSERT_PROBLEM", payload });
      if (res?.ok) {
        const btn = document.getElementById("lc-revision-btn") as HTMLButtonElement | null;
        if (btn) btn.textContent = "✓ Edit Problem";
        overlay.remove();
      } else {
        throw new Error(res?.error || "unknown error");
      }
    } catch (error) {
      alert("Failed to save: " + error);
      saveBtn.textContent = entry ? "Update" : "Save";
      saveBtn.style.opacity = "1";
      saveBtn.disabled = false;
    }
  };

  buttonContainer.appendChild(cancelBtn);
  buttonContainer.appendChild(saveBtn);
  content.appendChild(buttonContainer);
  modal.appendChild(content);
}

async function init() {
  await waitForBody();
  const adapter = getAdapter();
  if (!adapter) return;

  const button = createButton();

  document.body.appendChild(button);

  // Force the button to stay visible even if other scripts try to hide it
  const observer = new MutationObserver(() => {
    if (!document.body.contains(button)) {
      document.body.appendChild(button);
    }
    // Ensure button styles haven't been overridden
    if (button.style.position !== "fixed") {
      button.style.cssText = `
        position: fixed !important;
        right: 20px !important;
        bottom: 20px !important;
        z-index: 2147483647 !important;
        padding: 6px 12px !important;
        border-radius: 6px !important;
        border: 1px solid #e2e8f0 !important;
        background: #ffffff !important;
        color: #475569 !important;
        font-size: 12px !important;
        font-weight: 500 !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        backdrop-filter: blur(8px) !important;
        min-width: auto !important;
        height: 32px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        letter-spacing: 0.025em !important;
        opacity: 1 !important;
        visibility: visible !important;
        pointer-events: auto !important;
      `;
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  const s = canonicalUrlAndScrape();
  if (s) {
    const existing = await chrome.runtime.sendMessage({ type: "GET_BY_URL", url: s.canonical });
    const storedEntry = existing?.entry as ProblemEntry | undefined;
    if (storedEntry) button.textContent = "Update revision";
  }

  button.onclick = async () => {
    const scrape = canonicalUrlAndScrape();
    if (!scrape) return alert("Unsupported platform");
    const latest = await chrome.runtime.sendMessage({ type: "GET_BY_URL", url: scrape.canonical });
    const entry = (latest?.entry as ProblemEntry) || null;
    const overlay = createModal();
    renderForm(overlay, entry, {
      title: scrape.title || undefined,
      difficulty: scrape.difficulty,
      tags: scrape.tags,
      customTags: [],
      notes: "",
      inRevisionQueue: false,
      nextReviewDate: getTodayIso(),
    } as any);
  };
}

export default async function initRevisionButton() {
  return init();
}

// Also export the init function for direct usage
export { init };

// Automatically initialize when the content script loads
// Ensure the button is injected on supported pages without manual calls
init().catch(() => {});
