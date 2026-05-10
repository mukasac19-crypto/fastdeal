import type { ReactNode } from "react";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "FastDeal Admin",
  robots: { index: false, follow: false }
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="admin-shell">
      <AdminGate>
        <AdminSidebar />
        <div className="admin-content">{children}</div>
      </AdminGate>
    </div>
  );
}
