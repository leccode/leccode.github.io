import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Experience } from "@/components/experience";
import { Hero } from "@/components/hero";
import { LatestArticles } from "@/components/latest-articles";
import { Projects } from "@/components/projects";
import { getTechIcons } from "@/lib/tech-icons";

export default async function Home() {
  const icons = await getTechIcons();

  return (
    <>
      <main id="main" tabIndex={-1} className="relative z-1">
        <Hero />
        <Projects />
        <About icons={icons} />
        <Experience />
        <LatestArticles />
        <Contact />
      </main>
    </>
  );
}
