import classData from "@/data/equipment/classes.json";
import backgroundData from "@/data/equipment/backgrounds.json";
import choices from "@/data/equipment/choices.json";
import { parseEquipmentOption, type EquipmentChoice, type EquipmentOption } from "@/types/equipment";

const classEquipment: Record<string, readonly EquipmentOption[]> = Object.fromEntries(
  Object.entries(classData).map(([id, options]) => [id, options.map(parseEquipmentOption)])
);
const backgroundEquipment: Record<string, readonly EquipmentOption[]> = Object.fromEntries(
  Object.entries(backgroundData).map(([id, pack]) => [id, [
    parseEquipmentOption({ id: "a", label: "Paquetage", ...pack }),
    parseEquipmentOption({ id: "b", label: "Pièces d’or", items: [], gold: 50 }),
  ]])
);

export function getClassEquipment(id: string): readonly EquipmentOption[] {
  return Object.hasOwn(classEquipment, id) ? classEquipment[id] : [];
}

export function getBackgroundEquipment(id: string): readonly EquipmentOption[] {
  return Object.hasOwn(backgroundEquipment, id) ? backgroundEquipment[id] : [];
}

export function getEquipmentChoices(choice?: EquipmentChoice): readonly string[] {
  if (!choice) return [];
  if (choice === "artisan-or-instrument") return [...choices.artisan, ...choices.instrument];
  return choices[choice];
}

export const equipmentChoiceLabels: Record<EquipmentChoice, string> = {
  instrument: "Instrument de musique",
  artisan: "Outils d’artisan",
  "artisan-or-instrument": "Outils d’artisan ou instrument de musique",
  game: "Boîte de jeux",
};

export function resolveEquipmentOption(options: readonly EquipmentOption[], id: string | null): EquipmentOption {
  const selected = options.find(option => option.id === id) ?? options[0];
  if (!selected) throw new Error("No equipment options available.");
  return selected;
}

export function resolveEquipmentChoice(option: EquipmentOption, value: string | null): string {
  const options = getEquipmentChoices(option.choice);
  return value && options.includes(value) ? value : options[0] ?? "";
}

export function getEquipmentItems(option: EquipmentOption, choice: string): readonly string[] {
  return option.choice ? [...option.items, resolveEquipmentChoice(option, choice)] : option.items;
}
