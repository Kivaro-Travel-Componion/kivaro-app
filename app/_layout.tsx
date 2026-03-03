import { Stack } from "expo-router";
import { useFonts } from 'expo-font';
import './global.css'
import { fontFamily } from "@/constants/fonts";
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/app/global.css';

export default function RootLayout() {
  const [loaded, error] = useFonts({
    [fontFamily.bold]: require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
    [fontFamily.regular]: require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    [fontFamily.light]: require('../assets/fonts/PlusJakartaSans-Light.ttf'),
    [fontFamily.medium]: require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
  });

  return (
    <GluestackUIProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Camera screen */}
        <Stack.Screen
          name="scan-bill"
          options={{
            headerShown: false,
            presentation: "fullScreenModal",
            animation: "slide_from_bottom",
          }}
        />

        {/* Bill result screen */}
        <Stack.Screen
          name="bill-result"
          options={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
      </Stack>
    </GluestackUIProvider>
  );
}