import Link from "next/link";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { getGeneralWhatsAppHref } from "@/lib/whatsapp";

export function WhatsAppFloat() {
  const href = getGeneralWhatsAppHref();
  const isExternal = href.startsWith("http");

  return (
    <Link
      className="whatsapp-float"
      href={href}
      aria-label="Contact FastDeal Rwanda on WhatsApp"
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
    >
      <WhatsAppIcon className="whatsapp-icon" />
    </Link>
  );
}
