import presets from "@/data/ability-presets.json";

export const ABILITIES = [
  { id: "force", name: "Force", short: "FOR" },
  { id: "dexterite", name: "Dextérité", short: "DEX" },
  { id: "constitution", name: "Constitution", short: "CON" },
  { id: "intelligence", name: "Intelligence", short: "INT" },
  { id: "sagesse", name: "Sagesse", short: "SAG" },
  { id: "charisme", name: "Charisme", short: "CHA" },
] as const;
export type AbilityId = typeof ABILITIES[number]["id"];
export type AbilityScores = Record<AbilityId, number>;
export const POINT_BUDGET = 27;
export const SCORE_COSTS: Readonly<Record<number, number>> = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };

function scoresFromValues(values: readonly number[]): AbilityScores {
  return Object.fromEntries(ABILITIES.map((ability, index) => [ability.id, values[index]])) as AbilityScores;
}

export function defaultScores(): AbilityScores {
  return scoresFromValues(ABILITIES.map(() => 10));
}

export function pointsSpent(scores: AbilityScores): number {
  return ABILITIES.reduce((total, ability) => total + (SCORE_COSTS[scores[ability.id]] ?? Infinity), 0);
}

export function validScores(scores: AbilityScores): boolean {
  return ABILITIES.every(({ id }) => Number.isInteger(scores[id]) && scores[id] >= 8 && scores[id] <= 15)
    && pointsSpent(scores) <= POINT_BUDGET;
}

export function standardScores(classId: string): AbilityScores | null {
  if (!Object.hasOwn(presets, classId)) return null;
  const result = scoresFromValues(presets[classId as keyof typeof presets]);
  if (!validScores(result) || pointsSpent(result) !== POINT_BUDGET) throw new Error(`Invalid ability preset: ${classId}`);
  return result;
}

export function changeScore(scores: AbilityScores, id: AbilityId, delta: number): AbilityScores {
  const result = { ...scores, [id]: scores[id] + delta };
  return validScores(result) ? result : scores;
}

export function readScores(params: URLSearchParams): AbilityScores {
  const result = scoresFromValues(ABILITIES.map(({ id }) => Number(params.get(`ability-${id}`))));
  return validScores(result) ? result : defaultScores();
}

export function withScores(params: URLSearchParams, scores: AbilityScores): URLSearchParams {
  const result = new URLSearchParams(params);
  if (!validScores(scores)) throw new Error("Invalid ability scores.");
  for (const { id } of ABILITIES) result.set(`ability-${id}`, String(scores[id]));
  return result;
}

export interface BackgroundBonus {
  id: string;
  label: string;
  scores: AbilityScores;
}

export function backgroundBonuses(abilityNames: readonly string[]): BackgroundBonus[] {
  const allowed = ABILITIES.filter(ability => abilityNames.includes(ability.name));
  if (allowed.length !== 3) return [];
  const zero = scoresFromValues(ABILITIES.map(() => 0));
  const all = { ...zero };
  for (const { id } of allowed) all[id] = 1;
  return [
    { id: "all", label: `+1 en ${allowed.map(ability => ability.name).join(", ")}`, scores: all },
    ...allowed.flatMap(first => allowed.filter(second => first.id !== second.id).map(second => ({
      id: `${first.id}:${second.id}`,
      label: `+2 ${first.name} et +1 ${second.name}`,
      scores: { ...zero, [first.id]: 2, [second.id]: 1 },
    }))),
  ];
}

export function abilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}
