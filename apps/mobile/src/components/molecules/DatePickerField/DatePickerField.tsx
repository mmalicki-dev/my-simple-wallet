import { useState } from "react";
import { View, Text, Pressable, Modal, Platform, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useColors } from "@/hooks";
import { isoDate } from "@/screens/ChartsScreen/chartBuilders";

interface DatePickerFieldProps {
  label: string;
  value: string;
  min?: string;
  max?: string;
  onChange: (value: string) => void;
}

const DatePickerField = ({
  label,
  value,
  min,
  max,
  onChange,
}: DatePickerFieldProps) => {
  const colors = useColors();
  const [show, setShow] = useState(false);
  const date = value ? new Date(value) : new Date();

  return (
    <View style={styles.dateField}>
      <Text style={[styles.dateFieldLabel, { color: colors.textMuted }]}>
        {label}
      </Text>
      <Pressable
        onPress={() => setShow(true)}
        style={[styles.dateButton, { borderColor: colors.border }]}
      >
        <Text style={[styles.dateButtonText, { color: colors.text }]}>
          {value || "Select"}
        </Text>
      </Pressable>

      {show && Platform.OS === "android" && (
        <DateTimePicker
          value={date}
          mode="date"
          minimumDate={min ? new Date(min) : undefined}
          maximumDate={max ? new Date(max) : undefined}
          onChange={(_, selected) => {
            setShow(false);
            if (selected) onChange(isoDate(selected));
          }}
        />
      )}

      {show && Platform.OS === "ios" && (
        <Modal transparent animationType="slide">
          <View style={styles.dateModal}>
            <View
              style={[
                styles.dateModalCard,
                { backgroundColor: colors.surface },
              ]}
            >
              <DateTimePicker
                value={date}
                mode="date"
                display="spinner"
                minimumDate={min ? new Date(min) : undefined}
                maximumDate={max ? new Date(max) : undefined}
                onChange={(_, selected) => {
                  if (selected) onChange(isoDate(selected));
                }}
                style={{ width: "100%" }}
              />
              <Pressable
                onPress={() => setShow(false)}
                style={[
                  styles.dateModalDone,
                  { backgroundColor: colors.neon },
                ]}
              >
                <Text style={{ color: colors.bg, fontWeight: "600" }}>
                  Done
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dateField: { flex: 1, gap: 6 },
  dateFieldLabel: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  dateButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 4,
  },
  dateButtonText: { fontSize: 12 },
  dateModal: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  dateModalCard: {
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    gap: 12,
  },
  dateModalDone: {
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 8,
  },
});

export default DatePickerField;
