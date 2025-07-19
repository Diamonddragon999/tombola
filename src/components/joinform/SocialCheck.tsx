import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ReactNode } from 'react';

/* culoarea trebuie să fie EXACT una din keys‑urile map‑ului de mai jos   */
/*  – ca Tailwind să nu o „taie” la build; pe astea le pui la safelist!   */
const COLOR_CLASS: Record<'blue'|'pink'|'red', string> = {
  blue: 'data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600',
  pink: 'data-[state=checked]:bg-pink-600 data-[state=checked]:border-pink-600',
  red : 'data-[state=checked]:bg-red-600  data-[state=checked]:border-red-600',
};

export interface SocialProps {
  id: string;
  checked: boolean;
  tone: 'blue' | 'pink' | 'red';
  icon: ReactNode;
  text: string;
  url: string;
  onToggle: (v: boolean) => void;
}

export function SocialCheck({
  id, checked, tone, icon, text, url, onToggle,
}: SocialProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(v) => onToggle(v as boolean)}
        className={`border-white/50 rounded-sm ${COLOR_CLASS[tone]}`}
      />
      <Label
        htmlFor={id}
        className="text-white text-sm flex items-center gap-2 cursor-pointer"
      >
        {icon}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
          onClick={() => onToggle(true)}
        >
          {text}
        </a>
      </Label>
    </div>
  );
}
