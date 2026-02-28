import AISuggestions from "@/components/ai-suggestions";
import NextAdventure from "@/components/next-adventure";
import QuickActions from "@/components/quick-actions";
import RecentActivity from "@/components/recent-activity";
import Welcome from "@/components/welcome";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const { bottom } = useSafeAreaInsets();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: bottom + 74 }}
    >
      <Welcome name="Alex" avatarUri="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"/>
      <View className="flex-col gap-8 p-4">
        <QuickActions />
        <AISuggestions />
        <NextAdventure />
        <RecentActivity />
      </View>
    </ScrollView>
  );
}