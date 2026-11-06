import type { Metadata } from "next";
import AdminLogin from "@/components/admin/AdminLogin";

export const metadata: Metadata = { title: "Admin · Madò Onnà" };

export default function Page() {
  return <AdminLogin />;
}
