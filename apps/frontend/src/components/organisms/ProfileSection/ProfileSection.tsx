import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import UserInfoBlock from "@/components/organisms/UserInfoBlock/UserInfoBlock";
import UserPreferencesBlock from "@/components/organisms/UserPreferencesBlock/UserPreferencesBlock";
import UserSecurityBlock from "@/components/organisms/UserSecurityBlock/UserSecurityBlock";
import UserDevicesBlock from "@/components/organisms/UserDevicesBlock/UserDevicesBlock";
import styles from "./ProfileSection.module.css";

const ProfileSection = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const el = document.querySelector(hash);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("section-glow");
    const timer = setTimeout(() => el.classList.remove("section-glow"), 1400);
    return () => clearTimeout(timer);
  }, [hash]);

  return (
    <div className={styles.sections}>
      <UserInfoBlock />
      <UserPreferencesBlock />
      <UserSecurityBlock />
      <UserDevicesBlock />
    </div>
  );
};

export default ProfileSection;
