"use client";

import { useEffect, useRef } from "react";
import { NeuralNetwork, type NetworkColors } from "@/lib/neural-network";

function readColors(): NetworkColors {
  const styles = getComputedStyle(document.documentElement);
  return {
    node: styles.getPropertyValue("--neural-node").trim() || "#6aa8ff",
    signal: styles.getPropertyValue("--neural-signal").trim() || "#5ee89a",
  };
}

/** Full-viewport animated network behind every page. Decorative only. */
export function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const network = new NeuralNetwork(canvas, readColors());
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => {
      if (reducedMotion.matches) {
        network.stop();
        network.renderStatic();
      } else if (document.hidden) {
        network.stop();
      } else {
        network.start();
      }
    };

    let resizeFrame = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        network.resize();
        if (reducedMotion.matches) network.renderStatic();
      });
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "mouse")
        network.setPointer(event.clientX, event.clientY);
    };
    const onPointerOut = (event: PointerEvent) => {
      if (!event.relatedTarget) network.clearPointer();
    };

    // Repaint with new colours when the theme toggles.
    const themeObserver = new MutationObserver(() => {
      network.setColors(readColors());
      if (reducedMotion.matches) network.renderStatic();
    });

    network.resize();
    sync();

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerout", onPointerOut);
    document.addEventListener("visibilitychange", sync);
    reducedMotion.addEventListener("change", sync);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      network.stop();
      cancelAnimationFrame(resizeFrame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerout", onPointerOut);
      document.removeEventListener("visibilitychange", sync);
      reducedMotion.removeEventListener("change", sync);
      themeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
