import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Checkbox from "expo-checkbox";
import type {
  RecurringPayment,
  RecurringPaymentType,
  BillingCycle,
} from "shared";
import { RECURRING_PAYMENT_TYPES, BILLING_CYCLES } from "shared";
import { FormInput } from "@/components/atoms/FormInput/FormInput";
import { Toggle } from "@/components/atoms/Toggle/Toggle";
import { NeonButton } from "@/components/atoms/NeonButton/NeonButton";
import DatePickerField from "@/components/molecules/DatePickerField/DatePickerField";
import { useColors } from "@/hooks";
import { useGetAccountsQuery } from "@/services/accountApi";
import { useGetCategoriesQuery } from "@/services/categoryApi";
import {
  useCreateRecurringPaymentMutation,
  useUpdateRecurringPaymentMutation,
  useDeleteRecurringPaymentMutation,
} from "@/services/recurringPaymentApi";
import { sectionLabel } from "@/styles/typography";

interface RecurringPaymentFormProps {
  payment?: RecurringPayment;
  defaultType?: RecurringPaymentType;
  onClose: () => void;
}

const RecurringPaymentForm = ({
  payment,
  defaultType,
  onClose,
}: RecurringPaymentFormProps) => {
  const colors = useColors();
  const { data: accounts = [] } = useGetAccountsQuery();
  const { data: categories = [] } = useGetCategoriesQuery();

  const [type, setType] = useState<RecurringPaymentType>(
    payment?.type ?? defaultType ?? "subscription",
  );
  const [name, setName] = useState(payment?.name ?? "");
  const [amount, setAmount] = useState(String(payment?.amount ?? ""));
  const [account, setAccount] = useState(
    payment?.account ?? accounts[0]?._id ?? "",
  );
  const [category, setCategory] = useState(
    payment?.category ?? categories[0]?._id ?? "",
  );
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(
    payment?.billingCycle ?? "monthly",
  );
  const [nextDueDate, setNextDueDate] = useState(
    payment?.nextDueDate?.slice(0, 10) ?? "",
  );
  const [description, setDescription] = useState(payment?.description ?? "");
  const [isActive, setIsActive] = useState(payment?.isActive ?? true);

  const [createRecurringPayment] = useCreateRecurringPaymentMutation();
  const [updateRecurringPayment] = useUpdateRecurringPaymentMutation();
  const [deleteRecurringPayment] = useDeleteRecurringPaymentMutation();

  const selectedAccount = accounts.find((a) => a._id === account);

  const handleSubmit = async () => {
    const body = {
      name,
      type,
      amount: parseFloat(amount),
      account,
      category,
      billingCycle,
      nextDueDate,
      description: description || undefined,
      isActive,
    };
    if (payment) {
      await updateRecurringPayment({ id: payment._id, body });
    } else {
      await createRecurringPayment(body);
    }
    onClose();
  };

  const handleDelete = async () => {
    if (!payment) return;
    await deleteRecurringPayment({ id: payment._id });
    onClose();
  };

  return (
    <View style={styles.form}>
      <Toggle
        options={[...RECURRING_PAYMENT_TYPES].map((t) => ({
          value: t,
          label: t.charAt(0).toUpperCase() + t.slice(1),
        }))}
        value={type}
        onChange={(val) => setType(val as RecurringPaymentType)}
      />

      <FormInput
        label="Name"
        value={name}
        onChangeText={setName}
        placeholder="e.g. Netflix"
      />

      <FormInput
        label={
          selectedAccount
            ? `Amount / Cycle (${selectedAccount.currency})`
            : "Amount / Cycle"
        }
        value={amount}
        onChangeText={setAmount}
        placeholder="0.00"
        keyboardType="decimal-pad"
      />

      <View style={styles.field}>
        <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>
          Billing Cycle
        </Text>
        <Toggle
          options={[...BILLING_CYCLES].map((c) => ({
            value: c,
            label: c.charAt(0).toUpperCase() + c.slice(1),
          }))}
          value={billingCycle}
          onChange={(val) => setBillingCycle(val as BillingCycle)}
        />
      </View>

      <View style={styles.field}>
        <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>
          Account
        </Text>
        <View style={[styles.pickerWrapper, { borderColor: colors.border }]}>
          <Picker
            selectedValue={account}
            onValueChange={setAccount}
            style={[styles.picker, { color: colors.text }]}
            dropdownIconColor={colors.textMuted}
          >
            {accounts.map((a) => (
              <Picker.Item key={a._id} label={a.name} value={a._id} color={colors.text} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.field}>
        <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>
          Category
        </Text>
        <View style={[styles.pickerWrapper, { borderColor: colors.border }]}>
          <Picker
            selectedValue={category}
            onValueChange={setCategory}
            style={[styles.picker, { color: colors.text }]}
            dropdownIconColor={colors.textMuted}
          >
            {categories.map((c) => (
              <Picker.Item key={c._id} label={c.name} value={c._id} color={colors.text} />
            ))}
          </Picker>
        </View>
      </View>

      <DatePickerField
        label="Next Due Date"
        value={nextDueDate}
        onChange={setNextDueDate}
      />

      <FormInput
        label="Notes"
        value={description}
        onChangeText={setDescription}
        placeholder="Optional"
      />

      {payment && (
        <View style={styles.checkField}>
          <Checkbox
            value={isActive}
            onValueChange={setIsActive}
            color={colors.neon}
          />
          <Text style={[styles.checkLabel, { color: colors.text }]}>
            Active
          </Text>
        </View>
      )}

      <NeonButton label={payment ? "Save" : "Create"} onPress={handleSubmit} />
      {payment && (
        <NeonButton label="Delete" variant="danger" onPress={handleDelete} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  form: { gap: 20 },
  field: { gap: 6 },
  fieldLabel: sectionLabel,
  pickerWrapper: {
    borderWidth: 1,
    borderRadius: 4,
    overflow: "hidden",
  },
  picker: { height: 48 },
  checkField: { flexDirection: "row", alignItems: "center", gap: 12 },
  checkLabel: { fontSize: 14 },
});

export default RecurringPaymentForm;
