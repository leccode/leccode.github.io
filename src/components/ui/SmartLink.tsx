import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { isExternalHref } from "@/lib/site";

type SmartLinkProps = ComponentPropsWithoutRef<"a"> & { href: string };

/**
 * Internal routes use next/link (prefetching, client navigation).
 * External URLs open in a new tab safely; mailto links open normally.
 */
export function SmartLink({ href, children, ...rest }: SmartLinkProps) {
  if (href.startsWith("mailto:")) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }

  if (isExternalHref(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}
