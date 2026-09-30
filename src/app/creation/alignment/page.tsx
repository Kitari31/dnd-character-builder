"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CreationSummary } from "@/components/creation-summary";
import { ALIGNMENTS, ALIGNMENT_SOURCE } from "@/lib/alignments";
import { backgroundBonuses, POINT_BUDGET, pointsSpent, readScores } from "@/lib/abilities";
import { getBackgrounds } from "@/lib/backgrounds";
import { getClasses } from "@/lib/classes";

const panel = "rounded-2xl border border-white/10 bg-white/[0.03] p-5";
const action = "inline-block rounded-xl border border-[#b89b6d]/60 bg-[#b89b6d]/10 px-4 py-3 text-sm font-semibold text-[#f1e2c9] hover:bg-[#b89b6d]/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b89b6d]";

export default function AlignmentPage() {
  return <Suspense fallback={<main className="min-h-screen bg-[#0b0e12] p-6 text-white">Chargement…</main>}>
    <AlignmentSelection />
  </Suspense>;
}

function AlignmentSelection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const characterClass = getClasses().find(item => item.id === params.get("class"));
  const background = getBackgrounds().find(item => item.id === params.get("background"));
  const [selectedId, setSelectedId] = useState(() => searchParams.get("alignment"));
  const [saved, setSaved] = useState(false);
  const selected = ALIGNMENTS.find(item => item.id === selectedId);
  if (selected) params.set("alignment", selected.id);
  else params.delete("alignment");
  const abilitiesHref = `/creation/abilities?${params.toString()}`;
  const hasAbilities = characterClass && background
    && pointsSpent(readScores(params)) === POINT_BUDGET
    && params.get("abilityBackground") === background.id
    && backgroundBonuses(background.abilities).some(bonus => bonus.id === params.get("abilityBonus"));

  if (!hasAbilities) {
    return <main className="min-h-screen bg-[#0b0e12] p-6 text-white">
      <div className={`${panel} mx-auto max-w-xl space-y-5`}>
        <h1 className="text-2xl font-semibold">Complète d’abord tes caractéristiques</h1>
        <p className="text-white/60">Répartis tes 27 points et choisis tes bonus d’historique pour poursuivre.</p>
        <Link className={action} href={abilitiesHref}>Reprendre la création →</Link>
      </div>
    </main>;
  }

  return <main className="min-h-screen bg-[#0b0e12] text-white">
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="border-b border-white/10 pb-5">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-[#b89b6d]">Création du personnage · Étape 07</p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Choisis ton alignement</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">L’alignement associe la morale (bien, neutralité, mal) au rapport à l’ordre (loi, neutralité, chaos). Il indique une tendance, pas une conduite immuable.</p>
        <CreationSummary classId={characterClass.id} speciesId={params.get("species")} backgroundId={background.id} level={params.get("level")} />
      </header>

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-[1.45fr_0.9fr]">
      <section className={panel}>
        <fieldset>
          <legend className="text-lg font-semibold">Les neuf alignements</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {ALIGNMENTS.map(alignment => <label key={alignment.id} className={`cursor-pointer rounded-xl border p-4 transition focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-[#b89b6d] ${selected?.id === alignment.id ? "border-[#b89b6d] bg-[#b89b6d]/10" : "border-white/10 hover:border-white/30"}`}>
              <span className="flex items-center gap-3">
                <input type="radio" name="alignment" value={alignment.id} checked={selected?.id === alignment.id} aria-describedby={`${alignment.id}-description`}
                  className="h-4 w-4 shrink-0 accent-[#b89b6d]" onChange={() => {
                    setSelectedId(alignment.id);
                    setSaved(false);
                  }} />
                <span className="font-semibold">{alignment.name} <span className="text-xs text-[#d8c09a]">{alignment.short}</span></span>
              </span>
              <span id={`${alignment.id}-description`} className="mt-3 block text-sm leading-6 text-white/70">{alignment.summary}</span>
            </label>)}
          </div>
        </fieldset>
        <p className="mt-5 text-xs leading-6 text-white/50">Résumés en français d’après les règles officielles D&D 2024. <a href={ALIGNMENT_SOURCE} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-[#d8c09a]">Lire la section sur D&D Beyond (anglais)</a>.</p>
      </section>

      <aside className={`${panel} lg:sticky lg:top-6`} aria-labelledby="summary-title">
        <h2 id="summary-title" className="text-lg font-semibold">L’alignement de ton personnage</h2>
        {selected ? <div className="mt-4 rounded-xl border border-[#b89b6d]/30 bg-[#b89b6d]/10 p-4" aria-live="polite">
          <p className="font-semibold text-[#d8c09a]">{selected.name} · {selected.short}</p>
          <p className="mt-2 text-sm leading-6 text-white/70">{selected.description}</p>
        </div> : <p className="mt-4 text-sm text-white/60">Choisis un alignement pour ton personnage.</p>}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <Link className="text-sm text-white/60 hover:text-white" href={abilitiesHref}>← Caractéristiques</Link>
          <button type="button" disabled={!selected} className={`${action} disabled:cursor-not-allowed disabled:opacity-40`} onClick={() => {
            if (!selected) return;
            router.replace(`/creation/alignment?${params.toString()}`, { scroll: false });
            setSaved(true);
          }}>Valider l’alignement</button>
        </div>
        <p role="status" className="mt-3 text-sm text-[#d8c09a]">{saved ? "Alignement enregistré." : ""}</p>
      </aside>
      </div>
    </div>
  </main>;
}
