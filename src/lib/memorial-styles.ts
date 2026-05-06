import type { MemorialStyle } from "@/types/database";

export const MEMORIAL_STYLE_OPTIONS: {
  value: MemorialStyle;
  label: string;
}[] = [
  { value: "classic_elegant", label: "Classic Elegant" },
  { value: "warm_family", label: "Warm Family Tribute" },
  { value: "celebration_of_life", label: "Celebration of Life" },
  { value: "faith_prayer", label: "Faith & Prayer" },
  { value: "modern_minimal", label: "Modern Minimal" },
  { value: "floral_remembrance", label: "Floral Remembrance" },
  { value: "veteran_tribute", label: "Veteran Tribute" },
];
