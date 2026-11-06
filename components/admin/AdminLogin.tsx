"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Icon, Input } from "@/components/ds";
import { createClient } from "@/lib/supabase/client";

export default function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function signIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    const { error } = await createClient().auth.signInWithPassword({
      email: String(f.get("email")),
      password: String(f.get("password")),
    });
    if (error) {
      setError("That email and password don't match.");
      setBusy(false);
      return;
    }
    router.replace("/admin/journal");
    router.refresh();
  }

  return (
    <main className="adm-login">
      <div className="adm-login__card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/mark-white-t.png" alt="Madò Onnà" width={474} height={622} />
        <h1 className="h-md">
          Notes from <em className="accent">the house</em>
        </h1>
        <form className="form" onSubmit={signIn}>
          <Input label="Email" name="email" type="email" autoComplete="email" required placeholder="name@madoonna.com" />
          <Input label="Password" name="password" type="password" autoComplete="current-password" required error={error || undefined} />
          <Button variant="primary" size="lg" type="submit" block disabled={busy} iconRight={<Icon name="arrow-right" />}>
            {busy ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </main>
  );
}
