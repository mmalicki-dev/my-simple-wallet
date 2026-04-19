import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import Input from "@/components/atoms/Input/Input";
import Button from "@/components/atoms/Button/Button";
import Checkbox from "@/components/atoms/Checkbox/Checkbox";
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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

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
        await register({ email, password, name }).unwrap();
        navigate(`/${lang}/auth/login`);
      }
    } catch {
      setServerError(
        mode === "login"
          ? "Invalid email or password."
          : "Registration failed. Try again.",
      );
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {mode === "register" && (
        <Input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
        />
      )}
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={8}
        autoComplete={mode === "login" ? "current-password" : "new-password"}
      />
      {mode === "login" && (
        <Checkbox
          id="rememberMe"
          label="Remember me"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
      )}
      {serverError && <p className={styles.error}>{serverError}</p>}
      <Button type="submit" isLoading={isLoginLoading || isRegisterLoading}>
        {mode === "login" ? "Sign in" : "Create account"}
      </Button>
    </form>
  );
};

export default AuthForm;
