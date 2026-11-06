import type { Metadata } from "next";
import AdminPostForm from "@/components/admin/AdminPostForm";

export const metadata: Metadata = { title: "New story · Admin · Madò Onnà" };

export default function Page() {
  return <AdminPostForm />;
}
