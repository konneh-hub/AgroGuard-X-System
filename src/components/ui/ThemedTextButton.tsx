import { ThemedText } from "@/components/themed-text";
import { Pressable, StyleProp, TextStyle, ViewStyle } from "react-native";

export function ThemedTextButton({
  children,
  onPress,
  style,
  textStyle,
  disabled,
}: {
  children: React.ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          paddingVertical: 14,
          paddingHorizontal: 16,
          borderRadius: 12,
          backgroundColor: "#2e7d32",
          borderWidth: 1,
          borderColor: "#1b5e20",
          alignItems: "center",
          opacity: disabled ? 0.6 : 1,
          transform: pressed ? [{ scale: 0.99 }] : undefined,
        },
        style,
      ]}
    >
      <ThemedText style={textStyle}>{children}</ThemedText>
    </Pressable>
  );
}
