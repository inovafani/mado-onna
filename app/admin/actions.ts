"use server";

import { updateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Admins write to Supabase from the browser; this drops the cached public journal so the change shows at once.
export async function refreshJournal() {
  const { data } = await (await createClient()).auth.getUser();
  if (!data.user) throw new Error("Unauthorized");
  updateTag("posts");
}
