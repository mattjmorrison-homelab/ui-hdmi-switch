import { Gamepad, Gamepad2, Joystick, Monitor, Tv, type LucideIcon } from 'lucide-react';

// Maps the icon name strings the backend sends (Input.icon) to the actual
// lucide-react component to render. The backend only ever names a concept
// ("tv", "monitor") — which icon library implements that stays entirely a
// frontend concern.
export const ICONS: Record<string, LucideIcon> = {
  tv: Tv,
  monitor: Monitor,
  joystick: Joystick,
  gamepad: Gamepad,
  'gamepad-2': Gamepad2,
};

export const DEFAULT_ICON: LucideIcon = Tv;
