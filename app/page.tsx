import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { Journey } from "@/components/Journey";
import { Nav } from "@/components/Nav";
import { Skills } from "@/components/Skills";
import { Accent, Section, SectionHeading } from "@/components/ui";
import { Work } from "@/components/Work";
import {
  SITE_URL,
  achievements,
  description,
  learning,
  person,
  showAchievements,
  showLearning,
} from "@/lib/content";

// Person structured data, so search engines and AI assistants connect the site, GitHub and LinkedIn.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: person.name,
  url: SITE_URL,
  image: `${SITE_URL}/card-photo.webp`,
  email: `mailto:${person.email}`,
  jobTitle: "B.Tech ECE student (Software & Embedded)",
  description,
  alumniOf: { "@type": "CollegeOrUniversity", name: person.college },
  address: { "@type": "PostalAddress", addressLocality: "Vizianagaram", addressRegion: "Andhra Pradesh", addressCountry: "IN" },
  knowsAbout: ["C", "Python", "CAN bus", "Embedded systems", "Raspberry Pi", "ESP32", "pytest", "Next.js"],
  sameAs: [person.github, person.linkedin].filter(Boolean),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
      />
      <a
        href="#about"
        className="sr-only z-[60] rounded-full bg-navy px-4 py-2 text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <Nav />
      <main>
        <Hero />
        <About />

        <Section id="skills">
          <SectionHeading id="skills" label="Skills">
            The periodic table <Accent>of my stack.</Accent>
          </SectionHeading>
          <Skills />
        </Section>

        <Section id="work">
          <SectionHeading id="work" label="Work">
            Things <Accent>I&apos;ve built.</Accent>
          </SectionHeading>
          <Work />
        </Section>

        <Section id="journey">
          <SectionHeading id="journey" label="Journey">
            My <Accent>journey.</Accent>
          </SectionHeading>
          <Journey />
        </Section>

        {showLearning && (
          <Section id="learning">
            <SectionHeading id="learning" label="Learning">
              Always <Accent>learning.</Accent>
            </SectionHeading>
            <ul className="grid gap-4 sm:grid-cols-2">
              {learning.map((c) => (
                <li key={c.title} className="rounded-2xl border border-navy/10 bg-white/70 p-6">
                  <p className="text-lg font-bold text-navy">{c.title}</p>
                  <p className="text-muted">
                    {c.issuer} · {c.when}
                  </p>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {showAchievements && (
          <Section id="achievements">
            <SectionHeading id="achievements" label="Achievements">
              Proud <Accent>moments.</Accent>
            </SectionHeading>
            <ul className="grid gap-4 sm:grid-cols-3">
              {achievements.map((a) => (
                <li key={a.label} className="rounded-2xl border border-navy/10 bg-white/70 p-6">
                  <p className="text-5xl font-bold text-navy">{a.value}</p>
                  <p className="mt-2 text-muted">{a.label}</p>
                </li>
              ))}
            </ul>
          </Section>
        )}

        <Section id="contact">
          <SectionHeading id="contact" label="Contact">
            Let&apos;s <Accent>talk.</Accent>
          </SectionHeading>
          <Contact />
        </Section>
      </main>

      <footer className="mx-auto max-w-6xl border-t border-navy/10 px-5 py-10 text-sm text-muted md:px-8">
        <p>
          © 2026 {person.name}. Built with AI-assisted development (Claude, GitHub Copilot); every
          change reviewed and tested by me. The intro character and voice are AI-generated.
        </p>
        <p className="mt-2">
          ID card inspired by{" "}
          <a className="underline" href="https://vercel.com/blog/building-an-interactive-3d-event-badge-with-react-three-fiber">
            Vercel&apos;s 3D event badge
          </a>{" "}
          and the{" "}
          <a className="underline" href="https://reactbits.dev/components/lanyard">
            React Bits Lanyard
          </a>
          .
        </p>
      </footer>
    </>
  );
}
