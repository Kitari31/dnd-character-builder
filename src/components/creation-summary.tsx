import { getClasses } from "@/lib/classes";
import { getSpecies } from "@/lib/species";
import { getBackgrounds } from "@/lib/backgrounds";

interface CreationSummaryProps {
  classId?: string | null;
  speciesId?: string | null;
  backgroundId?: string | null;
  level?: string | number | null;
}

export function CreationSummary({ classId, speciesId, backgroundId, level }: CreationSummaryProps) {
  const numericLevel = Number(level);
  const validLevel = Number.isInteger(numericLevel) && numericLevel >= 1 && numericLevel <= 20 ? numericLevel : null;
  const parts = [
    getClasses().find(item => item.id === classId)?.name,
    getSpecies().find(item => item.id === speciesId)?.name,
    getBackgrounds().find(item => item.id === backgroundId)?.name,
    validLevel !== null ? `Niveau ${validLevel}` : null,
  ].filter(Boolean);

  if (parts.length === 0) return null;

  return <p aria-label="Récapitulatif du personnage" className="mt-3 text-sm text-[#d8c09a]">{parts.join(" · ")}</p>;
}
