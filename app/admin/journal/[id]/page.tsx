import type { Metadata } from "next";
import AdminPostForm from "@/components/admin/AdminPostForm";

export const metadata: Metadata = { title: "Edit story · Admin · Madò Onnà" };

export default function Page({ params }: PageProps<"/admin/journal/[id]">) {
  return <AdminPostForm params={params} />;
}
