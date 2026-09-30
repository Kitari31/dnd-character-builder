"use client";

import { CreationSummary } from "@/components/creation-summary";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { COMMON_LANGUAGE, OPTIONAL_LANGUAGES, normalizeLanguageChoices, withLanguages } from "@/lib/languages";

export default function LanguagesPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#0b0e12] p-6 text-white">Chargement…</main>}>
      <LanguageSelection />
    </Suspense>
  );
}

function LanguageSelection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedIds, setSelectedIds] = useState(() => normalizeLanguageChoices(searchParams.getAll("languages")));
  const [saved, setSaved] = useState(false);
  const complete = selectedIds.length === 2;

  function toggleLanguage(id: string) {
    setSelectedIds(current => current.includes(id)
      ? current.filter(value => value !== id)
      : normalizeLanguageChoices([...current, id]));
    setSaved(false);
  }

  function selectionParams() {
    return withLanguages(new URLSearchParams(searchParams.toString()), selectedIds);
  }

  return (
    <main className="min-h-screen bg-[#0b0e12] text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="border-b border-white/10 pb-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-[#b89b6d]">Création du personnage · Étape 05</p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Choisis tes langues</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">
            Ton personnage connaît déjà le commun. Choisis deux autres langues courantes qu’il sait parler, lire et écrire.
          </p>
          <CreationSummary classId={searchParams.get("class")} speciesId={searchParams.get("species")} backgroundId={searchParams.get("background")} level={searchParams.get("level")} />
        </header>

        <div className="mt-5 grid items-start gap-5 lg:grid-cols-[1.45fr_0.9fr]">
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5" aria-labelledby="languages-title">
            <div className="mb-5 rounded-xl border border-[#b89b6d]/30 bg-[#b89b6d]/10 p-4">
              <p className="font-semibold text-[#f1e2c9]">{COMMON_LANGUAGE.name}</p>
              <p className="mt-1 text-sm text-white/60">Acquis par défaut</p>
            </div>
            <fieldset aria-describedby="language-count">
              <legend id="languages-title" className="text-lg font-semibold">Langues au choix</legend>
              <p id="language-count" className="mb-4 mt-2 text-sm text-white/60" aria-live="polite">
                {selectedIds.length} / 2 langues sélectionnées{complete ? " · Décoche une langue pour changer ton choix." : ""}
              </p>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {OPTIONAL_LANGUAGES.map(language => {
                  const selected = selectedIds.includes(language.id);
                  const disabled = complete && !selected;
                  return (
                    <label key={language.id} className={`flex items-center gap-3 rounded-xl border p-4 transition ${selected ? "border-[#b89b6d] bg-[#b89b6d]/10" : "border-white/10"} ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:border-[#b89b6d]/60"}`}>
                      <input type="checkbox" checked={selected} disabled={disabled} onChange={() => toggleLanguage(language.id)} className="h-4 w-4 accent-[#b89b6d]" />
                      <span className="text-sm font-medium">{language.name}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </section>

          <aside className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 lg:sticky lg:top-6" aria-labelledby="summary-title">
            <h2 id="summary-title" className="text-lg font-semibold">Les langues de ton personnage</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="rounded-xl border border-[#b89b6d]/30 bg-[#b89b6d]/10 p-3 text-[#d8c09a]">Commun · acquis</li>
              {selectedIds.map(id => <li key={id} className="rounded-xl border border-white/10 p-3">{OPTIONAL_LANGUAGES.find(language => language.id === id)?.name}</li>)}
            </ul>
            <p className="mt-4 text-sm text-white/60">{complete ? "Tes trois langues sont prêtes." : `Encore ${2 - selectedIds.length} langue${selectedIds.length === 0 ? "s" : ""} à choisir.`}</p>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <button type="button" className="text-sm text-white/60 hover:text-white" onClick={() => router.push(`/creation/equipment?${selectionParams().toString()}`)}>← Équipement</button>
              <button type="button" disabled={!complete} className="rounded-xl border border-[#b89b6d] bg-[#b89b6d]/10 px-5 py-3 text-sm font-semibold text-[#f1e2c9] transition hover:bg-[#b89b6d]/20 disabled:cursor-not-allowed disabled:opacity-40" onClick={() => {
                if (!complete) return;
                router.replace(`/creation/languages?${selectionParams().toString()}`, { scroll: false });
                setSaved(true);
              }}>Valider les langues</button>
            </div>
            <p role="status" className="mt-3 text-sm text-[#d8c09a]">{saved ? "Langues enregistrées." : ""}</p>
          </aside>
        </div>
      </div>
    </main>
  );
}
