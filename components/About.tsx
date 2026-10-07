import QRCode from "qrcode";
import { SITE_URL, aboutSentences, motto, person, quickFacts } from "@/lib/content";
import { IdCard } from "./IdCard";
import { Reveal } from "./Reveal";
import { Accent, ButtonLink, SectionHeading } from "./ui";

export async function About() {
  // QR code for the flat card, made at build time. It points at the live résumé.
  const qrSvg = await QRCode.toString(`${SITE_URL}${person.resume}`, {
    type: "svg",
    margin: 0,
    color: { dark: "#1e2a4a", light: "#ffffff" },
  });

  return (
    <section id="about" aria-labelledby="about-heading" className="relative mx-auto max-w-6xl scroll-mt-24 px-5 md:px-8">
      <div className="grid gap-12 md:grid-cols-[1.15fr_1fr]">
        <div className="py-20 md:py-28">
          <SectionHeading id="about" label="About">
            Hi, I&apos;m <Accent>{person.firstName}.</Accent>
          </SectionHeading>
          <Reveal>
            <div className="max-w-xl space-y-4 text-lg leading-relaxed text-ink">
              {aboutSentences.map((s) => (
                <p key={s}>{s}</p>
              ))}
            </div>
            <dl className="mt-8 grid max-w-xl grid-cols-1 gap-x-6 gap-y-3 border-t border-navy/10 pt-6 sm:grid-cols-2">
              {quickFacts.map((f) => (
                <div key={f.label}>
                  <dt className="text-xs font-semibold tracking-[0.15em] text-muted uppercase">{f.label}</dt>
                  <dd className="text-base font-medium text-navy">{f.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 font-serif text-2xl text-navy italic">“{motto}”</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={person.resume} download>
                Résumé
              </ButtonLink>
              <ButtonLink href={person.github} variant="outline" external>
                GitHub
              </ButtonLink>
              {person.linkedin && (
                <ButtonLink href={person.linkedin} variant="outline" external>
                  LinkedIn
                </ButtonLink>
              )}
            </div>
          </Reveal>
        </div>

        {/* The card hangs from the top edge of the section. */}
        <div className="relative -mt-8 min-h-[520px] md:mt-0 md:min-h-[720px]">
          <IdCard resumeUrl={person.resume} qrSvg={qrSvg} />
        </div>
      </div>
    </section>
  );
}
