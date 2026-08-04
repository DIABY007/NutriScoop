import Link from "next/link";
import { NouveauSuiviForm } from "./nouveau-suivi-form";

export default async function NouveauSuiviPage() {
  return (
    <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-6 lg:py-10 max-w-2xl mx-auto w-full">
      {/* ─── Retour ─── */}
      <Link
        href="/suivi-nutritionnel"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-6 min-h-11 w-fit"
      >
        <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
        Tous les dossiers
      </Link>

      {/* ─── Titre ─── */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Nouveau dossier de suivi
        </h1>
        <p className="mt-1 text-sm text-muted">
          Créez un dossier, vous pourrez ajouter des participants et choisir le niveau de suivi depuis la page du dossier.
        </p>
      </div>

      {/* ─── Formulaire ─── */}
      <div className="p-6 rounded-2xl bg-surface border border-border shadow-sm">
        <NouveauSuiviForm />
      </div>
    </div>
  );
}