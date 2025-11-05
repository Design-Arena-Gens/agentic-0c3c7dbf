import { BlockType, CraftingRecipe } from '@/types/game';
import { useState } from 'react';

interface CraftingTableProps {
  onClose: () => void;
  inventory: BlockType[];
}

const craftingRecipes: CraftingRecipe[] = [
  {
    result: 'planks',
    pattern: [
      ['wood', null, null],
      [null, null, null],
      [null, null, null],
    ],
    count: 4,
  },
  {
    result: 'cobblestone',
    pattern: [
      ['stone', 'stone', null],
      ['stone', 'stone', null],
      [null, null, null],
    ],
    count: 1,
  },
  {
    result: 'wood',
    pattern: [
      ['planks', 'planks', null],
      ['planks', 'planks', null],
      [null, null, null],
    ],
    count: 1,
  },
];

export default function CraftingTable({ onClose, inventory }: CraftingTableProps) {
  const [selectedGrid, setSelectedGrid] = useState<(BlockType | null)[][]>([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<BlockType | null>(null);

  const blockIcons: Record<BlockType, string> = {
    grass: '🟩',
    dirt: '🟫',
    stone: '⬜',
    wood: '🪵',
    leaves: '🍃',
    sand: '🟨',
    water: '💧',
    cobblestone: '⬛',
    planks: '🪚',
  };

  const handleGridClick = (row: number, col: number) => {
    if (selectedInventoryItem) {
      const newGrid = selectedGrid.map((r) => [...r]);
      newGrid[row][col] = selectedInventoryItem;
      setSelectedGrid(newGrid);
    } else {
      const newGrid = selectedGrid.map((r) => [...r]);
      newGrid[row][col] = null;
      setSelectedGrid(newGrid);
    }
  };

  const getCraftingResult = () => {
    for (const recipe of craftingRecipes) {
      let matches = true;
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          if (selectedGrid[row][col] !== recipe.pattern[row][col]) {
            matches = false;
            break;
          }
        }
        if (!matches) break;
      }
      if (matches) return recipe;
    }
    return null;
  };

  const craftingResult = getCraftingResult();

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 pointer-events-auto z-50">
      <div
        className="relative p-8"
        style={{
          background: '#3A3A3A',
          border: '4px solid #000',
          boxShadow: 'inset 0 0 0 2px #5A5A5A, 0 8px 0 #000',
          minWidth: '500px',
          imageRendering: 'pixelated',
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-xl font-bold w-8 h-8 flex items-center justify-center"
          style={{
            background: '#8B3A3A',
            border: '2px solid #000',
            boxShadow: '0 2px 0 #000',
          }}
        >
          ×
        </button>

        <h1
          className="text-white text-center mb-6"
          style={{
            fontSize: '20px',
            textShadow: '3px 3px 0 #000',
            fontFamily: 'monospace',
            fontWeight: 'bold',
          }}
        >
          CRAFTING TABLE
        </h1>

        <div className="flex gap-8 items-center justify-center">
          {/* Crafting Grid */}
          <div>
            <div className="grid grid-cols-3 gap-1 mb-4">
              {selectedGrid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleGridClick(rowIndex, colIndex)}
                    className="cursor-pointer flex items-center justify-center"
                    style={{
                      width: '56px',
                      height: '56px',
                      background: '#2A2A2A',
                      border: '2px solid #000',
                      boxShadow: 'inset 0 0 0 1px #5A5A5A',
                      imageRendering: 'pixelated',
                    }}
                  >
                    {cell && <span className="text-3xl">{blockIcons[cell]}</span>}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Arrow */}
          <div className="text-white text-3xl">→</div>

          {/* Result */}
          <div>
            <div
              className="flex items-center justify-center"
              style={{
                width: '64px',
                height: '64px',
                background: craftingResult ? '#5C8B3C' : '#2A2A2A',
                border: '3px solid #000',
                boxShadow: 'inset 0 0 0 1px #5A5A5A',
                imageRendering: 'pixelated',
              }}
            >
              {craftingResult && (
                <div className="relative">
                  <span className="text-4xl">{blockIcons[craftingResult.result]}</span>
                  <span
                    className="absolute -bottom-1 -right-1 text-white text-xs"
                    style={{
                      textShadow: '1px 1px 0 #000',
                      fontFamily: 'monospace',
                      fontWeight: 'bold',
                    }}
                  >
                    {craftingResult.count}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Inventory Selection */}
        <div className="mt-8">
          <h2
            className="text-white mb-3 text-sm"
            style={{
              textShadow: '2px 2px 0 #000',
              fontFamily: 'monospace',
            }}
          >
            SELECT MATERIAL
          </h2>
          <div className="flex gap-2 flex-wrap justify-center">
            {inventory.map((blockType, index) => (
              <div
                key={index}
                onClick={() => setSelectedInventoryItem(blockType)}
                className="cursor-pointer flex items-center justify-center"
                style={{
                  width: '48px',
                  height: '48px',
                  background: selectedInventoryItem === blockType ? '#5C8B3C' : '#3A3A3A',
                  border: selectedInventoryItem === blockType ? '3px solid #FFF' : '2px solid #000',
                  boxShadow: 'inset 0 0 0 1px #5A5A5A',
                  imageRendering: 'pixelated',
                }}
              >
                <span className="text-2xl">{blockIcons[blockType]}</span>
              </div>
            ))}
            <div
              onClick={() => setSelectedInventoryItem(null)}
              className="cursor-pointer flex items-center justify-center"
              style={{
                width: '48px',
                height: '48px',
                background: selectedInventoryItem === null ? '#8B3A3A' : '#3A3A3A',
                border: selectedInventoryItem === null ? '3px solid #FFF' : '2px solid #000',
                boxShadow: 'inset 0 0 0 1px #5A5A5A',
                imageRendering: 'pixelated',
              }}
            >
              <span className="text-2xl">🗑️</span>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-gray-400">
          <p>Press E to close</p>
        </div>
      </div>
    </div>
  );
}
