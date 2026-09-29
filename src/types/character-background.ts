export type CharacterBackgroundSource = "official" | "homebrew";

/** Common data model, independent of storage and UI. */
export interface CharacterBackground {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly description: string;
  readonly abilities: readonly string[];
  readonly feat: {
    readonly name: string;
    readonly detail?: string;
    readonly url: string;
  };
  readonly skills: readonly string[];
  readonly tool: string;
  readonly theme: string;
  readonly rulesUrl?: string;
  readonly source: CharacterBackgroundSource;
}

function isText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isHttpsUrl(value: unknown): value is string {
  return isText(value) && URL.canParse(value) && new URL(value).protocol === "https:";
}

/** Shared validation for JSON data and future homebrew data sources. */
export function parseCharacterBackground(value: unknown): CharacterBackground {
  if (typeof value !== "object" || value === null) {
    throw new Error("Invalid character background: expected an object.");
  }

  const data = value as Record<string, unknown>;
  const textFields = ["id", "name", "role", "description", "tool", "theme"] as const;

  for (const field of textFields) {
    if (!isText(data[field])) {
      throw new Error(`Invalid character background: ${field} must be a non-empty string.`);
    }
  }

  for (const field of ["abilities", "skills"] as const) {
    if (!Array.isArray(data[field]) || !data[field].every(isText)) {
      throw new Error(`Invalid character background: ${field} must be an array of non-empty strings.`);
    }
  }

  if (typeof data.feat !== "object" || data.feat === null) {
    throw new Error("Invalid character background: feat must be an object.");
  }
  const feat = data.feat as Record<string, unknown>;
  if (!isText(feat.name) || !isHttpsUrl(feat.url) || (feat.detail !== undefined && !isText(feat.detail))) {
    throw new Error("Invalid character background: feat must have a name, an HTTPS URL and an optional non-empty detail.");
  }

  if (data.source !== "official" && data.source !== "homebrew") {
    throw new Error("Invalid character background: unknown source.");
  }
  if (data.rulesUrl !== undefined && !isHttpsUrl(data.rulesUrl)) {
    throw new Error("Invalid character background: rulesUrl must be an HTTPS URL.");
  }

  return value as CharacterBackground;
}
