import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Checkbox from "expo-checkbox";
import { CURRENCIES } from "shared";
import type { Account, AccountType, Currency } from "shared";
import { FormInput } from "@/components/atoms/FormInput/FormInput";
import { Toggle } from "@/components/atoms/Toggle/Toggle";
import { NeonButton } from "@/components/atoms/NeonButton/NeonButton";
import { useColors } from "@/hooks";
import {
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
} from "@/services/accountApi";
import { sectionLabel } from "@/styles/typography";

interface AccountFormProps {
  account?: Account;
  onClose: () => void;
}

const AccountForm = ({ account, onClose }: AccountFormProps) => {
  const colors = useColors();
  const [name, setName] = useState(account?.name ?? "");
  const [currency, setCurrency] = useState<Currency>(account?.currency ?? "PLN");
  const [type, setType] = useState<AccountType>(account?.type ?? "debit");
  const [isDefault, setIsDefault] = useState(account?.isDefault ?? false);
  const [includeInTotal, setIncludeInTotal] = useState(
    account?.includeInTotal ?? true,
  );

  const [createAccount] = useCreateAccountMutation();
  const [updateAccount] = useUpdateAccountMutation();
  const [deleteAccount] = useDeleteAccountMutation();

  const isCredit = type === "credit";

  const handleSubmit = async () => {
    const effectiveIsDefault = isCredit ? false : isDefault;
    if (account) {
      await updateAccount({
        id: account._id,
        body: {
          name,
          currency,
          isDefault: effectiveIsDefault,
          type,
          includeInTotal,
        },
      });
    } else {
      await createAccount({ name, currency, type, includeInTotal });
    }
    onClose();
  };

  const handleDelete = async () => {
    if (!account) return;
    await deleteAccount({ id: account._id });
    onClose();
  };

  return (
    <View style={styles.form}>
      <FormInput
        label="Name"
        value={name}
        onChangeText={setName}
        placeholder="Account name"
      />

      <View style={styles.field}>
        <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>
          Currency
        </Text>
        <View style={[styles.pickerWrapper, { borderColor: colors.border }]}>
          <Picker
            selectedValue={currency}
            onValueChange={(val) => setCurrency(val as Currency)}
            style={[styles.picker, { color: colors.text }]}
            dropdownIconColor={colors.textMuted}
          >
            {[...CURRENCIES].map((c) => (
              <Picker.Item key={c} label={c} value={c} color={colors.text} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.field}>
        <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>
          Account Type
        </Text>
        <Toggle
          options={[
            { value: "debit", label: "Debit" },
            { value: "credit", label: "Credit" },
          ]}
          value={type}
          onChange={(val) => setType(val as AccountType)}
        />
      </View>

      <View style={styles.checkField}>
        <Checkbox
          value={isCredit ? false : isDefault}
          onValueChange={isCredit ? undefined : setIsDefault}
          disabled={isCredit}
          color={colors.neon}
        />
        <Text
          style={[
            styles.checkLabel,
            { color: isCredit ? colors.textMuted : colors.text },
          ]}
        >
          Set as default account
        </Text>
      </View>

      <View style={styles.checkField}>
        <Checkbox
          value={includeInTotal}
          onValueChange={setIncludeInTotal}
          color={colors.neon}
        />
        <Text style={[styles.checkLabel, { color: colors.text }]}>
          Include in total balance
        </Text>
      </View>

      <NeonButton label={account ? "Save" : "Create"} onPress={handleSubmit} />
      {account && (
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

export default AccountForm;
