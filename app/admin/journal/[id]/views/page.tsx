import type { Metadata } from "next";
import AdminPostViews from "@/components/admin/AdminPostViews";

export const metadata: Metadata = { title: "Story visitors · Admin · Madò Onnà" };

export default function Page({ params }: PageProps<"/admin/journal/[id]/views">) {
  return <AdminPostViews params={params} />;
}
