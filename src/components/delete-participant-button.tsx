"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteParticipant } from "@/app/actions";

type Props = {
  participantId: string;
  participantNom: string;
  participantPrenom: string;
};

export function DeleteParticipantButton({
  participantId,
  participantNom,
  participantPrenom,
}: Props) {
  const [pending, setPending] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setPending(true);
    try {
      await deleteParticipant(participantId);
    } catch {
      setPending(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      {/* Bouton "Supprimer" */}
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        className="inline-flex items-center justify-center gap-2 min-h-11 px-4 py-2.5 rounded-xl border border-destructive/30 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
      >
        <svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
        Supprimer
      </button>

      {/* Modal de confirmation */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => !pending && setShowConfirm(false)}
          />

          {/* Dialog */}
          <div className="relative w-full max-w-md p-6 rounded-2xl bg-surface shadow-xl border border-border">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center size-10 rounded-full bg-destructive/10 shrink-0">
                <svg className="size-5 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              </span>
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Supprimer le participant
                </h3>
                <p className="text-sm text-muted mt-0.5">
                  Cette action est irréversible.
                </p>
              </div>
            </div>

            <p className="text-sm text-foreground mb-6">
              Êtes-vous sûr de vouloir supprimer <strong>{participantPrenom} {participantNom}</strong> ?
              Tous ses suivis quotidiens seront également supprimés.
            </p>

            <div className="flex flex-col sm:flex-row-reverse gap-3">
              <button
                type="button"
                onClick={handleDelete}
                disabled={pending}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-11 px-5 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pending ? (
                  <>
                    <svg className="size-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" />
                    </svg>
                    Suppression…
                  </>
                ) : (
                  "Oui, supprimer"
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={pending}
                className="w-full sm:w-auto inline-flex items-center justify-center min-h-11 px-5 py-2.5 rounded-xl border border-input text-sm font-medium text-foreground hover:bg-sidebar-hover transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}