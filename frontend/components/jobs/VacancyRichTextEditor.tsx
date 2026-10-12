"use client";

import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { ReactNode } from "react";

function ToolbarButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      title={label}
      onClick={onClick}
      className={`flex h-8 min-w-8 items-center justify-center rounded px-2 text-sm ${
        active ? "bg-[#e7f0fb] text-[#1769aa]" : "text-[#4b5159] hover:bg-[#f0f2f4]"
      }`}
    >
      {children}
    </button>
  );
}

function FieldError({ children }: { children?: ReactNode }) {
  if (!children) {
    return null;
  }

  return <p className="mt-1 text-xs text-[#c92a3a]">{children}</p>;
}

export default function VacancyRichTextEditor({
  onChange,
  error,
  initialContent = "",
}: {
  onChange: (html: string) => void;
  error?: string;
  initialContent?: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: false, underline: false }),
      Underline,
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: false, allowBase64: false }),
    ],
    content: initialContent,
    immediatelyRender: false,
    onUpdate: ({ editor: updatedEditor }) => onChange(updatedEditor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "vacancy-description min-h-[190px] px-3 py-3 text-sm leading-6 text-[#343a40] outline-none",
      },
    },
  });

  return (
    <div
      className={`mt-1.5 overflow-hidden rounded border ${
        error ? "border-[#dc3545]" : "border-[#dfe2e6]"
      }`}
    >
      <div className="flex flex-wrap items-center gap-0.5 border-b border-[#e5e7eb] px-2 py-1">
        <ToolbarButton
          label="Tebal"
          active={editor?.isActive("bold")}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          label="Miring"
          active={editor?.isActive("italic")}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          label="Garis bawah"
          active={editor?.isActive("underline")}
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
        >
          <u>U</u>
        </ToolbarButton>
        <ToolbarButton
          label="Daftar berpoin"
          active={editor?.isActive("bulletList")}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          ••
        </ToolbarButton>
        <ToolbarButton
          label="Tautan"
          active={editor?.isActive("link")}
          onClick={() => {
            if (!editor) return;
            const currentHref = editor.getAttributes("link").href as string | undefined;
            const href = window.prompt("Masukkan URL tautan", currentHref ?? "https://");
            if (href === null) return;
            if (!href.trim()) {
              editor.chain().focus().unsetLink().run();
              return;
            }
            editor.chain().focus().setLink({ href: href.trim() }).run();
          }}
        >
          ↗
        </ToolbarButton>
        <ToolbarButton
          label="Tambahkan gambar"
          onClick={() => {
            const src = window.prompt("Masukkan URL gambar");
            if (src?.trim()) {
              editor?.chain().focus().setImage({ src: src.trim(), alt: "Deskripsi gambar" }).run();
            }
          }}
        >
          ▧
        </ToolbarButton>
        <ToolbarButton
          label="Blok kode"
          active={editor?.isActive("codeBlock")}
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
        >
          {"</>"}
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
      <FieldError>{error}</FieldError>
    </div>
  );
}
