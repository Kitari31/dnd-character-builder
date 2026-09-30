import acolyte from "@/data/backgrounds/acolyte.json";
import artisan from "@/data/backgrounds/artisan.json";
import artiste from "@/data/backgrounds/artiste.json";
import charlatan from "@/data/backgrounds/charlatan.json";
import criminel from "@/data/backgrounds/criminel.json";
import ermite from "@/data/backgrounds/ermite.json";
import fermier from "@/data/backgrounds/fermier.json";
import garde from "@/data/backgrounds/garde.json";
import guide from "@/data/backgrounds/guide.json";
import marchand from "@/data/backgrounds/marchand.json";
import marin from "@/data/backgrounds/marin.json";
import noble from "@/data/backgrounds/noble.json";
import sage from "@/data/backgrounds/sage.json";
import scribe from "@/data/backgrounds/scribe.json";
import soldat from "@/data/backgrounds/soldat.json";
import voyageur from "@/data/backgrounds/voyageur.json";
import { parseCharacterBackground, type CharacterBackground } from "@/types/character-background";

const officialBackgrounds: readonly CharacterBackground[] = [
  acolyte,
  artisan,
  artiste,
  charlatan,
  criminel,
  ermite,
  fermier,
  garde,
  guide,
  marchand,
  marin,
  noble,
  sage,
  scribe,
  soldat,
  voyageur,
].map(parseCharacterBackground);

/** Central entry point for the background catalogue. */
export function getBackgrounds(): readonly CharacterBackground[] {
  return officialBackgrounds;
}
