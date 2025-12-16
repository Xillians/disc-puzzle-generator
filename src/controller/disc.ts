/**
 * Individual stone disc mechanics and positioning
 */

import type { StoneSymbol, StoneType, DiscPosition } from './types.js';
import { PositionMapper } from './position-mapper.js';

/**
 * Represents a single stone disc for the puzzle
 * 
 * Handles:
 * - Symbol rotation and positioning
 * - Converting between logical positions and disc rotations
 * - Getting current disc state
 */
export class Disc {
  public readonly stoneType: StoneType;
  public readonly symbols: StoneSymbol[];
  public currentRotation: number = 0; // 0-based index of current top symbol
  
  constructor(stoneType: StoneType, symbols: StoneSymbol[]) {
    this.stoneType = stoneType;
    this.symbols = symbols;
  }
  
  /**
   * Get the currently active symbol (the one at the top position)
   */
  getCurrentSymbol(): StoneSymbol | undefined {
    return this.symbols[this.currentRotation];
  }
  
  /**
   * Rotate the disc by a number of positions
   * @param positions Number of positions to rotate (default: 1)
   * 
   * Examples:
   * ```ts
   * // Rotate by 1 position (default)
   * disc.rotate();
   * // Rotate by 3 positions
   * disc.rotate(3);
   * ```
   */
  rotate(positions: number = 1): void {
    this.currentRotation = (this.currentRotation + positions) % this.symbols.length;
  }
  
  /**
   * EXPLICITLY set a symbol to the TOP position (12 o'clock, above the horn)
   * This is purely mechanical - it does NOT consider puzzle alignment rules
   */
  setToTop(symbolId: string): boolean {
    const index = this.symbols.findIndex(s => s.id === symbolId);
    if (index !== -1) {
      this.currentRotation = index;
      return true;
    }
    return false;
  }

  /**
   * Set a symbol to a specific position on the disc (for cavernstone positioning)
   */
  setToPosition(symbolId: string, position: DiscPosition): boolean {
    const symbolIndex = this.symbols.findIndex(s => s.id === symbolId);
    if (symbolIndex === -1) return false;

    const targetPositionIndex = PositionMapper.getPositionIndex(position);
    
    // To put symbolIndex at targetPositionIndex:
    // currentRotation + targetPositionIndex should equal symbolIndex (mod length)
    // So: currentRotation = symbolIndex - targetPositionIndex (mod length)
    this.currentRotation = (symbolIndex - targetPositionIndex + this.symbols.length) % this.symbols.length;
    return true;
  }

  /**
   * Get which symbol is currently at a specific position
   */
  getSymbolAtPosition(position: DiscPosition): StoneSymbol | undefined {
    const targetIndex = PositionMapper.getPositionIndex(position);
    const symbolIndex = (this.currentRotation + targetIndex) % this.symbols.length;
    return this.symbols[symbolIndex];
  }

  /**
   * Get the position of a specific symbol on the current disc state
   */
  getPositionOfSymbol(symbolId: string): DiscPosition | null {
    const symbolIndex = this.symbols.findIndex(s => s.id === symbolId);
    if (symbolIndex === -1) return null;

    // Calculate where this symbol currently appears relative to current rotation
    const currentPosition = (symbolIndex - this.currentRotation + this.symbols.length) % this.symbols.length;
    return PositionMapper.getPositionFromIndex(currentPosition);
  }

  /**
   * Get the symbol that appears opposite to the current one (for circular discs)
   */
  getOppositeSymbol(): StoneSymbol | null {
    if (this.symbols.length % 2 !== 0) return null; // Can't have opposite on odd number of symbols
    const oppositeIndex = (this.currentRotation + this.symbols.length / 2) % this.symbols.length;
    const opposite = this.symbols[oppositeIndex];
    return opposite ?? null;
  }
}