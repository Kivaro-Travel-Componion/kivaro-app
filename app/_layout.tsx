import { Stack } from "expo-router";
import { useFonts } from 'expo-font';
import './global.css'
import { fontFamily } from "@/constants/fonts";

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/app/global.css';
import { config } from "@/components/ui/gluestack-ui-provider/config";

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
        <Stack.Screen 
          name="(tabs)"
          options={{ headerShown: false}}
        />
      </Stack>
    </GluestackUIProvider>
  );
}
