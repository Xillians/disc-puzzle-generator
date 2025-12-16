# Xulgath Stone Puzzle System

A typescript implementation based on the point and click adventure Indiana Jones and the Fate of Atlantis. This creates a disc based puzzle for the fantasy setting of Pathfinder.

## 🎮 Overview

This puzzle system simulates three rotating stone discs that must be aligned according to cryptic clues to unlock ancient Xulgath temples in the Darklands. Each disc represents different aspects of the lost civilization:

- **Cavernstone**: Six Cavern Heart resonances (Life, Water, Stone, Light, Thunder, Growth)
- **Godstone**: Four ancient deities (The First Ones, Zevgavizeb, Apsu, Desna)  
- **Worldstone**: Four aspects of Vask's history (Verdant Garden, Blighted Wastes, Deep Springs, Molten Veins)

## 🏗️ Architecture

### Core Classes

- **`Disc`**: Represents a single rotating stone disc with symbols
- **`StonePuzzle`**: Manages complete multi-disc puzzles with solution validation
- **`PuzzleFactory`**: Creates different puzzle configurations for progressive gameplay

### Key Features

- ✅ **Object-oriented design** for easy puzzle management
- ✅ **Random solution generation** for replayability  
- ✅ **Progressive difficulty** (1-3 discs)
- ✅ **Multiple doors** support with independent puzzles
- ✅ **Clue system** that provides contextual hints
- ✅ **Thematic lore integration** with Pathfinder's Darklands setting

## 🚀 Quick Start

### Installation

```bash
# Clone or download the project
git clone 

# Install dependencies
pnpm install

# Build the TypeScript
pnpm run build

# Run the demo
pnpm start
```

### Basic Usage

```typescript
import { PuzzleFactory } from './disc.js';

// Create different puzzle types
const basicPuzzle = PuzzleFactory.createBasicPuzzle();      // Just cavernstone
const fullPuzzle = PuzzleFactory.createFullPuzzle();        // All three discs

// Custom puzzle for specific door
const customPuzzle = PuzzleFactory.createCustomPuzzle(
  ['cavernstone', 'godstone'], 
  { cavernstone: 'resonance_life', godstone: 'apsu' }
);

// Player interaction
const disc = puzzle.getDisc('cavernstone');
disc?.rotate(2);                           // Player rotates disc
disc?.setToSymbol('resonance_water');      // Player sets to specific symbol

// Check solution and get clues
console.log(puzzle.isSolved());            // false
console.log(puzzle.getCluesForSolution()); // Array of clue strings
```

## 🎲 Puzzle Types

### Basic Puzzle (1 Disc)
```typescript
const puzzle = PuzzleFactory.createBasicPuzzle();
// Only cavernstone - 6 possible solutions
```

### Intermediate Puzzle (2 Discs)  
```typescript
const puzzle = PuzzleFactory.createIntermediatePuzzle();
// Cavernstone + godstone - 24 possible solutions (6 × 4)
```

### Full Puzzle (3 Discs)
```typescript
const puzzle = PuzzleFactory.createFullPuzzle();
// All three discs - 96 possible solutions (6 × 4 × 4)
```

## 🎯 Game Integration

### Progressive Discovery
Perfect for campaigns where players gradually discover stones:

```typescript
// Early game: Players find just the cavernstone
let puzzle = PuzzleFactory.createBasicPuzzle();

// Mid game: Add theological complexity  
puzzle.addDisc('godstone');

// End game: Complete the Vask story
puzzle.addDisc('worldstone');
```

### Multiple Locations
Each door can have its own puzzle configuration:

```typescript
// Temple entrance - simple
const entrancePuzzle = PuzzleFactory.createBasicPuzzle();

// Inner sanctum - complex
const sanctumPuzzle = PuzzleFactory.createFullPuzzle();

// Treasure vault - custom combination
const vaultPuzzle = PuzzleFactory.createCustomPuzzle(
  ['cavernstone', 'worldstone'],
  { cavernstone: 'resonance_growth', worldstone: 'verdant_garden' }
);
```

## 🗂️ Data Structure

All puzzle data is stored in [`orientations.json`](src/orientations.json) with a unified structure:

```json
{
  "cavernstone": {
    "symbols": [
      {
        "id": "resonance_life",
        "label": "Resonance of Life",
        "orientations": [
          {
            "clue": "Life's essence flows beneath the horned marker",
            "solution": "Place the resonance of life beneath the tall horns"
          }
        ]
      }
    ]
  }
}
```

## 🎨 Lore Integration

### The Tragic History of Vask

The puzzle tells the story of the ancient Xulgath civilization:

- **Verdant Garden**: What Vask was - a paradise under the Cavern Hearts
- **Blighted Wastes**: What it became - poisoned by blightburn crystals after Aroden's "liberation"
- **Deep Springs**: What endures - hope and life in the depths
- **Molten Veins**: What shapes - the raw geological forces beneath

### Ancient Theology

The Xulgath understood cosmic forces beyond just Zevgavizeb:

- **The First Ones**: Primordial entities that shaped reality
- **Zevgavizeb**: The Ravenous King (hunger, survival)
- **Apsu**: The Waybringer (creation, freedom) 
- **Desna**: The Song of Spheres (dreams, cosmic mystery)

## 🧪 Testing

```bash
# Run tests
pnpm test

# Run specific test file
pnpm test disc.spec.ts
```

## 📁 Project Structure

```
src/
├── disc.ts              # Core puzzle classes
├── main.ts               # Demo application  
├── orientations.json     # Puzzle data
└── __tests__/
    └── disc.spec.ts      # Unit tests
```

## 🔧 Configuration

### TypeScript
- Configured for modern ES modules
- Strict type checking enabled
- Node.js types included

### Testing
- Uses Vitest for fast TypeScript testing
- Includes example test structure

## 🎪 Example Output

```
=== Xulgath Stone Puzzle System ===

Creating a full puzzle with all three stones...
Full puzzle state: {
  "discs": [
    {
      "stoneType": "cavernstone",
      "currentSymbol": "resonance_water",
      "currentLabel": "Resonance of Water"
    },
    {
      "stoneType": "godstone", 
      "currentSymbol": "desna",
      "currentLabel": "Desna"
    },
    {
      "stoneType": "worldstone",
      "currentSymbol": "molten_veins", 
      "currentLabel": "The Molten Veins"
    }
  ],
  "isSolved": false,
  "solution": {
    "cavernstone": "resonance_light",
    "godstone": "apsu", 
    "worldstone": "verdant_garden"
  }
}

Getting clues for the solution...
Clues found:
1. "Light blazes before the horned marker"
2. "Apsu's breath grants life to the worthy"  
3. "The First Ones planted seeds in paradise"
```

## 📝 License

ISC License - feel free to adapt for your own campaigns!

## 🎭 Credits

Inspired by the stone alignment puzzle from *Indiana Jones and the Fate of Atlantis* (LucasArts, 1992) and adapted for the rich lore of Paizo's Pathfinder RPG setting.
