"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { copyText } from "@/lib/clipboard";

export default function useClipboard() {
  const [status, setStatus] = useState<"idle" | "copying" | "copied" | "error">("idle");
  const request = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      request.current = request.current + 1;
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const copy = useCallback(async (text: string) => {
    const current = ++request.current;
    if (timer.current) clearTimeout(timer.current);
    setStatus("copying");
    const success = await copyText(text);
    if (!mounted.current || current !== request.current) return false;
    setStatus(success ? "copied" : "error");
    timer.current = setTimeout(() => setStatus("idle"), 2500);
    return success;
  }, []);

  return { copy, status };
}
