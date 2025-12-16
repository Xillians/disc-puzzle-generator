/**
 * Utility for mapping between orientation names and disc position indices
 */

import type { DiscPosition } from './types.js';

/**
 * Utility class for mapping between orientations and disc positions
 */
export class PositionMapper {
  // Maps orientation words to disc position indices (0-5 for 6-sided disc)
  private static readonly POSITION_MAP: Record<DiscPosition, number> = {
    'above': 0,    // 12 o'clock - horn points up
    'right': 1,    // 2 o'clock  
    'front': 2,    // 4 o'clock
    'below': 3,    // 6 o'clock - opposite of horn
    'left': 4,     // 8 o'clock
    'behind': 5    // 10 o'clock
  };

  static getPositionIndex(position: DiscPosition): number {
    return this.POSITION_MAP[position];
  }

  static getPositionFromIndex(index: number): DiscPosition {
    const entries = Object.entries(this.POSITION_MAP);
    const found = entries.find(([, value]) => value === index);
    return (found?.[0] as DiscPosition) ?? 'above';
  }

  static getAllPositions(): DiscPosition[] {
    return Object.keys(this.POSITION_MAP) as DiscPosition[];
  }
}