import Image from "next/image";
import Link from "next/link";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { getGeneralWhatsAppHref } from "@/lib/whatsapp";

const whatsappDisplay = process.env.NEXT_PUBLIC_FASTDEAL_WHATSAPP_NUMBER ?? "";

const footerGroups = [
  {
    title: "Marketplace",
    links: [
      { href: "/buy", label: "Browse cars" },
      { href: "/saved", label: "Saved cars" },
      { href: "/sell", label: "Sell my car" }
    ]
  },
  {
    title: "Services",
    links: [
      { href: "/services", label: "Free valuation" },
      { href: "/services", label: "Verified fast sale" },
      { href: "/services", label: "Premium managed sale" },
      { href: "/services", label: "Find me a car" }
    ]
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About us" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/contact", label: "Contact" }
    ]
  }
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  const whatsappHref = getGeneralWhatsAppHref();
  const isExternal = whatsappHref.startsWith("http");

  return (
    <footer className="site-footer">
      <span className="footer-accent" aria-hidden="true" />

      <div className="footer-main">
        <div className="footer-about">
          <Link className="footer-brand" href="/" aria-label="FastDeal Rwanda home">
            <Image
              src="/fastdeal-logo.png"
              alt="FastDeal Rwanda"
              className="footer-brand-logo"
              width={220}
              height={56}
            />
          </Link>
          <p>
            FastDeal Rwanda helps car owners sell faster — with valuation,
            inspection, professional photos, marketing, and buyer screening.
          </p>

          <Link
            className="footer-whatsapp"
            href={whatsappHref}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noreferrer" : undefined}
          >
            <WhatsAppIcon className="whatsapp-icon" />
            <span>
              <small>Chat on WhatsApp</small>
              <strong>{whatsappDisplay || "Message us anytime"}</strong>
            </span>
          </Link>

          <ul className="footer-meta">
            <li>
              <FooterIcon name="pin" />
              Kigali, Rwanda
            </li>
            <li>
              <FooterIcon name="clock" />
              Mon – Sat, 8:00 – 18:00
            </li>
            <li>
              <FooterIcon name="shield" />
              Verified inspections
            </li>
          </ul>
        </div>

        <div className="footer-columns">
          {footerGroups.map((group) => (
            <nav className="footer-nav" key={group.title} aria-label={group.title}>
              <h2>{group.title}</h2>
              {group.links.map((link) => (
                <Link key={`${group.title}-${link.label}`} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </nav>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; {year} FastDeal Rwanda. All rights reserved.</span>
        <span className="footer-tagline">Sell faster. Safely. Smartly.</span>
      </div>
    </footer>
  );
}

function FooterIcon({ name }: { name: "pin" | "clock" | "shield" }) {
  if (name === "pin") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 2.5a7 7 0 0 0-7 7c0 4.97 7 12 7 12s7-7.03 7-12a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"
          fill="currentColor"
        />
      </svg>
    );
  }
  if (name === "clock") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19Zm0 17.3a7.8 7.8 0 1 1 0-15.6 7.8 7.8 0 0 1 0 15.6ZM12.8 7H11.2v6l5.1 3.05.8-1.32-4.3-2.55V7Z"
          fill="currentColor"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2.5 4 5v6.2c0 4.6 3.2 8.85 8 10.3 4.8-1.45 8-5.7 8-10.3V5l-8-2.5Zm-1 13.2L7.3 12l1.4-1.4 2.3 2.3 4.3-4.3 1.4 1.4L11 15.7Z"
        fill="currentColor"
      />
    </svg>
  );
}
