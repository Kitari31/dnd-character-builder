"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getClasses } from "@/lib/classes";
import { getBackgrounds } from "@/lib/backgrounds";
import {
  equipmentChoiceLabels, getBackgroundEquipment, getClassEquipment,
  getEquipmentChoices, getEquipmentItems, resolveEquipmentChoice,
  resolveEquipmentOption,
} from "@/lib/equipment";
import type { EquipmentOption } from "@/types/equipment";

const panel = "rounded-2xl border border-white/10 bg-white/[0.03] p-5";
const control = "w-full rounded-xl border border-white/20 bg-[#151a20] p-3 text-sm text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b89b6d]";
const action = "rounded-xl border border-[#b89b6d] bg-[#b89b6d]/10 px-5 py-3 text-sm font-semibold text-[#f1e2c9] transition hover:bg-[#b89b6d]/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b89b6d]";

export default function EquipmentPage() {
  return <Suspense fallback={<main className="min-h-screen bg-[#0b0e12] p-6 text-white">Chargement…</main>}>
    <EquipmentSelection />
  </Suspense>;
}

function EquipmentSelection() {
  const params = useSearchParams();
  const characterClass = getClasses().find(item => item.id === params.get("class"));
  const background = getBackgrounds().find(item => item.id === params.get("background"));
  const classOptions = getClassEquipment(characterClass?.id ?? "");
  const backgroundOptions = getBackgroundEquipment(background?.id ?? "");

  if (!characterClass || !background || !classOptions.length || !backgroundOptions.length) {
    return <main className="min-h-screen bg-[#0b0e12] p-6 text-white">
      <div className={`mx-auto max-w-xl space-y-5 ${panel}`}>
        <h1 className="text-2xl font-semibold">Choisis d’abord ta classe et ton historique</h1>
        <p className="text-white/60">Ces choix déterminent les équipements disponibles.</p>
        <Link className={`${action} inline-block`} href={!characterClass ? "/creation/classes" : `/creation/backgrounds?${params.toString()}`}>
          Reprendre la création →
        </Link>
      </div>
    </main>;
  }

  return <EquipmentForm key={`${characterClass.id}-${background.id}`} classId={characterClass.id}
    className={characterClass.name} backgroundId={background.id} backgroundName={background.name}
    classOptions={classOptions} backgroundOptions={backgroundOptions} />;
}

function EquipmentForm({ classId, className, backgroundId, backgroundName, classOptions, backgroundOptions }: {
  classId: string; className: string; backgroundId: string; backgroundName: string;
  classOptions: readonly EquipmentOption[]; backgroundOptions: readonly EquipmentOption[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [classOptionId, setClassOptionId] = useState(() => resolveEquipmentOption(classOptions,
    searchParams.get("equipmentClass") === classId ? searchParams.get("classEquipment") : null).id);
  const [backgroundOptionId, setBackgroundOptionId] = useState(() => resolveEquipmentOption(backgroundOptions,
    searchParams.get("equipmentBackground") === backgroundId ? searchParams.get("backgroundEquipment") : null).id);
  const classOption = resolveEquipmentOption(classOptions, classOptionId);
  const backgroundOption = resolveEquipmentOption(backgroundOptions, backgroundOptionId);
  const [classChoice, setClassChoice] = useState(() => resolveEquipmentChoice(classOption,
    searchParams.get("equipmentClass") === classId ? searchParams.get("classEquipmentChoice") : null));
  const [backgroundChoice, setBackgroundChoice] = useState(() => resolveEquipmentChoice(backgroundOption,
    searchParams.get("equipmentBackground") === backgroundId ? searchParams.get("backgroundEquipmentChoice") : null));

  function selectionParams() {
    const params = new URLSearchParams(searchParams.toString());
    params.set("equipmentClass", classId);
    params.set("equipmentBackground", backgroundId);
    params.set("classEquipment", classOption.id);
    params.set("backgroundEquipment", backgroundOption.id);
    for (const [key, value] of [
      ["classEquipmentChoice", resolveEquipmentChoice(classOption, classChoice)],
      ["backgroundEquipmentChoice", resolveEquipmentChoice(backgroundOption, backgroundChoice)],
    ]) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    return params;
  }

  return <main className="min-h-screen bg-[#0b0e12] text-white">
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="border-b border-white/10 pb-5">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-[#b89b6d]">Création du personnage · Étape 04</p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Choisis ton équipement</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">
          Choisis un équipement de classe et un équipement d’historique.
        </p>
        <p className="mt-3 text-sm text-[#d8c09a]">{className} · {backgroundName} · Niveau {searchParams.get("level") ?? "1"}</p>
        {Number(searchParams.get("level")) > 1 && <p className="mt-2 text-xs text-white/50">Équipement de départ ; les ressources supplémentaires liées au niveau sont à définir avec ton MJ.</p>}
      </header>

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-[1.45fr_0.9fr]">
        <div className="space-y-5">
          <EquipmentOptions name="class-equipment" title={`Équipement de classe · ${className}`} options={classOptions}
            selected={classOption} choice={resolveEquipmentChoice(classOption, classChoice)}
            onSelect={id => { setClassOptionId(id); }}
            onChoice={value => { setClassChoice(value); }} />
          <EquipmentOptions name="background-equipment" title={`Équipement d’historique · ${backgroundName}`} options={backgroundOptions}
            selected={backgroundOption} choice={resolveEquipmentChoice(backgroundOption, backgroundChoice)}
            onSelect={id => { setBackgroundOptionId(id); }}
            onChoice={value => { setBackgroundChoice(value); }} />

        </div>

        <aside className={`${panel} lg:sticky lg:top-6`} aria-labelledby="summary-title">
          <h2 id="summary-title" className="text-lg font-semibold">Ton équipement de départ</h2>
          <div className="mt-4 rounded-xl border border-[#b89b6d]/30 bg-[#b89b6d]/10 p-4" aria-live="polite">
            <p className="text-xs uppercase tracking-widest text-[#d8c09a]">Total des pièces d’or</p>
            <p className="mt-1 text-3xl font-semibold">{classOption.gold + backgroundOption.gold} <span className="text-lg">po</span></p>
            <p className="mt-1 text-xs text-white/50">Classe : {classOption.gold} po · Historique : {backgroundOption.gold} po</p>
          </div>
          {[{ label: className, option: classOption, choice: classChoice }, { label: backgroundName, option: backgroundOption, choice: backgroundChoice }].map(({ label, option, choice }, index) => (
            <section key={index} className="mt-5">
              <h3 className="text-sm font-semibold text-[#d8c09a]">{label} · {option.label}</h3>
              {option.items.length ? <ul className="mt-2 space-y-1 text-sm leading-6 text-white/70">
                {getEquipmentItems(option, choice).map(item => <li key={item}>• {item}</li>)}
              </ul> : <p className="mt-2 text-sm text-white/60">Or uniquement, pour acheter ton équipement.</p>}
            </section>
          ))}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <button type="button" className="text-sm text-white/60 hover:text-white" onClick={() => router.push(`/creation/backgrounds?${selectionParams().toString()}`)}>← Historique</button>
            <button type="button" className={action} onClick={() => {
              router.push(`/creation/languages?${selectionParams().toString()}`);
            }}>Continuer →</button>
          </div>
        </aside>
      </div>
    </div>
  </main>;
}

function EquipmentOptions({ name, title, options, selected, choice, onSelect, onChoice }: {
  name: string; title: string; options: readonly EquipmentOption[]; selected: EquipmentOption; choice: string;
  onSelect: (id: string) => void; onChoice: (value: string) => void;
}) {
  return <fieldset className={panel}>
    <legend className="px-2 text-lg font-semibold">{title}</legend>
    <div className="space-y-3">
      {options.map(option => <label key={option.id} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${selected.id === option.id ? "border-[#b89b6d] bg-[#b89b6d]/10" : "border-white/10 hover:border-white/30"}`}>
        <input type="radio" name={name} value={option.id} checked={selected.id === option.id} onChange={() => onSelect(option.id)} className="mt-1 accent-[#b89b6d]" />
        <span className="min-w-0">
          <span className="block text-sm font-semibold">Option {option.id.toUpperCase()} · {option.label}</span>
          {option.items.length > 0 && <span className="mt-2 block text-sm leading-6 text-white/65">{option.items.join(" · ")}{option.choice ? ` · ${equipmentChoiceLabels[option.choice]} au choix` : ""}</span>}
          <span className="mt-2 block text-sm font-medium text-[#d8c09a]">{option.gold} po</span>
        </span>
      </label>)}
    </div>
    {selected.choice && <div className="mt-4">
      <label htmlFor={`${name}-choice`} className="mb-2 block text-sm text-white/70">{equipmentChoiceLabels[selected.choice]}</label>
      <select id={`${name}-choice`} value={choice} onChange={event => onChoice(event.target.value)} className={control}>
        {getEquipmentChoices(selected.choice).map(item => <option key={item} value={item}>{item}</option>)}
      </select>
      <p className="mt-2 text-xs leading-5 text-white/50">Choisis le même type que celui de ta maîtrise d’outil ou d’instrument, lorsqu’elle est liée à ce paquetage.</p>
    </div>}
  </fieldset>;
}
