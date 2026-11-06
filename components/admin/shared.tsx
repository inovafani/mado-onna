"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Icon } from "@/components/ds";
import { createClient } from "@/lib/supabase/client";

export const BUCKET = "journal-images";
export const DEFAULT_AUTHOR = "Madò Onnà";

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-");

export const readingTime = (html: string) => {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
};

export const fmtDate = (iso: string | null, time = false) =>
  iso
    ? new Date(iso).toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        ...(time && { hour: "2-digit", minute: "2-digit" }),
        timeZone: "Asia/Makassar",
      })
    : "—";

/** Uploads to the public journal bucket and returns its URL. */
export async function uploadImage(file: File) {
  if (!file.type.startsWith("image/")) throw new Error("That file isn't an image.");
  if (file.size > 10 * 1024 * 1024) throw new Error("Images must be under 10 MB.");
  const supabase = createClient();
  const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${file.name.split(".").pop()}`;
  const { error } = await supabase.storage.from(BUCKET).upload(name, file);
  if (error) throw new Error(`Upload failed: ${error.message}`);
  return supabase.storage.from(BUCKET).getPublicUrl(name).data.publicUrl;
}

export function AdminBar() {
  const router = useRouter();
  async function signOut() {
    await createClient().auth.signOut();
    router.replace("/admin");
    router.refresh();
  }
  return (
    <header className="adm-bar">
      <div className="adm-bar__side">
        <Link href="/admin/journal" className="adm-bar__link">
          Stories
        </Link>
        <Link href="/journal" target="_blank" className="adm-bar__link">
          View journal <Icon name="arrow-up-right" size={14} />
        </Link>
      </div>
      <Link href="/admin/journal" className="adm-bar__brand" aria-label="Journal admin">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/mark-white-t.png" alt="" width={474} height={622} />
      </Link>
      <div className="adm-bar__side adm-bar__side--end">
        <Button size="sm" variant="ghost" onClick={signOut}>
          Sign out
        </Button>
      </div>
    </header>
  );
}
