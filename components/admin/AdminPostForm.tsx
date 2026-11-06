"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Checkbox, Icon, Input, Textarea } from "@/components/ds";
import Tabs from "@/components/Tabs";
import { ACTS, JOURNAL_CATS } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";
import { refreshJournal } from "@/app/admin/actions";
import RichEditor from "./RichEditor";
import { AdminBar, DEFAULT_AUTHOR, fmtDate, readingTime, slugify, uploadImage } from "./shared";

const CATS = JOURNAL_CATS.slice(1);

type Form = {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  image_url: string;
  image_alt: string;
  author: string;
  published: boolean;
  published_at: string | null;
  updated_at: string | null;
  meta_title: string;
  meta_description: string;
  focus_keyword: string;
  canonical_url: string;
  og_title: string;
  og_description: string;
  tags: string[];
  schema_types: string[];
  related_acts: string[];
};

const EMPTY: Form = {
  title: "",
  slug: "",
  category: CATS[0],
  excerpt: "",
  content: "",
  image_url: "",
  image_alt: "",
  author: DEFAULT_AUTHOR,
  published: false,
  published_at: null,
  updated_at: null,
  meta_title: "",
  meta_description: "",
  focus_keyword: "",
  canonical_url: "",
  og_title: "",
  og_description: "",
  tags: [],
  schema_types: ["Article"],
  related_acts: [],
};

const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
const plain = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").toLowerCase();

/** Where the focus keyword shows up. Google weighs the title, the opening and the headings most. */
function keywordChecks(f: Form) {
  const k = f.focus_keyword.trim().toLowerCase();
  if (!k) return [];
  const headings = [...f.content.matchAll(/<h[23][^>]*>(.*?)<\/h[23]>/gi)].map((m) => plain(m[1])).join(" ");
  return [
    { label: "In the title", ok: (f.meta_title || f.title).toLowerCase().includes(k) },
    { label: "In the standfirst", ok: f.excerpt.toLowerCase().includes(k) },
    { label: "In the opening paragraph", ok: plain(f.content.match(/<p[^>]*>(.*?)<\/p>/i)?.[1] ?? "").includes(k) },
    { label: "In a heading", ok: headings.includes(k) },
    { label: "In the URL", ok: f.slug.includes(slugify(k)) },
  ];
}

// Dates are picked in Bali time; a story dated a given day goes out at 09:00 WITA.
const toDay = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString("en-CA", { timeZone: "Asia/Makassar" }) : "");
const fromDay = (day: string) => new Date(`${day}T09:00:00+08:00`).toISOString();

export default function AdminPostForm({ params }: { params?: Promise<{ id: string }> }) {
  const id = params ? use(params).id : null;
  const router = useRouter();
  const [form, setForm] = useState<Form>(EMPTY);
  const [loaded, setLoaded] = useState(!id);
  const [slugTouched, setSlugTouched] = useState(!!id);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    createClient()
      .from("posts")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) setError("This story couldn't be found. It may have been deleted.");
        else setForm(Object.fromEntries(Object.entries(EMPTY).map(([k, empty]) => [k, data[k] ?? empty])) as Form);
        setLoaded(true);
      });
  }, [id]);

  // Don't lose an unsaved story to a stray tab close.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setDirty(true);
    setForm((f) => ({ ...f, [key]: value, ...(key === "title" && !slugTouched && { slug: slugify(value as string) }) }));
  }

  async function setCover(file?: File) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      set("image_url", await uploadImage(file));
    } catch (e) {
      setError((e as Error).message);
    }
    setUploading(false);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.slug) return setError("Give the story a title first.");
    if (form.published && (!form.image_url || !form.excerpt.trim()))
      return setError("A live story needs a cover photo and a standfirst. Add them, or save it as a draft.");

    setSaving(true);
    setError("");
    const payload = {
      ...form,
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      author: form.author.trim() || DEFAULT_AUTHOR,
      meta_title: form.meta_title.trim() || null,
      meta_description: form.meta_description.trim() || null,
      focus_keyword: form.focus_keyword.trim() || null,
      canonical_url: form.canonical_url.trim() || null,
      og_title: form.og_title.trim() || null,
      og_description: form.og_description.trim() || null,
      schema_types: form.schema_types.length ? form.schema_types : ["Article"],
      published_at: form.published_at ?? (form.published ? new Date().toISOString() : null),
      updated_at: id ? new Date().toISOString() : null,
      reading_time: readingTime(form.content),
    };
    const supabase = createClient();
    const { error } = id ? await supabase.from("posts").update(payload).eq("id", id) : await supabase.from("posts").insert(payload);
    if (error) {
      setSaving(false);
      return setError(error.code === "23505" ? `Another story already uses /journal/${form.slug}. Change the URL.` : error.message);
    }
    await refreshJournal();
    setDirty(false);
    router.push("/admin/journal");
  }

  const metaTitle = form.meta_title || `${form.title || "Story title"} · Madò Onnà Journal`;
  const metaDesc = form.meta_description || form.excerpt;
  const checks = keywordChecks(form);

  if (!loaded)
    return (
      <>
        <AdminBar />
        <main className="adm-main">
          <p className="wrap adm-note">Loading story…</p>
        </main>
      </>
    );

  return (
    <>
      <AdminBar />
      <main className="adm-main">
        <form className="wrap adm-editor" onSubmit={save} noValidate>
          <div className="adm-editor__main">
            <textarea
              className="adm-title"
              rows={2}
              value={form.title}
              onChange={(e) => set("title", e.target.value.replace(/\n/g, " "))}
              placeholder="Story title"
              aria-label="Title"
              autoFocus={!id}
            />
            <label className="adm-url">
              /journal/
              <input
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set("slug", slugify(e.target.value));
                }}
                placeholder="story-url"
                aria-label="URL"
              />
            </label>
            <textarea
              className="adm-dek"
              rows={2}
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              placeholder="Standfirst: one or two sentences that make someone want to read on. Shown on the journal cards and under the headline."
              aria-label="Standfirst"
            />
            <RichEditor value={form.content} onChange={(html) => set("content", html)} onError={setError} />
          </div>

          <aside className="adm-side">
            <div className="adm-group">
              <span className="eyebrow">
                Status <span>~{readingTime(form.content)} min read</span>
              </span>
              <Tabs<"draft" | "live">
                label="Status"
                value={form.published ? "live" : "draft"}
                onChange={(v) => set("published", v === "live")}
                items={[
                  { value: "draft", label: "Draft" },
                  { value: "live", label: "Live on site" },
                ]}
              />
              <div className="form">
                <Input
                  label="Publish date"
                  type="date"
                  value={toDay(form.published_at)}
                  onChange={(e) => set("published_at", e.target.value ? fromDay(e.target.value) : null)}
                  hint={form.published_at ? undefined : "Set to today when it first goes live."}
                />
              </div>
              {form.updated_at && <span className="adm-note">Last saved {fmtDate(form.updated_at, true)}</span>}
              {error && (
                <p className="adm-note adm-note--error" role="alert">
                  {error}
                </p>
              )}
              <div className="adm-actions">
                <Button variant="primary" type="submit" disabled={saving || uploading} iconRight={<Icon name="arrow-right" />}>
                  {saving ? "Saving…" : form.published ? "Save & publish" : "Save draft"}
                </Button>
                <Button href="/admin/journal" variant="ghost">
                  Cancel
                </Button>
              </div>
            </div>

            <div className="adm-group">
              <span className="eyebrow">Category</span>
              <div className="chips" role="radiogroup" aria-label="Category">
                {CATS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    role="radio"
                    aria-checked={form.category === c}
                    className={"chip" + (form.category === c ? " is-on" : "")}
                    onClick={() => set("category", c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="adm-group">
              <span className="eyebrow">Cover photo</span>
              <label className={"adm-cover" + (form.image_url ? " has-img" : "")}>
                {form.image_url ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.image_url} alt="" />
                    <span className="adm-cover__swap">{uploading ? "Uploading…" : "Replace"}</span>
                  </>
                ) : (
                  <>
                    <Icon name={uploading ? "upload" : "image"} size={20} />
                    {uploading ? "Uploading…" : "Upload a landscape photo"}
                  </>
                )}
                <input type="file" accept="image/*" disabled={uploading} onChange={(e) => setCover(e.target.files?.[0])} />
              </label>
              <div className="form">
                <Input
                  label="Describe the photo"
                  value={form.image_alt}
                  onChange={(e) => set("image_alt", e.target.value)}
                  placeholder="Head chef plating red snapper at the grill"
                  hint="Read aloud to visitors who can't see it, and used by Google Images."
                />
              </div>
            </div>

            <div className="form">
              <Input
                label="Byline"
                value={form.author}
                onChange={(e) => set("author", e.target.value)}
                placeholder={DEFAULT_AUTHOR}
                hint="Leave as Madò Onnà, or credit the chef, bartender or writer."
              />
            </div>

            <div className="adm-group">
              <span className="eyebrow">Make a night of it</span>
              <div className="chips" aria-label="Parts of the night linked under the story">
                {ACTS.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    aria-pressed={form.related_acts.includes(a.id)}
                    className={"chip" + (form.related_acts.includes(a.id) ? " is-on" : "")}
                    onClick={() => set("related_acts", toggle(form.related_acts, a.id))}
                  >
                    {a.title}
                  </button>
                ))}
              </div>
              <span className="adm-note">Shown as cards at the end of the story, so a reader can book what they just read about.</span>
            </div>

            <div className="adm-group">
              <span className="eyebrow">Tags</span>
              <TagInput tags={form.tags} onChange={(t) => set("tags", t)} />
            </div>

            <div className="adm-group">
              <span className="eyebrow">Search & sharing</span>
              <div className="adm-serp" aria-hidden="true">
                <span className="adm-serp__url">Madò Onnà › journal › {form.slug || "…"}</span>
                <span className="adm-serp__title">{metaTitle}</span>
                <span className="adm-serp__desc">{metaDesc || "Uses the standfirst unless you write a search description."}</span>
              </div>
              <div className="form">
                <div className="adm-group">
                  <Input
                    label="Focus keyword"
                    value={form.focus_keyword}
                    onChange={(e) => set("focus_keyword", e.target.value)}
                    placeholder="mediterranean restaurant bali"
                  />
                  {checks.length > 0 && (
                    <ul className="adm-checks" role="list">
                      {checks.map((c) => (
                        <li key={c.label} className={c.ok ? "is-ok" : undefined}>
                          <Icon name={c.ok ? "check" : "minus"} size={14} />
                          {c.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <Input
                  label="Search title"
                  value={form.meta_title}
                  onChange={(e) => set("meta_title", e.target.value)}
                  placeholder="Defaults to the story title"
                  hint={`${metaTitle.length} / 60 characters`}
                />
                <Textarea
                  label="Search description"
                  rows={3}
                  value={form.meta_description}
                  onChange={(e) => set("meta_description", e.target.value)}
                  placeholder="Defaults to the standfirst"
                />
                <span className={"adm-note adm-count" + (metaDesc.length > 155 ? " is-over" : "")}>{metaDesc.length} / 155 characters</span>
                <Input
                  label="Canonical URL"
                  type="url"
                  value={form.canonical_url}
                  onChange={(e) => set("canonical_url", e.target.value)}
                  placeholder="Leave empty"
                  hint="Only when this story first ran somewhere else, like a magazine feature."
                />
              </div>
              <div className="adm-group">
                <span className="eyebrow">Rich results</span>
                <Checkbox
                  label="Article: headline, date and byline in Google"
                  checked={form.schema_types.includes("Article")}
                  onChange={() => set("schema_types", toggle(form.schema_types, "Article"))}
                />
                <Checkbox
                  label="FAQ: each heading followed by a paragraph becomes a question and answer"
                  checked={form.schema_types.includes("FAQPage")}
                  onChange={() => set("schema_types", toggle(form.schema_types, "FAQPage"))}
                />
              </div>
            </div>

            <div className="adm-group">
              <span className="eyebrow">Social share</span>
              <div className="adm-share" aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {form.image_url ? <img src={form.image_url} alt="" /> : <span className="adm-share__img" />}
                <span className="adm-share__copy">
                  <span className="adm-share__title">{form.og_title || metaTitle}</span>
                  <span className="adm-share__desc">{form.og_description || metaDesc}</span>
                </span>
              </div>
              <div className="form">
                <Input
                  label="Share title"
                  value={form.og_title}
                  onChange={(e) => set("og_title", e.target.value)}
                  placeholder="Defaults to the search title"
                  hint="How the link reads on WhatsApp, Instagram and Facebook."
                />
                <Textarea
                  label="Share description"
                  rows={2}
                  value={form.og_description}
                  onChange={(e) => set("og_description", e.target.value)}
                  placeholder="Defaults to the search description"
                />
              </div>
            </div>
          </aside>
        </form>
      </main>
    </>
  );
}

/** Tags as removable chips; Enter or comma adds one, Backspace on empty removes the last. */
function TagInput({ tags, onChange }: { tags: string[]; onChange: (t: string[]) => void }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const t = draft.trim().toLowerCase().replace(/,/g, "");
    if (t && !tags.includes(t)) onChange([...tags, t]);
    setDraft("");
  };
  return (
    <div className="adm-tags">
      {tags.map((t) => (
        <button key={t} type="button" className="chip is-on adm-tag" onClick={() => onChange(tags.filter((x) => x !== t))} aria-label={`Remove ${t}`}>
          {t}
          <Icon name="x" size={12} />
        </button>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={add}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add();
          } else if (e.key === "Backspace" && !draft && tags.length) onChange(tags.slice(0, -1));
        }}
        placeholder={tags.length ? "Add another" : "seafood, bodrum nights, berawa…"}
        aria-label="Add a tag"
      />
    </div>
  );
}
