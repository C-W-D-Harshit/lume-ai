"use client";

import React, { ReactNode, useState, useEffect } from "react";

export default function LayoutProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <div>{children}</div>;
}
