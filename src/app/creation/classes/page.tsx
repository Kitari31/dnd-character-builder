"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const classes = [
  {
    id: "barbarian",
    name: "Barbare",
    role: "Puissance brute",
    description:
      "Les barbares sont de puissants guerriers animés par des forces primordiales qui se manifestent sous forme d'une rage.",
    traits: ["Rage", "Resistance naturelle", "Mêlée"],
    primaryStat: "Force",
    difficulty: "Moyenne",
  },
  {
    id: "bard",
    name: "Barde",
    role: "Soutien polyvalent",
    description:
      "Les bardes excellent dans l'art d'inspirer autrui, d'apaiser les blessures, de décourager les ennemis et de créer des illusions.",
    traits: ["Soutien", "Musique", "Contrôle"],
    primaryStat: "Charisme",
    difficulty: "Élevée",
  },
  {
    id: "cleric",
    name: "Clerc",
    role: "Magie divine",
    description:
      "Les clercs tirent leur pouvoir des domaines des dieux et le canalisent pour accomplir des miracles.",
    traits: ["Soin", "Protection", "Ordre divin"],
    primaryStat: "Sagesse",
    difficulty: "Moyenne",
  },
  {
    id: "druid",
    name: "Druide",
    role: "Nature et métamorphose",
    description:
      "Les druides canalisent les forces de la nature pour soigner, se transformer en animaux et déchaîner une destruction élémentaire.",
    traits: ["Nature", "Métamorphose", "Contrôle"],
    primaryStat: "Sagesse",
    difficulty: "Élevée",
  },
  {
    id: "fighter",
    name: "Guerrier",
    role: "Maître des armes",
    description:
      "Les combattants font preuve de prouesses sans précédent avec leurs armes et armures, les utilisant pour infliger et défier la mort.",
    traits: ["Armes", "Technique", "Polyvalence"],
    primaryStat: "Force ou Dextérité",
    difficulty: "Facile",
  },
  {
    id: "monk",
    name: "Moine",
    role: "Discipline martiale",
    description:
      "Les moines font appel à l'entraînement et à la discipline pour concentrer leur énergie intérieure, la canalisant afin de frapper vite et fort.",
    traits: ["Mobilité", "Arts martiaux", "Discipline"],
    primaryStat: "Dextérité & Sagesse",
    difficulty: "Élevée",
  },
  {
    id: "paladin",
    name: "Paladin",
    role: "Champion sacré",
    description:
      "Les paladins sont unis par leurs serments pour s'opposer aux forces de l'anéantissement.",
    traits: ["Tank", "Soutien", "Châtiment-divin"],
    primaryStat: "Force & Charisme",
    difficulty: "Moyenne",
  },
  {
    id: "ranger",
    name: "Rôdeur",
    role: "Traqueur polyvalent",
    description:
      "Les rôdeurs canalisent des pouvoirs primordiaux pour protéger le monde des ravages causés par les monstres et les tyrans.",
    traits: ["Traque", "Distance", "Exploration"],
    primaryStat: "Dextérité & Sagesse",
    difficulty: "Moyenne",
  },
  {
    id: "rogue",
    name: "Roublard",
    role: "Précision et ruse",
    description:
      "Les roublards misent sur la ruse, la discrétion et les vulnérabilités de leurs adversaires pour prendre le dessus en toute situation.",
    traits: ["Discrétion", "Précision", "Mobilité"],
    primaryStat: "Dextérité",
    difficulty: "facile",
  },
  {
    id: "sorcerer",
    name: "Ensorceleur",
    role: "Magie innée",
    description:
      "Les ensorceleurs manient une magie innée, inscrite au plus profond de leur être.",
    traits: ["Métamagie", "Style explosif", "Puissance"],
    primaryStat: "Charisme",
    difficulty: "Élevée",
  },
  {
    id: "warlock",
    name: "Occultiste",
    role: "Pacte mystérieux",
    description:
      "Les démonistes partent en quête de savoirs occultes et concluent des pactes avec des êtres ancestraux pour accroître leur propre puissance.",
    traits: ["Pacte", "Malédictions", "Décharges"],
    primaryStat: "Charisme",
    difficulty: "Élevée",
  },
  {
    id: "wizard",
    name: "Magicien",
    role: "Maîtrise des arcanes",
    description:
      "Les magiciens étudient la magie pour lancer des sorts de feu explosif, de tromperie subtile et de transformations spectaculaires.",
    traits: ["Sorts", "Contrôle", "Connaissance"],
    primaryStat: "Intelligence",
    difficulty: "Moyenne",
  },
];

export default function ClassPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedSpecies = searchParams.get("species") ?? "";
  const [selectedClassId, setSelectedClassId] = useState<string>("fighter");

  const selectedClass = useMemo(
    () => classes.find((item) => item.id === selectedClassId) ?? classes[0],
    [selectedClassId]
  );

  const handleContinue = () => {
    const params = new URLSearchParams();

    if (selectedSpecies) {
      params.set("species", selectedSpecies);
    }

    params.set("class", selectedClassId);

    router.push(`/creation/background?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-[#0b0e12] text-white lg:h-screen lg:overflow-hidden">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 sm:px-6 lg:h-screen lg:px-8 lg:py-6">
        {/* Header */}
        <header className="shrink-0 border-b border-white/10 pb-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-[#b89b6d]">
                Création du personnage · Étape 02
              </p>

              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Choisis ta classe
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
                La classe définit le style de jeu principal de ton personnage :
                combat, magie, soutien, discrétion ou polyvalence.
              </p>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="mt-4 flex-1 lg:min-h-0">
          <div className="grid h-full gap-4 lg:grid-cols-[1.45fr_0.9fr]">
            {/* Left panel */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 lg:min-h-0 lg:overflow-hidden">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-white/50">
                  Classes disponibles
                </h2>

                <span className="text-sm text-white/35">
                  {classes.length} choix
                </span>
              </div>

              <div className="lg:h-[calc(100%-2.5rem)] lg:overflow-y-auto">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                  {classes.map((item) => {
                    const isSelected = item.id === selectedClassId;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedClassId(item.id)}
                        className={`
                          group relative overflow-hidden rounded-xl border p-4 text-left transition-all duration-200
                          aspect-[1/0.82]
                          ${
                            isSelected
                              ? "border-[#b89b6d] bg-[linear-gradient(180deg,rgba(184,155,109,0.18),rgba(184,155,109,0.06))] shadow-[0_0_0_1px_rgba(184,155,109,0.2)]"
                              : "border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] hover:border-white/20 hover:bg-white/[0.05]"
                          }
                        `}
                      >

                        {/* bottom content */}
                        <div className="relative z-10 mt-auto flex h-full flex-col justify-end">
                          <p className="mb-1 text-xs uppercase tracking-[0.16em] text-white/40">
                            {item.role}
                          </p>

                          <h3 className="text-xl font-semibold tracking-tight">
                            {item.name}
                          </h3>

                          <div
                            className={`
                              mt-3 h-px w-10
                              ${isSelected ? "bg-[#b89b6d]" : "bg-white/12"}
                            `}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Right panel */}
            <aside className="flex flex-col rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5 lg:min-h-0">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-white/50">
                  Aperçu
                </h2>

                <span className="rounded-full border border-[#b89b6d]/30 bg-[#b89b6d]/10 px-3 py-1 text-xs font-medium text-[#d8c09a]">
                  {selectedClass.name}
                </span>
              </div>

              <div className="flex min-h-0 flex-1 flex-col gap-4">
                {/* Visual block */}
                <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[radial-gradient(circle_at_top,rgba(184,155,109,0.22),transparent_38%),linear-gradient(180deg,#151a20_0%,#0d1116_100%)]">
                  <div className="flex aspect-[16/10] items-center justify-center">
                    <div className="text-center">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                        Illustration / portrait plus tard
                      </p>
                    </div>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                      Classe
                    </p>
                    <h3 className="mt-1 text-2xl font-semibold">
                      {selectedClass.name}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <div className="rounded-xl border border-white/10 bg-black/15 p-4">
                  <p className="mb-2 text-xs uppercase tracking-[0.18em] text-white/40">
                    Description
                  </p>
                  <p className="text-sm leading-6 text-white/70">
                    {selectedClass.description}
                  </p>
                </div>

                {/* Extra infos */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/10 bg-black/15 p-4">
                    <p className="mb-2 text-xs uppercase tracking-[0.18em] text-white/40">
                      Caractéristique principale
                    </p>
                    <p className="text-sm font-medium text-white/80">
                      {selectedClass.primaryStat}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/15 p-4">
                    <p className="mb-2 text-xs uppercase tracking-[0.18em] text-white/40">
                      Difficulté
                    </p>
                    <p className="text-sm font-medium text-white/80">
                      {selectedClass.difficulty}
                    </p>
                  </div>
                </div>

                {/* Traits */}
                <div className="rounded-xl border border-white/10 bg-black/15 p-4">
                  <p className="mb-3 text-xs uppercase tracking-[0.18em] text-white/40">
                    Points clés
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {selectedClass.traits.map((trait) => (
                      <span
                        key={trait}
                        className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/75"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer actions */}
                <div className="mt-auto flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="text-sm font-medium text-white/50 transition hover:text-white"
                  >
                    ← Retour
                  </button>

                  <button
                    type="button"
                    onClick={handleContinue}
                    className="rounded-xl border border-[#b89b6d] bg-[#b89b6d]/10 px-5 py-3 text-sm font-semibold text-[#f1e2c9] transition hover:bg-[#b89b6d]/20"
                  >
                    Continuer →
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}