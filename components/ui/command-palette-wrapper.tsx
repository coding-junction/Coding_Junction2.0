"use client";

import { CommandPalette } from "@/components/ui/command-palette";

/**
 * Client-side wrapper for the CommandPalette.
 * Needed because the root layout is a Server Component.
 */
export function CommandPaletteWrapper() {
  return <CommandPalette />;
}
