import { fontFamily } from "@/constants/fonts";
import { Icon } from "@/components/ui/icon";
import { DollarSign, PlaneTakeoff, ListCheck, CircleDollarSign } from "lucide-react-native";
import { Text, View, Pressable, Animated } from "react-native";
import { useRef } from "react";

function ActionButton({ label, icon, bg, color }: {
  label: string;
  icon: any;
  bg: string;
  color: string;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.88,
      useNativeDriver: true,
      speed: 50,
      bounciness: 6,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 10,
    }).start();
  };

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={{ transform: [{ scale }] }} className="items-center gap-2">
        <View className={`w-12 h-12 ${bg} rounded-full items-center justify-center`}>
          <Icon as={icon} className={color} size="md" />
        </View>
        <Text className="text-xs text-gray-600 font-medium">{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

export default function QuickActions() {
  const actions = [
    { label: 'Add Expense', icon: DollarSign, bg: 'bg-blue-100', color: 'text-blue-500' },
    { label: 'New Trip', icon: PlaneTakeoff, bg: 'bg-red-100', color: 'text-red-500' },
    { label: 'Currency', icon: CircleDollarSign, bg: 'bg-purple-100', color: 'text-purple-500' },
    { label: 'Check List', icon: ListCheck, bg: 'bg-green-100', color: 'text-green-500' },
  ];

  return (
    <View className="flex-col gap-4">
      <Text className="text-[#0F172A] text-xl" style={{ fontFamily: fontFamily.bold }}>Quick Actions</Text>
      <View className="bg-white rounded-xl p-4 flex-row justify-between">
        {actions.map((action) => (
          <ActionButton key={action.label} {...action} />
        ))}
      </View>
    </View>
  );
}