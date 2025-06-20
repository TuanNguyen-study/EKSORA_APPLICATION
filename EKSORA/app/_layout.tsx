import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import store from '../store';


export default function Layout() {
  return (
    <Provider store={store}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#1e90ff' },
          headerTintColor:"white",
          headerTitleStyle: { fontWeight: 'bold' },
          headerShown: false
        }}
      >
        <Stack.Screen name="(stack)" options={{ headerShown: false }} />
        <Stack.Screen name="trip-detail" options={{ title: 'Trip Details' }} />
        <Stack.Screen name="loginEmail" options={{ title: 'login Email' }} />
        <Stack.Screen name="loginPhone" options={{ title: 'login Phone' }} />

        {/* <Stack.Screen name="home" options={{ title: 'home' }} /> */}
        <Stack.Screen name="editFavorite" options={{ title: 'Edit Favorite',headerShown:false }} />
        <Stack.Screen name="setting" options={{ title: 'Setting',headerShown:false }} />
        <Stack.Screen name="booking" options={{ title: 'Booking Screen',headerShown:false }} />
      </Stack>
    </Provider>
  );
}
