"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const SOURCE_URL =
  "https://www.aidedd.org/regles-24/origines-des-personnages/description-des-historiques/";

const backgrounds = [
  {
    id: "acolyte",
    name: "Acolyte",
    role: "Foi et spiritualité",
    description:
      "Vous avez vécu au service d'un lieu sacré, étudié la religion et appris à canaliser une petite part de puissance divine.",
    abilities: ["Intelligence", "Sagesse", "Charisme"],
    feat: {
      name: "Initié à la magie",
      detail: "Clerc",
      url: "https://www.aidedd.org/feat/fr/initie-a-la-magie",
    },
    skills: ["Intuition", "Religion"],
    tool: "Matériel de calligraphe",
    theme: "Temple et dévotion",
  },
  {
    id: "artisan",
    name: "Artisan",
    role: "Création et savoir-faire",
    description:
      "Vous avez appris votre métier dans un atelier et développé un véritable savoir-faire ainsi qu'un œil attentif aux détails.",
    abilities: ["Force", "Dextérité", "Intelligence"],
    feat: {
      name: "Façonneur",
      url: "https://www.aidedd.org/feat/fr/faconneur",
    },
    skills: ["Investigation", "Persuasion"],
    tool: "Au choix : outils d'artisan",
    theme: "Atelier et création",
  },
  {
    id: "artiste",
    name: "Artiste",
    role: "Spectacle et expression",
    description:
      "Votre jeunesse a été marquée par les spectacles, la musique et les représentations. Vous êtes à votre place devant un public.",
    abilities: ["Force", "Dextérité", "Charisme"],
    feat: {
      name: "Musicien",
      url: "https://www.aidedd.org/feat/fr/musicien",
    },
    skills: ["Acrobaties", "Représentation"],
    tool: "Au choix : instrument de musique",
    theme: "Scène et spectacle",
  },
  {
    id: "charlatan",
    name: "Charlatan",
    role: "Ruse et tromperie",
    description:
      "Vous avez appris à profiter de la crédulité des autres, à inventer des histoires convaincantes et à vous sortir des situations délicates.",
    abilities: ["Dextérité", "Constitution", "Charisme"],
    feat: {
      name: "Doué",
      url: "https://www.aidedd.org/feat/fr/doue",
    },
    skills: ["Escamotage", "Tromperie"],
    tool: "Matériel de contrefaçon",
    theme: "Mensonges et combines",
  },
  {
    id: "criminel",
    name: "Criminel",
    role: "Ombres et discrétion",
    description:
      "Vous avez survécu grâce au vol, aux cambriolages ou à d'autres activités clandestines, seul ou entouré d'autres malfrats.",
    abilities: ["Dextérité", "Constitution", "Intelligence"],
    feat: {
      name: "Vigilant",
      url: "https://www.aidedd.org/feat/fr/vigilant",
    },
    skills: ["Escamotage", "Discrétion"],
    tool: "Outils de voleur",
    theme: "Ruelles et bas-fonds",
  },
  {
    id: "ermite",
    name: "Ermite",
    role: "Solitude et méditation",
    description:
      "Vous avez vécu loin de la civilisation, consacrant de longues périodes à la réflexion, à la nature et aux mystères du monde.",
    abilities: ["Constitution", "Sagesse", "Charisme"],
    feat: {
      name: "Guérisseur",
      url: "https://www.aidedd.org/feat/fr/guerisseur",
    },
    skills: ["Médecine", "Religion"],
    tool: "Matériel d'herboriste",
    theme: "Retraite et méditation",
  },
  {
    id: "fermier",
    name: "Fermier",
    role: "Nature et endurance",
    description:
      "Vous avez grandi en travaillant la terre et en prenant soin des animaux. Cette vie vous a appris la patience et la robustesse.",
    abilities: ["Force", "Constitution", "Sagesse"],
    feat: {
      name: "Robuste",
      url: "https://www.aidedd.org/feat/fr/robuste",
    },
    skills: ["Dressage", "Nature"],
    tool: "Outils de charpentier",
    theme: "Terre et campagne",
  },
  {
    id: "garde",
    name: "Garde",
    role: "Vigilance et protection",
    description:
      "Vous avez passé de longues heures à surveiller les murailles, les rues ou les portes d'une cité, toujours attentif au moindre danger.",
    abilities: ["Force", "Intelligence", "Sagesse"],
    feat: {
      name: "Vigilant",
      url: "https://www.aidedd.org/feat/fr/vigilant",
    },
    skills: ["Athlétisme", "Perception"],
    tool: "Au choix : boîte de jeux",
    theme: "Remparts et surveillance",
  },
  {
    id: "guide",
    name: "Guide",
    role: "Exploration et survie",
    description:
      "Vous avez grandi loin des terres habitées et appris à survivre dans les régions sauvages, à voyager et à guider ceux qui s'y aventurent.",
    abilities: ["Dextérité", "Constitution", "Sagesse"],
    feat: {
      name: "Initié à la magie",
      detail: "Druide",
      url: "https://www.aidedd.org/feat/fr/initie-a-la-magie",
    },
    skills: ["Discrétion", "Survie"],
    tool: "Outils de cartographe",
    theme: "Nature sauvage",
  },
  {
    id: "marchand",
    name: "Marchand",
    role: "Commerce et voyage",
    description:
      "Vous avez appris à acheter, vendre et transporter des marchandises, parcourant parfois de longues distances pour exercer votre métier.",
    abilities: ["Constitution", "Intelligence", "Charisme"],
    feat: {
      name: "Chanceux",
      url: "https://www.aidedd.org/feat/fr/chanceux",
    },
    skills: ["Dressage", "Persuasion"],
    tool: "Instruments de navigateur",
    theme: "Commerce et caravanes",
  },
  {
    id: "marin",
    name: "Marin",
    role: "Mer et aventure",
    description:
      "Vous avez vécu sur les ponts des navires, affronté les tempêtes et fréquenté les nombreux ports qui bordent les mers.",
    abilities: ["Force", "Dextérité", "Sagesse"],
    feat: {
      name: "Bagarreur de tavernes",
      url: "https://www.aidedd.org/feat/fr/bagarreur-de-tavernes",
    },
    skills: ["Acrobaties", "Perception"],
    tool: "Instruments de navigateur",
    theme: "Océan et navigation",
  },
  {
    id: "noble",
    name: "Noble",
    role: "Influence et autorité",
    description:
      "Vous avez grandi au milieu du pouvoir, du confort et des traditions de la noblesse, recevant une éducation privilégiée.",
    abilities: ["Force", "Intelligence", "Charisme"],
    feat: {
      name: "Doué",
      url: "https://www.aidedd.org/feat/fr/doue",
    },
    skills: ["Histoire", "Persuasion"],
    tool: "Au choix : boîte de jeux",
    theme: "Cour et privilèges",
  },
  {
    id: "sage",
    name: "Sage",
    role: "Étude et connaissance",
    description:
      "Vous avez consacré des années à l'étude de livres et de parchemins, accumulant des connaissances sur le monde et la magie.",
    abilities: ["Constitution", "Intelligence", "Sagesse"],
    feat: {
      name: "Initié à la magie",
      detail: "Magicien",
      url: "https://www.aidedd.org/feat/fr/initie-a-la-magie",
    },
    skills: ["Arcanes", "Histoire"],
    tool: "Matériel de calligraphe",
    theme: "Bibliothèques et savoir",
  },
  {
    id: "scribe",
    name: "Scribe",
    role: "Écriture et précision",
    description:
      "Vous avez travaillé parmi les documents, les archives et les manuscrits, développant une écriture soignée et un grand souci du détail.",
    abilities: ["Dextérité", "Intelligence", "Sagesse"],
    feat: {
      name: "Doué",
      url: "https://www.aidedd.org/feat/fr/doue",
    },
    skills: ["Investigation", "Perception"],
    tool: "Matériel de calligraphe",
    theme: "Archives et manuscrits",
  },
  {
    id: "soldat",
    name: "Soldat",
    role: "Discipline et combat",
    description:
      "Vous avez été formé à la guerre et avez mis cet entraînement en pratique sur le champ de bataille.",
    abilities: ["Force", "Dextérité", "Constitution"],
    feat: {
      name: "Sauvagerie martiale",
      url: "https://www.aidedd.org/feat/fr/sauvagerie-martiale",
    },
    skills: ["Athlétisme", "Intimidation"],
    tool: "Au choix : jeu",
    theme: "Armée et champ de bataille",
  },
  {
    id: "voyageur",
    name: "Voyageur",
    role: "Débrouille et liberté",
    description:
      "Vous avez grandi dans la rue et appris à survivre grâce aux petits travaux, à votre débrouillardise et parfois au vol.",
    abilities: ["Dextérité", "Sagesse", "Charisme"],
    feat: {
      name: "Chanceux",
      url: "https://www.aidedd.org/feat/fr/chanceux",
    },
    skills: ["Discrétion", "Intuition"],
    tool: "Outils de voleur",
    theme: "Rues et vagabondage",
  },
];

export default function BackgroundPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedSpecies = searchParams.get("species") ?? "";
  const selectedClass = searchParams.get("class") ?? "";

  const [selectedBackgroundId, setSelectedBackgroundId] =
    useState<string>("acolyte");

  const selectedBackground = useMemo(
    () =>
      backgrounds.find((item) => item.id === selectedBackgroundId) ??
      backgrounds[0],
    [selectedBackgroundId]
  );

  const handleContinue = () => {
    const params = new URLSearchParams();

    if (selectedSpecies) {
      params.set("species", selectedSpecies);
    }

    if (selectedClass) {
      params.set("class", selectedClass);
    }

    params.set("background", selectedBackgroundId);

    router.push(`/creation/abilities?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-[#0b0e12] text-white lg:h-screen lg:overflow-hidden">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 sm:px-6 lg:h-screen lg:px-8 lg:py-6">
        {/* Header */}
        <header className="shrink-0 border-b border-white/10 pb-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-[#b89b6d]">
                Création du personnage · Étape 03
              </p>

              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Choisis ton historique
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
                Ton historique représente la vie de ton personnage avant le
                début de son aventure et détermine plusieurs de ses aptitudes
                de départ.
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
                  Historiques disponibles
                </h2>

                <span className="text-sm text-white/35">
                  {backgrounds.length} choix
                </span>
              </div>

              <div className="lg:h-[calc(100%-2.5rem)] lg:overflow-y-auto">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                  {backgrounds.map((item) => {
                    const isSelected =
                      item.id === selectedBackgroundId;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          setSelectedBackgroundId(item.id)
                        }
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
                              ${
                                isSelected
                                  ? "bg-[#b89b6d]"
                                  : "bg-white/12"
                              }
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
            <aside className="flex flex-col rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5 lg:min-h-0 lg:overflow-hidden">
              <div className="mb-4 flex shrink-0 items-center justify-between">
                <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-white/50">
                  Aperçu
                </h2>

                <span className="rounded-full border border-[#b89b6d]/30 bg-[#b89b6d]/10 px-3 py-1 text-xs font-medium text-[#d8c09a]">
                  {selectedBackground.name}
                </span>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                <div className="flex min-h-full flex-col gap-3">
                  {/* Visual */}
                  <div className="relative shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[radial-gradient(circle_at_top,rgba(184,155,109,0.22),transparent_38%),linear-gradient(180deg,#151a20_0%,#0d1116_100%)]">
                    <div className="flex aspect-[16/7] items-center justify-center">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                        Illustration / décor plus tard
                      </p>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                        {selectedBackground.theme}
                      </p>

                      <h3 className="mt-1 text-2xl font-semibold">
                        {selectedBackground.name}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="shrink-0 rounded-xl border border-white/10 bg-black/15 p-4">
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                        Historique
                      </p>

                      <a
                        href={SOURCE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#b89b6d] transition hover:text-[#d8c09a]"
                      >
                        Fiche complète ↗
                      </a>
                    </div>

                    <p className="text-sm leading-6 text-white/70">
                      {selectedBackground.description}
                    </p>
                  </div>

                  {/* Ability scores */}
                  <div className="shrink-0 rounded-xl border border-white/10 bg-black/15 p-4">
                    <p className="mb-3 text-xs uppercase tracking-[0.18em] text-white/40">
                      Valeurs de caractéristique
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {selectedBackground.abilities.map((ability) => (
                        <span
                          key={ability}
                          className="rounded-md border border-[#b89b6d]/20 bg-[#b89b6d]/10 px-3 py-2 text-sm font-medium text-[#dfc79f]"
                        >
                          {ability}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Feat + skills */}
                  <div className="grid shrink-0 grid-cols-2 gap-3">
                    <div className="rounded-xl border border-white/10 bg-black/15 p-4">
                      <p className="mb-2 text-xs uppercase tracking-[0.18em] text-white/40">
                        Don
                      </p>

                      <a
                        href={selectedBackground.feat.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-white/85 transition hover:text-[#d8c09a]"
                      >
                        {selectedBackground.feat.name} ↗
                      </a>

                      {"detail" in selectedBackground.feat &&
                        selectedBackground.feat.detail && (
                          <p className="mt-1 text-xs text-white/40">
                            {selectedBackground.feat.detail}
                          </p>
                        )}
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/15 p-4">
                      <p className="mb-2 text-xs uppercase tracking-[0.18em] text-white/40">
                        Compétences
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {selectedBackground.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-sm text-white/75"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Tool + Equipment */}
                  <div className="grid shrink-0 grid-cols-2 gap-3">
                    <div className="rounded-xl border border-white/10 bg-black/15 p-4">
                      <p className="mb-2 text-xs uppercase tracking-[0.18em] text-white/40">
                        Maîtrise d&apos;outils
                      </p>

                      <p className="text-sm font-medium leading-5 text-white/80">
                        {selectedBackground.tool}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/15 p-4">
                      <p className="mb-2 text-xs uppercase tracking-[0.18em] text-white/40">
                        Équipement
                      </p>

                      <p className="text-sm font-medium text-white/80">
                        Paquetage ou 50 po
                      </p>

                      <a
                        href={SOURCE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-block text-xs text-white/35 transition hover:text-[#d8c09a]"
                      >
                        Voir le détail ↗
                      </a>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-auto flex shrink-0 items-center justify-between pt-2">
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
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}