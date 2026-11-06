import { Suspense } from "react";
import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="adm">
      <Suspense>{children}</Suspense>
    </div>
  );
}
