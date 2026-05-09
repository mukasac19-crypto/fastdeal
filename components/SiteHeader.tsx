import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="FastDeal Rwanda home">
        <span className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 5H18V8H10V11H16V14H10V20H7V5Z" fill="white" />
            <rect x="8" y="21" width="10" height="2" rx="1" fill="#ffce00" />
          </svg>
        </span>
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
