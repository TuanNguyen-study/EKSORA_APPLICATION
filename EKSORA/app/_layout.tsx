import { Stack, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from "react-native-toast-message";
import { Provider } from 'react-redux';
import { toastConfig } from "../hooks/toastConfig";
import store from '../store';
import { AppProviders } from '../store/AppProviders';
import FixedFloatingChatBotButton from './(stack)/chax-AI/screens/FFixedFloatingChatBotButton';

export default function Layout() {
  const segments = useSegments();
  const isHomeScreen = segments[0] === '(tabs)' && segments[1] === 'home';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <AppProviders>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'none',
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(stack)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
          {/* Chỉ hiện ở home */}
          {isHomeScreen && <FixedFloatingChatBotButton />}
          <Toast config={toastConfig} />
        </AppProviders>
      </Provider>
    </GestureHandlerRootView>
  );
}