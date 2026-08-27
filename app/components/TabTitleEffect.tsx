"use client";

import { useEffect } from "react";

export default function TabTitleEffect() {
  useEffect(() => {
    const originalTitle = "Proxy Shakespeare | Pekan Ilkomerz 62";
    const awayTitle = "👋 Hey, don't leave! | Proxy Shakespeare";

    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = awayTitle;
      } else {
        document.title = originalTitle;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  return null;
}

