import { useState } from "react";
import { CURRENCIES } from "shared";
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
  const [form, setForm] = useState({
    name: account?.name ?? "",
    currency: account?.currency ?? "PLN",
  });
  const [isDefault, setIsDefault] = useState(account?.isDefault ?? false);

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
    if (account) {
      await updateAccount({
        id: account._id,
        body: { name: form.name, currency: form.currency, isDefault },
      });
    } else {
      await createAccount({ name: form.name, currency: form.currency });
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
      ]}
    >
      <Checkbox
        id="isDefault"
        label="Set as default account"
        checked={isDefault}
        onChange={(e) => setIsDefault(e.target.checked)}
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
