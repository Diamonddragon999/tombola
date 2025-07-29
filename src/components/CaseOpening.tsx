import { useEffect, useRef } from "react";
import { Prize, RARITY_COLORS } from "@/types/prizes";

/**
 * CaseOpening v5 – fine‑tuned UI
 *  • **square cards & larger images**  (H = W, img ≈ 70 %)
 *  • subtle glass gradient + hover lift
 *  • onTick callback neschimbat
 */

interface Props {
  prizes: readonly Prize[];
  selected: Prize | null;
  rolling: boolean;
  onDone: () => void;
  onTick?: (idx: number) => void; // ping la fiecare card vizibil
}

const ITEMS = 60;

/* ------------------------------------------------ layout metrics */
function metrics() {
  const vw = typeof window === "undefined" ? 1920 : window.innerWidth;
  const GAP = Math.min(16, vw * 0.008);      // max 16 px
  const visible = 8;                         // câte carduri simultan
  const W = Math.floor((vw - GAP * (visible - 1)) / visible);
  const H = W;                               // pătrat → imagine mai mare

  let TXT = "text-xs";
  if (W >= 170) TXT = "text-sm";
  if (W >= 210) TXT = "text-base";
  if (W >= 250) TXT = "text-lg";

  return { W, H, GAP, TXT } as const;
}

export default function CaseOpening({ prizes, selected, rolling, onDone, onTick }: Props) {
  const railRef   = useRef<HTMLDivElement>(null);
  const wrapRef   = useRef<HTMLDivElement>(null);

  /* rebuild la (re)roll */
  useEffect(() => {
    buildRail(prizes[0]);
    if (!rolling || !selected) return;
    buildRail(selected, true).then(onDone);
    // eslint‑disable‑next‑line react-hooks/exhaustive-deps
  }, [rolling, selected]);

  /* -------------------------------------------------------------- */
  function buildRail(prize: Prize, animate = false) {
    const rail = railRef.current!;
    rail.innerHTML = "";

    const { W, H, GAP, TXT } = metrics();

    /** 1️⃣  slots random + winner */
    const slots: Prize[] = Array.from({ length: ITEMS }, () =>
      prizes[Math.floor(Math.random() * prizes.length)]
    );
    const stopIdx = Math.floor(Math.random() * ITEMS * 0.4) + ITEMS * 0.3;
    slots[stopIdx] = prize;

    /** 2️⃣  DOM paint */
    slots.forEach((p, i) => {
      const card = document.createElement("div");
      card.className = [
        "relative shrink-0 flex flex-col items-center justify-center rounded-2xl",
        "bg-gradient-to-b from-white/15 to-white/5 backdrop-blur-sm",
        "transition-transform duration-200 hover:scale-105 card-shadow select-none",
        TXT,
      ].join(" ");
      card.style.cssText += `width:${W}px;height:${H}px;margin-right:${GAP}px`;

      const bar = document.createElement("div");
      bar.className = "absolute left-0 top-0 h-full w-[6px] sm:w-[8px] rounded-l-2xl";
      bar.style.background = RARITY_COLORS[p.rarity];
      card.appendChild(bar);

      if (p.image) {
        const img = document.createElement("img");
        img.src = p.image;
        img.alt = p.name;
        img.className = "object-contain pointer-events-none mb-2 drop-shadow";
        img.style.height = `${Math.round(H * 0.7)}px`;
        card.appendChild(img);
      }

      const span = document.createElement("span");
      span.textContent = p.name;
      span.className   = "px-2 text-center leading-tight";
      card.appendChild(span);

      if (i === stopIdx) card.dataset.win = "1";
      rail.appendChild(card);
    });

    /** 3️⃣  ANIM */
    if (!animate) return Promise.resolve();

    const oneStep   = W + GAP;
    const container = wrapRef.current!;
    const travel    = (stopIdx * oneStep) + W / 2 - container.clientWidth / 2;

    const anim = rail.animate(
      [ { transform: "translateX(0)" }, { transform: `translateX(-${travel}px)` } ],
      { duration: 3800, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" }
    );

    /* tick pings */
    if (onTick) {
      const steps   = travel / oneStep;
      const stepDur = 3800 / steps;
      let n = 0;
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
      className="relative w-full overflow-hidden border-[4px] md:border-[6px] border-yellow-400 rounded-2xl bg-blue-800/30 backdrop-blur-sm mx-auto"
    >
      <div className="absolute -top-2 md:-top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[18px] md:border-l-[22px] border-r-[18px] md:border-r-[22px] border-t-[30px] md:border-t-[36px] border-l-transparent border-r-transparent border-t-red-500 neon-violet z-20" />
      <div ref={railRef} className="flex p-4 sm:p-6 md:p-8" />
    </div>
  );
}
