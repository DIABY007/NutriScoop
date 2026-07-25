"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Participant } from "@/types";

export function ParticipantList({ participants }: { participants: Participant[] }) {
  const [search, setSearch] = useState("");

  // ─── Filtre côté client ───
  const filtered = useMemo(() => {
    if (!search.trim()) return participants;
    const q = search.toLowerCase().trim();
    return participants.filter(
      (p) =>
        p.nom.toLowerCase().includes(q) ||
        p.prenom.toLowerCase().includes(q)
    );
  }, [search, participants]);

  return (
    <>
      {/* ─── Barre de recherche ─── */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 size-5 text-muted-foreground pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom ou prénom…"
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-surface text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            aria-label="Rechercher un participant"
          />
        </div>
      </div>

      {/* ─── Liste des participants ─── */}
      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((participant) => (
            <Link
              key={participant.id}
              href={`/participant/${participant.id}`}
              className="flex flex-col gap-3 p-5 rounded-xl bg-surface border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              {/* En-tête de la carte */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="flex items-center justify-center size-10 rounded-full bg-primary-light text-primary font-semibold text-sm shrink-0">
                    {participant.prenom.charAt(0).toUpperCase()}
                    {participant.nom.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-foreground truncate">
                      {participant.prenom} {participant.nom}
                    </h3>
                    <p className="text-xs text-muted">
                      {participant.age} ans · {participant.sexe === "homme" ? "Homme" : participant.sexe === "femme" ? "Femme" : "Autre"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Infos supplémentaires */}
              <div className="flex flex-wrap gap-3 pt-1">
                <div className="flex items-center gap-1.5 text-xs text-muted">
                  <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                  </svg>
                  <span>{participant.poids_initial} kg</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted">
                  <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                  </svg>
                  <span>Depuis le {new Date(participant.date_debut).toLocaleDateString("fr-FR")}</span>
                </div>
              </div>

              {/* Objectif */}
              {participant.objectif && (
                <p className="text-sm text-muted leading-relaxed line-clamp-2 border-t border-border pt-3 mt-1">
                  <span className="text-foreground font-medium">Objectif : </span>
                  {participant.objectif}
                </p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        /* ─── Aucun résultat pour la recherche ─── */
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <svg
            className="size-12 text-muted-foreground/40 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <h3 className="text-base font-semibold text-foreground mb-1">
            Aucun résultat
          </h3>
          <p className="text-sm text-muted max-w-xs">
            Aucun participant ne correspond à votre recherche. Essayez un autre terme.
          </p>
        </div>
      )}
    </>
  );
}