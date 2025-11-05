import { useState, useCallback } from 'react';
import { Block, BlockType, PlayerStats, GameSettings, DEFAULT_KEYBINDINGS } from '@/types/game';

export const useGameState = () => {
  const [blocks, setBlocks] = useState<Block[]>(() => {
    const initialBlocks: Block[] = [];
    // Create a 20x1x20 ground plane
    for (let x = -10; x < 10; x++) {
      for (let z = -10; z < 10; z++) {
        initialBlocks.push({
          position: [x, 0, z],
          type: Math.random() > 0.7 ? 'dirt' : 'grass',
        });
      }
    }
    // Add some random blocks
    for (let i = 0; i < 30; i++) {
      const x = Math.floor(Math.random() * 20) - 10;
      const z = Math.floor(Math.random() * 20) - 10;
      const y = Math.floor(Math.random() * 3) + 1;
      const types: BlockType[] = ['stone', 'wood', 'cobblestone'];
      initialBlocks.push({
        position: [x, y, z],
        type: types[Math.floor(Math.random() * types.length)],
      });
    }
    return initialBlocks;
  });

  const [selectedSlot, setSelectedSlot] = useState(0);
  const [inventory] = useState<BlockType[]>([
    'grass',
    'dirt',
    'stone',
    'wood',
    'cobblestone',
    'sand',
    'planks',
    'leaves',
    'water',
  ]);

  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    health: 20,
    hunger: 20,
    maxHealth: 20,
    maxHunger: 20,
  });

  const [isPaused, setIsPaused] = useState(false);
  const [showCrafting, setShowCrafting] = useState(false);
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    mouseSensitivity: 0.5,
    uiScale: 1.0,
    renderDistance: 100,
    keybindings: DEFAULT_KEYBINDINGS,
  });

  const addBlock = useCallback((position: [number, number, number]) => {
    const blockExists = blocks.some(
      (b) =>
        b.position[0] === position[0] &&
        b.position[1] === position[1] &&
        b.position[2] === position[2]
    );

    if (!blockExists) {
      const newBlock: Block = {
        position,
        type: inventory[selectedSlot],
      };
      setBlocks((prev) => [...prev, newBlock]);
    }
  }, [blocks, inventory, selectedSlot]);

  const removeBlock = useCallback((position: [number, number, number]) => {
    setBlocks((prev) =>
      prev.filter(
        (b) =>
          !(
            b.position[0] === position[0] &&
            b.position[1] === position[1] &&
            b.position[2] === position[2]
          )
      )
    );
  }, []);

  const updatePlayerStats = useCallback((newStats: Partial<PlayerStats>) => {
    setPlayerStats((prev) => ({ ...prev, ...newStats }));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setGameSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  return {
    blocks,
    selectedSlot,
    setSelectedSlot,
    inventory,
    playerStats,
    updatePlayerStats,
    isPaused,
    setIsPaused,
    showCrafting,
    setShowCrafting,
    gameSettings,
    updateSettings,
    addBlock,
    removeBlock,
  };
};
