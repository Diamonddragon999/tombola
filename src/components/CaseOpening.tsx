import { useEffect, useRef } from "react";
import { Prize, RARITY_COLORS } from "@/types/prizes";

/**
 * CaseOpening v7 – readability & bigger labels
 * ------------------------------------------------
 *  • square cards, larger images
 *  • label font scales with card size (inline style)
 *  • smoother layout on very wide screens
 */

interface Props {
  prizes: readonly Prize[];
  selected: Prize | null;
  rolling: boolean;
  onDone: () => void;
  /** tick callback la fiecare card vizibil */
  onTick?: (idx: number) => void;
}

const ITEMS = 72; // 12 rotații complete (6 vizibile × 12)

/* ----------------------------- LAYOUT --------------------------- */
function metrics() {
  const vw = typeof window === "undefined" ? 1920 : window.innerWidth;
  const GAP = Math.min(24, vw * 0.008);        // max 24 px între carduri
  const SHOW = vw < 1280 ? 6 : 7;               // câte carduri vizibile
  const W = Math.floor((vw - GAP * (SHOW - 1)) / SHOW);
  const H = W;                                  // pătrat
  return { W, H, GAP } as const;
}

export default function CaseOpening({ prizes, selected, rolling, onDone, onTick }: Props) {
  const railRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  /* build rail inițial + când începe o rulare */
  useEffect(() => {
    buildRail(prizes[0]);
    if (!rolling || !selected) return;
    buildRail(selected, true).then(onDone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rolling, selected]);

  /* -------------------------------------------------------------- */
  function buildRail(prize: Prize, animate = false) {
    const rail = railRef.current!;
    rail.innerHTML = "";

    const { W, H, GAP } = metrics();

    /* 1️⃣ generează sloturi */
    const slots: Prize[] = Array.from({ length: ITEMS }, () => prizes[Math.floor(Math.random() * prizes.length)]);
    const stopIdx = Math.floor(Math.random() * ITEMS * 0.45) + ITEMS * 0.25;
    slots[stopIdx] = prize;

    /* 2️⃣ DOM paint */
    slots.forEach((p, i) => {
      const card = document.createElement("div");
      card.className =
        "relative shrink-0 flex flex-col items-center justify-center rounded-2xl " +
        "bg-gradient-to-b from-white/15 to-white/5 backdrop-blur-sm " +
        "transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg select-none";
      card.style.cssText = `width:${W}px;height:${H}px;margin-right:${GAP}px;`;

      /* bara de raritate */
      const bar = document.createElement("div");
      bar.className = "absolute left-0 top-0 h-full w-[6px] sm:w-[8px] rounded-l-2xl";
      bar.style.background = RARITY_COLORS[p.rarity];
      card.appendChild(bar);

      /* imagine */
      if (p.image) {
        const img = document.createElement("img");
        img.src = p.image;
        img.alt = p.name;
        img.className = "object-contain pointer-events-none mb-2 drop-shadow-md";
        img.style.height = `${Math.round(H * 0.7)}px`;
        card.appendChild(img);
      }

      /* etichetă */
      const span = document.createElement("span");
      span.textContent = p.name;
      span.className = "px-2 text-center leading-snug font-semibold";
      span.style.fontSize = `${Math.max(14, Math.round(W * 0.08))}px`; // min 14 px
      card.appendChild(span);

      if (i === stopIdx) card.dataset.win = "1";
      rail.appendChild(card);
    });

    /* 3️⃣ animație + tick-uri */
    if (!animate) return Promise.resolve();

    const step = metrics().W + metrics().GAP;
    const container = wrapRef.current!;
    const travel = stopIdx * step + step / 2 - container.clientWidth / 2;
    const DURATION = 4000; // ms

    const anim = rail.animate(
      [{ transform: "translateX(0)" }, { transform: `translateX(-${travel}px)` }],
      { duration: DURATION, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" }
    );

    if (onTick) {
      const steps = Math.round(travel / step);
      const stepDur = DURATION / steps;
      let n = 0;
      onTick(0);
      const id = setInterval(() => {
        n += 1;
        onTick(n);
        if (n >= steps) clearInterval(id);
      }, stepDur);
    }

    return anim.finished.then(() => {
      rail.querySelector('[data-win="1"]')?.classList.add("ring-4", "ring-yellow-300", "win-pulse");
    });
  }

  return (
    <div
      ref={wrapRef}
      className="relative w-full overflow-hidden border-[4px] md:border-[2px] border-white rounded-2xl bg-blue-800/30 backdrop-blur-sm mx-auto"
    >
      {/* marker */}
      <div className="absolute -top-2 md:-top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[16px] md:border-l-[20px] border-r-[16px] md:border-r-[20px] border-t-[28px] md:border-t-[34px] border-l-transparent border-r-transparent border-t-red-500 neon-violet z-20" />
      <div ref={railRef} className="flex p-4 sm:p-6 md:p-8" />
    </div>
  );
}