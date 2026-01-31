import { useState } from "react";

export interface CapturedElementData {
  page_url: string;
  locators: {
    selector_type: string;
    selector_value: string;
  }[];
}

export function useElementCapture() {
  const [captured, setCaptured] =
    useState<CapturedElementData | null>(null);

  const reset = () => setCaptured(null);

  return {
    captured,
    setCaptured,
    reset,
  };
}
