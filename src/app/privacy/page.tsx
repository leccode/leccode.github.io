import type { Metadata } from "next";
import { PageShell } from "@/components/ui/page-shell";
import { SpotlightCard } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How this website handles your data.",
  alternates: { canonical: "/privacy/" },
};

export default function PrivacyPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Privacy policy"
      lede="Last updated: November 2026"
    >
      <SpotlightCard className="p-8 sm:p-10">
        <div className="space-y-5 text-pretty leading-relaxed text-fg/85">
          <p>
            This website uses no tracking cookies, analytics or third-party data
            collection. Fonts and icons are served from this site, so your
            browser makes no requests to other services.
          </p>
          <p>
            Your theme choice (light, dark or system) and accent colour are
            saved in your browser’s local storage. They never leave your device.
          </p>
          <p>
            If you email me, your address and message are used only to reply.
            They are never shared, sold or passed to third parties.
          </p>
          <p>
            This site is hosted on GitHub Pages. See{" "}
            <a
              href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              GitHub’s privacy statement
            </a>{" "}
            for how GitHub handles server logs and IP addresses.
          </p>
        </div>
      </SpotlightCard>
    </PageShell>
  );
}
