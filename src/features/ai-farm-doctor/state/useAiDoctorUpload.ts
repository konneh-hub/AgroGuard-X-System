import { useCallback, useEffect, useMemo, useState } from "react";
// Offline queue will be enabled once @react-native-community/netinfo is installed.


import type { DiagnosisResult, ProcessingStage } from "../types/analysis";
import { diagnoseFromImageUri } from "../services/aiDoctorService";
import { flushQueueIfOnline } from "../services/offlineQueueService";

import type { AiDoctorProgress } from "../services/aiDoctorService";


export function useAiDoctorUpload(params?: { defaultCropType?: string }) {

  const [stage, setStage] = useState<ProcessingStage>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  // Keep isOnline as a simple default until @react-native-community/netinfo is installed.
  useEffect(() => {
    setIsOnline(true);
  }, []);


  const progressCb = useMemo(
    () =>
      (p: AiDoctorProgress) => {
        setStage(p.stage);
        setProgress(p.progress);
        if (p.message && p.stage === "error") setError(p.message);
      },
    [],
  );

  const upload = async (args: {
    imageUri: string;
    fileName?: string;
    cropType?: string;
    locationHint?: string;
  }) => {
    setError(null);
    setResult(null);
    setStage("compressing");
    setProgress(0.05);

    try {
      const { imageUri, fileName, cropType, locationHint } = args;

      const res = await diagnoseFromImageUri({
        imageUri,
        fileName,
        cropType: cropType ?? params?.defaultCropType,
        locationHint,
        onProgress: progressCb,
      });

      setResult(res);
      return { result: res, queued: false };
    } catch (e: any) {
      const msg = e?.message ?? String(e);
      setError(msg);
      setStage("error");
      setProgress(0);

      return { result: null, queued: false, error: msg };
    }
  };


  const startFlush = useCallback(async () => {
    await flushQueueIfOnline();
  }, []);

  return {
    stage,
    progress,
    error,
    result,
    isOnline,
    upload,

    startFlush,
  };
}

