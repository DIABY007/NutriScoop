"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { useEffect } from "react";

// ─── Types ───────────────────────────────────────────────
type RichTextEditorProps = {
  initialContent?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  editable?: boolean;
};

// ─── Icônes SVG toolbar (inline, zéro dépendance) ───────
const icons = {
  bold: (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
      <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    </svg>
  ),
  italic: (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="19" y1="4" x2="10" y2="4" />
      <line x1="14" y1="20" x2="5" y2="20" />
      <line x1="15" y1="4" x2="9" y2="20" />
    </svg>
  ),
  underline: (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 4v6a6 6 0 0 0 12 0V4" />
      <line x1="4" y1="20" x2="20" y2="20" />
    </svg>
  ),
  heading1: <span className="text-xs font-bold leading-none" aria-hidden="true">H1</span>,
  heading2: <span className="text-xs font-bold leading-none" aria-hidden="true">H2</span>,
  bulletList: (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="9" y1="6" x2="20" y2="6" />
      <line x1="9" y1="12" x2="20" y2="12" />
      <line x1="9" y1="18" x2="20" y2="18" />
      <circle cx="4" cy="6" r="1" fill="currentColor" />
      <circle cx="4" cy="12" r="1" fill="currentColor" />
      <circle cx="4" cy="18" r="1" fill="currentColor" />
    </svg>
  ),
  orderedList: (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="10" y1="6" x2="21" y2="6" />
      <line x1="10" y1="12" x2="21" y2="12" />
      <line x1="10" y1="18" x2="21" y2="18" />
      <path d="M4 6h1v4" />
      <path d="M4 10h2" />
      <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
    </svg>
  ),
};

// ─── Groupe de boutons ──────────────────────────────────
type ToolbarGroupProps = {
  children: React.ReactNode;
  label: string;
};

function ToolbarGroup({ children, label }: ToolbarGroupProps) {
  return (
    <div role="group" aria-label={label} className="flex items-center gap-0.5">
      {children}
      <span className="mx-1.5 h-5 w-px bg-border last:hidden" aria-hidden="true" />
    </div>
  );
}

// ─── Bouton de la barre d'outils ─────────────────────────
type ToolbarButtonProps = {
  onClick: () => void;
  isActive?: boolean;
  label: string;
  children: React.ReactNode;
};

function ToolbarButton({ onClick, isActive = false, label, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={isActive}
      title={label}
      className={`
        inline-flex items-center justify-center
        min-h-9 min-w-9 p-2
        rounded-lg text-sm font-medium
        transition-all duration-150 ease-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30
        ${isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted hover:bg-sidebar-hover hover:text-foreground"
        }
      `}
    >
      {children}
    </button>
  );
}

// ─── Barre d'outils ──────────────────────────────────────
type ToolbarProps = {
  editor: Editor;
};

function Toolbar({ editor }: ToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-border bg-muted/10 rounded-t-xl" role="toolbar" aria-label="Mise en forme du texte">
      {/* ─── Style de texte ─── */}
      <ToolbarGroup label="Style de texte">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          label="Gras"
        >
          {icons.bold}
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          label="Italique"
        >
          {icons.italic}
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          label="Souligné"
        >
          {icons.underline}
        </ToolbarButton>
      </ToolbarGroup>

      {/* ─── Titres ─── */}
      <ToolbarGroup label="Titres">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive("heading", { level: 1 })}
          label="Titre 1"
        >
          {icons.heading1}
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          label="Titre 2"
        >
          {icons.heading2}
        </ToolbarButton>
      </ToolbarGroup>

      {/* ─── Listes ─── */}
      <ToolbarGroup label="Listes">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          label="Liste à puces"
        >
          {icons.bulletList}
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          label="Liste numérotée"
        >
          {icons.orderedList}
        </ToolbarButton>
      </ToolbarGroup>
    </div>
  );
}

// ─── Composant Éditeur ──────────────────────────────────
export default function RichTextEditor({
  initialContent = "",
  onChange,
  placeholder = "Commencez à rédiger…",
  editable = true,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2] },
      }),
      Underline,
    ],
    content: initialContent || `
      <h2>Programme nutritionnel</h2>
      <p>Rédigez ici le programme personnalisé du participant...</p>
    `,
    editable,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[280px] px-4 py-4 focus-visible:outline-none text-foreground",
        placeholder,
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  // Met à jour le contenu si initialContent change (ex: chargement serveur)
  useEffect(() => {
    if (editor && initialContent && editor.getHTML() !== initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  if (!editor) {
    return (
      <div className="flex items-center justify-center min-h-[320px] rounded-2xl bg-surface border border-border">
        <p className="text-sm text-muted-foreground">Chargement de l'éditeur…</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-surface border border-border shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 transition-shadow">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}