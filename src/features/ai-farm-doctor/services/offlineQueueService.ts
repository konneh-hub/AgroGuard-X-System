import NetInfo from "@react-native-community/netinfo";

import { diagnoseImage } from "../repository/aiDoctorRepository";
import { addRecord } from "../repository/diagnosisHistoryRepository";
import { loadQueue, saveQueue } from "../repository/offlineQueueRepository";
import type { DiagnosisInput, DiagnosisResult } from "../types/analysis";
import type { DiagnosisHistoryRecord } from "../types/history";
import type { AiDoctorQueueItem } from "../utils/offlineQueue";

function nowIso() {
  return new Date().toISOString();
}

function makeHistoryRecord(args: {
  item: AiDoctorQueueItem;
  result: DiagnosisResult;
}): DiagnosisHistoryRecord {
  const { item, result } = args;
  return {
    id: item.id,
    createdAt: item.createdAt,
    imageDataRef: {
      base64: item.payload.cropImageBase64,
      mimeType: item.payload.mimeType,
      fileName: item.payload.fileName,
    },
    result,
  };
}

export async function enqueueForOffline(params: {
  input: DiagnosisInput;
  id: string;
}): Promise<void> {
  const { input, id } = params;

  const queue = await loadQueue();
  const item: AiDoctorQueueItem = {
    id,
    createdAt: nowIso(),
    updatedAt: nowIso(),
    status: "queued",
    attempts: 0,
    payload: input,
  };

  queue.unshift(item);
  await saveQueue(queue);
}

export async function flushQueueIfOnline(
  params: {
    onProgress?: (msg: string) => void;
  } = {},
): Promise<void> {
  const isConnected = await new Promise<boolean>((resolve) => {
    NetInfo.fetch()
      .then((s: any) => resolve(Boolean(s.isConnected)))
      .catch(() => resolve(false));
  });

  if (!isConnected) return;

  const queue = await loadQueue();
  const pending = queue.filter(
    (x) => x.status === "queued" || x.status === "failed",
  );
  if (!pending.length) return;

  // Process sequentially for simplicity.
  const nextQueue = [...queue];

  for (const item of pending) {
    params.onProgress?.(`Processing queued diagnosis: ${item.id}`);
    const idx = nextQueue.findIndex((x) => x.id === item.id);
    if (idx === -1) continue;

    nextQueue[idx] = {
      ...nextQueue[idx],
      status: "processing",
      updatedAt: nowIso(),
    };
    await saveQueue(nextQueue);

    try {
      const result = await diagnoseImage(item.payload);
      const record = makeHistoryRecord({ item, result });
      await addRecord(record);

      nextQueue[idx] = {
        ...nextQueue[idx],
        status: "done",
        updatedAt: nowIso(),
      };
      await saveQueue(nextQueue);
    } catch (e: any) {
      nextQueue[idx] = {
        ...nextQueue[idx],
        status: "failed",
        attempts: nextQueue[idx].attempts + 1,
        lastError: e?.message ?? String(e),
        updatedAt: nowIso(),
      };
      await saveQueue(nextQueue);
    }
  }
}
