"use client";

import { useEffect, useState } from "react";
import AlarmPage from "./AlarmPage"; // the main alarm component

export default function AlarmPageWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // nothing rendered server-side

  return <AlarmPage />; // render your actual client component
}
