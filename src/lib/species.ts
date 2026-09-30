import aasimar from "@/data/species/aasimar.json";
import drakeide from "@/data/species/drakeide.json";
import nain from "@/data/species/nain.json";
import elfe from "@/data/species/elfe.json";
import gnome from "@/data/species/gnome.json";
import goliath from "@/data/species/goliath.json";
import halfelin from "@/data/species/halfelin.json";
import humain from "@/data/species/humain.json";
import orc from "@/data/species/orc.json";
import tieffelin from "@/data/species/tieffelin.json";
import { parseCharacterSpecies, type CharacterSpecies } from "@/types/character-species";

const officialSpecies: readonly CharacterSpecies[] = [
  aasimar,
  drakeide,
  nain,
  elfe,
  gnome,
  goliath,
  halfelin,
  humain,
  orc,
  tieffelin,
].map(parseCharacterSpecies);

/** Central entry point for the species catalogue. */
export function getSpecies(): readonly CharacterSpecies[] {
  return officialSpecies;
}
