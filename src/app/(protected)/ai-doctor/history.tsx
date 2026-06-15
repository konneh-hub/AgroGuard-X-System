import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

import type { DiagnosisHistoryRecord } from "@/features/ai-farm-doctor/types/history";
import { queryHistory } from "@/features/ai-farm-doctor/repository/diagnosisHistoryRepository";

export default function AiDoctorHistory() {
  const router = useRouter();
  const [items, setItems] = useState<DiagnosisHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await queryHistory({ limit: 50 });
      setItems(res);
      setLoading(false);
    })();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Diagnosis History</ThemedText>
      <ThemedText themeColor="textSecondary">Stored diagnoses (offline-first demo).</ThemedText>

      <View style={{ height: 12 }} />

      {loading ? (
        <ThemedText themeColor="textSecondary">Loading…</ThemedText>
      ) : items.length ? (
        items.map((it) => (
          <TouchableOpacity
            key={it.id}
            style={styles.item}
            onPress={() =>
              router.push({
                pathname: "/ai-doctor/result",
                params: { result: JSON.stringify(it.result) },
              })
            }
          >
            <ThemedText style={styles.itemTitle}>{it.result.issueName}</ThemedText>
            <ThemedText themeColor="textSecondary">
              {new Date(it.createdAt).toLocaleString()}
            </ThemedText>
            <ThemedText themeColor="textSecondary">Confidence: {(it.result.confidenceScore * 100).toFixed(1)}%</ThemedText>
          </TouchableOpacity>
        ))
      ) : (
        <ThemedText themeColor="textSecondary">No history yet.</ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 10,
  },
  item: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.04)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    gap: 4,
    marginTop: 10,
  },
  itemTitle: { fontWeight: "800" },
});

