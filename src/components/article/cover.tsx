import { cn } from "@/lib/utils";

/** Generated gradient cover for an article — swap for an <Image> if you have one. */
export function ArticleCover({
  hue,
  title,
  className,
}: {
  hue: number;
  title?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("relative overflow-hidden", className)}
      style={{
        background: `radial-gradient(110% 90% at 0% 0%, oklch(0.72 0.19 ${hue} / 0.95), transparent 55%),
          radial-gradient(90% 100% at 100% 100%, oklch(0.62 0.2 ${hue + 60} / 0.9), transparent 60%),
          oklch(0.2 0.04 ${hue})`,
      }}
    >
      <div className="bg-grid absolute inset-0 opacity-50" />
      <div className="absolute -right-10 -top-10 size-48 rounded-full border border-white/20 transition-transform duration-1000 ease-out group-hover:scale-125" />
      <div className="absolute -right-2 -top-2 size-28 rounded-full border border-white/15 transition-transform duration-1000 ease-out group-hover:scale-150" />
      {title && (
        <p className="absolute bottom-5 left-5 right-5 line-clamp-2 font-serif text-2xl italic leading-tight text-white/90">
          {title}
        </p>
      )}
    </div>
  );
}
