"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/tabs";
import type { SuiviNutritionnel } from "@/types";

// ─── Imports dynamiques (SSR désactivé pour éviter "window is not defined") ───
const RichTextEditor = dynamic(
  () => import("@/components/rich-text-editor"),
  { ssr: false }
);
const BilanSaisi = dynamic(
  () => import("@/components/bilan-saisi"),
  { ssr: false }
);

type SuiviTabsProps = {
  participantId: string;
  suivi: SuiviNutritionnel | null;
};

export function SuiviNutritionnelTabs({ participantId, suivi }: SuiviTabsProps) {
  const [activeTab, setActiveTab] = useState("evaluation");
  const [programmeHtml, setProgrammeHtml] = useState<string>(
    suivi?.programme_nutritionnel ?? ""
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleEditorChange = useCallback((html: string) => {
    setProgrammeHtml(html);
  }, []);

  const handleSave = useCallback(() => {
    setIsSaving(true);
    console.log("=== Programme nutritionnel sauvegardé ===");
    console.log(programmeHtml);
    // Simuler un délai pour le feedback visuel
    setTimeout(() => setIsSaving(false), 600);
  }, [programmeHtml]);

  return (
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
      <TabsContent value="evaluation" className="focus-visible:outline-none">
        <BilanSaisi niveauSuivi="RENFORCEE" />
      </TabsContent>

      {/* ─── Contenu : Programme nutritionnel ─── */}
      <TabsContent value="programme" className="focus-visible:outline-none">
        <div className="space-y-4">
          {/* ─── Éditeur de texte enrichi ─── */}
          <RichTextEditor
            initialContent={suivi?.programme_nutritionnel ?? ""}
            onChange={handleEditorChange}
          />

          {/* ─── Barre d'actions ─── */}
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
      </TabsContent>
    </Tabs>
  );
}