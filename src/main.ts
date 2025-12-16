import logger from './utils/logger.js';
import { PuzzleFactory } from './controller/puzzle-factory.js';


function main() {
  const puzzle = PuzzleFactory.createFullPuzzle();
  const solution = puzzle.getSolution();
  logger.info({ state: puzzle.getState(), solution }, "Initial puzzle state and solution");
  const discs = ['cavernstone', 'godstone', 'worldstone'];

  for (const discType of discs) {
    const disc = puzzle.getDisc(discType as 'cavernstone' | 'godstone' | 'worldstone');
    if (disc) {
      logger.info({ state: puzzle.getState() }, `Current state before rotating ${discType}`);
      disc.rotate(1);
      logger.info({ state: puzzle.getState() }, `State after rotating ${discType}`);
    }
  }

  // Actually solve the puzzle using proper alignment mechanics
  logger.info("Now solving the puzzle using proper alignment:");
  puzzle.applySolution(); // This uses proper positioning logic
  logger.info({ state: puzzle.getState(), isSolved: puzzle.isSolved() }, "Puzzle solved!");
}

main();