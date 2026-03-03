import { useState, useRef, useCallback } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";

export type BillScanResult = {
  totalAmount: number;
  currency: string;
  items: { name: string; price: number }[];
  tax?: number;
  tip?: number;
  rawText: string;
  confidence: "high" | "medium" | "low";
};

export type ScanState = "idle" | "scanning" | "processing" | "done" | "error";

async function callOpenAIVision(base64: string): Promise<BillScanResult> {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing EXPO_PUBLIC_OPENAI_API_KEY in .env");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64}`,
                detail: "high",
              },
            },
            {
              type: "text",
              text: `Analyze this bill/receipt image and extract the financial information.
Respond ONLY with a valid JSON object (no markdown, no extra text) in this exact format:
{
  "totalAmount": <number>,
  "currency": "<currency code like USD, VND, EUR>",
  "items": [{"name": "<item name>", "price": <number>}],
  "tax": <number or null>,
  "tip": <number or null>,
  "rawText": "<brief summary of what was on the bill>",
  "confidence": "<high|medium|low>"
}
If you cannot read the bill clearly, set confidence to "low" and do your best estimate.
If no bill is visible, return totalAmount as 0.`,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`API error: ${response.status} — ${errBody}`);
  }

  const data = await response.json();
  const text: string = data.choices?.[0]?.message?.content ?? "";
  const cleanJson = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleanJson) as BillScanResult;
}

export function useScanBill() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [billResult, setBillResult] = useState<BillScanResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  const requestCameraPermission = useCallback(async (): Promise<boolean> => {
    if (permission?.granted) return true;
    const result = await requestPermission();
    return result.granted;
  }, [permission, requestPermission]);

  // Chụp từ camera
  const captureAndAnalyze = useCallback(async () => {
    if (!cameraRef.current) return;
    try {
      setScanState("processing");
      const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.8, exif: false });
      if (!photo?.base64) throw new Error("Failed to capture image");
      const parsed = await callOpenAIVision(photo.base64);
      setBillResult(parsed);
      setScanState("done");
    } catch (err: any) {
      console.error("Scan error:", err);
      setErrorMessage(err.message || "Failed to analyze bill");
      setScanState("error");
    }
  }, []);

  // Phân tích từ ảnh thư viện
  const analyzeFromBase64 = useCallback(async (base64: string) => {
    try {
      setScanState("processing");
      const parsed = await callOpenAIVision(base64);
      setBillResult(parsed);
      setScanState("done");
    } catch (err: any) {
      console.error("Scan error:", err);
      setErrorMessage(err.message || "Failed to analyze bill");
      setScanState("error");
    }
  }, []);

  const reset = useCallback(() => {
    setScanState("idle");
    setBillResult(null);
    setErrorMessage(null);
  }, []);

  return {
    cameraRef,
    permission,
    scanState,
    billResult,
    errorMessage,
    requestCameraPermission,
    captureAndAnalyze,
    analyzeFromBase64,
    reset,
  };
}