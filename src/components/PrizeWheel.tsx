// src/components/PrizeWheel.tsx
import { useEffect, useRef } from 'react';
import { Prize, RARITY_COLORS } from '@/types/prizes';
import confetti from 'canvas-confetti';
import { Howl } from 'howler';

const spinSound = new Howl({ src: ['/scroll.mp3'], volume: 0.45 });
const winSound  = new Howl({ src: ['/win.mp3'],    volume: 0.9  });

/* ---------- CONFIG ---------- */
const SIZE        = 540;          // px
const FULL_ROT    = 2 * Math.PI;
const DECAY       = 0.984;        // fricţiune
const START_SPEED = 0.34;         // rad / frame (~20 RPM)
const FONT        = '600 16px "Inter",sans-serif';

/* ---------- INTERFAŢĂ ---------- */
interface Props {
  prizes: Prize[];
  selectedPrize: Prize | null;
  isSpinning: boolean;
  onSpinComplete: () => void;
}

/* =================================================================== */
export function PrizeWheel({
  prizes,
  selectedPrize,
  isSpinning,
  onSpinComplete,
}: Props) {
  const canvasRef         = useRef<HTMLCanvasElement>(null);
  const requestRef        = useRef<number>();
  const angleRef          = useRef(0);
  const speedRef          = useRef(0);
  const lastSliceIndexRef = useRef(-1);

  /* ------------- DESEN ------------- */
  function draw(ctx: CanvasRenderingContext2D) {
    const r = SIZE / 2;
    ctx.clearRect(0, 0, SIZE, SIZE);

    const slice = FULL_ROT / prizes.length;

    /* felii */
    prizes.forEach((p, i) => {
      const start = angleRef.current + i * slice;
      const end   = start + slice;

      ctx.beginPath();
      ctx.moveTo(r, r);
      ctx.arc(r, r, r - 6, start, end);      // -6 = mic padding pt bordură
      const grad = ctx.createRadialGradient(r, r, 0, r, r, r);
      grad.addColorStop(0,    `${RARITY_COLORS[p.rarity]}22`);
      grad.addColorStop(0.85, `${RARITY_COLORS[p.rarity]}`);
      grad.addColorStop(1,    `${RARITY_COLORS[p.rarity]}`);
      ctx.fillStyle = grad;
      ctx.strokeStyle = '#111';
      ctx.lineWidth   = 3;
      ctx.fill();
      ctx.stroke();

      /* text */
      ctx.save();
      ctx.translate(r, r);
      ctx.rotate(start + slice / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = FONT;
      const txt = p.name.length > 18 ? `${p.name.slice(0, 17)}…` : p.name;
      ctx.fillText(txt, r - 22, 6);          // padding spre centru
      ctx.restore();
    });

    /* inel central + “logo” simplu */
    ctx.beginPath();
    ctx.arc(r, r, 36, 0, FULL_ROT);
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 4;
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#facc15';
    ctx.font = '700 20px Inter,sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('R', r, r + 7);

    /* pointer */
    ctx.save();
    ctx.translate(r, r);
    ctx.rotate(-Math.PI / 2);
    ctx.beginPath();
    ctx.moveTo(r - 18, -12);
    ctx.lineTo(r - 18,  12);
    ctx.lineTo(r,        0);
    ctx.closePath();
    ctx.fillStyle = '#fff';
    ctx.shadowColor = '#0008';
    ctx.shadowBlur  = 5;
    ctx.fill();
    ctx.restore();
  }

  /* ------------- ANIMAŢIE ------------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = SIZE;
    canvas.height = SIZE;

    function tick() {
      angleRef.current += speedRef.current;
      speedRef.current *= DECAY;

      /* tick‑sound când trece pointerul pe altă felie */
      const slice = FULL_ROT / prizes.length;
      const idx =
        Math.floor(((FULL_ROT - (angleRef.current % FULL_ROT)) / slice)) %
        prizes.length;
      if (idx !== lastSliceIndexRef.current) {
        spinSound.play();
        lastSliceIndexRef.current = idx;
      }

      draw(ctx);

      if (speedRef.current < 0.003) {
        cancelAnimationFrame(requestRef.current!);
        confetti({ spread: 90, particleCount: 160, origin: { y: 0.2 } });
        winSound.play();
        setTimeout(onSpinComplete, 500);
        return;
      }
      requestRef.current = requestAnimationFrame(tick);
    }

    draw(ctx);

    if (isSpinning && selectedPrize) {
      /* setează viteza iniţială + un mic offset random */
      const targetIndex = prizes.findIndex(p => p.id === selectedPrize.id);
      const slice       = FULL_ROT / prizes.length;

      /* rotim astfel încât slice‑ul dorit să ajungă sub pointer */
      const targetAngle =
        FULL_ROT - (targetIndex + 0.5) * slice + (Math.random() * slice - slice / 2);
      angleRef.current = targetAngle - START_SPEED * 45; // „în urmă” ca să poată accelera
      speedRef.current = START_SPEED;
      lastSliceIndexRef.current = -1;
      requestRef.current = requestAnimationFrame(tick);
    }

    return () => cancelAnimationFrame(requestRef.current!);
  }, [isSpinning, selectedPrize, prizes]);

  return <canvas ref={canvasRef} className="rounded-full shadow-2xl" />;
}
