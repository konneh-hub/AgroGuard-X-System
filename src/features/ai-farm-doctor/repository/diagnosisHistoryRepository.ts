import type {
    DiagnosisHistoryRecord,
    HistoryFilter,
} from "@/features/ai-farm-doctor/types/history";
import { getItem, setItem } from "@/lib/storage";

const HISTORY_KEY = "agroguardx_ai_doctor_history_v1";

export async function loadHistory(): Promise<DiagnosisHistoryRecord[]> {
  const raw = await getItem(HISTORY_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as DiagnosisHistoryRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveHistory(
  items: DiagnosisHistoryRecord[],
): Promise<void> {
  await setItem(HISTORY_KEY, JSON.stringify(items));
}

export async function addRecord(record: DiagnosisHistoryRecord): Promise<void> {
  const items = await loadHistory();
  items.unshift(record);
  await saveHistory(items);
}

export async function queryHistory(
  filter: HistoryFilter = {},
): Promise<DiagnosisHistoryRecord[]> {
  const items = await loadHistory();
  const filtered = items.filter((x) =>
    filter.issueType ? x.result.issueType === filter.issueType : true,
  );
  return typeof filter.limit === "number"
    ? filtered.slice(0, filter.limit)
    : filtered;
}
