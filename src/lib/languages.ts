import languages from "@/data/languages.json";

export const COMMON_LANGUAGE = languages.find(language => language.id === "commun")!;
export const OPTIONAL_LANGUAGES = languages.filter(language => language.id !== COMMON_LANGUAGE.id);

/** Restore only distinct, valid choices; Common is always added separately. */
export function normalizeLanguageChoices(ids: readonly string[]): string[] {
  return [...new Set(ids)].filter(id => OPTIONAL_LANGUAGES.some(language => language.id === id)).slice(0, 2);
}

export function withLanguages(params: URLSearchParams, choices: readonly string[]): URLSearchParams {
  const result = new URLSearchParams(params);
  result.delete("languages");
  for (const id of [COMMON_LANGUAGE.id, ...normalizeLanguageChoices(choices)]) {
    result.append("languages", id);
  }
  return result;
}
