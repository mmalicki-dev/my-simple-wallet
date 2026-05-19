import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/store";
import { setCredentials } from "@/redux/slices/authSlice";
import UserBlockWrapper from "@/components/molecules/UserBlockWrapper/UserBlockWrapper";
import FormField from "@/components/molecules/FormField/FormField";
import Input from "@/components/atoms/Input/Input";
import HoloButton from "@/components/atoms/HoloButton/HoloButton";
import {
  useRequestEmailChangeMutation,
  useUpdateProfileMutation,
} from "@/services/authApi";
import styles from "./UserInfoBlock.module.css";

const UserInfoBlock = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const dispatch = useDispatch();
  const [name, setName] = useState(user?.name ?? "");
  const [newEmail, setNewEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const [updateProfile, { isLoading: isSavingName }] =
    useUpdateProfileMutation();
  const [requestEmailChange, { isLoading: isSendingEmail }] =
    useRequestEmailChangeMutation();

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = await updateProfile({ name }).unwrap();
    dispatch(setCredentials({ user: updated, accessToken: accessToken! }));
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    await requestEmailChange({ email: newEmail }).unwrap();
    setEmailSent(true);
    setNewEmail("");
  };

  return (
    <UserBlockWrapper title="User Info">
      <form onSubmit={handleSaveName}>
        <FormField label="Name" htmlFor="name">
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </FormField>
        <HoloButton type="submit" isLoading={isSavingName}>
          Save
        </HoloButton>
      </form>
      <div className={styles.divider} />
      <FormField label="Current Email" htmlFor="currentEmail">
        <Input id="currentEmail" value={user?.email ?? ""} disabled />
      </FormField>
      <form onSubmit={handleEmailChange}>
        <FormField label="New Email" htmlFor="newEmail">
          <Input
            id="newEmail"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Enter new email address"
            required
          />
        </FormField>
        {emailSent && (
          <p className={styles.success}>
            Verification email sent. Check your inbox.
          </p>
        )}
        <HoloButton type="submit" isLoading={isSendingEmail}>
          Change Email
        </HoloButton>
      </form>
    </UserBlockWrapper>
  );
};

export default UserInfoBlock;
