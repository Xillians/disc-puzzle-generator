/**
 * Factory for creating different types of stone puzzles
 */

import type { Cavernstone, Godstone, StoneType, Worldstone } from './types.js';
import { StonePuzzle } from './puzzle.js';

/**
 * Factory class for creating different types of puzzles
 * 
 * Provides convenient methods to create:
 * - Basic puzzles (single disc)
 * - Intermediate puzzles (two discs) 
 * - Full puzzles (three discs)
 * - Custom configurations
 */
export class PuzzleFactory {
  /**
   * Create a simple single-disc puzzle (just cavernstone)
   */
  static createBasicPuzzle(): StonePuzzle {
    const puzzle = new StonePuzzle();
    puzzle.addDisc('cavernstone');
    puzzle.generateRandomSolution();
    return puzzle;
  }
  
  /**
   * Create a two-disc puzzle (cavernstone + godstone)
   */
  static createIntermediatePuzzle(): StonePuzzle {
    const puzzle = new StonePuzzle();
    puzzle.addDisc('cavernstone');
    puzzle.addDisc('godstone');
    puzzle.generateRandomSolution();
    return puzzle;
  }
  
  /**
   * Create a full three-disc puzzle
   */
  static createFullPuzzle(): StonePuzzle {
    const puzzle = new StonePuzzle();
    puzzle.addDisc('cavernstone');
    puzzle.addDisc('godstone');
    puzzle.addDisc('worldstone');
    puzzle.generateRandomSolution();
    return puzzle;
  }
  
  /**
   * Create a puzzle with a specific configuration
   * @param stones Array of stone types to include
   * @param solution Optional predefined solution mapping
   * @return Configured StonePuzzle instance
   * 
   * Example:
   * ```ts
   * const puzzle = PuzzleFactory.createCustomPuzzle(
   * ['cavernstone', 'worldstone'],
   * { cavernstone: 'symbolA', worldstone: 'symbolB' }
   * );
   * ```
   */
  static createCustomPuzzle(
    stones: Array<StoneType>,
    solution?: Record<StoneType, Cavernstone | Godstone | Worldstone>
  ): StonePuzzle {
    const puzzle = new StonePuzzle();
    
    for (const stoneType of stones) {
      puzzle.addDisc(stoneType);
    }
    
    if (solution) {
      puzzle.setSolution(solution);
    } else {
      puzzle.generateRandomSolution();
    }
    
    return puzzle;
  }
}