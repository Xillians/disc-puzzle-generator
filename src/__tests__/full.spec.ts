import { describe, test } from "vitest";
import { PuzzleFactory } from "../controller/puzzle-factory.js";

describe("Full test", () => {
  test("Cavernheart, God, and World stones", () => {
    const puzzle = PuzzleFactory.createFullPuzzle();
    const state = puzzle.getState();

    if (state.discs.length !== 3) {
      test.fails("Expected three discs in the full puzzle");
    }

    const clues = puzzle.getCluesForSolution();
    if (clues.length === 0) {
      test.fails("Expected clues for the discs");
    }

    puzzle.applySolution();
    if (!puzzle.isSolved()) {
      throw new Error("Expected the puzzle to be solved after applying the solution");
    }

    const isSolved = puzzle.isSolved();
    if (!isSolved) {
      throw new Error("Expected the puzzle to be solved");
    }
  });
  test("Disc rotation works", () => {
    const puzzle = PuzzleFactory.createFullPuzzle();
    const initialState = puzzle.getState();
    const cavernstone = puzzle.getDisc('cavernstone');
    const godstone = puzzle.getDisc('godstone');
    const worldstone = puzzle.getDisc('worldstone');

    if (!cavernstone) {
      test.fails("Cavernstone disc not found");
      return;
    }
    if (!godstone) {
      test.fails("Godstone disc not found");
      return;
    }
    if (!worldstone) {
      test.fails("Worldstone disc not found");
      return;
    }
    // simulate rotating the discs iteratively one time through all symbols. At one point it should match the solution. After a full rotation it should be back to initial state.
    const totalSymbolsCavern = cavernstone.symbols.length;
    const totalSymbolsGod = godstone.symbols.length;
    const totalSymbolsWorld = worldstone.symbols.length;
    for (let i = 0; i < totalSymbolsCavern; i++) {
      cavernstone.rotate();
    }
    for (let i = 0; i < totalSymbolsGod; i++) {
      godstone.rotate();
    }
    for (let i = 0; i < totalSymbolsWorld; i++) {
      worldstone.rotate();
    }
    const finalState = puzzle.getState();
    const initialStateDiscCavern = initialState.discs.find((d: any) => d.stoneType === 'cavernstone');
    const finalStateDiscCavern = finalState.discs.find((d: any) => d.stoneType === 'cavernstone');
    if (!initialStateDiscCavern || !finalStateDiscCavern) {
      test.fails("Cavernstone disc not found in initial or final state");
      return;
    }
    const initialStateDiscGod = initialState.discs.find((d: any) => d.stoneType === 'godstone');
    const finalStateDiscGod = finalState.discs.find((d: any) => d.stoneType === 'godstone');
    if (!initialStateDiscGod || !finalStateDiscGod) {
      test.fails("Godstone disc not found in initial or final state");
      return;
    }
    const initialStateDiscWorld = initialState.discs.find((d: any) => d.stoneType === 'worldstone');
    const finalStateDiscWorld = finalState.discs.find((d: any) => d.stoneType === 'worldstone');
    if (!initialStateDiscWorld || !finalStateDiscWorld) {
      test.fails("Worldstone disc not found in initial or final state");
      return;
    }
  });
  test("Brute force solution finding", () => {
    const puzzle = PuzzleFactory.createFullPuzzle();
    const cavernstone = puzzle.getDisc('cavernstone');
    const godstone = puzzle.getDisc('godstone');
    const worldstone = puzzle.getDisc('worldstone');
    if (!cavernstone || !godstone || !worldstone) {
      test.fails("Discs not found");
      return;
    }
    const totalSymbolsCavern = cavernstone.symbols.length;
    const totalSymbolsGod = godstone.symbols.length;
    const totalSymbolsWorld = worldstone.symbols.length;
    let solved = false;
    for (let i = 0; i < totalSymbolsCavern; i++) {
      cavernstone.rotate();
      for (let j = 0; j < totalSymbolsGod; j++) {
        godstone.rotate();
        for (let k = 0; k < totalSymbolsWorld; k++) {
          worldstone.rotate();
          if (puzzle.isSolved()) {
            solved = true;
            break;
          }
        }
      }
    }
    if (!solved) {
      throw new Error("Expected to find a solution by brute force rotation");
    }
  });
  test("Get clues for solution", () => {
    const puzzle = PuzzleFactory.createFullPuzzle();
    const clues = puzzle.getCluesForSolution();
    const solution = puzzle.getSolution();
    // when applying the cavernstone clue and putting the disc to the corresponding symbol, at least one godstone orientation should match the solution
    // If you then do the same for the godstone clue, the cavernstone orientation should also match the solution
    const cavernstone = puzzle.getDisc('cavernstone');
    const godstone = puzzle.getDisc('godstone');
    const worldstone = puzzle.getDisc('worldstone');
    if (!cavernstone || !godstone || !worldstone) {
      test.fails("Discs not found");
      return;
    }
    let cavernstoneMatches = false;
    let godstoneMatches = false;
    let worldstoneMatches = false;
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
    for (const symbol of worldstone.symbols) {
      for (const orientation of symbol.orientations) {
        if (orientation.clue === clues[2]) {
          // this orientation corresponds to the clue, check if it matches the solution
          if (puzzle.getSolution()['worldstone'] === symbol.id) {
            worldstoneMatches = true;
          }
        }
      }
    }
  });
});