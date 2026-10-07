import { person } from "@/lib/content";
import { ScrollFillText } from "./ScrollFillText";
import { ButtonLink } from "./ui";

export function Contact() {
  return (
    <div className="max-w-4xl">
      <ScrollFillText
        text="I'm looking for my first role in software or embedded systems."
        className="text-3xl leading-tight font-bold tracking-tight text-navy md:text-5xl"
      />
      <p className="mt-6 text-lg leading-relaxed text-ink">Email is the quickest way to reach me.</p>
      <a
        href={`mailto:${person.email}`}
        className="mt-6 inline-block text-2xl font-bold break-all text-navy underline decoration-navy/30 underline-offset-8 hover:decoration-navy md:text-4xl"
      >
        {person.email}
      </a>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href={person.resume} download>
          Download résumé
        </ButtonLink>
        <ButtonLink href={person.resumeEmbedded} variant="outline" download>
          Embedded version
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
    </div>
  );
}
