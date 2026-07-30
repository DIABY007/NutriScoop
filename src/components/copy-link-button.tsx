"use client";

import { useState, useCallback } from "react";

type CopyLinkButtonProps = {
  accessToken: string;
  participantPrenom: string;
  participantNom: string;
};

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // supprime les accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // remplace les espaces/caractères spéciaux par -
    .replace(/^-+|-+$/g, ""); // supprime les tirets en début/fin
}

export default function CopyLinkButton({
  accessToken,
  participantPrenom,
  participantNom,
}: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const slug = `${slugify(participantPrenom)}-${slugify(participantNom)}`;
    const url = `${window.location.origin}/portal/${slug}/${accessToken}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  }, [accessToken, participantPrenom, participantNom]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`
        inline-flex items-center justify-center gap-2
        min-h-11 px-4 py-2.5
        rounded-xl text-sm font-medium
        transition-all duration-150 ease-out
        active:scale-[0.97]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30
        ${
          copied
            ? "bg-success text-white shadow-sm"
            : "border border-border text-foreground hover:bg-sidebar-hover"
        }
      `}
      title="Copier le lien d'accès patient"
    >
      {copied ? (
        <>
          <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
          Lien copié&nbsp;!
        </>
      ) : (
        <>
          <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
          </svg>
          Envoyer le lien&nbsp;{participantPrenom}
        </>
      )}
    </button>
  );
}