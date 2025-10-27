import { Animatronic, Location } from './types';

export const ANIMATRONICS: Animatronic[] = [
  { 
    name: 'Freddy', 
    behavior: 'sneaky', 
    speed: 8000, 
    image: 'https://cdn.poehali.dev/projects/81c66a5c-3c60-4104-b60f-3b70b1f8c23d/files/0072ce98-3fdc-48a3-9daf-c9475d7276fa.jpg'
  },
  { 
    name: 'Bonnie', 
    behavior: 'aggressive', 
    speed: 5000, 
    image: 'https://cdn.poehali.dev/projects/81c66a5c-3c60-4104-b60f-3b70b1f8c23d/files/4bd8ac2f-b259-4b2e-9717-4f8b999f25e1.jpg'
  },
  { 
    name: 'Chica', 
    behavior: 'random', 
    speed: 7000, 
    image: 'https://cdn.poehali.dev/projects/81c66a5c-3c60-4104-b60f-3b70b1f8c23d/files/920e1551-2859-487c-8841-ad90a6e4dc99.jpg'
  },
  { 
    name: 'Foxy', 
    behavior: 'fast', 
    speed: 4000, 
    image: 'https://cdn.poehali.dev/projects/81c66a5c-3c60-4104-b60f-3b70b1f8c23d/files/e952d50b-c033-429e-84f7-77b616dc3351.jpg'
  },
];

export const INITIAL_LOCATIONS: Location[] = [
  { id: 'show-stage', name: 'Show Stage', animatronic: null, camNumber: 1 },
  { id: 'dining-area', name: 'Dining Area', animatronic: null, camNumber: 2 },
  { id: 'backstage', name: 'Backstage', animatronic: null, camNumber: 3 },
  { id: 'pirate-cove', name: "Pirate Cove", animatronic: null, camNumber: 4 },
  { id: 'west-hall', name: 'West Hall', animatronic: null, camNumber: 5 },
  { id: 'west-hall-corner', name: 'West Hall Corner', animatronic: null, camNumber: 6 },
  { id: 'east-hall', name: 'East Hall', animatronic: null, camNumber: 7 },
  { id: 'east-hall-corner', name: 'East Hall Corner', animatronic: null, camNumber: 8 },
  { id: 'supply-closet', name: 'Supply Closet', animatronic: null, camNumber: 9 },
  { id: 'kitchen', name: 'Kitchen', animatronic: null, camNumber: 10 },
];

export const PATH_MAP: Record<string, string[]> = {
  'show-stage': ['dining-area', 'backstage'],
  'dining-area': ['west-hall', 'east-hall'],
  'backstage': ['west-hall'],
  'pirate-cove': ['west-hall'],
  'west-hall': ['supply-closet', 'west-hall-corner'],
  'west-hall-corner': [],
  'east-hall': ['east-hall-corner'],
  'east-hall-corner': [],
  'supply-closet': ['west-hall'],
  'kitchen': ['east-hall'],
};
