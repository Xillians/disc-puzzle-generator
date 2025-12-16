import { describe, test } from "vitest";
import { PuzzleFactory } from "../controller/puzzle-factory.js";


describe("basic test", () => {
  test("Cavernheart puzzle", () => {
    const puzzle = PuzzleFactory.createBasicPuzzle();
    const state = puzzle.getState();

    if (state.discs.length !== 1) {
      test.fails("Expected one disc in the basic puzzle");
    }

    const clues = puzzle.getCluesForSolution();
    if (clues.length === 0) {
      test.fails("Expected clues for cavernstone disc");
    }

    puzzle.applySolution();
    if (!puzzle.isSolved()) {
      test.fails("Expected the puzzle to be solved after applying the solution");
    }

    const isSolved = puzzle.isSolved();
    if (!isSolved) {
      test.fails("Expected the puzzle to be solved");
    }
  });

  test("Disc rotation works", () => {
    const puzzle = PuzzleFactory.createBasicPuzzle();
    const initialState = puzzle.getState();
    const disc = puzzle.getDisc('cavernstone');
    if (!disc) {
      test.fails("Cavernstone disc not found");
      return;
    }
    // simulate rotating the disc iteratively one time through all symbols. At one point it should match the solution. After a full rotation it should be back to initial state.
    const totalSymbols = disc.symbols.length;
    let solved = false;
    for (let i = 0; i < totalSymbols; i++) {
      disc.rotate(1);
      if (puzzle.isSolved()) {
        solved = true;
      }
    }
    const finalState = puzzle.getState();
    const wasSolved = solved;
    if (!wasSolved) {
      test.fails("Expected the puzzle to be solved at least once during full rotation");
    }
    const initialStateDisc = initialState.discs[0];
    const finalStateDisc = finalState.discs[0];
    if (initialStateDisc?.currentSymbol !== finalStateDisc?.currentSymbol) {
      test.fails("Disc did not return to initial state after full rotation");
    }
  });
});