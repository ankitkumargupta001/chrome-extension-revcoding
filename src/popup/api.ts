import type { BgRequest, BgResponse, StorageSchema } from "@/types";

function send<T extends BgRequest>(msg: T): Promise<BgResponse> {
  return chrome.runtime.sendMessage(msg);
}

export function bgGetAll() {
  return send({ type: "GET_ALL" });
}
export function bgUpdateProblem(id: string, updates: any) {
  return send({ type: "UPDATE_PROBLEM", id, updates });
}
export function bgExport() {
  return send({ type: "EXPORT" });
}
export function bgImport(data: StorageSchema) {
  return send({ type: "IMPORT", data });
}
export function bgStats() {
  return send({ type: "STATS" });
}
export function bgClearAll() {
  return send({ type: "CLEAR_ALL" });
}
