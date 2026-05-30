import { useState } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import type { TextInputProps } from "react-native";
import { FormInput } from "@/components/atoms/FormInput/FormInput";
import { Icon } from "@/components/atoms/Icon/Icon";
import { useColors } from "@/hooks";

type PasswordInputProps = Omit<TextInputProps, "secureTextEntry"> & {
  label: string;
};

const PasswordInput = ({ label, ...rest }: PasswordInputProps) => {
  const [visible, setVisible] = useState(false);
  const colors = useColors();

  return (
    <View style={styles.wrapper}>
      <FormInput
        label={label}
        secureTextEntry={!visible}
        style={styles.input}
        {...rest}
      />
      <Pressable
        style={styles.toggle}
        onPress={() => setVisible((v) => !v)}
        accessibilityLabel={visible ? "Hide password" : "Show password"}
        hitSlop={8}
      >
        <Icon
          name={visible ? "eye-open" : "eye-closed"}
          size={18}
          color={colors.textMuted}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { position: "relative" },
  input: { paddingRight: 44 },
  toggle: {
    position: "absolute",
    right: 12,
    bottom: 10,
  },
});

export default PasswordInput;
