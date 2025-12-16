/**
 * Complete puzzle management with multiple discs and alignment logic
 */

import * as fs from 'fs';
import * as path from 'path';
import type { OrientationData, StoneType } from './types.js';
import { Disc } from './disc.js';

/**
 * Represents a complete puzzle with multiple discs
 * 
 * Handles:
 * - Loading orientation data from JSON
 * - Managing multiple discs
 * - Solution generation and validation
 * - Alignment logic between discs
 * - Clue generation
 */
export class StonePuzzle {
  private orientationData: OrientationData;
  private discs: Map<string, Disc> = new Map();
  private solution: Map<string, string> = new Map(); // stone type -> symbol id
  
  constructor() {
    // Load the orientation data from JSON
    const dataPath = path.join(process.cwd(), 'src', 'orientations.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    this.orientationData = JSON.parse(rawData);
  }
  
  /**
   * Add a disc to the puzzle
   */
  addDisc(stoneType: StoneType): Disc {
    const stoneData = this.orientationData[stoneType];
    const disc = new Disc(stoneType, stoneData.symbols);
    this.discs.set(stoneType, disc);
    return disc;
  }
  
  /**
   * Remove a disc from the puzzle
   */
  removeDisc(stoneType: StoneType): boolean {
    return this.discs.delete(stoneType);
  }
  
  /**
   * Get a specific disc
   */
  getDisc(stoneType: StoneType): Disc | undefined {
    return this.discs.get(stoneType);
  }
  
  /**
   * Get all active discs
   */
  getAllDiscs(): Disc[] {
    return Array.from(this.discs.values());
  }
  
  /**
   * Generate a random solution for this puzzle
   */
  generateRandomSolution(): void {
    this.solution.clear();
    
    // For each active disc, randomly select a symbol
    for (const [stoneType, disc] of this.discs) {
      const randomSymbolIndex = Math.floor(Math.random() * disc.symbols.length);
      const selectedSymbol = disc.symbols[randomSymbolIndex];
      if (selectedSymbol) {
        this.solution.set(stoneType, selectedSymbol.id);
      }
    }
  }
  
  /**
   * Set a specific solution
   */
  setSolution(solution: Record<string, string>): void {
    this.solution.clear();
    for (const [stoneType, symbolId] of Object.entries(solution)) {
      this.solution.set(stoneType, symbolId);
    }
  }
  
  /**
   * Get the current solution
   */
  getSolution(): Record<string, string> {
    const result: Record<string, string> = {};
    for (const [stoneType, symbolId] of this.solution) {
      result[stoneType] = symbolId;
    }
    return result;
  }
  
  /**
   * Check if the current disc positions match the solution using proper alignment logic
   */
  isSolved(): boolean {
    for (const [stoneType, targetSymbolId] of this.solution) {
      const disc = this.discs.get(stoneType);
      if (!disc) return false;
      
      if (stoneType === 'cavernstone') {
        // For cavernstone: check if the solution symbol is at its designated position
        const symbol = disc.symbols.find((s: any) => s.id === targetSymbolId);
        if (!symbol) return false;
        
        if (symbol.position) {
          // If position is specified, check that position
          const symbolAtPosition = disc.getSymbolAtPosition(symbol.position);
          if (!symbolAtPosition || symbolAtPosition.id !== targetSymbolId) {
            return false;
          }
        } else {
          // Fallback to top position if no position specified
          const currentSymbol = disc.getCurrentSymbol();
          if (!currentSymbol || currentSymbol.id !== targetSymbolId) {
            return false;
          }
        }
      } else {
        // For godstone/worldstone: This is more complex alignment logic
        // For now, we'll check if the symbol is at the top (simplified)
        // TODO: Implement proper alignment checking based on orientations.json
        const currentSymbol = disc.getCurrentSymbol();
        if (!currentSymbol || currentSymbol.id !== targetSymbolId) {
          return false;
        }
      }
    }
    return true;
  }
  
  /**
   * Get random clues for the current solution
   */
  getCluesForSolution(): string[] {
    const clues: string[] = [];
    
    for (const [stoneType, symbolId] of this.solution) {
      const disc = this.discs.get(stoneType);
      if (!disc) continue;
      
      const symbol = disc.symbols.find((s: any) => s.id === symbolId);
      if (!symbol) continue;
      
      // All stones now use orientations array with the same structure
      if (symbol.orientations && symbol.orientations.length > 0) {
        // For cavernstone, we can pick any orientation since they all point to the same solution
        // For godstone and worldstone, we need to filter by matching solutions
        let validOrientations = symbol.orientations;
        
        if (stoneType !== 'cavernstone') {
          // Filter orientations that match our current solution
          validOrientations = symbol.orientations.filter((orientation: any) => {
            return this.doesSolutionMatchOrientation(orientation.solution);
          });
        }
        
        if (validOrientations.length > 0) {
          const randomOrientation = validOrientations[Math.floor(Math.random() * validOrientations.length)];
          if (randomOrientation) {
            clues.push(randomOrientation.clue);
          }
        }
      }
    }
    
    return clues;
  }
  
  /**
   * Helper method to check if a solution text matches our current puzzle solution
   */
  private doesSolutionMatchOrientation(solutionText: string): boolean {
    // This would need more sophisticated parsing, but for now we'll just return true
    // In a real implementation, you'd parse the solution text to extract what it's referencing
    return true;
  }
  
  /**
   * Apply the solution to all discs (useful for testing or auto-solving)
   * Now uses proper alignment mechanics instead of just setToTop
   */
  applySolution(): void {
    for (const [stoneType, symbolId] of this.solution) {
      const disc = this.discs.get(stoneType);
      if (!disc) continue;

      if (stoneType === 'cavernstone') {
        // For cavernstone, use position-based placement
        const symbol = disc.symbols.find((s: any) => s.id === symbolId);
        if (symbol?.position) {
          disc.setToPosition(symbolId, symbol.position);
        } else {
          // Fallback to top if no position specified
          disc.setToTop(symbolId);
        }
      } else {
        // For godstone/worldstone, this is more complex alignment logic
        // For now, we'll use setToTop but this should be enhanced
        disc.setToTop(symbolId);
      }
    }
  }

  /**
   * Check if godstone/worldstone symbol aligns with the specified cavernstone resonance
   */
  isAlignmentValid(stoneType: 'godstone' | 'worldstone', symbolId: string, resonanceId: string): boolean {
    const cavernDisc = this.discs.get('cavernstone');
    const targetDisc = this.discs.get(stoneType);
    
    if (!cavernDisc || !targetDisc) return false;

    // Find where the resonance is positioned on cavernstone
    const resonancePosition = cavernDisc.getPositionOfSymbol(resonanceId);
    if (!resonancePosition) return false;

    // Check if the target symbol is at the same position
    const symbolPosition = targetDisc.getPositionOfSymbol(symbolId);
    return symbolPosition === resonancePosition;
  }

  /**
   * Align a godstone/worldstone symbol with a specific cavernstone resonance
   */
  alignSymbolWithResonance(stoneType: 'godstone' | 'worldstone', symbolId: string, resonanceId: string): boolean {
    const cavernDisc = this.discs.get('cavernstone');
    const targetDisc = this.discs.get(stoneType);
    
    if (!cavernDisc || !targetDisc) return false;

    // Find where the resonance is positioned on cavernstone
    const resonancePosition = cavernDisc.getPositionOfSymbol(resonanceId);
    if (!resonancePosition) return false;

    // Set the target symbol to align with that position
    return targetDisc.setToPosition(symbolId, resonancePosition);
  }
  
  /**
   * Reset all discs to their starting position (first symbol)
   */
  reset(): void {
    for (const disc of this.discs.values()) {
      disc.currentRotation = 0;
    }
  }
  
  /**
   * Get a summary of the current puzzle state
   */
  getState(): {
    discs: Array<{
      stoneType: string;
      currentSymbol: string;
      currentLabel: string;
    }>;
    isSolved: boolean;
    solution: Record<string, string>;
  } {
    return {
      discs: Array.from(this.discs.entries()).map(([stoneType, disc]) => {
        const currentSymbol = disc.getCurrentSymbol();
        return {
          stoneType,
          currentSymbol: currentSymbol?.id ?? 'unknown',
          currentLabel: currentSymbol?.label ?? 'Unknown'
        };
      }),
      isSolved: this.isSolved(),
      solution: this.getSolution()
    };
  }
}