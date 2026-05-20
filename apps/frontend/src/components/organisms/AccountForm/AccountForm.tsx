import { useState } from "react";
import { CURRENCIES } from "shared";
import type { AccountType, Currency } from "shared";
import type { Account } from "@/types";
import Checkbox from "@/components/atoms/Checkbox/Checkbox";
import FormActions from "@/components/molecules/FormActions/FormActions";
import Form from "../Form/Form";
import {
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
} from "@/services/accountApi";

interface AccountFormProps {
  account?: Account;
  onClose: () => void;
}

const AccountForm = ({ account, onClose }: AccountFormProps) => {
  const [form, setForm] = useState<{
    name: string;
    currency: Currency;
    type: AccountType;
  }>({
    name: account?.name ?? "",
    currency: account?.currency ?? "PLN",
    type: account?.type ?? "debit",
  });
  const [isDefault, setIsDefault] = useState(account?.isDefault ?? false);
  const [includeInTotal, setIncludeInTotal] = useState(
    account?.includeInTotal ?? true,
  );

  const isCredit = form.type === "credit";

  const [createAccount] = useCreateAccountMutation();
  const [updateAccount] = useUpdateAccountMutation();
  const [deleteAccount] = useDeleteAccountMutation();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveIsDefault = isCredit ? false : isDefault;
    if (account) {
      await updateAccount({
        id: account._id,
        body: {
          name: form.name,
          currency: form.currency,
          isDefault: effectiveIsDefault,
          type: form.type,
          includeInTotal,
        },
      });
    } else {
      await createAccount({
        name: form.name,
        currency: form.currency,
        type: form.type,
        includeInTotal,
      });
    }
    onClose();
  };

  const handleDelete = async () => {
    if (!account) return;
    await deleteAccount({ id: account._id });
    onClose();
  };

  return (
    <Form
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      inputsArray={[
        {
          type: "text",
          id: "name",
          label: "Name",
          placeholder: "Account name",
          handleChange,
          value: form.name,
        },
      ]}
      selectsArray={[
        {
          type: "select",
          id: "currency",
          label: "Currency",
          placeholder: "Select currency",
          handleChange,
          value: form.currency,
          optionsArray: [...CURRENCIES].map((c) => ({ value: c, label: c })),
        },
        {
          type: "select",
          id: "type",
          label: "Account type",
          placeholder: "Select type",
          handleChange,
          value: form.type,
          optionsArray: [
            { value: "debit", label: "Debit" },
            { value: "credit", label: "Credit" },
          ],
        },
      ]}
    >
      <Checkbox
        id="isDefault"
        label="Set as default account"
        checked={isCredit ? false : isDefault}
        disabled={isCredit}
        onChange={(e) => setIsDefault(e.target.checked)}
      />
      <Checkbox
        id="includeInTotal"
        label="Include in total balance"
        checked={includeInTotal}
        onChange={(e) => setIncludeInTotal(e.target.checked)}
      />
      <FormActions
        onCancel={onClose}
        onDelete={account ? handleDelete : undefined}
        submitLabel={account ? "Save" : "Create"}
      />
    </Form>
  );
};

export default AccountForm;
