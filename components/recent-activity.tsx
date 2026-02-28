import { fontFamily } from "@/constants/fonts";
import { Text, View, Pressable } from "react-native";
import { Hotel, Plane, UtensilsCrossed } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";

const activities = [
  {
    id: "1",
    icon: Hotel,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-400",
    title: "Added hotel booking",
    subtitle: "Grand Hotel Excelsior • 2m ago",
    amount: null,
  },
  {
    id: "2",
    icon: Plane,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-400",
    title: "Flight confirmed",
    subtitle: "Delta DL402 • 4h ago",
    amount: null,
  },
  {
    id: "3",
    icon: UtensilsCrossed,
    iconBg: "bg-red-100",
    iconColor: "text-red-400",
    title: "Dinner at Mario's",
    subtitle: "Food & Drinks • Yesterday",
    amount: "-$84.00",
  },
];

export default function RecentActivity() {
  return (
    <View className="flex-col gap-3">
      {/* Header */}
      <View className="flex-row items-center justify-between">
        <Text className="text-[#0F172A] text-xl" style={{ fontFamily: fontFamily.bold }}>
          Recent Activity
        </Text>
        <Pressable>
          <Text className="text-blue-500 text-sm" style={{ fontFamily: fontFamily.semiBold }}>
            See All
          </Text>
        </Pressable>
      </View>

      {/* List */}
      <View className="bg-white rounded-2xl overflow-hidden">
        {activities.map((item, index) => (
          <View key={item.id}>
            <Pressable className="flex-row items-center px-4 py-3 gap-3 active:bg-gray-50">
              {/* Icon */}
              <View className={`w-10 h-10 rounded-full ${item.iconBg} items-center justify-center`}>
                <Icon as={item.icon} size="sm" className={item.iconColor} />
              </View>

              {/* Text */}
              <View className="flex-1">
                <Text
                  className="text-[#0F172A] text-sm"
                  style={{ fontFamily: fontFamily.semiBold }}
                >
                  {item.title}
                </Text>
                <Text
                  className="text-gray-400 text-xs mt-0.5"
                  style={{ fontFamily: fontFamily.regular }}
                >
                  {item.subtitle}
                </Text>
              </View>

              {/* Amount */}
              {item.amount && (
                <Text
                  className="text-red-500 text-sm"
                  style={{ fontFamily: fontFamily.semiBold }}
                >
                  {item.amount}
                </Text>
              )}
            </Pressable>

            {/* Divider */}
            {index < activities.length - 1 && (
              <View className="h-[1px] bg-gray-100 ml-16" />
            )}
          </View>
        ))}
      </View>
    </View>
  );
}