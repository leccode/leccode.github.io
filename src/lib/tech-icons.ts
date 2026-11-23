import { allTech } from "@/data/site";

/**
 * Downloads the tech-stack icons from skillicons.dev at BUILD time and returns them as
 * data URIs, so they're baked into the static HTML: visitors' browsers never contact
 * a third-party server. If the download fails, the UI falls back to a text tile.
 */

export type TechIcon = { dark: string | null; light: string | null };
export type TechIcons = Record<string, TechIcon>;

const memo = new Map<string, Promise<string | null>>();

function fetchIcon(id: string, theme: "dark" | "light") {
  const key = `${id}:${theme}`;
  if (!memo.has(key)) {
    memo.set(
      key,
      fetch(
        `https://skillicons.dev/icons?i=${encodeURIComponent(id)}&theme=${theme}`,
        { cache: "force-cache" },
      )
        .then((res) => (res.ok ? res.text() : null))
        .then((svg) =>
          svg && svg.trimStart().startsWith("<svg")
            ? `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`
            : null,
        )
        .catch(() => null),
    );
  }
  return memo.get(key)!;
}

export async function getTechIcons(): Promise<TechIcons> {
  const entries = await Promise.all(
    allTech.map(async (t) => {
      const [dark, light] = await Promise.all([
        fetchIcon(t.icon, "dark"),
        fetchIcon(t.icon, "light"),
      ]);
      return [t.icon, { dark, light }] as const;
    }),
  );
  return Object.fromEntries(entries);
}
