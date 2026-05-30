import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Picker } from "@react-native-picker/picker";
import { CURRENCIES } from "shared";
import type { Currency, Session } from "shared";
import type { RootState } from "@/redux/store";
import { setCredentials } from "@/redux/slices/authSlice";
import { FormInput } from "@/components/atoms/FormInput/FormInput";
import PasswordInput from "@/components/molecules/PasswordInput/PasswordInput";
import { NeonButton } from "@/components/atoms/NeonButton/NeonButton";
import { ThemeToggle } from "@/components/atoms/ThemeToggle/ThemeToggle";
import { LanguageToggle } from "@/components/atoms/LanguageToggle/LanguageToggle";
import UserSectionList from "@/components/organisms/UserSectionList/UserSectionList";
import { useColors } from "@/hooks";
import { alpha } from "@/theme/colors";
import {
  useUpdateProfileMutation,
  useRequestEmailChangeMutation,
  useChangePasswordMutation,
  useLogoutMutation,
  useGetSessionsQuery,
  useDeleteSessionMutation,
} from "@/services/authApi";
import { sectionLabel } from "@/styles/typography";

function parseUserAgent(ua: string): string {
  if (!ua || ua === "unknown") return "Unknown device";
  let browser = "Unknown browser";
  if (/Edg\//.test(ua)) browser = "Edge";
  else if (/OPR\//.test(ua)) browser = "Opera";
  else if (/Chrome\//.test(ua)) browser = "Chrome";
  else if (/Firefox\//.test(ua)) browser = "Firefox";
  else if (/Safari\//.test(ua)) browser = "Safari";
  let os = "Unknown OS";
  if (/Windows NT/.test(ua)) os = "Windows";
  else if (/Mac OS X/.test(ua)) os = "macOS";
  else if (/Android/.test(ua)) os = "Android";
  else if (/iPhone|iPad/.test(ua)) os = "iOS";
  else if (/Linux/.test(ua)) os = "Linux";
  return `${browser} on ${os}`;
}

function formatExpiry(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const DeviceRow = ({ session }: { session: Session }) => {
  const colors = useColors();
  const [deleteSession, { isLoading }] = useDeleteSessionMutation();
  return (
    <View
      style={[
        styles.deviceRow,
        {
          backgroundColor: alpha(colors.surface, 0.6),
          borderColor: alpha(colors.neon, 0.12),
        },
      ]}
    >
      <View style={styles.deviceInfo}>
        <Text style={[styles.deviceName, { color: colors.text }]} numberOfLines={1}>
          {parseUserAgent(session.userAgent)}
        </Text>
        <Text style={[styles.deviceExpiry, { color: colors.textMuted }]}>
          Expires {formatExpiry(session.expiresAt)}
        </Text>
      </View>
      <NeonButton
        label="Revoke"
        variant="danger"
        onPress={() => deleteSession(session.id)}
        loading={isLoading}
        style={styles.revokeBtn}
      />
    </View>
  );
};

const ProfileSection = () => {
  const colors = useColors();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);

  const [name, setName] = useState(user?.name ?? "");
  const [newEmail, setNewEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [totalBalanceCurrency, setTotalBalanceCurrency] = useState<Currency>(
    user?.totalBalanceCurrency ?? "PLN",
  );

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const { data: sessions, isLoading: isLoadingSessions } = useGetSessionsQuery();

  const [updateProfile, { isLoading: isSavingName }] =
    useUpdateProfileMutation();
  const [requestEmailChange, { isLoading: isSendingEmail }] =
    useRequestEmailChangeMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleSaveName = async () => {
    const updated = await updateProfile({ name }).unwrap();
    dispatch(setCredentials({ user: updated, accessToken: token! }));
  };

  const handleEmailChange = async () => {
    await requestEmailChange({ email: newEmail }).unwrap();
    setEmailSent(true);
    setNewEmail("");
  };

  const handleSavePreferences = async () => {
    const updated = await updateProfile({ totalBalanceCurrency }).unwrap();
    dispatch(setCredentials({ user: updated, accessToken: token! }));
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    try {
      await changePassword({
        oldPassword: currentPassword,
        newPassword,
      }).unwrap();
      setPasswordSuccess("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordError(err?.data?.message ?? "Something went wrong");
    }
  };

  return (
    <View style={styles.sections}>
      <UserSectionList title="User Info">
        <View style={styles.block}>
          <FormInput label="Name" value={name} onChangeText={setName} />
          <NeonButton
            label="Save"
            onPress={handleSaveName}
            loading={isSavingName}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={{ opacity: 0.5 }}>
            <FormInput
              label="Current Email"
              value={user?.email ?? ""}
              editable={false}
            />
          </View>
          <FormInput
            label="New Email"
            value={newEmail}
            onChangeText={setNewEmail}
            placeholder="Enter new email address"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {emailSent && (
            <Text style={[styles.success, { color: colors.success }]}>
              Verification email sent. Check your inbox.
            </Text>
          )}
          <NeonButton
            label="Change Email"
            onPress={handleEmailChange}
            loading={isSendingEmail}
          />
        </View>
      </UserSectionList>

      <UserSectionList title="Preferences">
        <View style={styles.block}>
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: colors.textMuted }]}>
              Theme
            </Text>
            <ThemeToggle />
          </View>
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: colors.textMuted }]}>
              Language
            </Text>
            <LanguageToggle />
          </View>
          <View style={styles.field}>
            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>
              Total Balance Currency
            </Text>
            <View
              style={[styles.pickerWrapper, { borderColor: colors.border }]}
            >
              <Picker
                selectedValue={totalBalanceCurrency}
                onValueChange={setTotalBalanceCurrency}
                style={[styles.picker, { color: colors.text }]}
                dropdownIconColor={colors.textMuted}
              >
                {[...CURRENCIES].map((c) => (
                  <Picker.Item
                    key={c}
                    label={c}
                    value={c}
                    color={colors.text}
                  />
                ))}
              </Picker>
            </View>
          </View>
          <NeonButton
            label="Save"
            onPress={handleSavePreferences}
          />
        </View>
      </UserSectionList>

      <UserSectionList title="Remembered Devices">
        <View style={styles.block}>
          {isLoadingSessions && (
            <Text style={[styles.deviceEmpty, { color: colors.textMuted }]}>
              Loading…
            </Text>
          )}
          {!isLoadingSessions && (!sessions || sessions.length === 0) && (
            <Text style={[styles.deviceEmpty, { color: colors.textMuted }]}>
              No remembered devices.
            </Text>
          )}
          {sessions && sessions.length > 0 && (
            <View style={styles.deviceList}>
              {sessions.map((session) => (
                <DeviceRow key={session.id} session={session} />
              ))}
            </View>
          )}
        </View>
      </UserSectionList>

      <UserSectionList title="Security">
        <View style={styles.block}>
          <PasswordInput
            label="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <PasswordInput
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <PasswordInput
            label="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          {!!passwordError && (
            <Text style={[styles.error, { color: colors.danger }]}>
              {passwordError}
            </Text>
          )}
          {!!passwordSuccess && (
            <Text style={[styles.success, { color: colors.success }]}>
              {passwordSuccess}
            </Text>
          )}
          <NeonButton
            label="Change Password"
            onPress={handleChangePassword}
            loading={isChangingPassword}
          />
        </View>
      </UserSectionList>

      <NeonButton
        label="Logout"
        variant="danger"
        onPress={() => logout()}
        loading={isLoggingOut}
        style={styles.logoutBtn}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sections: { gap: 8 },
  block: { gap: 16, paddingVertical: 8 },
  divider: { height: 1, marginVertical: 4 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLabel: sectionLabel,
  field: { gap: 6 },
  fieldLabel: sectionLabel,
  pickerWrapper: {
    borderWidth: 1,
    borderRadius: 4,
    overflow: "hidden",
  },
  picker: { height: 48 },
  error: { fontSize: 13 },
  success: { fontSize: 13 },
  logoutBtn: { marginTop: 8 },
  deviceList: { gap: 8 },
  deviceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
  },
  deviceInfo: { flex: 1, gap: 2, minWidth: 0 },
  deviceName: { fontSize: 14, fontWeight: "500" },
  deviceExpiry: { fontSize: 11 },
  deviceEmpty: { fontSize: 13 },
  revokeBtn: { paddingVertical: 8, paddingHorizontal: 14 },
});

export default ProfileSection;
