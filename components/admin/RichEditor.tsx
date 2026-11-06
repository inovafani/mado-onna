"use client";

import { useRef, useState } from "react";
import { useEditor, useEditorState, EditorContent, Node, mergeAttributes, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Button, Icon, type IconName } from "@/components/ds";
import { uploadImage } from "./shared";

/** An Instagram post or reel. Saved as Instagram's own blockquote; the article page loads embed.js to render it. */
const Instagram = Node.create({
  name: "instagram",
  group: "block",
  atom: true,
  addAttributes: () => ({ shortcode: { default: null } }),
  parseHTML: () => [
    {
      tag: "blockquote[data-instgrm-permalink]",
      getAttrs: (el) => ({ shortcode: (el as HTMLElement).dataset.instgrmPermalink?.match(/\/(?:p|reel|tv)\/([\w-]+)/)?.[1] ?? null }),
    },
  ],
  renderHTML: ({ HTMLAttributes }) => [
    "blockquote",
    mergeAttributes({
      class: "instagram-media",
      "data-instgrm-captioned": "",
      "data-instgrm-permalink": `https://www.instagram.com/p/${HTMLAttributes.shortcode}/`,
      "data-instgrm-version": "14",
    }),
  ],
  addNodeView: () => ({ node }) => {
    const dom = document.createElement("div");
    dom.className = "adm-embed";
    dom.textContent = `Instagram post · ${node.attrs.shortcode}`;
    return { dom };
  },
});

type Prompt = null | "link" | "instagram";

export default function RichEditor({ value, onChange, onError }: { value: string; onChange: (html: string) => void; onError: (msg: string) => void }) {
  const [prompt, setPrompt] = useState<Prompt>(null);
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const file = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false } }),
      Image,
      Placeholder.configure({ placeholder: "Tell the story. Use headings to break it up, and drop photos in where they help." }),
      Instagram,
    ],
    content: value,
    immediatelyRender: false,
    editorProps: { attributes: { class: "article__body", "aria-label": "Story body" } },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return <div className="adm-rte" />;

  function open(p: Prompt) {
    setPrompt((cur) => (cur === p ? null : p));
    setUrl(p === "link" ? (editor!.getAttributes("link").href ?? "") : "");
  }

  function apply() {
    const chain = editor!.chain().focus();
    if (prompt === "link") {
      if (url) chain.extendMarkRange("link").setLink({ href: url }).run();
      else chain.extendMarkRange("link").unsetLink().run();
    } else {
      const shortcode = url.match(/instagram\.com\/(?:p|reel|tv)\/([\w-]+)/)?.[1];
      if (!shortcode) return onError("Paste a link to an Instagram post or reel.");
      chain.insertContent({ type: "instagram", attrs: { shortcode } }).run();
    }
    setPrompt(null);
  }

  async function addImage(f?: File) {
    if (!f) return;
    setUploading(true);
    try {
      editor!.chain().focus().setImage({ src: await uploadImage(f), alt: "" }).run();
    } catch (e) {
      onError((e as Error).message);
    }
    setUploading(false);
    if (file.current) file.current.value = "";
  }

  return (
    <div className="adm-rte">
      <Toolbar editor={editor} prompt={prompt} uploading={uploading} onPrompt={open} onImage={() => file.current?.click()} />
      {prompt && (
        <div className="adm-rte__prompt">
          <input
            autoFocus
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                apply();
              }
              if (e.key === "Escape") setPrompt(null);
            }}
            placeholder={prompt === "link" ? "https://… (leave empty to remove the link)" : "https://www.instagram.com/p/… or /reel/…"}
          />
          <Button size="sm" variant="primary" onClick={apply}>
            {prompt === "link" ? "Apply" : "Embed"}
          </Button>
        </div>
      )}
      <input ref={file} type="file" accept="image/*" hidden onChange={(e) => addImage(e.target.files?.[0])} />
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({
  editor,
  prompt,
  uploading,
  onPrompt,
  onImage,
}: {
  editor: Editor;
  prompt: Prompt;
  uploading: boolean;
  onPrompt: (p: Prompt) => void;
  onImage: () => void;
}) {
  // Re-render the toolbar as the selection moves so active marks light up.
  const on = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      h2: e.isActive("heading", { level: 2 }),
      h3: e.isActive("heading", { level: 3 }),
      ul: e.isActive("bulletList"),
      ol: e.isActive("orderedList"),
      quote: e.isActive("blockquote"),
      link: e.isActive("link"),
    }),
  });
  const c = () => editor.chain().focus();
  const btn = (label: string, active: boolean, run: () => void, content: React.ReactNode, disabled = false) => (
    <button type="button" className={"adm-rte__btn" + (active ? " is-on" : "")} aria-label={label} title={label} aria-pressed={active} onClick={run} disabled={disabled}>
      {content}
    </button>
  );
  const icon = (n: IconName) => <Icon name={n} />;

  return (
    <div className="adm-rte__bar" role="toolbar" aria-label="Formatting">
      {btn("Bold", on.bold, () => c().toggleBold().run(), <b>B</b>)}
      {btn("Italic", on.italic, () => c().toggleItalic().run(), <i>I</i>)}
      <span className="adm-rte__sep" />
      {btn("Heading", on.h2, () => c().toggleHeading({ level: 2 }).run(), "H2")}
      {btn("Subheading", on.h3, () => c().toggleHeading({ level: 3 }).run(), "H3")}
      {btn("Pull quote", on.quote, () => c().toggleBlockquote().run(), icon("quote"))}
      {btn("Bulleted list", on.ul, () => c().toggleBulletList().run(), icon("list"))}
      {btn("Numbered list", on.ol, () => c().toggleOrderedList().run(), icon("list-ordered"))}
      <span className="adm-rte__sep" />
      {btn("Link", on.link || prompt === "link", () => onPrompt("link"), icon("link"))}
      {btn(uploading ? "Uploading photo…" : "Photo", uploading, onImage, icon(uploading ? "upload" : "image"), uploading)}
      {btn("Instagram post", prompt === "instagram", () => onPrompt("instagram"), icon("instagram"))}
    </div>
  );
}
