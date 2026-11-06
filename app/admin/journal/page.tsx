import type { Metadata } from "next";
import AdminPostList from "@/components/admin/AdminPostList";

export const metadata: Metadata = { title: "Journal · Admin · Madò Onnà" };

export default function Page() {
  return <AdminPostList />;
}
