/** Shared animation constants (mirrors --ease-out-expo in globals.css). */

/** Fast start, long gentle settle: the default curve for reveals and entrances. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Snappy spring for pills/indicators that slide between items (layoutId). */
export const SPRING = { type: "spring", stiffness: 380, damping: 30 } as const;
