"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type ChallengeBrief = {
  id: string;
  nom: string;
  date_debut: string;
  date_fin: string;
  statut: string;
  created_at: string;
};

type DossierBrief = {
  id: string;
  nom: string;
  niveau_suivi: string;
  created_at: string;
};

type Props = {
  challenges: ChallengeBrief[];
  dossiers: DossierBrief[];
  participantCounts: Record<string, number>;
};

const NIVEAUX_LABEL: Record<string, { label: string; color: string }> = {
  ESSENTIELLE: { label: "Essentielle", color: "bg-success/10 text-success" },
  RENFORCEE: { label: "Renforcée", color: "bg-info/10 text-info" },
  INTENSE: { label: "Intense", color: "bg-warning/10 text-warning" },
  CLINIQUE: { label: "Clinique", color: "bg-destructive/10 text-destructive" },
};

export default function SearchableHomePage({ challenges, dossiers, participantCounts }: Props) {
  const [query, setQuery] = useState("");

  const filteredChallenges = useMemo(() => {
    if (!query.trim()) return challenges;
    const q = query.toLowerCase().trim();
    return challenges.filter((c) => c.nom.toLowerCase().includes(q));
  }, [challenges, query]);

  const filteredDossiers = useMemo(() => {
    if (!query.trim()) return dossiers;
    const q = query.toLowerCase().trim();
    return dossiers.filter((d) => d.nom.toLowerCase().includes(q));
  }, [dossiers, query]);

  const now = new Date();
  const hasResults = filteredChallenges.length > 0 || filteredDossiers.length > 0;

  return (
    <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      {/* ─── En-tête ─── */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Accueil
        </h1>
        <p className="mt-1 text-sm text-muted">
          {challenges.length + dossiers.length > 0
            ? `${challenges.length} challenge${challenges.length > 1 ? "s" : ""} · ${dossiers.length} dossier${dossiers.length > 1 ? "s" : ""} de suivi`
            : "Créez votre premier challenge ou dossier de suivi."}
        </p>
      </div>

      {/* ─── Barre de recherche ─── */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            inputMode="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par nom…"
            autoComplete="off"
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-surface text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 transition-shadow"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Effacer la recherche"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {!hasResults && query && (
        <div className="flex flex-col items-center justify-center py-16 px-4 rounded-2xl bg-surface border border-dashed border-border text-center">
          <svg className="size-10 text-muted-foreground/30 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <p className="text-sm text-muted">
            Aucun résultat pour « {query} »
          </p>
        </div>
      )}

      {/* ─── Section Challenges ─── */}
      {filteredChallenges.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Challenges
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({filteredChallenges.length})
              </span>
            </h2>
            <Link
              href="/"
              className="text-sm font-medium text-primary hover:text-primary-hover transition-colors"
            >
              Voir tout
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredChallenges.map((c) => {
              const estActif = c.statut === "actif" && new Date(c.date_fin) >= now;
              const nbParticipants = participantCounts[c.id] ?? 0;

              return (
                <Link
                  key={c.id}
                  href={`/challenge/${c.id}`}
                  className="flex flex-col gap-3 p-5 rounded-xl bg-surface border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold text-foreground">{c.nom}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${
                      estActif ? "bg-success/10 text-success" : "bg-muted/30 text-muted-foreground"
                    }`}>
                      {estActif ? "Actif" : "Terminé"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                    <span>Du {new Date(c.date_debut).toLocaleDateString("fr-FR")}</span>
                    <span>au {new Date(c.date_fin).toLocaleDateString("fr-FR")}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted pt-1 border-t border-border">
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                    </svg>
                    <span>{nbParticipants} participant{nbParticipants > 1 ? "s" : ""}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ─── Section Dossiers ─── */}
      {filteredDossiers.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Dossiers de suivi nutritionnel
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({filteredDossiers.length})
              </span>
            </h2>
            <Link
              href="/suivi-nutritionnel"
              className="text-sm font-medium text-primary hover:text-primary-hover transition-colors"
            >
              Voir tout
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDossiers.map((d) => {
              const niveau = NIVEAUX_LABEL[d.niveau_suivi] ?? { label: d.niveau_suivi, color: "bg-muted/30 text-muted-foreground" };
              return (
                <Link
                  key={d.id}
                  href={`/suivi-nutritionnel/${d.id}`}
                  className="flex flex-col gap-3 p-5 rounded-xl bg-surface border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold text-foreground">{d.nom}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${niveau.color}`}>
                      {niveau.label}
                    </span>
                  </div>
                  <div className="text-xs text-muted">
                    Dossier de suivi nutritionnel
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}