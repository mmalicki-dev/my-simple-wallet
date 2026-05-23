import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenLayout } from '@/components/templates/ScreenLayout/ScreenLayout';
import { GlassWrapper } from '@/components/templates/GlassWrapper/GlassWrapper';
import { AuthTabs } from '@/components/atoms/AuthTabs/AuthTabs';
import { AuthForm } from '@/components/molecules/AuthForm/AuthForm';

type Mode = 'login' | 'register';

const AuthScreen = () => {
  const [mode, setMode] = useState<Mode>('login');

  return (
    <ScreenLayout>
      <View style={styles.content}>
        <GlassWrapper>
          <AuthTabs currentTab={mode} onPress={setMode} />
          <AuthForm mode={mode} />
        </GlassWrapper>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});

export default AuthScreen;
