import Link from "next/link";

const footerGroups = [
  {
    title: "Marketplace",
    links: [
      { href: "/#inventory", label: "Cars" },
      { href: "/sell", label: "Sell my car" },
      { href: "/saved", label: "Saved cars" },
      { href: "/how-it-works", label: "How it works" }
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
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" }
    ]
  }
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-about">
          <Link className="footer-brand" href="/" aria-label="FastDeal Rwanda home">
            <span className="brand-mark">F</span>
            <span>
              FastDeal
              <small>Rwanda</small>
            </span>
          </Link>
          <p>
            FastDeal Rwanda helps car owners sell faster with valuation,
            inspection, professional marketing, buyer screening, and closing support.
          </p>
          <div className="footer-actions">
            <Link className="primary-link" href="/sell">
              Sell my car
            </Link>
            <Link className="secondary-link" href="/contact">
              Contact us
            </Link>
          </div>
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
          <div className="footer-contact">
            <h2>Contact</h2>
            <p>Kigali, Rwanda</p>
            <Link href="/contact">Ask about a car</Link>
            <Link href="/sell">Submit car details</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>Copyright {year} FastDeal Rwanda. All rights reserved.</span>
        <span>Sell faster. Safely. Smartly.</span>
      </div>
    </footer>
  );
}
