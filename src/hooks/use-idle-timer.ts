"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const ACTIVITY_EVENTS = [
  "mousemove",
  "mousedown",
  "mouseup",
  "click",
  "scroll",
  "wheel",
  "keydown",
  "keyup",
  "touchstart",
  "touchmove",
  "pointerdown",
] as const;

const TWENTY_MINUTES_MS = 20 * 60 * 1000;
const THIRTY_SECONDS_MS = 30 * 1000;

export function getIdleTimeoutMs(): number {
  const override = process.env.NEXT_PUBLIC_IDLE_TIMEOUT_MS;
  if (override) {
    const parsed = Number.parseInt(override, 10);
    if (!Number.isNaN(parsed) && parsed > 0) return parsed;
  }

  const isDevOrPreview =
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";

  return isDevOrPreview ? THIRTY_SECONDS_MS : TWENTY_MINUTES_MS;
}

export function useIdleTimer() {
  const [isIdle, setIsIdle] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const idleTimeoutMs = getIdleTimeoutMs();

  const resetTimer = useCallback(() => {
    setIsIdle(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsIdle(true), idleTimeoutMs);
  }, [idleTimeoutMs]);

  useEffect(() => {
    resetTimer();

    const handleActivity = () => resetTimer();

    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, handleActivity, { passive: true });
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, handleActivity);
      }
    };
  }, [resetTimer]);

  return isIdle;
}
