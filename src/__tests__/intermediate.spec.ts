import { describe, test } from "vitest";
import { PuzzleFactory } from "../controller/puzzle-factory.js";


describe("intermediate test", () => {
  test("Cavernheart and God stones", () => {
    const puzzle = PuzzleFactory.createIntermediatePuzzle();
    const state = puzzle.getState();

    if (state.discs.length !== 2) {
      test.fails("Expected two discs in the intermediate puzzle");
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
    const puzzle = PuzzleFactory.createIntermediatePuzzle();
    const initialState = puzzle.getState();
    const cavernstone = puzzle.getDisc('cavernstone');
    const godstone = puzzle.getDisc('godstone');
    if (!cavernstone) {
      test.fails("Cavernstone disc not found");
      return;
    }
    if (!godstone) {
      test.fails("Godstone disc not found");
      return;
    }

    // simulate rotating the discs iteratively one time through all symbols. At one point it should match the solution. After a full rotation it should be back to initial state.
    const totalSymbolsCavern = cavernstone.symbols.length;
    const totalSymbolsGod = godstone.symbols.length;
    let solved = false;
    for (let i = 0; i < totalSymbolsCavern; i++) {
      cavernstone.rotate(1);
      if (puzzle.isSolved()) {
        solved = true;
      }
    }
    for (let i = 0; i < totalSymbolsGod; i++) {
      godstone.rotate(1);
      if (puzzle.isSolved()) {
        solved = true;
      }
    }
    const finalState = puzzle.getState();
    const initialStateDisc = initialState.discs[0];
    const finalStateDisc = finalState.discs[0];
    if (initialStateDisc?.currentSymbol !== finalStateDisc?.currentSymbol) {
      test.fails("Disc did not return to initial state after full rotation");
    }
  });
  test("Brute force solution finding", () => {
    const puzzle = PuzzleFactory.createIntermediatePuzzle();
    const cavernstone = puzzle.getDisc('cavernstone');
    const godstone = puzzle.getDisc('godstone');
    if (!cavernstone || !godstone) {
      test.fails("Discs not found");
      return;
    }
    const totalSymbolsCavern = cavernstone.symbols.length;
    const totalSymbolsGod = godstone.symbols.length;
    let solved = false;
    for (let i = 0; i < totalSymbolsCavern; i++) {
      cavernstone.rotate(1);
      for (let j = 0; j < totalSymbolsGod; j++) {
        godstone.rotate(1);
        if (puzzle.isSolved()) {
          solved = true;
          break;
        }
      }
    }
    if (!solved) {
      throw new Error("Expected to find a solution by brute force rotation");
    }
  });
  test("Clues correspond to solution", () => {
    const puzzle = PuzzleFactory.createIntermediatePuzzle();
    const clues = puzzle.getCluesForSolution();
    const solution = puzzle.getSolution();
    // when applying the cavernstone clue and putting the disc to the corresponding symbol, at least one godstone orientation should match the solution
    // If you then do the same for the godstone clue, the cavernstone orientation should also match the solution
    const cavernstone = puzzle.getDisc('cavernstone');
    const godstone = puzzle.getDisc('godstone');
    if (!cavernstone || !godstone) {
      test.fails("Discs not found");
      return;
    }
    let cavernstoneMatches = false;
    let godstoneMatches = false;
    for (const symbol of cavernstone.symbols) {
      for (const orientation of symbol.orientations) {
        if (orientation.clue === clues[0]) {
          // this orientation corresponds to the clue, check if it matches the solution
          if (puzzle.getSolution()['cavernstone'] === symbol.id) {
            cavernstoneMatches = true;
          }
        }
      }
    }
    for (const symbol of godstone.symbols) {
      for (const orientation of symbol.orientations) {
        if (orientation.clue === clues[1]) {
          // this orientation corresponds to the clue, check if it matches the solution
          if (puzzle.getSolution()['godstone'] === symbol.id) {
            godstoneMatches = true;
          }
        }
      }
    }
  });
});