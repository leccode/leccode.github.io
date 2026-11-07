import { siteConfig } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { MailIcon } from "@/components/ui/Icons";

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="py-16 sm:py-24"
    >
      <Container>
        <div className="panel relative overflow-hidden rounded-3xl px-6 py-14 sm:px-12 sm:py-20">
          <h2
            id="contact-title"
            className="text-[clamp(2.25rem,6vw,4rem)] leading-[1.05] font-semibold tracking-[-0.03em] text-balance"
          >
            Let’s build something.
          </h2>
          <p className="mt-4 max-w-md text-lg text-muted">
            A project, a role or a research idea. I reply to every email.
          </p>

          <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <a
              href={`mailto:${siteConfig.email}?subject=Hello%20Constantine`}
              className="group inline-flex min-w-0 items-center gap-3 text-lg font-medium break-all text-accent sm:text-2xl"
            >
              <MailIcon className="size-6 shrink-0" />
              <span className="underline decoration-accent/40 underline-offset-4 transition-colors group-hover:decoration-accent">
                {siteConfig.email}
              </span>
            </a>
            <SocialLinks className="-ml-2 sm:ml-0" />
          </div>
        </div>
      </Container>
    </section>
  );
}
