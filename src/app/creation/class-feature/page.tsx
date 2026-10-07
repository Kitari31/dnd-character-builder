"use client";

import {
  Suspense,
  useMemo,
  useState,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  getClassFeatureConfig,
  type AbilityId,
  type ClassFeature,
  type LevelImprovementChoice,
} from "@/lib/class-features";

const ABILITIES: {
  id: AbilityId;
  name: string;
}[] = [
  {
    id: "strength",
    name: "Force",
  },
  {
    id: "dexterity",
    name: "Dextérité",
  },
  {
    id: "constitution",
    name: "Constitution",
  },
  {
    id: "intelligence",
    name: "Intelligence",
  },
  {
    id: "wisdom",
    name: "Sagesse",
  },
  {
    id: "charisma",
    name: "Charisme",
  },
];

const panel =
  "rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6";

const actionButton =
  "rounded-xl border border-[#b89b6d]/60 bg-[#b89b6d]/10 px-5 py-3 text-sm font-semibold text-[#f1e2c9] transition hover:bg-[#b89b6d]/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b89b6d] disabled:cursor-not-allowed disabled:opacity-35";

function emptyImprovementChoice(): LevelImprovementChoice {
  return {
    type: "",
    ability1: "",
    ability2: "",
    feat: "",
  };
}

function ClassFeatureContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const classId = searchParams.get("class");

  const config =
    getClassFeatureConfig(classId);

  const parsedLevel =
    Number(searchParams.get("level") ?? 1);

  const level =
    Number.isInteger(parsedLevel) &&
    parsedLevel >= 1 &&
    parsedLevel <= 20
      ? parsedLevel
      : 1;

  const [selectedSubclass, setSelectedSubclass] =
    useState(
      searchParams.get("subclass") ?? ""
    );

  const [levelChoices, setLevelChoices] =
    useState<
      Record<number, LevelImprovementChoice>
    >(() => {
      const choices: Record<
        number,
        LevelImprovementChoice
      > = {};

      if (!config) {
        return choices;
      }

      for (const improvementLevel of config.improvementLevels) {
        const storedChoice =
          searchParams.get(
            `level${improvementLevel}Choice`
          );

        choices[improvementLevel] = {
          type:
            storedChoice === "ability"
              ? "ability"
              : storedChoice === "feat"
                ? "feat"
                : "",

          ability1:
            (searchParams.get(
              `level${improvementLevel}Ability1`
            ) as AbilityId | null) ?? "",

          ability2:
            (searchParams.get(
              `level${improvementLevel}Ability2`
            ) as AbilityId | null) ?? "",

          feat:
            searchParams.get(
              `level${improvementLevel}Feat`
            ) ?? "",
        };
      }

      return choices;
    });

  const [epicBoon, setEpicBoon] =
    useState(
      searchParams.get("epicBoon") ?? ""
    );

  const selectedSubclassData =
    useMemo(() => {
      if (!config) {
        return undefined;
      }

      return config.subclasses.find(
        (subclass) =>
          subclass.id === selectedSubclass
      );
    }, [config, selectedSubclass]);

  const featuresByLevel =
    useMemo(() => {
      if (!config) {
        return [];
      }

      return Array.from(
        { length: level },
        (_, index) => {
          const currentLevel = index + 1;

          return {
            level: currentLevel,
            features:
              config.features.filter(
                (feature) =>
                  feature.level ===
                  currentLevel
              ),
          };
        }
      ).filter(
        (group) =>
          group.features.length > 0
      );
    }, [config, level]);

  if (!config) {
    return (
      <main className="min-h-screen bg-[#0b0e12] text-white">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <div className={panel}>
            <p className="text-xs uppercase tracking-[0.2em] text-[#b89b6d]">
              Aptitudes de classe
            </p>

            <h1 className="mt-2 text-3xl font-semibold">
              Cette classe n&apos;est pas encore
              disponible
            </h1>

            <p className="mt-3 text-white/60">
              Les aptitudes de cette classe
              n&apos;ont pas encore été ajoutées.
            </p>

            <button
              type="button"
              onClick={() =>
                router.push(
                  `/creation/classes?${searchParams.toString()}`
                )
              }
              className={`${actionButton} mt-6`}
            >
              ← Retour aux classes
            </button>
          </div>
        </div>
      </main>
    );
  }

  const classConfig = config;

  const needsSubclass =
    classConfig.subclasses.length > 0 &&
    classConfig.features.some(
      (feature) =>
        feature.type === "subclass-choice" &&
        feature.level <= level
    );

  const requiredImprovementLevels =
    classConfig.improvementLevels.filter(
      (improvementLevel) =>
        improvementLevel <= level
    );

  const needsEpicBoon =
    classConfig.epicBoonLevel !== undefined &&
    level >= classConfig.epicBoonLevel;

  function getSubclassFeatures(
    featureLevel: number
  ) {
    if (!selectedSubclassData) {
      return [];
    }

    return (
      selectedSubclassData.features[
        String(featureLevel)
      ] ?? []
    );
  }

  function setImprovementType(
    improvementLevel: number,
    type: "ability" | "feat"
  ) {
    setLevelChoices((current) => ({
      ...current,

      [improvementLevel]: {
        ...(current[
          improvementLevel
        ] ??
          emptyImprovementChoice()),

        type,
        ability1: "",
        ability2: "",
        feat: "",
      },
    }));
  }

  function setImprovementAbility(
    improvementLevel: number,
    key: "ability1" | "ability2",
    ability: AbilityId | ""
  ) {
    setLevelChoices((current) => ({
      ...current,

      [improvementLevel]: {
        ...(current[
          improvementLevel
        ] ??
          emptyImprovementChoice()),

        [key]: ability,
      },
    }));
  }

  function setImprovementFeat(
    improvementLevel: number,
    feat: string
  ) {
    setLevelChoices((current) => ({
      ...current,

      [improvementLevel]: {
        ...(current[
          improvementLevel
        ] ??
          emptyImprovementChoice()),

        feat,
      },
    }));
  }

  function isImprovementComplete(
    improvementLevel: number
  ) {
    const choice =
      levelChoices[improvementLevel] ??
      emptyImprovementChoice();

    if (choice.type === "ability") {
      return Boolean(
        choice.ability1 &&
          choice.ability2
      );
    }

    if (choice.type === "feat") {
      return (
        choice.feat.trim().length > 0
      );
    }

    return false;
  }

  const missingSubclass =
    needsSubclass &&
    !selectedSubclassData;

  const missingImprovement =
    requiredImprovementLevels.some(
      (improvementLevel) =>
        !isImprovementComplete(
          improvementLevel
        )
    );

  const missingEpicBoon =
    needsEpicBoon &&
    epicBoon.trim().length === 0;

  const canContinue =
    !missingSubclass &&
    !missingImprovement &&
    !missingEpicBoon;

  function selectionParams() {
    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    if (selectedSubclass) {
      params.set(
        "subclass",
        selectedSubclass
      );
    } else {
      params.delete("subclass");
    }

    for (const improvementLevel of classConfig.improvementLevels) {
      params.delete(
        `level${improvementLevel}Choice`
      );

      params.delete(
        `level${improvementLevel}Ability1`
      );

      params.delete(
        `level${improvementLevel}Ability2`
      );

      params.delete(
        `level${improvementLevel}Feat`
      );

      if (
        improvementLevel > level
      ) {
        continue;
      }

      const choice =
        levelChoices[
          improvementLevel
        ] ??
        emptyImprovementChoice();

      if (choice.type) {
        params.set(
          `level${improvementLevel}Choice`,
          choice.type
        );
      }

      if (
        choice.type ===
        "ability"
      ) {
        if (
          choice.ability1
        ) {
          params.set(
            `level${improvementLevel}Ability1`,
            choice.ability1
          );
        }

        if (
          choice.ability2
        ) {
          params.set(
            `level${improvementLevel}Ability2`,
            choice.ability2
          );
        }
      }

      if (
        choice.type ===
          "feat" &&
        choice.feat.trim()
      ) {
        params.set(
          `level${improvementLevel}Feat`,
          choice.feat.trim()
        );
      }
    }

    params.delete("epicBoon");

    if (
      needsEpicBoon &&
      epicBoon.trim()
    ) {
      params.set(
        "epicBoon",
        epicBoon.trim()
      );
    }

    return params;
  }

  function handleContinue() {
    if (!canContinue) {
      return;
    }

    router.push(
      `/creation/finish?${selectionParams().toString()}`
    );
  }

  function renderAutomaticFeature(
    feature: ClassFeature
  ) {
    return (
      <div>
        <h3 className="font-semibold">
          {feature.name}
        </h3>

        {feature.summary && (
          <p className="mt-1 text-sm leading-6 text-white/60">
            {feature.summary}
          </p>
        )}
      </div>
    );
  }

  function renderSubclassChoice(
    feature: ClassFeature
  ) {
    return (
      <div>
        <h3 className="font-semibold">
          {feature.name ??
            "Sous-classe"}
        </h3>

        {feature.summary && (
          <p className="mt-1 text-sm leading-6 text-white/60">
            {feature.summary}
          </p>
        )}

        <fieldset className="mt-4">
          <legend className="sr-only">
            Choix de la sous-classe
          </legend>

          <div className="grid gap-3 md:grid-cols-2">
            {classConfig.subclasses.map(
              (subclass) => {
                const selected =
                  selectedSubclass ===
                  subclass.id;

                return (
                  <label
                    key={
                      subclass.id
                    }
                    className={`cursor-pointer rounded-xl border p-4 transition focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-[#b89b6d] ${
                      selected
                        ? "border-[#b89b6d] bg-[#b89b6d]/15"
                        : "border-white/10 bg-black/10 hover:border-white/25"
                    }`}
                  >
                    <span className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="subclass"
                        value={
                          subclass.id
                        }
                        checked={
                          selected
                        }
                        onChange={() =>
                          setSelectedSubclass(
                            subclass.id
                          )
                        }
                        className="mt-1 accent-[#b89b6d]"
                      />

                      <span>
                        <span className="block font-semibold">
                          {
                            subclass.name
                          }
                        </span>

                        <span className="mt-2 block text-sm leading-5 text-white/55">
                          {
                            subclass.summary
                          }
                        </span>
                      </span>
                    </span>
                  </label>
                );
              }
            )}
          </div>
        </fieldset>

        {selectedSubclassData && (
          <div className="mt-5 rounded-xl border border-[#b89b6d]/25 bg-[#b89b6d]/[0.05] p-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-[#b89b6d]">
              Aptitude obtenue ·{" "}
              {
                selectedSubclassData.name
              }
            </p>

            <div className="space-y-4">
              {getSubclassFeatures(
                feature.level
              ).map(
                (
                  subclassFeature
                ) => (
                  <div
                    key={
                      subclassFeature.id
                    }
                  >
                    <h4 className="font-semibold text-[#f1e2c9]">
                      {
                        subclassFeature.name
                      }
                    </h4>

                    <p className="mt-1 text-sm leading-6 text-white/60">
                      {
                        subclassFeature.summary
                      }
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderSubclassFeature(
    feature: ClassFeature
  ) {
    if (!selectedSubclassData) {
      return (
        <div className="rounded-xl border border-[#b89b6d]/25 bg-[#b89b6d]/[0.05] p-4">
          <h3 className="font-semibold text-[#f1e2c9]">
            Sous-classe requise
          </h3>

          <p className="mt-1 text-sm leading-6 text-white/60">
            Il faut choisir ta
            sous-classe avant de
            connaître l&apos;aptitude
            obtenue au niveau{" "}
            {feature.level}.
          </p>
        </div>
      );
    }

    const subclassFeatures =
      getSubclassFeatures(
        feature.level
      );

    if (
      subclassFeatures.length === 0
    ) {
      return (
        <p className="text-sm text-white/50">
          Aucune aptitude de
          sous-classe définie pour ce
          niveau.
        </p>
      );
    }

    return (
      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-[#b89b6d]">
          {
            selectedSubclassData.name
          }
        </p>

        <div className="space-y-4">
          {subclassFeatures.map(
            (subclassFeature) => (
              <div
                key={
                  subclassFeature.id
                }
              >
                <h3 className="font-semibold">
                  {
                    subclassFeature.name
                  }
                </h3>

                <p className="mt-1 text-sm leading-6 text-white/60">
                  {
                    subclassFeature.summary
                  }
                </p>
              </div>
            )
          )}
        </div>
      </div>
    );
  }

  function renderImprovementChoice(
    feature: ClassFeature
  ) {
    const featureLevel =
      feature.level;

    const choice =
      levelChoices[
        featureLevel
      ] ??
      emptyImprovementChoice();

    return (
      <div>
        <h3 className="font-semibold">
          {feature.name ??
            "Amélioration de personnage"}
        </h3>

        <p className="mt-1 text-sm leading-6 text-white/60">
          Choisis entre une
          amélioration de
          caractéristiques et un don.
        </p>

        <fieldset className="mt-4">
          <legend className="sr-only">
            Choix de progression du
            niveau {featureLevel}
          </legend>

          <div className="grid gap-3 md:grid-cols-2">
            <label
              className={`cursor-pointer rounded-xl border p-4 transition ${
                choice.type ===
                "ability"
                  ? "border-[#b89b6d] bg-[#b89b6d]/15"
                  : "border-white/10 bg-black/10 hover:border-white/25"
              }`}
            >
              <span className="flex items-start gap-3">
                <input
                  type="radio"
                  name={`level-${featureLevel}-choice`}
                  checked={
                    choice.type ===
                    "ability"
                  }
                  onChange={() =>
                    setImprovementType(
                      featureLevel,
                      "ability"
                    )
                  }
                  className="mt-1 accent-[#b89b6d]"
                />

                <span>
                  <span className="block font-semibold">
                    Amélioration de
                    caractéristique
                  </span>

                  <span className="mt-1 block text-sm text-white/55">
                    Augmente une
                    caractéristique de
                    2 ou deux
                    caractéristiques
                    de 1.
                  </span>
                </span>
              </span>
            </label>

            <label
              className={`cursor-pointer rounded-xl border p-4 transition ${
                choice.type ===
                "feat"
                  ? "border-[#b89b6d] bg-[#b89b6d]/15"
                  : "border-white/10 bg-black/10 hover:border-white/25"
              }`}
            >
              <span className="flex items-start gap-3">
                <input
                  type="radio"
                  name={`level-${featureLevel}-choice`}
                  checked={
                    choice.type ===
                    "feat"
                  }
                  onChange={() =>
                    setImprovementType(
                      featureLevel,
                      "feat"
                    )
                  }
                  className="mt-1 accent-[#b89b6d]"
                />

                <span>
                  <span className="block font-semibold">
                    Choisir un don
                  </span>

                  <span className="mt-1 block text-sm text-white/55">
                    Choisis un don
                    auquel ton
                    personnage est
                    éligible.
                  </span>
                </span>
              </span>
            </label>
          </div>
        </fieldset>

        {choice.type ===
          "ability" && (
          <div className="mt-4 rounded-xl border border-[#b89b6d]/25 bg-[#b89b6d]/[0.04] p-4">
            <h4 className="font-semibold text-[#f1e2c9]">
              Répartis 2 points
            </h4>

            <p className="mt-1 text-sm text-white/60">
              Tu peux choisir deux
              caractéristiques
              différentes ou deux fois
              la même pour obtenir +2.
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label>
                <span className="mb-2 block text-sm text-white/70">
                  Premier +1
                </span>

                <select
                  value={
                    choice.ability1
                  }
                  onChange={(event) =>
                    setImprovementAbility(
                      featureLevel,
                      "ability1",
                      event.target
                        .value as
                        | AbilityId
                        | ""
                    )
                  }
                  className="w-full rounded-xl border border-white/20 bg-[#151a20] p-3 text-sm text-white"
                >
                  <option value="">
                    Choisir…
                  </option>

                  {ABILITIES.map(
                    (ability) => (
                      <option
                        key={
                          ability.id
                        }
                        value={
                          ability.id
                        }
                      >
                        {
                          ability.name
                        }
                      </option>
                    )
                  )}
                </select>
              </label>

              <label>
                <span className="mb-2 block text-sm text-white/70">
                  Deuxième +1
                </span>

                <select
                  value={
                    choice.ability2
                  }
                  onChange={(event) =>
                    setImprovementAbility(
                      featureLevel,
                      "ability2",
                      event.target
                        .value as
                        | AbilityId
                        | ""
                    )
                  }
                  className="w-full rounded-xl border border-white/20 bg-[#151a20] p-3 text-sm text-white"
                >
                  <option value="">
                    Choisir…
                  </option>

                  {ABILITIES.map(
                    (ability) => (
                      <option
                        key={
                          ability.id
                        }
                        value={
                          ability.id
                        }
                      >
                        {
                          ability.name
                        }
                      </option>
                    )
                  )}
                </select>
              </label>
            </div>
          </div>
        )}

        {choice.type === "feat" && (
          <div className="mt-4 rounded-xl border border-[#b89b6d]/25 bg-[#b89b6d]/[0.04] p-4">
            <label>
              <span className="block font-semibold text-[#f1e2c9]">
                Don choisi
              </span>

              <input
                type="text"
                value={choice.feat}
                onChange={(event) =>
                  setImprovementFeat(
                    featureLevel,
                    event.target.value
                  )
                }
                placeholder="Ex. Sentinelle"
                className="mt-3 w-full rounded-xl border border-white/20 bg-[#151a20] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#b89b6d] focus:outline-none"
              />
            </label>
          </div>
        )}
      </div>
    );
  }

  function renderEpicBoon(
    feature: ClassFeature
  ) {
    return (
      <div>
        <h3 className="font-semibold">
          {feature.name ??
            "Faveur épique"}
        </h3>

        {feature.summary && (
          <p className="mt-1 text-sm leading-6 text-white/60">
            {feature.summary}
          </p>
        )}

        <label className="mt-4 block rounded-xl border border-[#b89b6d]/25 bg-[#b89b6d]/[0.04] p-4">
          <span className="block font-semibold text-[#f1e2c9]">
            Faveur choisie
          </span>

          <input
            type="text"
            value={epicBoon}
            onChange={(event) =>
              setEpicBoon(
                event.target.value
              )
            }
            placeholder="Nom de la faveur épique"
            className="mt-3 w-full rounded-xl border border-white/20 bg-[#151a20] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#b89b6d] focus:outline-none"
          />
        </label>
      </div>
    );
  }

  function renderFeature(
    feature: ClassFeature
  ) {
    switch (feature.type) {
      case "automatic":
        return renderAutomaticFeature(
          feature
        );

      case "subclass-choice":
        return renderSubclassChoice(
          feature
        );

      case "subclass-feature":
        return renderSubclassFeature(
          feature
        );

      case "feat-choice":
        return renderImprovementChoice(
          feature
        );

      case "epic-boon-choice":
        return renderEpicBoon(
          feature
        );

      default:
        return null;
    }
  }

  return (
    <main className="min-h-screen bg-[#0b0e12] text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="border-b border-white/10 pb-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-[#b89b6d]">
            Création du personnage · Étape 09
          </p>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Aptitudes du{" "}
                {classConfig.className}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">
                Consulte les aptitudes
                obtenues par ton{" "}
                {classConfig.className} et
                effectue les choix
                nécessaires jusqu&apos;au
                niveau {level}.
              </p>
            </div>

            <div className="rounded-xl border border-[#b89b6d]/30 bg-[#b89b6d]/10 px-5 py-3">
              <p className="text-xs uppercase tracking-[0.16em] text-white/45">
                Niveau
              </p>

              <p className="text-2xl font-semibold text-[#f1e2c9]">
                {level}
              </p>
            </div>
          </div>
        </header>

        <div className="mt-6 grid items-start gap-5 lg:grid-cols-[1.45fr_0.65fr]">
          <ol className="space-y-4">
            {featuresByLevel.map(
              (group) => (
                <li
                  key={group.level}
                >
                  <section
                    className={panel}
                  >
                    <div className="mb-4 flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#b89b6d]/30 bg-[#b89b6d]/10 font-semibold text-[#f1e2c9]">
                        {
                          group.level
                        }
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-white/40">
                          Progression
                        </p>

                        <h2 className="font-semibold">
                          Niveau{" "}
                          {
                            group.level
                          }
                        </h2>
                      </div>
                    </div>

                    <ul className="divide-y divide-white/10">
                      {group.features.map(
                        (feature) => (
                          <li
                            key={
                              feature.id
                            }
                            className="py-5 first:pt-0 last:pb-0"
                          >
                            {renderFeature(
                              feature
                            )}
                          </li>
                        )
                      )}
                    </ul>
                  </section>
                </li>
              )
            )}
          </ol>

          <aside className="lg:sticky lg:top-6">
            <div className={panel}>
              <p className="text-xs uppercase tracking-[0.18em] text-[#b89b6d]">
                Récapitulatif
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Tes choix de classe
              </h2>

              <dl className="mt-5 space-y-4 text-sm">
                <div className="border-b border-white/10 pb-4">
                  <dt className="text-white/45">
                    Classe
                  </dt>

                  <dd className="mt-1 font-medium">
                    {
                      classConfig.className
                    }
                  </dd>
                </div>

                <div className="border-b border-white/10 pb-4">
                  <dt className="text-white/45">
                    Niveau
                  </dt>

                  <dd className="mt-1 font-medium">
                    {level}
                  </dd>
                </div>

                {needsSubclass && (
                  <div className="border-b border-white/10 pb-4">
                    <dt className="text-white/45">
                      Sous-classe
                    </dt>

                    <dd
                      className={`mt-1 font-medium ${
                        selectedSubclassData
                          ? ""
                          : "text-[#d8c09a]"
                      }`}
                    >
                      {selectedSubclassData
                        ? selectedSubclassData.name
                        : "À choisir"}
                    </dd>
                  </div>
                )}

                {requiredImprovementLevels.map(
                  (
                    improvementLevel
                  ) => {
                    const choice =
                      levelChoices[
                        improvementLevel
                      ] ??
                      emptyImprovementChoice();

                    return (
                      <div
                        key={
                          improvementLevel
                        }
                        className="border-b border-white/10 pb-4"
                      >
                        <dt className="text-white/45">
                          Niveau{" "}
                          {
                            improvementLevel
                          }
                        </dt>

                        <dd className="mt-1 font-medium">
                          {choice.type ===
                            "ability" &&
                          isImprovementComplete(
                            improvementLevel
                          )
                            ? "Amélioration de caractéristiques"
                            : null}

                          {choice.type ===
                            "feat" &&
                          isImprovementComplete(
                            improvementLevel
                          )
                            ? `Don : ${choice.feat}`
                            : null}

                          {!isImprovementComplete(
                            improvementLevel
                          ) && (
                            <span className="text-[#d8c09a]">
                              À compléter
                            </span>
                          )}
                        </dd>
                      </div>
                    );
                  }
                )}
              </dl>

              {!canContinue && (
                <div className="mt-5 rounded-xl border border-[#b89b6d]/25 bg-[#b89b6d]/[0.05] p-4">
                  <p className="text-sm font-medium text-[#f1e2c9]">
                    Des choix sont encore
                    nécessaires.
                  </p>

                  <ul className="mt-2 space-y-1 text-sm text-white/55">
                    {missingSubclass && (
                      <li>
                        • Choisis ta
                        sous-classe.
                      </li>
                    )}

                    {requiredImprovementLevels
                      .filter(
                        (
                          improvementLevel
                        ) =>
                          !isImprovementComplete(
                            improvementLevel
                          )
                      )
                      .map(
                        (
                          improvementLevel
                        ) => (
                          <li
                            key={
                              improvementLevel
                            }
                          >
                            • Complète le
                            choix du niveau{" "}
                            {
                              improvementLevel
                            }
                            .
                          </li>
                        )
                      )}

                    {missingEpicBoon && (
                      <li>
                        • Choisis ta
                        Faveur épique.
                      </li>
                    )}
                  </ul>
                </div>
              )}

              <div className="mt-6 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/creation/hit-points?${selectionParams().toString()}`
                    )
                  }
                  className="text-sm font-medium text-white/50 transition hover:text-white"
                >
                  ← Points de vie
                </button>

                <button
                  type="button"
                  disabled={
                    !canContinue
                  }
                  onClick={
                    handleContinue
                  }
                  className={
                    actionButton
                  }
                >
                  Continuer →
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default function ClassFeaturePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#0b0e12] p-6 text-white">
          Chargement…
        </main>
      }
    >
      <ClassFeatureContent />
    </Suspense>
  );
}