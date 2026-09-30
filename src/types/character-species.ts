export type CharacterSpeciesSource = "official" | "homebrew";

/** Common data model, independent of storage and UI. */
export interface CharacterSpecies {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly description: string;
  readonly traits: readonly string[];
  readonly rulesUrl?: string;
  readonly source: CharacterSpeciesSource;
}

/** Shared validation for JSON data and future homebrew data sources. */
export function parseCharacterSpecies(value: unknown): CharacterSpecies {
  if (typeof value !== "object" || value === null) {
    throw new Error("Invalid character species: expected an object.");
  }

  const data = value as Record<string, unknown>;
  const textFields = [
    "id", "name", "role", "description",
  ] as const;

  for (const field of textFields) {
    if (typeof data[field] !== "string" || data[field].trim().length === 0) {
      throw new Error(`Invalid character species: ${field} must be a non-empty string.`);
    }
  }

  if (
    !Array.isArray(data.traits) ||
    !data.traits.every((trait) => typeof trait === "string" && trait.trim().length > 0)
  ) {
    throw new Error("Invalid character species: traits must be an array of non-empty strings.");
  }

  if (data.source !== "official" && data.source !== "homebrew") {
    throw new Error("Invalid character species: unknown source.");
  }

  if (data.rulesUrl !== undefined) {
    if (typeof data.rulesUrl !== "string" || !URL.canParse(data.rulesUrl) || new URL(data.rulesUrl).protocol !== "https:") {
      throw new Error("Invalid character species: rulesUrl must be an HTTPS URL.");
    }
  }

  return value as CharacterSpecies;
}
