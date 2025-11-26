import { Stack } from 'expo-router';
import { COLORS } from '../constants/theme';


// defines what header bar looks like, which screens exist, their titles and the navigation structure
export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Homepage' }} />
      <Stack.Screen name="boards" options={{ title: 'All Boards' }} />
    </Stack>
  );
}