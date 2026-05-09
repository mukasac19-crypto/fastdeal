import Link from "next/link";

export function PageHeader({
  eyebrow,
  title,
  text,
  action
}: {
  eyebrow: string;
  title: string;
  text: string;
  action?: {
    href: string;
    label: string;
  };
}) {
  return (
    <section className="page-hero">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
      {action ? (
        <Link className="primary-link" href={action.href}>
          {action.label}
        </Link>
      ) : null}
    </section>
  );
}
