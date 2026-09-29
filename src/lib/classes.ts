import barbare from "@/data/classes/barbare.json";
import barde from "@/data/classes/barde.json";
import clerc from "@/data/classes/clerc.json";
import druide from "@/data/classes/druide.json";
import ensorceleur from "@/data/classes/ensorceleur.json";
import guerrier from "@/data/classes/guerrier.json";
import magicien from "@/data/classes/magicien.json";
import moine from "@/data/classes/moine.json";
import paladin from "@/data/classes/paladin.json";
import rodeur from "@/data/classes/rodeur.json";
import roublard from "@/data/classes/roublard.json";
import occultiste from "@/data/classes/occultiste.json";
import { parseCharacterClass, type CharacterClass } from "@/types/character-class";

const officialClasses: readonly CharacterClass[] = [
  barbare,
  barde,
  clerc,
  druide,
  ensorceleur,
  guerrier,
  magicien,  moine,
  paladin,
  rodeur,
  roublard,
  occultiste,
].map(parseCharacterClass);

/** Central entry point for the class catalogue. */
export function getClasses(): readonly CharacterClass[] {
  return officialClasses;
}
