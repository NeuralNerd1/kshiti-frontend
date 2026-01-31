"use client";

import { useEffect } from "react";
import { useToast } from "./ToastProvider";
import { registerToastHandler } from "./toast";

export default function ToastBridge() {
  const { show } = useToast();

  useEffect(() => {
    registerToastHandler(show);
  }, [show]);

  return null;
}
