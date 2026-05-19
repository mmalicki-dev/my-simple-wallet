import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/store";
import { setCredentials } from "@/redux/slices/authSlice";
import { CURRENCIES } from "shared";
import UserBlockWrapper from "@/components/molecules/UserBlockWrapper/UserBlockWrapper";
import FormField from "@/components/molecules/FormField/FormField";
import SelectOption from "@/components/atoms/SelectOption/SelectOption";
import HoloButton from "@/components/atoms/HoloButton/HoloButton";
import ThemeToggle from "@/components/atoms/ThemeToggle/ThemeToggle";
import LanguageSwitcher from "@/components/atoms/LanguageSwitcher/LanguageSwitcher";
import { useUpdateProfileMutation } from "@/services/authApi";
import styles from "./UserPreferencesBlock.module.css";

const CURRENCY_OPTIONS = CURRENCIES.map((c) => ({ value: c, label: c }));

const UserPreferencesBlock = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const dispatch = useDispatch();
  const [totalBalanceCurrency, setTotalBalanceCurrency] = useState(
    user?.totalBalanceCurrency ?? "PLN",
  );
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = await updateProfile({ totalBalanceCurrency }).unwrap();
    dispatch(setCredentials({ user: updated, accessToken: accessToken! }));
  };

  return (
    <UserBlockWrapper title="Preferences" id="preferences">
      <div className={styles.controls}>
        <ThemeToggle />
        <LanguageSwitcher />
      </div>
      <form onSubmit={handleSave}>
        <FormField label="Total Balance Currency" htmlFor="totalBalanceCurrency">
          <SelectOption
            id="totalBalanceCurrency"
            value={totalBalanceCurrency}
            options={CURRENCY_OPTIONS}
            onChange={(e) => setTotalBalanceCurrency(e.target.value)}
          />
        </FormField>
        <HoloButton type="submit" isLoading={isLoading}>
          Save
        </HoloButton>
      </form>
    </UserBlockWrapper>
  );
};

export default UserPreferencesBlock;
