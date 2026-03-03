import { fontFamily } from "@/constants/fonts";
import { Icon } from "@/components/ui/icon";
import { Sparkles, Star } from "lucide-react-native";
import { Text, View, Image, ScrollView } from "react-native";

const suggestions = [
  {
    id: "1",
    name: "Luce Café",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400",
  },
  {
    id: "2",
    name: "Bar Pasticceria",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400",
  },
  {
    id: "3",
    name: "The Mill",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=400",
  },
];

export default function AISuggestions() {
  return (
    <View className="bg-blue-50 rounded-2xl border border-blue-100 p-4 gap-3">
      {/* Header */}
      <View className="flex-row items-start gap-3">
        {/* Icon */}
        <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center">
          <Icon as={Sparkles} size="sm" className="text-blue-400" />
        </View>

        {/* Title + description */}
        <View className="flex-1 gap-1">
          <View className="flex-row items-center gap-2">
            <Text
              className="text-[#0F172A] text-base font-medium"
              style={{ fontFamily: fontFamily.bold }}
            >
              AI Suggestions
            </Text>
            <View className="bg-blue-500 rounded-full px-2 py-0.5">
              <Text
                className="text-white text-[10px] tracking-wide"
                style={{ fontFamily: fontFamily.bold }}
              >
                BETA
              </Text>
            </View>
          </View>
          <Text
            className="text-gray-500 text-sm leading-5"
            style={{ fontFamily: fontFamily.regular }}
          >
            AI thinks you'd love these breakfast spots based on your Milan trip.
          </Text>
        </View>
      </View>

      {/* Places */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 28 }}
      >
        {suggestions.map((place) => (
          <View key={place.id} className="items-center gap-1.5" style={{ width: 90 }}>
            {/* Circular image with rating */}
            <View className="relative">
              <Image
                source={{ uri: place.image }}
                style={{ width: 90, height: 90, borderRadius: 999 }}
                resizeMode="cover"
              />
              {/* Rating badge */}
              <View
                className="absolute bottom-1 left-1 flex-row items-center gap-0.5 bg-white rounded-full px-1.5 py-0.5"
                style={{ elevation: 2, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4 }}
              >
                <Icon as={Star} size="2xs" className="text-yellow-400" />
                <Text
                  className="text-[#0F172A] text-[10px]"
                  style={{ fontFamily: fontFamily.semiBold }}
                >
                  {place.rating}
                </Text>
              </View>
            </View>

            <Text
              className="text-[#0F172A] text-xs text-center"
              style={{ fontFamily: fontFamily.semiBold }}
            >
              {place.name}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}