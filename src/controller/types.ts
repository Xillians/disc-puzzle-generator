/**
 * Core data types for the Indiana Jones stone alignment puzzle system
 */

// Types for our orientation data structure
export interface Clue {
  clue: string;
  solution: string;
  target_position: number; // Mathematical index position for this clue
}

// Position mapping for 6-sided disc relative to horn marker
export enum DiscPosition {
  /** Position 0: Above the horn */
  Above = 0,
  /** Position 1: In front of the horn */
  Front = 1,
  /** Position 2: Behind the horn */
  Behind = 2,
  /** Position 3: Below the horn */
  Below = 3,
  /** Position 4: Left of the horn */
  Left = 4,
  /** Position 5: Right of the horn */
  Right = 5,
}

export interface StoneSymbol {
  id: string;
  label: string;
  index: number; // Mathematical index position of this symbol
  orientations: Clue[];
  // For cavernstone: where this symbol should be positioned relative to horn
  position?: DiscPosition;
  // For godstone/worldstone: what this symbol aligns with
  alignsWithResonance?: string[];
}

export interface StoneData {
  note?: string;
  symbols: StoneSymbol[];
  target_positions?: DiscPosition[];
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