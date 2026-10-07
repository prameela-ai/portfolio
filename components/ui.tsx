import { sectionNumber } from "@/lib/content";

// "Hi, I'm <Accent>Prameela.</Accent>": the one italic serif word per heading.
export function Accent({ children }: { children: React.ReactNode }) {
  return <em className="font-serif font-normal italic tracking-normal">{children}</em>;
}

// Small numbered label + h2, e.g. "01 — ABOUT" / "Hi, I'm Prameela."
export function SectionHeading({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-10 md:mb-14">
      <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-muted uppercase">
        {sectionNumber(id)} — {label}
      </p>
      <h2 id={`${id}-heading`} className="text-4xl leading-[1.05] font-bold tracking-tight text-navy md:text-6xl">
        {children}
      </h2>
    </div>
  );
}

export function Section({
  id,
  children,
  className = "",
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`mx-auto max-w-6xl scroll-mt-24 px-5 py-20 md:px-8 md:py-28 ${className}`}
    >
      {children}
    </section>
  );
}

const buttonStyles = {
  solid: "bg-navy text-paper hover:bg-ink",
  outline: "border border-navy/30 text-navy hover:border-navy hover:bg-navy/5",
};

export function ButtonLink({
  href,
  children,
  variant = "solid",
  download,
  external,
}: {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof buttonStyles;
  download?: boolean;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      download={download || undefined}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-semibold transition-colors ${buttonStyles[variant]}`}
    >
      {children}
    </a>
  );
}

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-navy/15 bg-white/60 px-3 py-1 text-xs font-medium text-navy">
      {children}
    </span>
  );
}
