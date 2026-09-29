"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const species = [
  {
    id: "aasimar",
    name: "Aasimar",
    role: "Héritage céleste",
    description:
      "Des êtres touchés par une puissance céleste, souvent guidés par la lumière et le destin.",
    traits: ["Résistance sacrée", "Présence marquante", "Thème lumineux"],
  },
  {
    id: "dragonborn",
    name: "Drakéide",
    role: "Sang draconique",
    description:
      "Descendants des dragons, fiers et puissants, marqués par leur souffle et leur prestance.",
    traits: ["Souffle draconique", "Présence forte", "Style agressif"],
  },
  {
    id: "dwarf",
    name: "Nain",
    role: "Peuple des montagnes",
    description:
      "Robustes, disciplinés et profondément ancrés dans leurs traditions, les nains excellent dans l’endurance.",
    traits: ["Grande résistance", "Esprit tenace", "Style défensif"],
  },
  {
    id: "elf",
    name: "Elfe",
    role: "Grâce ancestrale",
    description:
      "Élégants et anciens, les elfes brillent par leur agilité, leur perception et leur lien avec la magie.",
    traits: ["Grande agilité", "Perception fine", "Affinité magique"],
  },
  {
    id: "gnome",
    name: "Gnome",
    role: "Ingéniosité vive",
    description:
      "Curieux et malins, les gnomes aiment la découverte, la créativité et les solutions inattendues.",
    traits: ["Esprit inventif", "Petit gabarit", "Touche malicieuse"],
  },
  {
    id: "goliath",
    name: "Goliath",
    role: "Force des sommets",
    description:
      "Imposants et résistants, les goliaths sont forgés par la rudesse des montagnes et l’épreuve.",
    traits: ["Puissance physique", "Grande endurance", "Présence imposante"],
  },
  {
    id: "halfling",
    name: "Halfelin",
    role: "Chance vagabonde",
    description:
      "Petits mais courageux, les halfelins compensent leur taille par leur audace et leur étonnante chance.",
    traits: ["Chance naturelle", "Discrétion", "Ton léger"],
  },
  {
    id: "human",
    name: "Humain",
    role: "Polyvalence absolue",
    description:
      "Adaptables et ambitieux, les humains peuvent suivre presque toutes les voies et tous les destins.",
    traits: ["Très polyvalent", "Flexible", "Bon pour débuter"],
  },
  {
    id: "orc",
    name: "Orc",
    role: "Fureur maîtrisée",
    description:
      "Les orcs avancent avec force, ténacité et instinct, capables d’encaisser et de frapper fort.",
    traits: ["Endurance élevée", "Puissance brute", "Rythme offensif"],
  },
  {
    id: "tiefling",
    name: "Tieffelin",
    role: "Héritage infernal",
    description:
      "Marqués par une ascendance surnaturelle, les tieffelins dégagent une aura singulière et mystérieuse.",
    traits: ["Affinité magique", "Identité forte", "Ambiance mystique"],
  },
];

export default function SpeciesPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#0b0e12] text-white">Chargement…</main>}>
      <SpeciesSelection />
    </Suspense>
  );
}

function SpeciesSelection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedClass = searchParams.get("class") ?? "";
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string>("human");

  const selectedSpecies = useMemo(
    () => species.find((item) => item.id === selectedSpeciesId) ?? species[0],
    [selectedSpeciesId]
  );

  const handleContinue = () => {
    const params = new URLSearchParams();

    if (selectedClass) {
      params.set("class", selectedClass);
    }

    params.set("species", selectedSpeciesId);

    router.push(`/creation/backgrounds?${params.toString()}`);
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
                Choisis ta race
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
                Sélectionne la race de ton personnage. Chaque race apporte
                une identité forte, un style de jeu et un imaginaire différent.
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
                  Espèces disponibles
                </h2>

                <span className="text-sm text-white/35">
                  {species.length} choix
                </span>
              </div>

              <div className="lg:h-[calc(100%-2.5rem)] lg:overflow-y-auto">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                  {species.map((item) => {
                    const isSelected = item.id === selectedSpeciesId;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedSpeciesId(item.id)}
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
                  {selectedSpecies.name}
                </span>
              </div>

              <div className="flex min-h-0 flex-1 flex-col gap-4">
                {/* Visual block */}
                <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[radial-gradient(circle_at_top,rgba(184,155,109,0.22),transparent_38%),linear-gradient(180deg,#151a20_0%,#0d1116_100%)]">
                  <div className="flex aspect-[4/3] items-center justify-center lg:aspect-[4/3]">
                    <div className="text-center">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                        Illustration / portrait plus tard
                      </p>
                    </div>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                      Identité
                    </p>
                    <h3 className="mt-1 text-2xl font-semibold">
                      {selectedSpecies.name}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <div className="rounded-xl border border-white/10 bg-black/15 p-4">
                  <p className="mb-2 text-xs uppercase tracking-[0.18em] text-white/40">
                    Description
                  </p>
                  <p className="text-sm leading-6 text-white/70">
                    {selectedSpecies.description}
                  </p>
                </div>

                {/* Traits */}
                <div className="rounded-xl border border-white/10 bg-black/15 p-4">
                  <p className="mb-3 text-xs uppercase tracking-[0.18em] text-white/40">
                    Points clés
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {selectedSpecies.traits.map((trait) => (
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
