import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslations } from "@/i18n";
import Input from "@/components/atoms/Input/Input";
import Button from "@/components/atoms/Button/Button";
import Checkbox from "@/components/atoms/Checkbox/Checkbox";
import PasswordInput from "@/components/molecules/PasswordInput/PasswordInput";
import { useLoginMutation, useRegisterMutation } from "@/services/authApi";
import { setCredentials } from "@/redux/slices/authSlice";
import styles from "./AuthForm.module.css";

type Mode = "login" | "register";

interface AuthFormProps {
  mode: Mode;
}

const AuthForm = ({ mode }: AuthFormProps) => {
  const { lang = "en" } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { common, auth } = useTranslations();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secondPassword, setSecondPassword] = useState("");
  const [name, setName] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [registered, setRegistered] = useState(false);

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    try {
      if (mode === "login") {
        const result = await login({ email, password, rememberMe }).unwrap();
        dispatch(
          setCredentials({
            user: result.user,
            accessToken: result.accessToken,
          }),
        );
        navigate(`/${lang}/home`, { replace: true });
      } else {
        if (password !== secondPassword)
          return setServerError("Password doesn't match");
        await register({ email, password, name }).unwrap();
        setRegistered(true);
      }
    } catch {
      setServerError(mode === "login" ? auth.loginError : auth.registerError);
    }
  };

  if (registered) {
    return (
      <div className={styles.success}>
        <p className={styles.successTitle}>{auth.checkEmailTitle}</p>
        <p className={styles.successMessage}>{auth.checkEmailMessage}</p>
        <Link to={`/${lang}/auth/login`} className={styles.successLink}>
          {auth.goToSignIn}
        </Link>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {mode === "register" && (
        <Input
          type="text"
          placeholder={common.name}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
        />
      )}
      <Input
        type="email"
        placeholder={common.email}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />
      <PasswordInput
        placeholder={common.password}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={8}
        autoComplete={mode === "login" ? "current-password" : "new-password"}
      />
      {mode === "register" && (
        <PasswordInput
          placeholder={common.password}
          value={secondPassword}
          onChange={(e) => setSecondPassword(e.target.value)}
          required
          minLength={8}
          autoComplete={"new-password"}
        />
      )}
      {mode === "login" && (
        <Checkbox
          id="rememberMe"
          label={auth.rememberMe}
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
      )}
      {serverError && <p className={styles.error}>{serverError}</p>}
      <Button type="submit" isLoading={isLoginLoading || isRegisterLoading}>
        {mode === "login" ? auth.signIn : auth.createAccount}
      </Button>
    </form>
  );
};

export default AuthForm;
