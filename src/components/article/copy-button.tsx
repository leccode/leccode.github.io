"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, Copy } from "../icons";

export function CopyButton({
  text,
  label = "Copy code",
  className,
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label={label}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {}
      }}
      className={cn(
        "rounded-md p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white",
        className,
      )}
    >
      {copied ? (
        <Check width={14} height={14} className="text-emerald-400" />
      ) : (
        <Copy width={14} height={14} />
      )}
    </button>
  );
}

export function ShareButtons() {
  const [copied, setCopied] = useState(false);
  const btn = "btn btn-sm btn-secondary text-muted hover:text-fg";

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        className={btn}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(
              window.location.href.split("#")[0],
            );
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
          } catch {}
        }}
      >
        {copied ? (
          <Check width={15} height={15} className="text-emerald-500" />
        ) : (
          <Copy width={15} height={15} />
        )}
        {copied ? "Link copied" : "Copy link"}
      </button>
      <button
        type="button"
        className={btn}
        onClick={() => {
          const url = encodeURIComponent(window.location.href.split("#")[0]);
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
            "_blank",
            "noopener,noreferrer",
          );
        }}
      >
        Share on LinkedIn
      </button>
    </div>
  );
}
