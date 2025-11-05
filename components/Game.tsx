'use client';

import { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGameState } from '@/hooks/useGameState';
import { usePointerLock } from '@/hooks/usePointerLock';
import Scene from './Scene';
import HUD from './HUD';
import PauseMenu from './PauseMenu';
import CraftingTable from './CraftingTable';

export default function Game() {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameState = useGameState();
  const { isPaused, setIsPaused, showCrafting, setShowCrafting, gameSettings } = gameState;

  const isPointerLocked = usePointerLock(gameContainerRef, !isPaused && !showCrafting);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === gameSettings.keybindings.pause.toLowerCase()) {
        setIsPaused((prev) => !prev);
        if (document.pointerLockElement) {
          document.exitPointerLock();
        }
      }

      if (e.key.toLowerCase() === gameSettings.keybindings.inventory.toLowerCase() && !isPaused) {
        setShowCrafting((prev) => !prev);
        if (document.pointerLockElement) {
          document.exitPointerLock();
        }
      }

      // Hotbar selection
      const numKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
      const keyIndex = numKeys.indexOf(e.key);
      if (keyIndex !== -1) {
        gameState.setSelectedSlot(keyIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameSettings.keybindings, setIsPaused, setShowCrafting, gameState]);

  // Handle pointer lock exit
  useEffect(() => {
    const handlePointerLockChange = () => {
      if (!document.pointerLockElement && !isPaused && !showCrafting) {
        // Pointer lock was lost but game is not paused
      }
    };

    document.addEventListener('pointerlockchange', handlePointerLockChange);
    return () => document.removeEventListener('pointerlockchange', handlePointerLockChange);
  }, [isPaused, showCrafting]);

  return (
    <div
      ref={gameContainerRef}
      className="w-screen h-screen relative cursor-pointer"
      style={{ background: '#87CEEB' }}
    >
      <Canvas camera={{ fov: 75, near: 0.1, far: 1000 }}>
        <Scene gameState={gameState} isPointerLocked={isPointerLocked} />
      </Canvas>

      <HUD
        playerStats={gameState.playerStats}
        inventory={gameState.inventory}
        selectedSlot={gameState.selectedSlot}
        uiScale={gameState.gameSettings.uiScale}
      />

      {isPaused && (
        <PauseMenu
          onResume={() => setIsPaused(false)}
          onSave={() => console.log('Game saved')}
          onExit={() => window.location.reload()}
          settings={gameState.gameSettings}
          onSettingsChange={gameState.updateSettings}
        />
      )}

      {showCrafting && (
        <CraftingTable
          onClose={() => setShowCrafting(false)}
          inventory={gameState.inventory}
        />
      )}

      {!isPointerLocked && !isPaused && !showCrafting && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/70 text-white px-6 py-4 rounded text-sm">
            Click to play
          </div>
        </div>
      )}
    </div>
  );
}
