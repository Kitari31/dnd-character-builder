"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CreationSummary } from "@/components/creation-summary";
import { abilityModifier, backgroundBonuses, POINT_BUDGET, pointsSpent, readScores } from "@/lib/abilities";
import { ALIGNMENTS } from "@/lib/alignments";
import { getBackgrounds } from "@/lib/backgrounds";
import { getClasses } from "@/lib/classes";
import { calculateHitPoints, HIT_DICE } from "@/lib/hit-points";

const panel = "rounded-2xl border border-white/10 bg-white/[0.03] p-5";
const action = "rounded-xl border border-[#b89b6d]/60 bg-[#b89b6d]/10 px-4 py-3 text-sm font-semibold text-[#f1e2c9] hover:bg-[#b89b6d]/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b89b6d] disabled:cursor-not-allowed disabled:opacity-40";

export default function HitPointsPage() {
  return <Suspense fallback={<main className="min-h-screen bg-[#0b0e12] p-6 text-white">Chargement…</main>}>
    <HitPointsSelection />
  </Suspense>;
}

function HitPointsSelection() {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const characterClass = getClasses().find(item => item.id === params.get("class"));
  const background = getBackgrounds().find(item => item.id === params.get("background"));
  const bonus = backgroundBonuses(background?.abilities ?? []).find(item => item.id === params.get("abilityBonus"));
  const scores = readScores(params);
  const level = Number(params.get("level") ?? 1);
  const die = characterClass ? HIT_DICE[characterClass.id] : undefined;
  const valid = characterClass && background && bonus && die
    && params.get("abilityBackground") === background.id && pointsSpent(scores) === POINT_BUDGET
    && Number.isInteger(level) && level >= 1 && level <= 20
    && ALIGNMENTS.some(item => item.id === params.get("alignment"));

  if (!valid) return <main className="min-h-screen bg-[#0b0e12] p-6 text-white">
    <div className={`${panel} mx-auto max-w-xl space-y-5`}>
      <h1 className="text-2xl font-semibold">Complète les étapes précédentes</h1>
      <p className="text-white/60">La classe, le niveau, les caractéristiques et l’alignement sont nécessaires pour poursuivre.</p>
      <Link className={`${action} inline-block`} href={`/creation/${!Number.isInteger(level) || level < 1 || level > 20 ? "classes" : "alignment"}?${params.toString()}`}>Reprendre la création →</Link>
    </div>
  </main>;

  const constitution = scores.constitution + bonus.scores.constitution;
  return <HitPointsForm key={`${characterClass.id}-${level}-${constitution}`} classId={characterClass.id}
    className={characterClass.name} level={level} die={die} constitution={constitution} />;
}

function HitPointsForm({ classId, className, level, die, constitution }: {
  classId: string; className: string; level: number; die: number; constitution: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [method, setMethod] = useState(() => level > 1 && searchParams.get("hpMethod") === "rolls" ? "rolls" : "fixed");
  const [rolls, setRolls] = useState<string[]>(() => {
    const stored = searchParams.get("hpClass") === classId ? searchParams.getAll("hpRoll") : [];
    return Array.from({ length: level - 1 }, (_, index) => {
      const value = Number(stored[index]);
      return Number.isInteger(value) && value >= 1 && value <= die ? String(value) : "";
    });
  });
  const [saved, setSaved] = useState(false);
  const modifier = abilityModifier(constitution);
  const modifierLabel = modifier >= 0 ? `+${modifier}` : `−${Math.abs(modifier)}`;
  const complete = method === "fixed" || rolls.every(roll => roll.trim() !== "" && Number.isInteger(Number(roll)) && Number(roll) >= 1 && Number(roll) <= die);
  const result = complete ? calculateHitPoints(die, level, modifier, method === "rolls" ? rolls.map(Number) : undefined) : null;

  function selectionParams() {
    const params = new URLSearchParams(searchParams.toString());
    params.set("hpClass", classId);
    params.set("hpMethod", method);
    params.delete("hpRoll");
    for (const roll of rolls) params.append("hpRoll", roll);
    // The total is derived from the current class, level, Constitution and rolls.
    params.delete("hitPoints");
    return params;
  }

  return <main className="min-h-screen bg-[#0b0e12] text-white">
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="border-b border-white/10 pb-5">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-[#b89b6d]">Création du personnage · Étape 08</p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Calcule tes points de vie</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">Au niveau 1, prends le maximum de ton dé de vie et ajoute ton modificateur de Constitution. Aux niveaux suivants, utilise la valeur fixe ou tes jets de dés.</p>
        <CreationSummary classId={classId} speciesId={searchParams.get("species")} backgroundId={searchParams.get("background")} level={level} />
      </header>

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-[1.45fr_0.9fr]">
        <section className={panel} aria-labelledby="calculation-title">
          <h2 id="calculation-title" className="text-lg font-semibold">Calcul des points de vie</h2>
          <div className="mt-4 rounded-xl border border-[#b89b6d]/30 bg-[#b89b6d]/10 p-4">
            <p className="font-semibold text-[#f1e2c9]">Niveau 1 · {Math.max(1, die + modifier)} PV</p>
            <p className="mt-1 text-sm text-white/60">Maximum du d{die} : {die} {modifierLabel} de Constitution.</p>
          </div>
          {level > 1 && <>
            <fieldset className="mt-5">
              <legend className="text-lg font-semibold">Pour les niveaux 2 à {level}</legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {[{ id: "fixed", name: "Valeur fixe", description: `${die / 2 + 1} ${modifierLabel} de Constitution par niveau.` },
                  { id: "rolls", name: "Jets de dés", description: `Lance les ${level - 1}d${die} ensemble ou niveau par niveau. La Constitution est ajoutée automatiquement.` }].map(option =>
                  <label key={option.id} className={`cursor-pointer rounded-xl border p-4 focus-within:outline-2 focus-within:outline-[#b89b6d] ${method === option.id ? "border-[#b89b6d] bg-[#b89b6d]/10" : "border-white/10 hover:border-white/30"}`}>
                    <span className="flex items-center gap-3"><input type="radio" name="hp-method" checked={method === option.id} onChange={() => { setMethod(option.id); setSaved(false); }} className="h-4 w-4 accent-[#b89b6d]" /><span className="font-medium">{option.name}</span></span>
                    <span className="mt-2 block text-sm leading-6 text-white/60">{option.description}</span>
                  </label>)}
              </div>
            </fieldset>
            {method === "rolls" && <div className="mt-5">
              <button type="button" className={action} onClick={() => {
                setRolls(Array.from({ length: level - 1 }, () => String(Math.floor(Math.random() * die) + 1)));
                setSaved(false);
              }}>{complete ? "Relancer tous les dés" : "Lancer tous les dés"} · {level - 1}d{die}</button>
              <div aria-live="polite" aria-atomic="true" className="mt-4">
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                  {rolls.map((roll, index) => <li key={index} className="rounded-xl border border-[#b89b6d]/30 bg-[#b89b6d]/10 p-3 text-center">
                    <p className="text-xs text-white/60">Niveau {index + 2}</p>
                    <p className="mt-1 text-2xl font-semibold text-[#f1e2c9]" aria-label={roll ? `Résultat : ${roll}` : "Dé non lancé"}>{roll || "—"}</p>
                    <p className="text-xs text-white/50">d{die}</p>
                    <button type="button" className="mt-3 rounded-lg border border-[#b89b6d]/60 px-3 py-2 text-xs font-semibold text-[#f1e2c9] hover:bg-[#b89b6d]/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b89b6d]"
                      aria-label={`${roll ? "Relancer" : "Lancer"} le dé du niveau ${index + 2}`} onClick={() => {
                        const nextRoll = String(Math.floor(Math.random() * die) + 1);
                        setRolls(current => current.map((value, i) => i === index ? nextRoll : value));
                        setSaved(false);
                      }}>{roll ? "Relancer" : "Lancer"}</button>
                  </li>)}
                </ul>
              </div>
            </div>}
          </>}
        </section>

        <aside className={`${panel} lg:sticky lg:top-6`} aria-labelledby="summary-title">
          <h2 id="summary-title" className="text-lg font-semibold">Les points de vie de ton personnage</h2>
          <div className="mt-4 rounded-xl border border-[#b89b6d]/30 bg-[#b89b6d]/10 p-4" aria-live="polite">
            <p className="text-xs uppercase tracking-widest text-[#d8c09a]">Maximum de points de vie</p>
            <p className="mt-1 text-3xl font-semibold">{result ? `${result.total} PV` : "À compléter"}</p>
          </div>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-3"><dt className="text-white/60">Classe</dt><dd>{className}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-white/60">Dés de vie</dt><dd>{level}d{die}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-white/60">Constitution</dt><dd>{constitution} ({modifierLabel})</dd></div>
          </dl>
          {result && <table className="mt-5 w-full text-left text-sm">
            <caption className="mb-2 text-left text-xs text-white/50">Détail par niveau · Constitution incluse</caption>
            <thead className="text-xs text-white/50"><tr><th scope="col" className="py-2">Niveau</th><th scope="col">Dé / fixe</th><th scope="col" className="text-right">PV gagnés</th></tr></thead>
            <tbody>{result.gains.map(item => <tr key={item.level} className="border-t border-white/10"><th scope="row" className="py-2 font-medium">{item.level}</th><td>{item.base}</td><td className="text-right text-[#d8c09a]">+{item.gain}</td></tr>)}</tbody>
          </table>}
          {!complete && <p role="status" className="mt-4 text-sm text-white/60">{rolls.filter(Boolean).length} / {level - 1} dés lancés. Lance les dés restants pour calculer tes points de vie.</p>}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <button type="button" className="text-sm text-white/60 hover:text-white" onClick={() => router.push(`/creation/alignment?${selectionParams().toString()}`)}>← Alignement</button>
            <button type="button" className={action} disabled={!complete} onClick={() => {
              if (!complete) return;
              router.push(`/creation/class-feature?${selectionParams().toString()}`);}}>
              Continuer →
            </button>
          </div>
          <p role="status" className="mt-3 text-sm text-[#d8c09a]">{saved ? "Points de vie enregistrés." : ""}</p>
        </aside>
      </div>
    </div>
  </main>;
}
