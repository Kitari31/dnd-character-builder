export const HIT_DICE: Readonly<Record<string, number>> = {
  barbare: 12, guerrier: 10, paladin: 10, rodeur: 10,
  barde: 8, clerc: 8, druide: 8, moine: 8, roublard: 8, occultiste: 8,
  ensorceleur: 6, magicien: 6,
};

export function calculateHitPoints(die: number, level: number, modifier: number, rolls?: readonly number[]) {
  if (![6, 8, 10, 12].includes(die) || !Number.isInteger(level) || level < 1 || level > 20
    || !Number.isInteger(modifier)) throw new Error("Invalid hit point parameters.");
  if (rolls && (rolls.length !== level - 1 || rolls.some(roll => !Number.isInteger(roll) || roll < 1 || roll > die))) {
    throw new Error("Invalid hit point rolls.");
  }
  const gains = Array.from({ length: level }, (_, index) => {
    const base = index === 0 ? die : rolls ? rolls[index - 1] : die / 2 + 1;
    return { level: index + 1, base, gain: Math.max(1, base + modifier) };
  });
  return { gains, total: gains.reduce((sum, item) => sum + item.gain, 0) };
}
