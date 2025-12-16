/**
 * Indiana Jones Stone Alignment Puzzle System
 * 
 * Main entry point for the puzzle system with clean exports
 */

// Core classes
export { Disc } from './disc.js';
export { StonePuzzle } from './puzzle.js';
export { PuzzleFactory } from './puzzle-factory.js';
export { PositionMapper } from './position-mapper.js';

// Type definitions
export type { 
  Clue, 
  StoneSymbol, 
  StoneData, 
  OrientationData, 
  DiscPosition, 
  StoneType,
  Cavernstone,
  Godstone,
  Worldstone
} from './types.js';