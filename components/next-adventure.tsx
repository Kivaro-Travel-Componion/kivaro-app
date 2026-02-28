import { fontFamily } from "@/constants/fonts";
import { Icon } from "@/components/ui/icon";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowRight } from "lucide-react-native";
import { Text, View, Pressable, ImageBackground } from "react-native";

export default function NextAdventure() {
  return (
    <View className="flex-col gap-3">
      {/* Header */}
      <View className="flex-row items-center justify-between">
        <Text
          className="text-[#0F172A] text-xl font-bold"
          style={{ fontFamily: fontFamily.bold }}
        >
          Next Adventure
        </Text>
        <Pressable>
          <Text
            className="text-blue-500 text-sm"
            style={{ fontFamily: fontFamily.semiBold }}
          >
            See Details
          </Text>
        </Pressable>
      </View>

      {/* Card */}
      <View className="rounded-2xl overflow-hidden" style={{ height: 120 }}>
        <ImageBackground
          source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDpC-_S3B1hwAS0rzjHNNUeeD4gcM3mcpXnIYa0sG20-var-5jyHlggFOLhDw43gt04qbeShuB8uQMRMI3BWLfP3zB3u6uM3sfdBILDnvSU-HhyyQsNmQndZefojR-hdVTqqP4Trf5Fnu2p0mxTx2c1u5vHjMNbj_QoPDmU9BiwJ1nf6Dg5ibD0h1Wn9cjD0rOv0B0QW5LFlfaEqhCbLtMNEa5IgErWf623fZ2376Q-2spOh0n17_22fD-nnpFpVkQS8LR09SIKeR5d" }}
          style={{ flex: 1 }}
          resizeMode="cover"
        >
          <LinearGradient
            colors={["rgba(20,16,40,0.97)", "rgba(20,16,40,0.7)", "transparent"]}
            locations={[0, 0.55, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1, flexDirection: "row", alignItems: "center", paddingHorizontal: 16 }}
          >
            {/* Left: Text info */}
            <View style={{ flex: 1, justifyContent: "center", gap: 4 }}>
              {/* Badge */}
              <View style={{ alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#2D2A45", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4, marginBottom: 4 }}>
                <View style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: "#c084fc" }} />
                <Text style={{ color: "#d8b4fe", fontSize: 10, letterSpacing: 0.5, fontFamily: fontFamily.semiBold }}>
                  IN 12 DAYS
                </Text>
              </View>

              <Text style={{ color: "white", fontSize: 22, lineHeight: 28, fontFamily: fontFamily.bold }}>
                Amalfi Coast
              </Text>

              <Text style={{ color: "#d1d5db", fontSize: 12, marginTop: 2, fontFamily: fontFamily.regular }}>
                Oct 12 - Oct 19 • Italy
              </Text>
            </View>

            {/* Arrow button */}
            <Pressable
              style={{ width: 36, height: 36, borderRadius: 999, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.2)" }}
            >
              <Icon as={ArrowRight} size="sm" className="text-white" />
            </Pressable>
          </LinearGradient>
        </ImageBackground>
      </View>
    </View>
  );
}