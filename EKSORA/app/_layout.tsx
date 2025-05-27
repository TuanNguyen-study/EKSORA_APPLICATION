import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../store';

export default function Layout() {
  return (
    <Provider store={store}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#1e90ff' }, // Replace with your desired color
          headerTintColor:"white",
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="(stack)" options={{ headerShown: false }} />
        <Stack.Screen name="trip-detail" options={{ title: 'Trip Details' }} />

      </Stack>
    </Provider>
  );
}
