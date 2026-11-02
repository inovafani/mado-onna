import type { ReactNode } from "react";
import Preloader from "@/components/Preloader";
import SmoothScroll from "@/components/SmoothScroll";
import Motion from "@/components/Motion";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

/** Chrome shared by every page. Each route mounts its own copy, so scroll and motion start fresh per page. */
export default function PageShell({ current, children }: { current: string; children: ReactNode }) {
  return (
    <div className="shell">
      <SmoothScroll />
      <Preloader />
      <div className="page">
        <SiteNav current={current} />
        <main>{children}</main>
        <SiteFooter />
      </div>
      {/* Last, so every section is mounted before scroll triggers are measured. */}
      <Motion />
    </div>
  );
}
