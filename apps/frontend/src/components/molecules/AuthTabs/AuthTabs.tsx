import { useNavigate, useParams } from "react-router-dom";
import { useTranslations } from "@/i18n";
import Tabs from "@/components/molecules/Tabs/Tabs";
import styles from "./AuthTabs.module.css";

type Mode = "login" | "register";

interface AuthTabsProps {
  mode: Mode;
}

const AuthTabs = ({ mode }: AuthTabsProps) => {
  const { lang = "en" } = useParams();
  const navigate = useNavigate();
  const { auth } = useTranslations();

  const tabs = [auth.signIn, auth.register];

  const handleTabChange = (tab: string) => {
    if (tab === auth.signIn) navigate(`/${lang}/auth/login`);
    else navigate(`/${lang}/auth/register`);
  };

  return (
    <Tabs
      tabs={tabs}
      activeTab={mode === "login" ? auth.signIn : auth.register}
      onTabChange={handleTabChange}
      containerClass={styles.tabs}
      itemClass={styles.tab}
      activeTabClass={styles.active}
    />
  );
};

export default AuthTabs;
