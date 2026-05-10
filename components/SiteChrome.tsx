"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function SiteChrome({
  header,
  footer,
  whatsapp,
  children
}: {
  header: ReactNode;
  footer: ReactNode;
  whatsapp: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/kigali");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      {header}
      {children}
      {footer}
      {whatsapp}
    </>
  );
}
