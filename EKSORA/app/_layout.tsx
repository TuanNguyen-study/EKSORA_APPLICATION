import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../store';
import { COLORS } from '../constants/colors.jsx';

export default function Layout() {
  return (
    <Provider store={store}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: COLORS.white,
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="trip-detail" options={{ headerShown: false }} />
      </Stack>
    </Provider>
  );
}
