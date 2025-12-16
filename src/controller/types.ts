/**
 * Core data types for the Indiana Jones stone alignment puzzle system
 */

// Types for our orientation data structure
export interface Clue {
  clue: string;
  solution: string;
}

// Position mapping for 6-sided disc relative to horn marker
export type DiscPosition = 'above' | 'below' | 'front' | 'behind' | 'left' | 'right';

export interface StoneSymbol {
  id: string;
  label: string;
  orientations: Clue[];
  // For cavernstone: where this symbol should be positioned relative to horn
  position?: DiscPosition;
  // For godstone/worldstone: what this symbol aligns with
  alignsWithResonance?: string[];
}

export interface StoneData {
  note?: string;
  symbols: StoneSymbol[];
}

export interface OrientationData {
  horn: {
    description: string;
    sample_clues: string[];
  };
  cavernstone: StoneData;
  godstone: StoneData;
  worldstone: StoneData;
}

// Common stone types used throughout the system
export type StoneType = 'cavernstone' | 'godstone' | 'worldstone';

// enum for cavernstone positions
export enum Cavernstone {
  life = 'resonance_life',
  water = 'resonance_water',
  stone = 'resonance_stone',
  light = 'resonance_light',
  thunder = 'resonance_thunder',
  growth = 'resonance_growth',
}

export enum Godstone {
  desna = 'desna',
  zevgavizeb = 'zevgavizeb',
  apsu = 'apsu',
  firstOnes = 'first_ones',
}

export enum Worldstone {
  garden = 'verdant_garden',
  wastes = 'blighted_wastes',
  springs = 'deep_springs',
  veins = 'molten_veins',
}