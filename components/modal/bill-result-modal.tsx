import { fontFamily } from "@/constants/fonts";
import {
  Modal,
  View,
  Text,
  ScrollView,
  Pressable,
  Animated,
  useWindowDimensions,
} from "react-native";
import { useRef, useEffect } from "react";
import { CheckCircle, AlertCircle, Receipt, X, Plus } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";
import type { BillScanResult } from "@/hook/use-scan-bill";

type Props = {
  visible: boolean;
  result: BillScanResult | null;
  onClose: () => void;
  onAddExpense?: (amount: number, currency: string) => void;
};

function ConfidenceBadge({ level }: { level: "high" | "medium" | "low" }) {
  const config = {
    high: { bg: "bg-green-100", text: "text-green-700", label: "High confidence" },
    medium: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Medium confidence" },
    low: { bg: "bg-red-100", text: "text-red-700", label: "Low confidence" },
  }[level];

  return (
    <View className={`${config.bg} px-3 py-1 rounded-full flex-row items-center gap-1`}>
      <Icon
        as={level === "high" ? CheckCircle : AlertCircle}
        className={config.text}
        size="xs"
      />
      <Text className={`text-xs font-medium ${config.text}`}>{config.label}</Text>
    </View>
  );
}

function formatAmount(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: currency === "VND" ? 0 : 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

export default function BillResultModal({ visible, result, onClose, onAddExpense }: Props) {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const { height } = useWindowDimensions();

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 8,
        speed: 14,
      }).start();
    } else {
      slideAnim.setValue(300);
    }
  }, [visible]);

  if (!result) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Pressable
        className="flex-1 bg-black/50 justify-end"
        onPress={onClose}
      >
        <Animated.View
          style={{ transform: [{ translateY: slideAnim }], maxHeight: height * 0.85 }}
          className="bg-white rounded-t-3xl overflow-hidden"
        >
          <Pressable>
            {/* Handle bar */}
            <View className="items-center pt-3 pb-1">
              <View className="w-10 h-1 bg-gray-200 rounded-full" />
            </View>

            {/* Header */}
            <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center">
                  <Icon as={Receipt} className="text-green-600" size="sm" />
                </View>
                <View>
                  <Text
                    className="text-[#0F172A] text-lg"
                    style={{ fontFamily: fontFamily.bold }}
                  >
                    Bill Scanned
                  </Text>
                  <ConfidenceBadge level={result.confidence} />
                </View>
              </View>
              <Pressable
                onPress={onClose}
                className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
              >
                <Icon as={X} className="text-gray-500" size="sm" />
              </Pressable>
            </View>

            <ScrollView
              className="px-5"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 32 }}
            >
              {/* Total Amount — Hero */}
              <View className="items-center py-6">
                <Text className="text-gray-500 text-sm mb-1" style={{ fontFamily: fontFamily.medium }}>
                  Total Amount
                </Text>
                <Text
                  className="text-[#0F172A] text-5xl"
                  style={{ fontFamily: fontFamily.bold }}
                >
                  {formatAmount(result.totalAmount, result.currency)}
                </Text>
                <Text className="text-gray-400 text-sm mt-1">{result.currency}</Text>
              </View>

              {/* Breakdown */}
              {result.items.length > 0 && (
                <View className="mb-4">
                  <Text
                    className="text-[#0F172A] text-base mb-3"
                    style={{ fontFamily: fontFamily.bold }}
                  >
                    Items
                  </Text>
                  <View className="bg-gray-50 rounded-2xl overflow-hidden">
                    {result.items.map((item, i) => (
                      <View
                        key={i}
                        className={`flex-row justify-between items-center px-4 py-3 ${
                          i < result.items.length - 1 ? "border-b border-gray-100" : ""
                        }`}
                      >
                        <Text
                          className="text-gray-700 flex-1 mr-2"
                          style={{ fontFamily: fontFamily.medium }}
                          numberOfLines={1}
                        >
                          {item.name}
                        </Text>
                        <Text
                          className="text-[#0F172A]"
                          style={{ fontFamily: fontFamily.bold }}
                        >
                          {formatAmount(item.price, result.currency)}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Tax & Tip */}
              {(result.tax != null || result.tip != null) && (
                <View className="bg-gray-50 rounded-2xl px-4 py-3 mb-4 gap-2">
                  {result.tax != null && (
                    <View className="flex-row justify-between">
                      <Text className="text-gray-500" style={{ fontFamily: fontFamily.medium }}>
                        Tax
                      </Text>
                      <Text className="text-gray-700" style={{ fontFamily: fontFamily.bold }}>
                        {formatAmount(result.tax, result.currency)}
                      </Text>
                    </View>
                  )}
                  {result.tip != null && (
                    <View className="flex-row justify-between">
                      <Text className="text-gray-500" style={{ fontFamily: fontFamily.medium }}>
                        Tip
                      </Text>
                      <Text className="text-gray-700" style={{ fontFamily: fontFamily.bold }}>
                        {formatAmount(result.tip, result.currency)}
                      </Text>
                    </View>
                  )}
                  <View className="border-t border-gray-200 pt-2 flex-row justify-between">
                    <Text className="text-[#0F172A]" style={{ fontFamily: fontFamily.bold }}>
                      Total
                    </Text>
                    <Text className="text-[#0F172A]" style={{ fontFamily: fontFamily.bold }}>
                      {formatAmount(result.totalAmount, result.currency)}
                    </Text>
                  </View>
                </View>
              )}

              {/* Raw text note */}
              {result.rawText && (
                <View className="bg-blue-50 rounded-2xl px-4 py-3 mb-6">
                  <Text className="text-blue-500 text-xs mb-1" style={{ fontFamily: fontFamily.bold }}>
                    AI Summary
                  </Text>
                  <Text className="text-blue-700 text-sm" style={{ fontFamily: fontFamily.medium }}>
                    {result.rawText}
                  </Text>
                </View>
              )}

              {/* CTA Buttons */}
              <View className="gap-3">
                {onAddExpense && (
                  <Pressable
                    onPress={() => onAddExpense(result.totalAmount, result.currency)}
                    className="bg-[#0F172A] rounded-2xl py-4 flex-row items-center justify-center gap-2"
                  >
                    <Icon as={Plus} className="text-white" size="sm" />
                    <Text
                      className="text-white text-base"
                      style={{ fontFamily: fontFamily.bold }}
                    >
                      Add as Expense
                    </Text>
                  </Pressable>
                )}
                <Pressable
                  onPress={onClose}
                  className="bg-gray-100 rounded-2xl py-4 items-center"
                >
                  <Text
                    className="text-gray-600 text-base"
                    style={{ fontFamily: fontFamily.medium }}
                  >
                    Dismiss
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}