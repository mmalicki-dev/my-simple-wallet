import { useEffect, useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useLoginMutation, useRegisterMutation } from "@/services";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation";

type Mode = "login" | "register";
type NavProp = NativeStackNavigationProp<RootStackParamList, "Auth">;

interface AuthFormProps {
  mode: Mode;
}

const AuthForm = ({ mode }: AuthFormProps) => {
  const navigation = useNavigation<NavProp>();

  const [registered, setRegistered] = useState<boolean>(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secondPassword, setSecondPassword] = useState("");
  const [name, setName] = useState("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();

  const handleLogin = async () => {
    try {
      setError(null);
      await login({ email, password, rememberMe }).unwrap();
      navigation.replace("Home");
    } catch (e) {
      console.error("LOGIN ERROR", e);
      setError("Invalid email or password");
    }
  };

  const handleRegister = async () => {
    try {
      setError(null);
      if (password !== secondPassword)
        return setError("Passwords dont' match.");
      await register({ email, password, name }).unwrap();
      setRegistered(true);
    } catch (e) {
      console.error("REGISTER ERROR", e);
      setError("Registration failed. Please, try again.");
    }
  };

  useEffect(() => {
    setRegistered(false);
    setError(null);
  }, [mode]);

  if (registered)
    return (
      <View>
        <Text>Check your email to verify your account.</Text>
      </View>
    );

  return (
    <View>
      <TextInput
        onChangeText={setEmail}
        value={email}
        placeholder="example@gmail.com"
      />
      {mode === "register" && <TextInput onChangeText={setName} value={name} />}
      <TextInput
        onChangeText={setPassword}
        value={password}
        placeholder="Type password"
      />
      {mode === "register" && (
        <TextInput
          onChangeText={setSecondPassword}
          value={secondPassword}
          placeholder="Repeat password"
        />
      )}
      {mode === "login" && (
        <Pressable onPress={() => setRememberMe((s) => !s)}>
          <Text>Remember me</Text>
        </Pressable>
      )}
      {!!error && <Text>{error}</Text>}
      <TouchableOpacity
        onPress={mode === "login" ? handleLogin : handleRegister}
      >
        {!isLoginLoading && !isRegisterLoading ? (
          <Text>{mode.toLocaleUpperCase()}</Text>
        ) : (
          <Text>Loading</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export { AuthForm };
