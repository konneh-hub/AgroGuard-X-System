import { zodResolver } from "@hookform/resolvers/zod";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from "react-native";
import { z } from "zod";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

import { useAuth } from "../contexts/AuthContext";

const schema = z.object({
  fullName: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(6, "Enter your phone"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum([
    "FARMER",
    "AGRICULTURAL_EXPERT",
    "NGO_OFFICER",
    "FINANCIAL_INSTITUTION_OFFICER",
    "GOVERNMENT_OFFICER",
  ]),
  district: z.string().min(2, "Enter district"),
  chiefdom: z.string().min(2, "Enter chiefdom"),
  country: z.string().min(2, "Enter country"),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const theme = useTheme();

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      role: "FARMER",
      district: "",
      chiefdom: "",
      country: "",
    },
    mode: "onChange",
  });

  const ROLE_OPTIONS = [
    { key: "FARMER", label: "Farmer" },
    { key: "AGRICULTURAL_EXPERT", label: "Agricultural Expert" },
    { key: "NGO_OFFICER", label: "NGO Officer" },
    { key: "FINANCIAL_INSTITUTION_OFFICER", label: "Financial Institution" },
    { key: "GOVERNMENT_OFFICER", label: "Government Officer" },
  ];

  const onSubmit = handleSubmit(async (values) => {
    const result = await signUp(values as any);

    if (result.signedIn) {
      router.replace("/explore");
    } else {
      router.replace("/auth/login");
    }
  });

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <ThemedView type="card" style={styles.card}>
            <ThemedText type="title" style={styles.title}>
              Create Account
            </ThemedText>

            <View style={styles.field}>
              <ThemedText>Full name</ThemedText>
              <TextInput
                value={watch("fullName")}
                onChangeText={(t) => setValue("fullName", t)}
                style={[styles.input, { borderColor: theme.input }]}
                placeholder="Full name"
              />
              {errors.fullName ? (
                <ThemedText type="small">{errors.fullName.message}</ThemedText>
              ) : null}
            </View>

            <View style={styles.field}>
              <ThemedText>Email</ThemedText>
              <TextInput
                value={watch("email")}
                onChangeText={(t) => setValue("email", t)}
                style={[styles.input, { borderColor: theme.input }]}
                keyboardType="email-address"
                placeholder="you@example.com"
                autoCapitalize="none"
              />
              {errors.email ? (
                <ThemedText type="small">{errors.email.message}</ThemedText>
              ) : null}
            </View>

            <View style={styles.field}>
              <ThemedText>Phone</ThemedText>
              <TextInput
                value={watch("phone")}
                onChangeText={(t) => setValue("phone", t)}
                style={[styles.input, { borderColor: theme.input }]}
                keyboardType="phone-pad"
                placeholder="+232 ..."
              />
              {errors.phone ? (
                <ThemedText type="small">{errors.phone.message}</ThemedText>
              ) : null}
            </View>

            <View style={styles.field}>
              <ThemedText>Password</ThemedText>
              <TextInput
                value={watch("password")}
                onChangeText={(t) => setValue("password", t)}
                style={[styles.input, { borderColor: theme.input }]}
                placeholder="Password"
                secureTextEntry
              />
              {errors.password ? (
                <ThemedText type="small">{errors.password.message}</ThemedText>
              ) : null}
            </View>

            <View style={styles.field}>
              <ThemedText>Role</ThemedText>
              <View
                style={[styles.pickerWrapper, { borderColor: theme.input }]}
              >
                <Picker
                  selectedValue={watch("role")}
                  onValueChange={(v: string) => setValue("role", v as any)}
                  mode="dropdown"
                >
                  {ROLE_OPTIONS.map((r) => (
                    <Picker.Item label={r.label} value={r.key} key={r.key} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.field}>
              <ThemedText>District</ThemedText>
              <TextInput
                value={watch("district")}
                onChangeText={(t) => setValue("district", t)}
                style={[styles.input, { borderColor: theme.input }]}
                placeholder="District"
              />
              {errors.district ? (
                <ThemedText type="small">{errors.district.message}</ThemedText>
              ) : null}
            </View>

            <View style={styles.field}>
              <ThemedText>Chiefdom</ThemedText>
              <TextInput
                value={watch("chiefdom")}
                onChangeText={(t) => setValue("chiefdom", t)}
                style={[styles.input, { borderColor: theme.input }]}
                placeholder="Chiefdom"
              />
              {errors.chiefdom ? (
                <ThemedText type="small">{errors.chiefdom.message}</ThemedText>
              ) : null}
            </View>

            <View style={styles.field}>
              <ThemedText>Country</ThemedText>
              <TextInput
                value={watch("country")}
                onChangeText={(t) => setValue("country", t)}
                style={[styles.input, { borderColor: theme.input }]}
                placeholder="Country"
              />
              {errors.country ? (
                <ThemedText type="small">{errors.country.message}</ThemedText>
              ) : null}
            </View>

            <Pressable
              onPress={onSubmit}
              disabled={isSubmitting}
              style={({ pressed }) => [
                styles.button,
                pressed && { opacity: 0.9 },
                { borderColor: theme.primary, backgroundColor: theme.primary },
              ]}
            >
              <ThemedText
                style={{ color: theme.primaryForeground, fontWeight: "600" }}
              >
                {isSubmitting ? "Creating..." : "Register"}
              </ThemedText>
            </Pressable>

            <Pressable onPress={() => router.back()} style={styles.backLink}>
              <ThemedText type="link">Back</ThemedText>
            </Pressable>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.four, justifyContent: "center" },
  title: { marginBottom: Spacing.four },
  field: { marginBottom: Spacing.three, gap: Spacing.two },
  input: {
    height: 48,
    borderRadius: Spacing.two,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "transparent",
    paddingHorizontal: 12,
  },
  card: {
    maxWidth: 520,
    width: "100%",
    alignSelf: "center",
    padding: Spacing.four,
    borderRadius: Spacing.four,
    backgroundColor: "transparent",
  },
  roleList: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
  roleItem: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
    borderWidth: 1,
    borderColor: "#999",
    marginRight: 8,
    marginBottom: 8,
  },
  roleItemActive: { backgroundColor: "#e6f4fe" },
  button: {
    paddingVertical: Spacing.three,
    alignItems: "center",
    borderRadius: Spacing.four,
    borderWidth: 1,
    borderColor: "transparent",
    marginTop: Spacing.four,
    width: "100%",
  },
  backLink: { marginTop: Spacing.three, alignItems: "center" },
  scroll: { paddingBottom: 40 },
  dropdownToggle: {
    height: 48,
    borderRadius: Spacing.two,
    borderWidth: 1,
    borderColor: "#999",
    justifyContent: "center",
    paddingHorizontal: 12,
    backgroundColor: "transparent",
    marginTop: 8,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: Spacing.two,
    marginTop: 8,
    overflow: "hidden",
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: Spacing.two,
    marginTop: 8,
    overflow: "hidden",
  },
});
