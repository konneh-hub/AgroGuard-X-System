import { getItem, setItem } from "@/lib/storage";

import type { AiDoctorQueueItem } from "../utils/offlineQueue";

const QUEUE_KEY = "agroguardx_ai_doctor_queue_v1";

export async function loadQueue(): Promise<AiDoctorQueueItem[]> {
  const raw = await getItem(QUEUE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as AiDoctorQueueItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveQueue(items: AiDoctorQueueItem[]): Promise<void> {
  await setItem(QUEUE_KEY, JSON.stringify(items));
}

