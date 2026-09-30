"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CreationSummary } from "@/components/creation-summary";
import { getClasses } from "@/lib/classes";
import { getBackgrounds } from "@/lib/backgrounds";
import {
  ABILITIES, POINT_BUDGET, SCORE_COSTS, abilityModifier, backgroundBonuses,
  changeScore, defaultScores, pointsSpent, readScores, standardScores, withScores,
  type AbilityId, type BackgroundBonus,
} from "@/lib/abilities";

const panel = "rounded-2xl border border-white/10 bg-white/[0.03] p-5";
const button = "rounded-xl border border-[#b89b6d]/60 bg-[#b89b6d]/10 px-4 py-3 text-sm font-semibold text-[#f1e2c9] hover:bg-[#b89b6d]/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b89b6d] disabled:cursor-not-allowed disabled:opacity-40";

export default function AbilitiesPage() {
  return <Suspense fallback={<main className="min-h-screen bg-[#0b0e12] p-6 text-white">Chargement…</main>}>
    <AbilitiesSelection />
  </Suspense>;
}

function AbilitiesSelection() {
  const params = useSearchParams();
  const characterClass = getClasses().find(item => item.id === params.get("class"));
  const background = getBackgrounds().find(item => item.id === params.get("background"));
  const bonuses = backgroundBonuses(background?.abilities ?? []);

  if (!characterClass || !background || bonuses.length === 0) {
    return <main className="min-h-screen bg-[#0b0e12] p-6 text-white">
      <div className={`${panel} mx-auto max-w-xl space-y-5`}>
        <h1 className="text-2xl font-semibold">Choisis d’abord ta classe et ton historique</h1>
        <p className="text-white/60">Ils déterminent la répartition conseillée et les bonus disponibles.</p>
        <Link className={`${button} inline-block`} href={!characterClass ? "/creation/classes" : `/creation/backgrounds?${params.toString()}`}>Reprendre la création →</Link>
      </div>
    </main>;
  }

  return <AbilitiesForm key={`${characterClass.id}-${background.id}`} classId={characterClass.id}
    className={characterClass.name} primaryStat={characterClass.primaryStat}
    backgroundId={background.id} backgroundName={background.name} bonuses={bonuses} />;
}

function AbilitiesForm({ classId, className, primaryStat, backgroundId, backgroundName, bonuses }: {
  classId: string; className: string; primaryStat: string;
  backgroundId: string; backgroundName: string; bonuses: BackgroundBonus[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [scores, setScores] = useState(() => readScores(new URLSearchParams(searchParams.toString())));
  const [bonusId, setBonusId] = useState(() =>
    searchParams.get("abilityBackground") === backgroundId
      ? bonuses.find(bonus => bonus.id === searchParams.get("abilityBonus"))?.id ?? "all" : "all");
  const spent = pointsSpent(scores);
  const remaining = POINT_BUDGET - spent;
  const bonus = bonuses.find(item => item.id === bonusId) ?? bonuses[0];
  const preset = standardScores(classId);

  function updateScore(id: AbilityId, delta: number) {
    setScores(current => changeScore(current, id, delta));
  }

  function selectionParams() {
    const params = withScores(new URLSearchParams(searchParams.toString()), scores);
    params.set("abilityBackground", backgroundId);
    params.set("abilityBonus", bonus.id);
    return params;
  }

  return <main className="min-h-screen bg-[#0b0e12] text-white">
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="border-b border-white/10 pb-5">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-[#b89b6d]">Création du personnage · Étape 06</p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Attribue tes caractéristiques</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">Répartis 27 points entre tes six caractéristiques. Les valeurs de base sont à 10 par défaut et peuvent être ajustées de 8 à 15, avant les bonus d’historique.</p>
        <CreationSummary classId={classId} speciesId={searchParams.get("species")} backgroundId={backgroundId} level={searchParams.get("level")} />
      </header>

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-[1.45fr_0.9fr]">
        <div className="space-y-5">
          <section className={panel} aria-labelledby="scores-title">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="scores-title" className="text-lg font-semibold">Achat par points</h2>
              <p className="text-sm font-semibold text-[#d8c09a]" role="status">{remaining} / 27 points restants</p>
            </div>
            <p className="mt-2 text-sm text-white/60">Caractéristique principale de ta classe : {primaryStat}.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {preset && <button type="button" className="rounded-xl border border-white/20 px-4 py-3 text-sm text-white/70 hover:border-white/40 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b89b6d]" onClick={() => setScores(preset)}>Appliquer les valeurs standards · {className}</button>}
              <button type="button" className="rounded-xl border border-white/20 px-4 py-3 text-sm text-white/70 hover:border-white/40" onClick={() => {
                setScores(defaultScores());
              }}>Réinitialiser</button>
            </div>
            <div className="mt-5 space-y-3">
              {ABILITIES.map(ability => {
                const score = scores[ability.id];
                const increaseCost = score < 15 ? SCORE_COSTS[score + 1] - SCORE_COSTS[score] : 0;
                return <div key={ability.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 p-4">
                  <div>
                    <h3 className="font-medium">{ability.name}</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="button" className={button} aria-label={`Diminuer ${ability.name}`} disabled={score <= 8} onClick={() => updateScore(ability.id, -1)}>−</button>
                    <output className="w-8 text-center text-xl font-semibold" aria-label={`${ability.name} : valeur de base`}>{score}</output>
                    <button type="button" className={button} aria-label={`Augmenter ${ability.name}`} disabled={score >= 15 || increaseCost > remaining} onClick={() => updateScore(ability.id, 1)}>+</button>
                  </div>
                </div>;
              })}
            </div>
            <details className="mt-5 text-sm text-white/60">
              <summary className="cursor-pointer">Voir le barème des coûts</summary>
              <table className="mt-3 w-full text-center text-xs sm:text-sm">
                <caption className="sr-only">Coût des valeurs de base</caption>
                <thead><tr><th scope="col" className="py-2">Valeur</th>{Object.keys(SCORE_COSTS).map(score => <th key={score} scope="col">{score}</th>)}</tr></thead>
                <tbody><tr><th scope="row" className="py-2">Points</th>{Object.entries(SCORE_COSTS).map(([score, cost]) => <td key={score}>{cost}</td>)}</tr></tbody>
              </table>
            </details>
          </section>


        </div>

        <aside className={`${panel} lg:sticky lg:top-6`} aria-labelledby="summary-title">
          <section className="mb-5 border-b border-white/10 pb-5" aria-labelledby="bonus-title">
            <h2 id="bonus-title" className="text-lg font-semibold">Bonus d’historique · {backgroundName}</h2>
            <label htmlFor="background-bonus" className="mb-2 mt-3 block text-sm text-white/70">Choix du bonus d’historique</label>
            <select id="background-bonus" value={bonus.id} onChange={event => setBonusId(event.target.value)} className="w-full min-w-0 rounded-xl border border-white/20 bg-[#151a20] p-3 text-sm text-white">
              {bonuses.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}
            </select>
          </section>
          <h2 id="summary-title" className="text-lg font-semibold">Tes caractéristiques</h2>
          <table className="mt-4 w-full text-left text-sm">
            <caption className="mb-3 text-left text-xs text-white/50">Valeurs de base et bonus d’historique</caption>
            <thead className="text-xs text-white/50"><tr><th scope="col" className="py-2">Carac.</th><th scope="col">Base</th><th scope="col">Bonus</th><th scope="col">Total</th><th scope="col">Mod.</th></tr></thead>
            <tbody>{ABILITIES.map(ability => {
              const total = scores[ability.id] + bonus.scores[ability.id];
              const modifier = abilityModifier(total);
              return <tr key={ability.id} className="border-t border-white/10">
                <th scope="row" className="py-3 font-medium"><abbr title={ability.name} className="no-underline">{ability.short}</abbr></th>
                <td className="text-white/60">{scores[ability.id]}</td><td className="text-white/60">+{bonus.scores[ability.id]}</td>
                <td className="font-semibold text-[#d8c09a]">{total}</td><td>{modifier >= 0 ? "+" : ""}{modifier}</td>
              </tr>;
            })}</tbody>
          </table>
          {Number(searchParams.get("level")) > 1 && <p className="mt-3 text-xs leading-5 text-white/50">Ces valeurs correspondent à la création au niveau 1. Les améliorations obtenues aux niveaux suivants s’ajoutent ensuite.</p>}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <button type="button" className="text-sm text-white/60 hover:text-white" onClick={() => router.push(`/creation/languages?${selectionParams().toString()}`)}>← Langues</button>
            <button type="button" className={button} disabled={remaining !== 0} onClick={() => {
              if (remaining !== 0) return;
              router.push(`/creation/alignment?${selectionParams().toString()}`);
            }}>Alignement →</button>
          </div>
        </aside>
      </div>
    </div>
  </main>;
}
