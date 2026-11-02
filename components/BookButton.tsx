"use client";

import type { ReactNode } from "react";
import { openBooking, type Experience } from "@/lib/stores";
import { Button } from "@/components/ds";

export default function BookButton({
  exp = null,
  children,
  variant,
  size,
  magnetic,
}: {
  exp?: Experience | null;
  children: ReactNode;
  variant?: "outline" | "primary" | "ghost";
  size?: "sm" | "md" | "lg";
  magnetic?: boolean;
}) {
  return (
    <Button variant={variant} size={size} magnetic={magnetic} onClick={() => openBooking(exp)}>
      {children}
    </Button>
  );
}
