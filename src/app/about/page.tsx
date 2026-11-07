import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata: Metadata = {
  title: "About",
  description: `About ${siteConfig.name}, software and biomedical engineer.`,
  alternates: { canonical: "/about/" },
};

export default function AboutPage() {
  return (
    <Container size="narrow" className="py-16 sm:py-24">
      <PageHeader title="About me" />
      <div className="panel space-y-5 rounded-2xl p-6 text-lg leading-relaxed text-pretty sm:p-10">
        <p>
          I’m Constantine Lekkos, a software engineer and biomedical engineer. I
          care about how technology solves hard problems in science and
          industry.
        </p>
        <p>
          I’m pursuing an MPhil in Computer Science and Informatics, researching
          mechanistic neural networks, quantum computing and hardware approaches
          in bioinformatics. I also hold an MEng in Biomedical Engineering.
        </p>
        <p>
          For over four years I’ve built backend and full-stack production
          systems across fintech and healthcare, with .NET/C#, Blazor, Rust and
          modern JavaScript. Today I build software for a clinic.
        </p>
        <p className="text-muted">
          Away from the keyboard, I read about where quantum mechanics meets
          deep learning, or start the next project.
        </p>
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href="/#projects">View projects</ButtonLink>
        <ButtonLink href={`mailto:${siteConfig.email}`} variant="secondary">
          Email me
        </ButtonLink>
      </div>
    </Container>
  );
}
