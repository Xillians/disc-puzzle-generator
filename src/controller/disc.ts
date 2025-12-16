/**
 * Individual stone disc mechanics and positioning
 */

import type { StoneSymbol, StoneType } from './types.js';

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
   * MATHEMATICAL POSITIONING: Set symbol to target position using index calculations
   * This is the core mathematical method that replaces setToPosition/setToTop
   */
  setSymbolToPosition(symbolId: string, targetPosition: number): boolean {
    const symbolIndex = this.symbols.findIndex(s => s.id === symbolId);
    if (symbolIndex === -1) return false;

    // Mathematical formula: currentRotation = (symbolIndex - targetPosition + discSize) % discSize
    this.currentRotation = (symbolIndex - targetPosition + this.symbols.length) % this.symbols.length;
    return true;
  }

  /**
   * MATHEMATICAL POSITIONING: Get the current position of a symbol
   * Returns the mathematical position (0-5 for cavernstone, 0-3 for others)
   */
  getSymbolPosition(symbolId: string): number | null {
    const symbolIndex = this.symbols.findIndex(s => s.id === symbolId);
    if (symbolIndex === -1) return null;

    // Calculate actual position: (symbolIndex - currentRotation + discSize) % discSize
    return (symbolIndex - this.currentRotation + this.symbols.length) % this.symbols.length;
  }

  /**
   * MATHEMATICAL POSITIONING: Check if a symbol is at the specified position
   */
  isSymbolAtPosition(symbolId: string, targetPosition: number): boolean {
    const currentPosition = this.getSymbolPosition(symbolId);
    return currentPosition === targetPosition;
  }

  /**
   * MATHEMATICAL POSITIONING: Get the symbol currently at a specific position
   */
  getSymbolAtPosition(targetPosition: number): StoneSymbol | undefined {
    const symbolIndex = (this.currentRotation + targetPosition) % this.symbols.length;
    return this.symbols[symbolIndex];
  }

  /**
   * MATHEMATICAL POSITIONING: Calculate rotation needed to place symbol at target position
   * This doesn't apply the rotation, just calculates what's needed
   */
  calculateRotationForPosition(symbolId: string, targetPosition: number): number | null {
    const symbolIndex = this.symbols.findIndex(s => s.id === symbolId);
    if (symbolIndex === -1) return null;

    return (symbolIndex - targetPosition + this.symbols.length) % this.symbols.length;
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
}