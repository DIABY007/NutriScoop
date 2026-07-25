import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { EditParticipantForm } from "./edit-form";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ModifierParticipantPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: participant, error } = await supabase
    .from("participants")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !participant) {
    notFound();
  }

  return (
    <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      {/* ─── En-tête ─── */}
      <div className="mb-8">
        <Link
          href={`/participant/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-4 min-h-11"
        >
          <svg
            className="size-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Retour au profil
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Modifier le participant
        </h1>
        <p className="mt-1 text-sm text-muted">
          Modifiez les informations de {participant.prenom} {participant.nom}.
        </p>
      </div>

      {/* ─── Formulaire ─── */}
      <div className="w-full max-w-lg">
        <EditParticipantForm participant={participant} />
      </div>
    </div>
  );
}