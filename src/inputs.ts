import { Apple, Gamepad, Gamepad2, Joystick, Tv } from 'lucide-react';
import type { HdmiInput } from './graphql/generated';

export interface InputMeta {
  value: HdmiInput;
  label: string;
  icon: typeof Tv;
}

// Fixed, known set of switch inputs in physical port order. Kept as an
// explicit list (rather than derived from the generated enum) so display
// order and labels are controlled independently of schema ordering.
export const INPUTS: InputMeta[] = [
  { value: 'GOOGLE_TV', label: 'Google TV', icon: Tv },
  { value: 'APPLE_TV', label: 'Apple TV', icon: Apple },
  { value: 'PS3', label: 'PS3', icon: Gamepad },
  { value: 'PS4', label: 'PS4', icon: Gamepad2 },
  { value: 'SWITCH', label: 'Switch', icon: Joystick },
];
