import type { ReactNode } from "react";
import styles from "./Prose.module.css";

export function Prose({ children }: { children: ReactNode }) {
  return <div className={styles.prose}>{children}</div>;
}

/** Display equation block. */
export function Equation({ children }: { children: ReactNode }) {
  return <p className={styles.equation}>{children}</p>;
}

/** Numbered citation that jumps to the matching source. */
export function Cite({ n }: { n: number }) {
  return (
    <sup>
      <a href={`#source-${n}`} aria-label={`Source ${n}`}>
        [{n}]
      </a>
    </sup>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return <p className={styles.note}>{children}</p>;
}

export const figureClassName = styles.figure;
