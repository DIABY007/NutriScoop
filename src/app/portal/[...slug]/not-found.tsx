export default function PortalNotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-30 bg-surface border-b border-border safe-area-top">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Aurore AgroVital"
            className="size-9 rounded-xl object-contain shrink-0"
          />
          <span className="text-foreground font-semibold text-lg">
            Aurore AgroVital
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="flex flex-col items-center text-center max-w-sm py-16">
          <div className="flex items-center justify-center size-20 rounded-full bg-warning/10 mb-6">
            <svg
              className="size-10 text-warning"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-3">
            Lien invalide ou expiré
          </h1>
          <p className="text-sm text-muted leading-relaxed mb-8">
            Ce lien de connexion n&apos;est plus valide. Il a peut-être expiré
            ou le lien que vous avez utilisé est incorrect.
          </p>
          <p className="text-xs text-muted-foreground">
            Si vous pensez qu&apos;il s&apos;agit d&apos;une erreur,
            veuillez contacter votre nutritionniste pour obtenir un nouveau lien.
          </p>
        </div>
      </main>

      <footer className="py-6 text-center">
        <p className="text-xs text-muted-foreground">
          Aurore AgroVital &mdash; Suivi nutritionnel personnalisé
        </p>
      </footer>
    </div>
  );
}