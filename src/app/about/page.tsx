import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Mail } from "@/components/icons";
import { PageShell } from "@/components/ui/page-shell";
import { SpotlightCard } from "@/components/ui/primitives";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.name}, software and biomedical engineer.`,
  alternates: { canonical: "/about/" },
};

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="About"
      title={
        <>
          About{" "}
          <span className="font-serif font-normal italic text-gradient">
            me
          </span>
          .
        </>
      }
    >
      <SpotlightCard className="p-8 sm:p-10">
        <div className="space-y-5 text-pretty text-lg leading-relaxed text-fg/85">
          <p>
            I’m {site.name}, a software engineer and biomedical engineer. I care
            about how technology solves hard problems in science and industry.
          </p>
          <p>
            I’m pursuing an MPhil in Computer Science and Informatics,
            researching mechanistic neural networks, quantum computing and
            hardware approaches in bioinformatics. I also hold an MEng in
            Biomedical Engineering.
          </p>
          <p>
            For over four years I’ve built backend and full-stack systems across
            fintech, healthcare and various domains, with .NET/C#, Blazor and
            modern JavaScript. Today I build software for a clinic.
          </p>
          <p className="text-muted">
            Away from the keyboard, I read about where quantum mechanics meets
            deep learning, start the next project, or exploring countries.
          </p>
        </div>
      </SpotlightCard>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/#work" className="btn btn-md btn-primary group">
          View projects
          <ArrowUpRight className="transition-transform group-hover:rotate-45" />
        </Link>
        <a href={`mailto:${site.email}`} className="btn btn-md btn-secondary">
          <Mail className="text-accent" />
          Email me
        </a>
      </div>
    </PageShell>
  );
}
