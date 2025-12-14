"use client";
import { useEffect, useState } from "react";

export function useAlarm() {
  const [alarm, setAlarm] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("alarm");
    if (saved) setAlarm(saved);
  }, []);

  useEffect(() => {
    if (alarm) localStorage.setItem("alarm", alarm);
  }, [alarm]);

  return { alarm, setAlarm };
}
