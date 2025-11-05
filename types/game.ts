export type BlockType = 'grass' | 'dirt' | 'stone' | 'wood' | 'leaves' | 'sand' | 'water' | 'cobblestone' | 'planks';

export interface Block {
  position: [number, number, number];
  type: BlockType;
}

export interface PlayerStats {
  health: number;
  hunger: number;
  maxHealth: number;
  maxHunger: number;
}

export interface GameSettings {
  mouseSensitivity: number;
  uiScale: number;
  renderDistance: number;
  keybindings: KeyBindings;
}

export interface KeyBindings {
  forward: string;
  backward: string;
  left: string;
  right: string;
  jump: string;
  crouch: string;
  inventory: string;
  pause: string;
  slot1: string;
  slot2: string;
  slot3: string;
  slot4: string;
  slot5: string;
  slot6: string;
  slot7: string;
  slot8: string;
  slot9: string;
}

export const DEFAULT_KEYBINDINGS: KeyBindings = {
  forward: 'w',
  backward: 's',
  left: 'a',
  right: 'd',
  jump: ' ',
  crouch: 'Shift',
  inventory: 'e',
  pause: 'Escape',
  slot1: '1',
  slot2: '2',
  slot3: '3',
  slot4: '4',
  slot5: '5',
  slot6: '6',
  slot7: '7',
  slot8: '8',
  slot9: '9',
};

export interface CraftingRecipe {
  result: BlockType;
  pattern: (BlockType | null)[][];
  count: number;
}
