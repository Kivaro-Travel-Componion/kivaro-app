import { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import { fontFamily } from "@/constants/fonts";
import { ImageBackground, Text, View } from "react-native";
import { BellDot } from 'lucide-react-native';

export default function Welcome({ name, avatarUri }: UserInfo) {
  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800' }}
      className="h-[200px] rounded-b-3xl overflow-hidden"
      resizeMode="cover"
    >
      <View className="flex-1 bg-black/40 flex-row justify-between items-end px-6 py-8">
        <View className="flex-row justify-between items-center p-4 w-full rounded-2xl">
          <View className="flex-row items-center">
            <Avatar size="md">
              <AvatarFallbackText>Jane Doe</AvatarFallbackText>
              <AvatarImage
                source={{
                  uri: avatarUri,
                }}
              />
              <AvatarBadge />
            </Avatar>
            <View className="ml-3">
              <Text className="text-gray-300 text-md mb-1" style={{ fontFamily: fontFamily.regular }}>Welcome back,</Text>
              <Text className="text-white text-xl" style={{ fontFamily: fontFamily.bold }}>Hello, {name}! 👋</Text>
            </View>
          </View>
          <View className="p-2 bg-gray-100 rounded-full">
              <Icon as={BellDot} className="text-typography-500"/>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}