import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">
        D&D Builder
      </h1>

      <p className="text-lg">
        Crée ton personnage D&D facilement.
      </p>

      <Link
        href="/creation/classes"
        className="px-6 py-3 bg-black text-white rounded-lg"
      >
        Créer un personnage
      </Link>
    </main>
  );
}