import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/store";
import { setCredentials } from "@/redux/slices/authSlice";
import { CURRENCIES } from "shared";
import UserBlockWrapper from "@/components/molecules/UserBlockWrapper/UserBlockWrapper";
import Button from "@/components/atoms/Button/Button";
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
    <UserBlockWrapper title="Preferences">
      <div className={styles.controls}>
        <ThemeToggle />
        <LanguageSwitcher />
      </div>
      <form onSubmit={handleSave}>
        <div className={styles.field}>
          <label htmlFor="totalBalanceCurrency" className={styles.label}>
            Total Balance Currency
          </label>
          <select
            id="totalBalanceCurrency"
            className={styles.select}
            value={totalBalanceCurrency}
            onChange={(e) => setTotalBalanceCurrency(e.target.value)}
          >
            {CURRENCY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" isLoading={true}>
          Save
        </Button>
      </form>
    </UserBlockWrapper>
  );
};

export default UserPreferencesBlock;
