import Link from "next/link";

export default function ParticipantNotFound() {
  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="flex flex-col items-center text-center max-w-sm">
        <div
          className="flex items-center justify-center size-16 rounded-full bg-destructive/10 mb-6"
          aria-hidden="true"
        >
          <svg
            className="size-8 text-destructive"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">
          Participant introuvable
        </h1>
        <p className="text-sm text-muted leading-relaxed mb-8">
          Le participant que vous recherchez n&apos;existe pas ou a été
          supprimé.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 min-h-12 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition-colors shadow-sm"
        >
          <svg
            className="size-5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Retour au tableau de bord
        </Link>
      </div>
    </div>
  );
}