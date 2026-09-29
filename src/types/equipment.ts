export type EquipmentChoice = "instrument" | "artisan" | "artisan-or-instrument" | "game";

export interface EquipmentOption {
  readonly id: string;
  readonly label: string;
  readonly items: readonly string[];
  readonly gold: number;
  readonly choice?: EquipmentChoice;
}

export function parseEquipmentOption(value: unknown): EquipmentOption {
  if (typeof value !== "object" || value === null) {
    throw new Error("Invalid equipment option: expected an object.");
  }
  const data = value as Record<string, unknown>;
  for (const field of ["id", "label"] as const) {
    if (typeof data[field] !== "string" || !data[field].trim()) {
      throw new Error(`Invalid equipment option: missing ${field}.`);
    }
  }
  if (!Array.isArray(data.items) || !data.items.every(item => typeof item === "string" && item.trim())) {
    throw new Error("Invalid equipment option: invalid items.");
  }
  if (typeof data.gold !== "number" || !Number.isInteger(data.gold) || data.gold < 0) {
    throw new Error("Invalid equipment option: invalid gold.");
  }
  if (data.choice !== undefined && !["instrument", "artisan", "artisan-or-instrument", "game"].includes(String(data.choice))) {
    throw new Error("Invalid equipment option: unknown choice.");
  }
  return value as EquipmentOption;
}
