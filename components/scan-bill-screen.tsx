import { fontFamily } from "@/constants/fonts";
import { View, Text, Pressable, ActivityIndicator, Animated, StatusBar } from "react-native";
import { CameraView } from "expo-camera";
import { useRef, useEffect, useCallback, useState } from "react";
import { useScanBill } from "@/hook/use-scan-bill";
import { Icon } from "@/components/ui/icon";
import { X, ScanLine, Camera, RotateCcw, Zap, ZapOff, Images } from "lucide-react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";

export default function ScanBillScreen() {
  const {
    cameraRef,
    permission,
    scanState,
    billResult,
    errorMessage,
    requestCameraPermission,
    captureAndAnalyze,
    analyzeFromBase64,
    reset,
  } = useScanBill();

  const insets = useSafeAreaInsets();
  const [facing, setFacing] = useState<"front" | "back">("back");
  const [flash, setFlash] = useState<"off" | "on">("off");

  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shutterScale = useRef(new Animated.Value(1)).current;

  useEffect(() => { requestCameraPermission(); }, []);

  useEffect(() => {
    if (scanState === "idle") {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
          Animated.timing(scanLineAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
        ])
      );
      loop.start();
      return () => loop.stop();
    }
  }, [scanState]);

  useEffect(() => {
    if (scanState === "processing") {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 0.6, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      );
      loop.start();
      return () => loop.stop();
    }
  }, [scanState]);

  useEffect(() => {
    if (scanState === "done" && billResult) {
      router.push({
        pathname: "/bill-result",
        params: { billData: JSON.stringify(billResult) },
      });
      reset();
    }
  }, [scanState, billResult]);

  const handleCapture = useCallback(async () => {
    if (scanState !== "idle") return;
    Animated.sequence([
      Animated.timing(shutterScale, { toValue: 0.85, duration: 80, useNativeDriver: true }),
      Animated.spring(shutterScale, { toValue: 1, useNativeDriver: true }),
    ]).start();
    await captureAndAnalyze();
  }, [scanState, captureAndAnalyze]);

  // ── Chọn ảnh từ thư viện ─────────────────────────────────────────────
  const handlePickImage = useCallback(async () => {
    if (scanState !== "idle") return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;

    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.8,
      allowsEditing: true,
    });

    if (!picked.canceled && picked.assets[0]?.base64) {
      await analyzeFromBase64(picked.assets[0].base64);
    }
  }, [scanState, analyzeFromBase64]);

  const handleRetry = useCallback(() => reset(), [reset]);

  if (permission && !permission.granted) {
    return (
      <View className="flex-1 bg-[#0F172A] items-center justify-center px-8" style={{ paddingTop: insets.top }}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <View className="items-center gap-4">
          <View className="w-20 h-20 bg-white/10 rounded-full items-center justify-center mb-2">
            <Icon as={Camera} className="text-white" size="xl" />
          </View>
          <Text className="text-white text-2xl text-center" style={{ fontFamily: fontFamily.bold }}>
            Camera Access Needed
          </Text>
          <Text className="text-gray-400 text-center" style={{ fontFamily: fontFamily.medium }}>
            Please allow camera access to scan bills and receipts.
          </Text>
          <Pressable onPress={requestCameraPermission} className="bg-white rounded-2xl px-8 py-4 mt-4">
            <Text className="text-[#0F172A]" style={{ fontFamily: fontFamily.bold }}>Allow Camera</Text>
          </Pressable>
          <Pressable onPress={() => router.back()}>
            <Text className="text-gray-500" style={{ fontFamily: fontFamily.medium }}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const scanLineY = scanLineAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 220] });

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing} flash={flash}>

        {/* Top bar */}
        <View style={{ paddingTop: insets.top + 10 }} className="flex-row items-center justify-between px-4 pb-2">
          <Pressable onPress={() => router.back()} className="w-10 h-10 bg-black/50 rounded-full items-center justify-center">
            <Icon as={X} className="text-white" size="sm" />
          </Pressable>
          <Text className="text-white text-lg" style={{ fontFamily: fontFamily.bold }}>Scan Bill</Text>
          <Pressable onPress={() => setFlash(f => f === "off" ? "on" : "off")} className="w-10 h-10 bg-black/50 rounded-full items-center justify-center">
            <Icon as={flash === "on" ? Zap : ZapOff} className="text-white" size="sm" />
          </Pressable>
        </View>

        {/* Scan frame */}
        <View className="flex-1 items-center justify-center">
          <View className="relative" style={{ width: 280, height: 220 }}>
            {[
              { top: 0, left: 0 }, { top: 0, right: 0 },
              { bottom: 0, left: 0 }, { bottom: 0, right: 0 },
            ].map((pos, i) => (
              <View key={i} style={{
                position: "absolute", width: 28, height: 28, borderColor: "#22D3EE",
                borderTopWidth: "top" in pos ? 3 : 0, borderBottomWidth: "bottom" in pos ? 3 : 0,
                borderLeftWidth: "left" in pos ? 3 : 0, borderRightWidth: "right" in pos ? 3 : 0,
                ...pos,
              }} />
            ))}

            {scanState === "idle" && (
              <Animated.View style={{
                transform: [{ translateY: scanLineY }],
                position: "absolute", left: 0, right: 0, height: 2,
                backgroundColor: "#22D3EE", shadowColor: "#22D3EE", shadowOpacity: 0.9, shadowRadius: 8,
              }} />
            )}

            {scanState === "processing" && (
              <Animated.View style={{ opacity: pulseAnim }} className="absolute inset-0 bg-cyan-400/20 items-center justify-center rounded-xl">
                <ActivityIndicator color="#22D3EE" size="large" />
                <Text className="text-white text-sm mt-3" style={{ fontFamily: fontFamily.medium }}>
                  Analyzing bill...
                </Text>
              </Animated.View>
            )}
          </View>

          <Text className="text-white/60 text-sm mt-5 text-center px-10" style={{ fontFamily: fontFamily.medium }}>
            {scanState === "idle" ? "Position the bill within the frame"
              : scanState === "processing" ? "AI is reading your bill..." : ""}
          </Text>
        </View>

        {/* Bottom controls */}
        <View style={{ paddingBottom: insets.bottom + 16 }} className="flex-row items-center justify-between px-10 pt-4">

          {/* Flip camera */}
          <Pressable
            onPress={() => setFacing(f => f === "back" ? "front" : "back")}
            disabled={scanState !== "idle"}
            className="w-14 h-14 bg-white/20 rounded-full items-center justify-center"
            style={{ opacity: scanState !== "idle" ? 0.4 : 1 }}
          >
            <Icon as={RotateCcw} className="text-white" size="md" />
          </Pressable>

          {/* Shutter */}
          <Animated.View style={{ transform: [{ scale: shutterScale }] }}>
            <Pressable
              onPress={handleCapture}
              disabled={scanState !== "idle"}
              className="w-20 h-20 rounded-full items-center justify-center"
              style={{
                backgroundColor: scanState === "idle" ? "white" : "#ffffff50",
                borderWidth: 4,
                borderColor: scanState === "idle" ? "#22D3EE" : "transparent",
              }}
            >
              {scanState === "processing"
                ? <ActivityIndicator color="#0F172A" />
                : <Icon as={ScanLine} className="text-[#0F172A]" size="lg" />}
            </Pressable>
          </Animated.View>

          {/* Pick from library */}
          <Pressable
            onPress={handlePickImage}
            disabled={scanState !== "idle"}
            className="w-14 h-14 bg-white/20 rounded-full items-center justify-center"
            style={{ opacity: scanState !== "idle" ? 0.4 : 1 }}
          >
            <Icon as={Images} className="text-white" size="md" />
          </Pressable>

        </View>
      </CameraView>

      {/* Error toast */}
      {scanState === "error" && (
        <View className="absolute bottom-32 left-6 right-6 bg-red-500 rounded-2xl px-4 py-3 flex-row items-center justify-between">
          <Text className="text-white flex-1 mr-3" style={{ fontFamily: fontFamily.medium }}>
            {errorMessage || "Could not analyze bill"}
          </Text>
          <Pressable onPress={handleRetry}>
            <Text className="text-white" style={{ fontFamily: fontFamily.bold }}>Retry</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}