export type ViewDirection = 'center' | 'left' | 'right';

export type DoorState = {
  isOpen: boolean;
  hasAnimatronic: string | null;
};

export type Location = {
  id: string;
  name: string;
  animatronic: string | null;
  camNumber: number;
};

export type Animatronic = {
  name: string;
  behavior: 'aggressive' | 'sneaky' | 'random' | 'fast';
  speed: number;
  image: string;
};
