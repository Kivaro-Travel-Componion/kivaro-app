import { fontFamily } from "@/constants/fonts";
import {
  View, Text, ScrollView, Pressable, StatusBar,
  TextInput, Alert, Animated,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useRef, useEffect } from "react";
import { Icon } from "@/components/ui/icon";
import {
  ArrowLeft, Receipt, CheckCircle, AlertCircle, ChevronDown,
  MapPin, Wallet, Tag, Check, Plane,
} from "lucide-react-native";
import { useTripStore, type TripExpense } from "@/store/use-trip-store";
import type { BillScanResult } from "@/hook/use-scan-bill";

// ─── helpers ────────────────────────────────────────────────────────────────

function formatAmount(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency,
      minimumFractionDigits: currency === "VND" ? 0 : 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

const CATEGORIES: { key: TripExpense["category"]; label: string; emoji: string }[] = [
  { key: "food", label: "Food & Drink", emoji: "🍜" },
  { key: "transport", label: "Transport", emoji: "🚗" },
  { key: "accommodation", label: "Stay", emoji: "🏨" },
  { key: "activity", label: "Activity", emoji: "🎭" },
  { key: "shopping", label: "Shopping", emoji: "🛍️" },
  { key: "other", label: "Other", emoji: "📦" },
];

// ─── sub-components ─────────────────────────────────────────────────────────

function ConfidenceBadge({ level }: { level: "high" | "medium" | "low" }) {
  const cfg = {
    high: { bg: "bg-emerald-100", text: "text-emerald-700", label: "High confidence" },
    medium: { bg: "bg-amber-100", text: "text-amber-700", label: "Medium confidence" },
    low: { bg: "bg-red-100", text: "text-red-700", label: "Low confidence" },
  }[level];
  return (
    <View className={`${cfg.bg} px-3 py-1 rounded-full flex-row items-center gap-1 self-start`}>
      <Icon as={level === "high" ? CheckCircle : AlertCircle} className={cfg.text} size="xs" />
      <Text className={`text-xs ${cfg.text}`} style={{ fontFamily: fontFamily.medium }}>{cfg.label}</Text>
    </View>
  );
}

// ─── main screen ────────────────────────────────────────────────────────────

export default function BillResultScreen() {
  const { billData } = useLocalSearchParams<{ billData: string }>();
  const insets = useSafeAreaInsets();
  const { trips, addExpenseToTrip } = useTripStore();

  // Parse bill result from params
  const result: BillScanResult | null = billData ? JSON.parse(billData) : null;

  const [selectedTripId, setSelectedTripId] = useState<string | null>(
    trips.length > 0 ? trips[0].id : null
  );
  const [selectedCategory, setSelectedCategory] = useState<TripExpense["category"]>("food");
  const [note, setNote] = useState("");
  const [tripDropdownOpen, setTripDropdownOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  // Success animation
  const successScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (saved) {
      Animated.spring(successScale, {
        toValue: 1, useNativeDriver: true, bounciness: 14, speed: 10,
      }).start();
    }
  }, [saved]);

  if (!result) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <Text style={{ fontFamily: fontFamily.medium }} className="text-gray-400">No bill data found</Text>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text style={{ fontFamily: fontFamily.bold }} className="text-blue-500">Go back</Text>
        </Pressable>
      </View>
    );
  }

  const selectedTrip = trips.find((t:any) => t.id === selectedTripId);

  const handleSave = () => {
    if (!selectedTripId) {
      Alert.alert("Select a trip", "Please select a trip to add this expense to.");
      return;
    }
    const expense: TripExpense = {
      id: `expense-${Date.now()}`,
      name: result.rawText || "Scanned bill",
      totalAmount: result.totalAmount,
      currency: result.currency,
      date: new Date().toISOString(),
      category: selectedCategory,
      items: result.items,
      tax: result.tax,
      tip: result.tip,
      note,
    };
    addExpenseToTrip(selectedTripId, expense);
    setSaved(true);
    // Navigate back after short delay
    setTimeout(() => router.back(), 1600);
  };

  // ── Success overlay ──────────────────────────────────────────────────────
  if (saved) {
    return (
      <View className="flex-1 bg-white items-center justify-center gap-4" style={{ paddingBottom: insets.bottom }}>
        <StatusBar barStyle="dark-content" />
        <Animated.View style={{ transform: [{ scale: successScale }] }}
          className="w-24 h-24 bg-emerald-100 rounded-full items-center justify-center mb-2">
          <Icon as={Check} className="text-emerald-600" size="xl" />
        </Animated.View>
        <Text className="text-[#0F172A] text-2xl" style={{ fontFamily: fontFamily.bold }}>Expense Added!</Text>
        <Text className="text-gray-400 text-sm" style={{ fontFamily: fontFamily.medium }}>
          {formatAmount(result.totalAmount, result.currency)} added to{" "}
          <Text className="text-[#0F172A]">{selectedTrip?.name}</Text>
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* ── Header ── */}
      <View
        style={{ paddingTop: insets.top + 8 }}
        className="bg-white px-4 pb-4 border-b border-gray-100 flex-row items-center gap-3"
      >
        <Pressable onPress={() => router.back()} className="w-9 h-9 bg-gray-100 rounded-full items-center justify-center">
          <Icon as={ArrowLeft} className="text-gray-600" size="sm" />
        </Pressable>
        <View className="flex-1">
          <Text className="text-[#0F172A] text-lg" style={{ fontFamily: fontFamily.bold }}>Bill Result</Text>
          <ConfidenceBadge level={result.confidence} />
        </View>
        <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center">
          <Icon as={Receipt} className="text-green-600" size="sm" />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        {/* ── Total hero card ── */}
        <View className="mx-4 mt-4 rounded-3xl p-6 items-center">
          <Text className="text-sm mb-1" style={{ fontFamily: fontFamily.medium }}>
            Total Amount
          </Text>
          <Text className="text-[#0F172A] text-5xl" style={{ fontFamily: fontFamily.bold }}>
            {formatAmount(result.totalAmount, result.currency)}
          </Text>
          <Text className="text-white/40 text-sm mt-1" style={{ fontFamily: fontFamily.medium }}>
            {result.currency}
          </Text>
        </View>

        {/* ── Items breakdown ── */}
        {result.items.length > 0 && (
          <View className="mx-4 mt-4">
            <Text className="text-[#0F172A] text-base mb-2 px-1" style={{ fontFamily: fontFamily.bold }}>
              Items
            </Text>
            <View className="bg-white rounded-2xl overflow-hidden">
              {result.items.map((item, i) => (
                <View
                  key={i}
                  className={`flex-row items-center justify-between px-4 py-3 ${i < result.items.length - 1 ? "border-b border-gray-100" : ""}`}
                >
                  <Text className="text-gray-700 flex-1 mr-3" style={{ fontFamily: fontFamily.medium }} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text className="text-[#0F172A]" style={{ fontFamily: fontFamily.bold }}>
                    {formatAmount(item.price, result.currency)}
                  </Text>
                </View>
              ))}

              {/* Tax / Tip rows */}
              {(result.tax != null || result.tip != null) && (
                <>
                  <View className="h-px bg-gray-200 mx-4" />
                  {result.tax != null && (
                    <View className="flex-row justify-between px-4 py-2">
                      <Text className="text-gray-400 text-sm" style={{ fontFamily: fontFamily.medium }}>Tax</Text>
                      <Text className="text-gray-500 text-sm" style={{ fontFamily: fontFamily.bold }}>
                        {formatAmount(result.tax, result.currency)}
                      </Text>
                    </View>
                  )}
                  {result.tip != null && (
                    <View className="flex-row justify-between px-4 py-2">
                      <Text className="text-gray-400 text-sm" style={{ fontFamily: fontFamily.medium }}>Tip</Text>
                      <Text className="text-gray-500 text-sm" style={{ fontFamily: fontFamily.bold }}>
                        {formatAmount(result.tip, result.currency)}
                      </Text>
                    </View>
                  )}
                  <View className="flex-row justify-between px-4 py-3 bg-gray-50">
                    <Text className="text-[#0F172A]" style={{ fontFamily: fontFamily.bold }}>Total</Text>
                    <Text className="text-[#0F172A]" style={{ fontFamily: fontFamily.bold }}>
                      {formatAmount(result.totalAmount, result.currency)}
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>
        )}

        {/* ── AI summary ── */}
        {result.rawText && (
          <View className="mx-4 mt-3 bg-blue-50 rounded-2xl px-4 py-3">
            <Text className="text-blue-500 text-xs mb-1" style={{ fontFamily: fontFamily.bold }}>AI Summary</Text>
            <Text className="text-blue-700 text-sm" style={{ fontFamily: fontFamily.medium }}>{result.rawText}</Text>
          </View>
        )}

        {/* ── Divider ── */}
        <View className="mx-4 mt-5 mb-1 flex-row items-center gap-3">
          <View className="flex-1 h-px bg-gray-200" />
          <Text className="text-gray-400 text-xs" style={{ fontFamily: fontFamily.medium }}>ADD TO TRIP</Text>
          <View className="flex-1 h-px bg-gray-200" />
        </View>

        {/* ── Trip selector ── */}
        <View className="mx-4 mt-3">
          <View className="flex-row items-center gap-2 mb-2 px-1">
            <Icon as={Plane} className="text-gray-400" size="xs" />
            <Text className="text-gray-500 text-sm" style={{ fontFamily: fontFamily.medium }}>Select Trip</Text>
          </View>

          {/* Dropdown trigger */}
          <Pressable
            onPress={() => setTripDropdownOpen(o => !o)}
            className="bg-white rounded-2xl px-4 py-4 flex-row items-center justify-between border-2"
            style={{ borderColor: selectedTripId ? "#0F172A" : "#E5E7EB" }}
          >
            {selectedTrip ? (
              <View className="flex-row items-center gap-3 flex-1">
                <Text className="text-2xl">{selectedTrip.coverEmoji}</Text>
                <View className="flex-1">
                  <Text className="text-[#0F172A]" style={{ fontFamily: fontFamily.bold }}>{selectedTrip.name}</Text>
                  <View className="flex-row items-center gap-1 mt-0.5">
                    <Icon as={MapPin} className="text-gray-400" size="xs" />
                    <Text className="text-gray-400 text-xs" style={{ fontFamily: fontFamily.medium }}>{selectedTrip.destination}</Text>
                  </View>
                </View>
              </View>
            ) : (
              <Text className="text-gray-400 flex-1" style={{ fontFamily: fontFamily.medium }}>Choose a trip...</Text>
            )}
            <Icon as={ChevronDown} className="text-gray-400" size="sm" />
          </Pressable>

          {/* Dropdown list */}
          {tripDropdownOpen && (
            <View className="bg-white rounded-2xl mt-1 overflow-hidden border border-gray-100 shadow-sm">
              {trips.map((trip:any, i:any) => (
                <Pressable
                  key={trip.id}
                  onPress={() => { setSelectedTripId(trip.id); setTripDropdownOpen(false); }}
                  className={`flex-row items-center gap-3 px-4 py-3 ${i < trips.length - 1 ? "border-b border-gray-100" : ""}`}
                  style={{ backgroundColor: selectedTripId === trip.id ? "#F0FDF4" : "white" }}
                >
                  <Text className="text-2xl">{trip.coverEmoji}</Text>
                  <View className="flex-1">
                    <Text className="text-[#0F172A]" style={{ fontFamily: fontFamily.bold }}>{trip.name}</Text>
                    <Text className="text-gray-400 text-xs" style={{ fontFamily: fontFamily.medium }}>{trip.destination}</Text>
                  </View>
                  {selectedTripId === trip.id && (
                    <Icon as={Check} className="text-emerald-500" size="sm" />
                  )}
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* ── Budget preview ── */}
        {selectedTrip && (
          <View className="mx-4 mt-3 bg-white rounded-2xl px-4 py-3 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Icon as={Wallet} className="text-gray-400" size="sm" />
              <Text className="text-gray-500 text-sm" style={{ fontFamily: fontFamily.medium }}>Trip Budget</Text>
            </View>
            <Text className="text-[#0F172A]" style={{ fontFamily: fontFamily.bold }}>
              {formatAmount(selectedTrip.budget, selectedTrip.currency)}
            </Text>
          </View>
        )}

        {/* ── Category picker ── */}
        <View className="mx-4 mt-3">
          <View className="flex-row items-center gap-2 mb-2 px-1">
            <Icon as={Tag} className="text-gray-400" size="xs" />
            <Text className="text-gray-500 text-sm" style={{ fontFamily: fontFamily.medium }}>Category</Text>
          </View>
          <View className="flex-row flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat.key}
                onPress={() => setSelectedCategory(cat.key)}
                className="flex-row items-center gap-1.5 px-3 py-2 rounded-full border-2"
                style={{
                  borderColor: selectedCategory === cat.key ? "#0F172A" : "#E5E7EB",
                  backgroundColor: selectedCategory === cat.key ? "#0F172A" : "white",
                }}
              >
                <Text className="text-sm">{cat.emoji}</Text>
                <Text
                  className="text-sm"
                  style={{
                    fontFamily: fontFamily.medium,
                    color: selectedCategory === cat.key ? "white" : "#6B7280",
                  }}
                >
                  {cat.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* ── Note ── */}
        <View className="mx-4 mt-3">
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Add a note (optional)..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={2}
            className="bg-white rounded-2xl px-4 py-3 text-[#0F172A]"
            style={{ fontFamily: fontFamily.medium, minHeight: 56, textAlignVertical: "top" }}
          />
        </View>
      </ScrollView>

      {/* ── Sticky CTA ── */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 pt-3"
        style={{ paddingBottom: insets.bottom + 8 }}
      >
        <Pressable
          onPress={handleSave}
          className="bg-[#2B8CEE] rounded-2xl py-4 flex-row items-center justify-center gap-2"
          style={{ opacity: selectedTripId ? 1 : 0.4 }}
        >
          <Icon as={Check} className="text-white" size="sm" />
          <Text className="text-white text-base" style={{ fontFamily: fontFamily.bold }}>
            Add {formatAmount(result.totalAmount, result.currency)} to {selectedTrip?.name ?? "Trip"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}