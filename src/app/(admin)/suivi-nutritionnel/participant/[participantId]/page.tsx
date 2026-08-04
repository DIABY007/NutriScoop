import { redirect, notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

type PageProps = {
  params: Promise<{ participantId: string }>;
};

export default async function SuiviParParticipantPage({ params }: PageProps) {
  const { participantId } = await params;
  const supabase = await createClient();

  const { data: link } = await supabase
    .from("dossier_participants")
    .select("dossier_id")
    .eq("participant_id", participantId)
    .single();

  if (!link) {
    // Pas de suivi existant → rediriger vers la page de création
    redirect(`/suivi-nutritionnel/nouveau?participant_id=${participantId}`);
  }

  redirect(`/suivi-nutritionnel/${link.dossier_id}`);
}