import * as fs from 'fs';
import * as path from 'path';
import type { OrientationData, StoneType, StoneSymbol, Clue } from './types.js';
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
  }  /**
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
      this.solution.set(stoneType, this.getRandomSymbolForDisc(disc)?.id || '');
    }
  }

  private getRandomSymbolForDisc(disc: Disc): StoneSymbol | undefined {
    const randomIndex = Math.floor(Math.random() * disc.symbols.length);
    if (disc.symbols[randomIndex]) {
      return disc.symbols[randomIndex];
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
   * Get random clues for the current solution with proper cross-disc filtering
   */
  getCluesForSolution(): string[] {
    const clues: string[] = [];
    
    for (const [stoneType, symbolId] of this.solution) {
      const disc = this.discs.get(stoneType);
      const solution = this.solution.get(stoneType);
      if (!disc || !solution) continue;
      
      const symbol = disc.symbols.find((s: any) => s.id === symbolId);
      if (!symbol || symbol.orientations.length === 0) continue;

      const clue = this.getClueForOrientation(stoneType, symbol, solution);
      if(!clue) continue;
      clues.push(clue);
    }
    
    return clues;
  }
  private getClueForOrientation(stoneType: string, symbol: StoneSymbol, solution: string): string | undefined {
      let validOrientations = symbol.orientations;
      
      if (stoneType === 'godstone') {
        validOrientations = symbol.orientations.filter((orientation: Clue) => {
          return this.doesOrientationMatchSymbol(orientation.solution, solution);
        });
      } else if (stoneType === 'worldstone') {
        validOrientations = symbol.orientations.filter((orientation: Clue) => {
          return this.doesOrientationMatchSymbol(orientation.solution, solution);
        });
      }
      
      if (validOrientations.length > 0) {
        const randomOrientation = validOrientations[Math.floor(Math.random() * validOrientations.length)];
        if (randomOrientation) {
          return randomOrientation.clue;
        }
      }
  }

  
  /**
   * Apply the solution using integrated mathematical positioning
   * This uses the target_position data directly from orientations.json with proper cross-disc logic
   */
  applySolution(): void {
    for (const [stoneType, symbolId] of this.solution) {
      const disc = this.discs.get(stoneType);
      if (!symbolId || !stoneType) continue;
      if (!disc) continue;
      const symbol = this.findSymbolById(stoneType, symbolId);
      if (!symbol || !symbol.orientations || symbol.orientations.length === 0) continue;
      const solution = this.solution.get(stoneType);
      if (!solution) continue;

      const targetPosition = this.getTargetPositionForStoneType(stoneType, symbol, solution);
      if (typeof targetPosition === 'number') {
        disc.setSymbolToPosition(symbolId, targetPosition);
      }
    }
  }
  private getTargetPositionForStoneType(stoneType: string, symbol: StoneSymbol, solution: string): number | undefined {
    if (!symbol.orientations || symbol.orientations.length === 0) return undefined;

    let targetOrientation: Clue | undefined;

    if (stoneType === 'cavernstone') {
      // Cavernstone: any orientation (they share the same target_position)
      targetOrientation = symbol.orientations[0];
    } else if (stoneType === 'godstone') {
      // Godstone: choose orientation that matches the current cavernstone solution, fallback to first
      targetOrientation = symbol.orientations.find(orientation =>
        this.doesOrientationMatchSymbol(orientation.solution, solution)
      ) || symbol.orientations[0];
    } else if (stoneType === 'worldstone') {
      // Worldstone: choose orientation that matches the current godstone solution, fallback to first
      targetOrientation = symbol.orientations.find(orientation =>
        this.doesOrientationMatchSymbol(orientation.solution, solution)
      ) || symbol.orientations[0];
    }

    if (targetOrientation && typeof targetOrientation.target_position === 'number') {
      return targetOrientation.target_position;
    }

    return undefined;
  }

  /**
   * Check if puzzle is solved by validating mathematical positioning with proper cross-disc logic
   */
  isSolved(): boolean {
    for (const [stoneType, symbolId] of this.solution) {
      const disc = this.discs.get(stoneType);
      if (!disc) return false;

      const symbol = this.findSymbolById(stoneType, symbolId);
      if (!symbol || !symbol.orientations || symbol.orientations.length === 0) return false;

      let targetOrientation;

      if (stoneType === 'cavernstone') {
        // Cavernstone: Use any orientation (they all have same target_position)
        targetOrientation = symbol.orientations[0];
      } else if (stoneType === 'godstone') {
        // Godstone: Find orientation that matches current cavernstone
        const currentCavernstone = this.solution.get('cavernstone');
        targetOrientation = symbol.orientations.find(orientation => 
          this.doesOrientationMatchSymbol(orientation.solution, currentCavernstone)
        );
      } else if (stoneType === 'worldstone') {
        // Worldstone: Find orientation that matches current godstone
        const currentGodstone = this.solution.get('godstone');
        targetOrientation = symbol.orientations.find(orientation => 
          this.doesOrientationMatchSymbol(orientation.solution, currentGodstone)
        );
      }

      if (targetOrientation && typeof targetOrientation.target_position === 'number') {
        if (!disc.isSymbolAtPosition(symbolId, targetOrientation.target_position)) {
          return false;
        }
      } else {
        // If no matching orientation found, puzzle is not solved correctly
        return false;
      }
    }
    return true;
  }

  /**
   * Helper to check if an orientation solution text matches a specific symbol
   */
  private doesOrientationMatchSymbol(solutionText: string, symbolId?: string): boolean {
    if (!symbolId) return false;
    
    const lowerSolution = solutionText.toLowerCase();
    
    // Extract the key part of the symbol ID for matching
    if (symbolId.startsWith('resonance_')) {
      const resonanceType = symbolId.split('_')[1]; // e.g., 'life', 'stone'
      return lowerSolution.includes(resonanceType || '');
    }
    
    // For gods, check if the solution mentions the god name
    const godName = symbolId.replace('_', ' '); // e.g., 'first_ones' -> 'first ones'
    return lowerSolution.includes(symbolId) || lowerSolution.includes(godName);
  }

  /**
   * Helper method to find a symbol by ID within a stone type
   */
  private findSymbolById(stoneType: string, symbolId: string): StoneSymbol | undefined {
    const stoneData = this.orientationData[stoneType as keyof OrientationData];
    if (!stoneData || !('symbols' in stoneData)) return undefined;
    return stoneData.symbols.find((s: StoneSymbol) => s.id === symbolId);
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