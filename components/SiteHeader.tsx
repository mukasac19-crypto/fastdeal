import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="FastDeal Rwanda home">
        <span className="brand-mark">F</span>
        <span>
          FastDeal
          <small>Rwanda</small>
        </span>
      </Link>
      <nav className="desktop-nav" aria-label="Primary navigation">
        <Link href="/#inventory">Buy</Link>
        <Link href="/sell">Sell</Link>
        <Link href="/how-it-works">How it works</Link>
        
      </nav>
      <div className="header-actions">
        <Link className="icon-button" href="/saved" aria-label="Saved vehicles">
          <span aria-hidden="true">S</span>
          <span className="badge">0</span>
        </Link>
    
      </div>
    </header>
  );
}
