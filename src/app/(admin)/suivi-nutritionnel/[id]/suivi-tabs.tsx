"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/tabs";
import { saveEvaluation, saveProgramme } from "@/app/actions/suivi-nutritionnel";
import type { DossierParticipant } from "@/types";

// ─── Imports dynamiques (SSR désactivé) ───
const RichTextEditor = dynamic(
  () => import("@/components/rich-text-editor"),
  { ssr: false }
);
const GrilleEvaluation = dynamic(
  () => import("@/components/grille-evaluation"),
  { ssr: false }
);
const BilanSaisi = dynamic(
  () => import("@/components/bilan-saisi"),
  { ssr: false }
);

type SuiviTabsProps = {
  dossierId: string;
  participants: DossierParticipant[];
};

export function SuiviNutritionnelTabs({ dossierId, participants }: SuiviTabsProps) {
  const router = useRouter();
  const [selectedParticipantId, setSelectedParticipantId] = useState<string>(
    participants[0]?.id ?? ""
  );
  const [activeTab, setActiveTab] = useState("evaluation");

  // ─── Synchroniser la sélection quand la liste des participants change ───
  useEffect(() => {
    if (participants.length === 0) {
      setSelectedParticipantId("");
      return;
    }
    setSelectedParticipantId((prev) =>
      prev && participants.some((p) => p.id === prev) ? prev : participants[0].id
    );
  }, [participants]);

  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const selectedParticipant = participants.find((p) => p.id === selectedParticipantId);
  const participantInfos = selectedParticipant?.participants;

  const programmeHtml = selectedParticipant?.programme_nutritionnel ?? "";

  const handleEditorChange = useCallback((html: string) => {
    // On stocke localement via le state du composant RichTextEditor
  }, []);

  const handleSaveProgramme = useCallback(async (html: string) => {
    if (!selectedParticipantId) return;
    setIsSaving(true);
    setFeedback(null);

    const result = await saveProgramme(selectedParticipantId, dossierId, html);

    if (result.success) {
      setFeedback({ type: "success", message: "Programme sauvegardé !" });
      router.refresh();
    } else {
      setFeedback({ type: "error", message: result.message });
    }

    setTimeout(() => {
      setIsSaving(false);
      setFeedback(null);
    }, 2000);
  }, [selectedParticipantId, dossierId, router]);

  const handleEvaluationSave = useCallback(async (data: Record<string, string>) => {
    if (!selectedParticipantId) return;
    setFeedback(null);

    const result = await saveEvaluation(selectedParticipantId, dossierId, data);

    if (result.success) {
      setFeedback({ type: "success", message: "Évaluation sauvegardée !" });
      router.refresh();
    } else {
      setFeedback({ type: "error", message: result.message });
    }

    setTimeout(() => setFeedback(null), 2000);
  }, [selectedParticipantId, dossierId, router]);

  if (participants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 rounded-2xl bg-surface border border-dashed border-border text-center">
        <svg className="size-10 text-muted-foreground/30 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
        </svg>
        <p className="text-sm text-muted">
          Ajoutez des participants au dossier pour accéder à l'évaluation et au programme.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* ─── Toast de feedback ─── */}
      {feedback && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all duration-300 ${
            feedback.type === "success"
              ? "bg-success text-white"
              : "bg-destructive text-white"
          }`}
        >
          {feedback.type === "success" ? (
            <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          ) : (
            <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          )}
          {feedback.message}
        </div>
      )}

      {/* ─── Sélecteur de participant ─── */}
      {participants.length > 1 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Participant
          </label>
          <div className="flex flex-wrap gap-2">
            {participants.map((dp) => {
              const p = dp.participants;
              if (!p) return null;
              const isActive = dp.id === selectedParticipantId;
              return (
                <button
                  key={dp.id}
                  type="button"
                  onClick={() => setSelectedParticipantId(dp.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    isActive
                      ? "border-primary bg-primary-light/20 text-primary"
                      : "border-border bg-surface text-foreground hover:border-primary/30"
                  }`}
                >
                  <span className="flex items-center justify-center size-7 rounded-full bg-primary-light text-primary font-semibold text-xs">
                    {p.prenom.charAt(0).toUpperCase()}{p.nom.charAt(0).toUpperCase()}
                  </span>
                  {p.prenom} {p.nom}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <Tabs
        defaultValue="evaluation"
        baseId="suivi-nutritionnel"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        {/* ─── Barre d'onglets ─── */}
        <TabsList
          className="mb-6"
          label="Navigation suivi nutritionnel"
        >
          <TabsTrigger value="evaluation">
            <svg
              className="size-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
              />
            </svg>
            Évaluation nutritionnelle
          </TabsTrigger>
          <TabsTrigger value="programme">
            <svg
              className="size-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
              />
            </svg>
            Programme nutritionnel
          </TabsTrigger>
        </TabsList>

        {/* ─── Contenu : Évaluation nutritionnelle ─── */}
        <TabsContent value="evaluation" className="focus-visible:outline-none space-y-8">
          {selectedParticipant && (
            <>
              <GrilleEvaluation
                initialData={
                  selectedParticipant.evaluation_nutritionnelle
                    ? (selectedParticipant.evaluation_nutritionnelle as Record<string, string>)
                    : undefined
                }
                onSave={handleEvaluationSave}
              />

              <div className="border-t border-border pt-8">
                <BilanSaisi niveauSuivi={
                  (selectedParticipant as unknown as { niveau_suivi?: string })?.niveau_suivi as import("@/types").NiveauSuivi ?? "ESSENTIELLE"
                } />
              </div>
            </>
          )}
        </TabsContent>

        {/* ─── Contenu : Programme nutritionnel ─── */}
        <TabsContent value="programme" className="focus-visible:outline-none">
          {selectedParticipant && (
            <ProgrammeEditor
              initialContent={selectedParticipant.programme_nutritionnel ?? ""}
              dossierParticipantId={selectedParticipant.id}
              dossierId={dossierId}
              onSave={handleSaveProgramme}
            />
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}

// ─── Sous-composant pour l'éditeur de programme ───
function ProgrammeEditor({
  initialContent,
  dossierParticipantId,
  dossierId,
  onSave,
}: {
  initialContent: string;
  dossierParticipantId: string;
  dossierId: string;
  onSave: (html: string) => Promise<void>;
}) {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    await onSave(content);
    setIsSaving(false);
  }, [content, onSave]);

  return (
    <div className="space-y-4">
      <RichTextEditor
        initialContent={initialContent}
        onChange={setContent}
      />

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          disabled={isSaving}
          onClick={handleSave}
          className="
            inline-flex items-center justify-center gap-2
            min-h-11 px-5 py-2.5
            rounded-xl text-sm font-medium
            bg-primary text-primary-foreground
            hover:bg-primary-hover
            active:scale-[0.97]
            transition-all duration-150 ease-out
            shadow-sm
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30
            disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100
          "
        >
          {isSaving ? (
            <>
              <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Sauvegarde…
            </>
          ) : (
            <>
              <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
              Sauvegarder le programme
            </>
          )}
        </button>
      </div>
    </div>
  );
}