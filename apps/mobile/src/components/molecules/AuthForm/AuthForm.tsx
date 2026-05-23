import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useLoginMutation, useRegisterMutation } from '@/services';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation';
import { FormInput } from '@/components/atoms/FormInput/FormInput';
import { NeonButton } from '@/components/atoms/NeonButton/NeonButton';
import { useColors } from '@/hooks';

type Mode = 'login' | 'register';
type NavProp = NativeStackNavigationProp<RootStackParamList, 'Auth'>;

interface AuthFormProps {
  mode: Mode;
}

const AuthForm = ({ mode }: AuthFormProps) => {
  const navigation = useNavigation<NavProp>();
  const colors = useColors();

  const [registered, setRegistered] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secondPassword, setSecondPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();

  const handleLogin = async () => {
    try {
      setError(null);
      await login({ email, password, rememberMe }).unwrap();
      navigation.replace('Home');
    } catch (e) {
      console.error('LOGIN ERROR', e);
      setError('Invalid email or password.');
    }
  };

  const handleRegister = async () => {
    try {
      setError(null);
      if (password !== secondPassword) return setError("Passwords don't match.");
      await register({ email, password, name }).unwrap();
      setRegistered(true);
    } catch (e) {
      console.error('REGISTER ERROR', e);
      setError('Registration failed. Please try again.');
    }
  };

  useEffect(() => {
    setRegistered(false);
    setError(null);
  }, [mode]);

  if (registered)
    return (
      <View style={styles.success}>
        <Text style={[styles.successTitle, { color: colors.text }]}>Check your email</Text>
        <Text style={[styles.successMessage, { color: colors.textMuted }]}>
          We sent a verification link to {email}.
        </Text>
      </View>
    );

  return (
    <View style={styles.form}>
      <FormInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="example@gmail.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {mode === 'register' && (
        <FormInput
          label="Name"
          value={name}
          onChangeText={setName}
          placeholder="Your name"
        />
      )}
      <FormInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      {mode === 'register' && (
        <FormInput
          label="Confirm password"
          value={secondPassword}
          onChangeText={setSecondPassword}
          placeholder="Repeat password"
          secureTextEntry
        />
      )}
      {mode === 'login' && (
        <Pressable style={styles.rememberMe} onPress={() => setRememberMe((s) => !s)}>
          <View style={[styles.checkbox, { borderColor: rememberMe ? colors.neon : colors.border, backgroundColor: rememberMe ? colors.neon : 'transparent' }]} />
          <Text style={[styles.rememberMeText, { color: colors.textMuted }]}>Remember me</Text>
        </Pressable>
      )}
      {!!error && <Text style={[styles.error, { color: colors.danger }]}>{error}</Text>}
      <NeonButton
        label={mode === 'login' ? 'Login' : 'Register'}
        loading={isLoginLoading || isRegisterLoading}
        onPress={mode === 'login' ? handleLogin : handleRegister}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    gap: 16,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 14,
    height: 14,
    borderWidth: 1,
    borderRadius: 2,
  },
  rememberMeText: {
    fontSize: 13,
  },
  error: {
    fontSize: 13,
  },
  success: {
    gap: 8,
    paddingVertical: 8,
  },
  successTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  successMessage: {
    fontSize: 13,
    lineHeight: 20,
  },
});

export { AuthForm };
