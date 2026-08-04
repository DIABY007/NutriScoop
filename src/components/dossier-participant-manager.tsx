"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { removeParticipantFromDossier, getDossierParticipants } from "@/app/actions/suivi-nutritionnel";
import { DossierAddParticipantModal } from "./dossier-add-participant-modal";
import CopyLinkButton from "./copy-link-button";
import type { DossierParticipant } from "@/types";

type Props = {
  dossierId: string;
  initialParticipants: DossierParticipant[];
};

export function DossierParticipantManager({ dossierId, initialParticipants }: Props) {
  const router = useRouter();
  const [participants, setParticipants] = useState(initialParticipants);
  const [showAddModal, setShowAddModal] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const refreshParticipants = useCallback(async () => {
    const data = await getDossierParticipants(dossierId);
    setParticipants(data);
    router.refresh();
  }, [dossierId, router]);

  const handleRemove = useCallback(async (participantId: string) => {
    if (!confirm("Retirer ce participant du dossier ?")) return;
    setRemovingId(participantId);
    const result = await removeParticipantFromDossier(dossierId, participantId);
    if (result.success) {
      await refreshParticipants();
    }
    setRemovingId(null);
  }, [dossierId, refreshParticipants]);

  return (
    <section>
      {/* ─── En-tête ─── */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          Participants
          <span className="text-sm font-normal text-muted-foreground ml-2">
            ({participants.length})
          </span>
        </h2>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 min-h-11 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover active:scale-[0.97] transition-all duration-150 ease-out shadow-sm"
        >
          <svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Ajouter
        </button>
      </div>

      {/* ─── Liste des participants ─── */}
      {participants.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {participants.map((dp) => {
            const p = dp.participants;
            if (!p) return null;

            return (
              <div
                key={dp.id}
                className="flex flex-col gap-3 p-4 rounded-xl bg-surface border border-border shadow-sm"
              >
                {/* Infos participant */}
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center size-10 rounded-full bg-primary-light text-primary font-semibold text-sm shrink-0">
                    {p.prenom.charAt(0).toUpperCase()}{p.nom.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {p.prenom} {p.nom}
                    </p>
                    <p className="text-xs text-muted">
                      {p.age} ans · {p.poids_initial} kg
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1 border-t border-border">
                  {/* Lien d'accès patient */}
                  <CopyLinkButton
                    accessToken={dp.access_token}
                    participantPrenom={p.prenom}
                    participantNom={p.nom}
                  />

                  {/* Bouton retirer */}
                  <button
                    type="button"
                    onClick={() => handleRemove(p.id)}
                    disabled={removingId === p.id}
                    className="inline-flex items-center justify-center size-9 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                    title="Retirer du dossier"
                  >
                    <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-12 px-4 rounded-2xl bg-surface border border-dashed border-border text-center">
          <svg className="size-10 text-muted-foreground/30 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
          </svg>
          <p className="text-sm text-muted">
            Aucun participant dans ce dossier.
          </p>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="mt-4 inline-flex items-center justify-center gap-2 min-h-11 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition-colors shadow-sm"
          >
            <svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Ajouter un participant
          </button>
        </div>
      )}

      {/* ─── Modal d'ajout ─── */}
      {showAddModal && (
        <DossierAddParticipantModal
          dossierId={dossierId}
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          onParticipantAdded={refreshParticipants}
        />
      )}
    </section>
  );
}