"use client";

import Link from "next/link";

type ParticipantBrief = {
  id: string;
  nom: string;
  prenom: string;
  age: number;
  sexe: string;
  poids_initial: number;
  objectif: string | null;
  created_at: string;
};

type Props = {
  participants: ParticipantBrief[];
  challengeId: string;
};

export function ChallengeParticipantList({ participants, challengeId }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {participants.map((p) => (
        <Link
          key={p.id}
          href={`/participant/${p.id}`}
          className="flex items-center gap-3 p-4 rounded-xl bg-surface border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          <span className="flex items-center justify-center size-10 rounded-full bg-primary-light text-primary font-semibold text-sm shrink-0">
            {p.prenom.charAt(0).toUpperCase()}
            {p.nom.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {p.prenom} {p.nom}
            </p>
            <p className="text-xs text-muted">
              {p.age} ans · {p.poids_initial} kg
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}