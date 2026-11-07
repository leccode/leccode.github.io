import type { CSSProperties } from "react";
import styles from "./CodeWindow.module.css";
import { codeSample } from "./code-sample";

/**
 * Server component. The "typing" effect is pure CSS (staggered delays),
 * so it needs no client JavaScript and the code is readable without it.
 */
const START_DELAY = 0.4;
const LINE_STEP = 0.11;

function lineDelay(index: number): string {
  // Deterministic jitter keeps server and client output identical.
  const jitter = ((index * 37) % 5) * 0.025;
  return `${(START_DELAY + index * LINE_STEP + jitter).toFixed(3)}s`;
}

export function CodeWindow() {
  const lastIndex = codeSample.length - 1;

  return (
    <figure
      className={styles.window}
      aria-label="Rust code sample: an async worker"
    >
      <div className={styles.titlebar} aria-hidden="true">
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.filename}>main.rs</span>
        <span className={styles.lang}>Rust</span>
      </div>

      <pre className={styles.body}>
        <code>
          {codeSample.map((line, index) => (
            <span
              key={index}
              className={styles.line}
              style={{ "--delay": lineDelay(index) } as CSSProperties}
            >
              <span className={styles.gutter} aria-hidden="true">
                {index + 1}
              </span>
              <span>
                {"  ".repeat(line.indent)}
                {line.tokens.map(([kind, text], tokenIndex) => (
                  <span key={tokenIndex} className={styles[kind]}>
                    {text}
                  </span>
                ))}
                {index === lastIndex && (
                  <span className={styles.cursor} aria-hidden="true" />
                )}
              </span>
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
