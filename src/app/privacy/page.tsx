import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How this website handles your data.",
  alternates: { canonical: "/privacy/" },
};

export default function PrivacyPage() {
  return (
    <Container size="narrow" className="py-16 sm:py-24">
      <PageHeader title="Privacy policy">
        <p>Last updated: November 2026</p>
      </PageHeader>
      <div className="panel space-y-5 rounded-2xl p-6 leading-relaxed text-pretty sm:p-10">
        <p>
          This website uses no tracking cookies, analytics or third-party data
          collection. Fonts and icons are served from this site, so your browser
          makes no requests to other services.
        </p>
        <p>
          Your theme choice (light or dark) is saved in your browser’s local
          storage. It never leaves your device.
        </p>
        <p>
          If you email me, your address and message are used only to reply. They
          are never shared, sold or passed to third parties.
        </p>
        <p>
          This site is hosted on GitHub Pages. See{" "}
          <a
            href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            GitHub’s privacy statement
          </a>{" "}
          for how GitHub handles server logs and IP addresses.
        </p>
      </div>
    </Container>
  );
}
