/**
 * Neural network background renderer.
 *
 * Pure canvas logic with no React dependency: nodes drift, nearby nodes link,
 * and "signals" travel along links and hop onward like activations through
 * a network. The React wrapper only wires lifecycle and browser events.
 */

export type NetworkColors = {
  node: string;
  signal: string;
};

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
};

type Signal = {
  from: number;
  to: number;
  progress: number;
  speed: number;
  hops: number;
};

const MAX_DPR = 2;
const POINTER_RADIUS = 150;
const MAX_SIGNALS = 9;
const SIGNAL_INTERVAL_MS = 420;

export class NeuralNetwork {
  private readonly ctx: CanvasRenderingContext2D;
  private nodes: Node[] = [];
  private signals: Signal[] = [];
  private width = 0;
  private height = 0;
  private linkDistance = 150;
  private pointer: { x: number; y: number } | null = null;
  private rafId: number | null = null;
  private lastSignalAt = 0;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private colors: NetworkColors,
  ) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("2D canvas context is not available");
    this.ctx = ctx;
  }

  /** Matches the canvas to the viewport. Re-seeds only on real layout changes. */
  resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

    // Mobile browsers change innerHeight when the URL bar hides; don't reshuffle for that.
    const onlyToolbarChange =
      width === this.width &&
      Math.abs(height - this.height) < 140 &&
      this.nodes.length > 0;

    this.width = width;
    this.height = height;
    this.canvas.width = Math.floor(width * dpr);
    this.canvas.height = Math.floor(height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.linkDistance = width < 640 ? 115 : 150;

    if (!onlyToolbarChange) this.seed();
  }

  setColors(colors: NetworkColors): void {
    this.colors = colors;
  }

  setPointer(x: number, y: number): void {
    this.pointer = { x, y };
  }

  clearPointer(): void {
    this.pointer = null;
  }

  start(): void {
    if (this.rafId !== null) return;
    this.rafId = requestAnimationFrame(this.tick);
  }

  stop(): void {
    if (this.rafId === null) return;
    cancelAnimationFrame(this.rafId);
    this.rafId = null;
  }

  /** Draws a single still frame (used for reduced motion). */
  renderStatic(): void {
    this.signals = [];
    this.draw();
  }

  private seed(): void {
    const area = this.width * this.height;
    const count = Math.round(Math.min(Math.max(area / 15000, 30), 120));

    this.nodes = Array.from({ length: count }, () => ({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.8 + 1.2,
      alpha: Math.random() * 0.35 + 0.35,
    }));
    this.signals = [];
  }

  private readonly tick = (time: number): void => {
    this.update(time);
    this.draw();
    this.rafId = requestAnimationFrame(this.tick);
  };

  private update(time: number): void {
    for (const node of this.nodes) {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 0 || node.x > this.width) {
        node.vx *= -1;
        node.x = Math.min(Math.max(node.x, 0), this.width);
      }
      if (node.y < 0 || node.y > this.height) {
        node.vy *= -1;
        node.y = Math.min(Math.max(node.y, 0), this.height);
      }

      if (this.pointer) {
        const dx = this.pointer.x - node.x;
        const dy = this.pointer.y - node.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 0 && dist < POINTER_RADIUS) {
          const force = (POINTER_RADIUS - dist) / POINTER_RADIUS;
          node.x -= (dx / dist) * force * 2.5;
          node.y -= (dy / dist) * force * 2.5;
        }
      }
    }

    this.updateSignals(time);
  }

  private updateSignals(time: number): void {
    if (
      time - this.lastSignalAt > SIGNAL_INTERVAL_MS &&
      this.signals.length < MAX_SIGNALS
    ) {
      this.lastSignalAt = time;
      const from = Math.floor(Math.random() * this.nodes.length);
      const to = this.randomNeighbour(from);
      if (to !== null) this.signals.push(this.createSignal(from, to, 3));
    }

    const next: Signal[] = [];
    for (const signal of this.signals) {
      signal.progress += signal.speed;
      if (signal.progress < 1) {
        next.push(signal);
        continue;
      }
      // Arrived: sometimes fire onward, like an activation propagating.
      if (signal.hops > 0 && Math.random() < 0.7) {
        const onward = this.randomNeighbour(signal.to, signal.from);
        if (onward !== null)
          next.push(this.createSignal(signal.to, onward, signal.hops - 1));
      }
    }
    this.signals = next;
  }

  private createSignal(from: number, to: number, hops: number): Signal {
    return {
      from,
      to,
      progress: 0,
      speed: 0.012 + Math.random() * 0.012,
      hops,
    };
  }

  private randomNeighbour(index: number, exclude?: number): number | null {
    const origin = this.nodes[index];
    if (!origin) return null;

    const limit = this.linkDistance * this.linkDistance;
    const candidates: number[] = [];
    this.nodes.forEach((node, i) => {
      if (i === index || i === exclude) return;
      const dx = node.x - origin.x;
      const dy = node.y - origin.y;
      if (dx * dx + dy * dy < limit) candidates.push(i);
    });

    if (candidates.length === 0) return null;
    return candidates[Math.floor(Math.random() * candidates.length)] ?? null;
  }

  private draw(): void {
    const { ctx, nodes, colors } = this;
    const limit = this.linkDistance * this.linkDistance;

    ctx.clearRect(0, 0, this.width, this.height);

    // Links
    ctx.strokeStyle = colors.node;
    ctx.lineWidth = 0.8;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i]!;
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j]!;
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distSq = dx * dx + dy * dy;
        if (distSq >= limit) continue;

        ctx.globalAlpha = (1 - Math.sqrt(distSq) / this.linkDistance) * 0.38;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    // Nodes
    ctx.fillStyle = colors.node;
    for (const node of nodes) {
      ctx.globalAlpha = node.alpha;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Signals
    if (this.signals.length > 0) {
      ctx.fillStyle = colors.signal;
      ctx.shadowColor = colors.signal;
      ctx.shadowBlur = 10;
      for (const signal of this.signals) {
        const from = nodes[signal.from];
        const to = nodes[signal.to];
        if (!from || !to) continue;
        const x = from.x + (to.x - from.x) * signal.progress;
        const y = from.y + (to.y - from.y) * signal.progress;
        ctx.globalAlpha = 0.95;
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    }

    ctx.globalAlpha = 1;
  }
}
