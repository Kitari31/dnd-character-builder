export type CharacterClassSource = "official" | "homebrew";

/** Common data model, independent of storage and UI. */
export interface CharacterClass {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly description: string;
  readonly traits: readonly string[];
  readonly primaryStat: string;
  readonly difficulty: string;
  readonly source: CharacterClassSource;
}

/** Shared validation for JSON data and future homebrew data sources. */
export function parseCharacterClass(value: unknown): CharacterClass {
  if (typeof value !== "object" || value === null) {
    throw new Error("Invalid character class: expected an object.");
  }

  const data = value as Record<string, unknown>;
  const textFields = [
    "id", "name", "role", "description", "primaryStat", "difficulty",
  ] as const;

  for (const field of textFields) {
    if (typeof data[field] !== "string" || data[field].trim().length === 0) {
      throw new Error(`Invalid character class: ${field} must be a non-empty string.`);
    }
  }

  if (
    !Array.isArray(data.traits) ||
    !data.traits.every((trait) => typeof trait === "string" && trait.trim().length > 0)
  ) {
    throw new Error("Invalid character class: traits must be an array of non-empty strings.");
  }

  if (data.source !== "official" && data.source !== "homebrew") {
    throw new Error("Invalid character class: unknown source.");
  }

  return value as CharacterClass;
}
