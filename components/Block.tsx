import { useMemo } from 'react';
import * as THREE from 'three';
import { BlockType } from '@/types/game';

interface BlockProps {
  position: [number, number, number];
  type: BlockType;
}

const blockColors: Record<BlockType, string> = {
  grass: '#5C8B3C',
  dirt: '#8B6F47',
  stone: '#7A7A7A',
  wood: '#8B5A2B',
  leaves: '#3A5F2A',
  sand: '#E5D4A6',
  water: '#4A90E2',
  cobblestone: '#6B6B6B',
  planks: '#C19A6B',
};

const blockTopColors: Record<BlockType, string | null> = {
  grass: '#7CB342',
  dirt: '#8B6F47',
  stone: '#7A7A7A',
  wood: '#654321',
  leaves: '#3A5F2A',
  sand: '#E5D4A6',
  water: '#4A90E2',
  cobblestone: '#6B6B6B',
  planks: '#C19A6B',
};

export default function BlockComponent({ position, type }: BlockProps) {
  const textures = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d')!;

    const createTexture = (baseColor: string, isTop = false) => {
      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, 16, 16);

      // Add pixel-style noise
      for (let i = 0; i < 32; i++) {
        const x = Math.floor(Math.random() * 16);
        const y = Math.floor(Math.random() * 16);
        const brightness = Math.random() * 0.2 - 0.1;
        ctx.fillStyle = adjustBrightness(baseColor, brightness);
        ctx.fillRect(x, y, 1, 1);
      }

      // Add grid lines for definition
      ctx.strokeStyle = adjustBrightness(baseColor, -0.15);
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= 16; i += 4) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 16);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(16, i);
        ctx.stroke();
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
      return texture;
    };

    const sideTexture = createTexture(blockColors[type]);
    const topTexture = blockTopColors[type]
      ? createTexture(blockTopColors[type]!)
      : sideTexture;
    const bottomTexture = createTexture(adjustBrightness(blockColors[type], -0.2));

    return [
      new THREE.MeshLambertMaterial({ map: sideTexture }), // right
      new THREE.MeshLambertMaterial({ map: sideTexture }), // left
      new THREE.MeshLambertMaterial({ map: topTexture }), // top
      new THREE.MeshLambertMaterial({ map: bottomTexture }), // bottom
      new THREE.MeshLambertMaterial({ map: sideTexture }), // front
      new THREE.MeshLambertMaterial({ map: sideTexture }), // back
    ];
  }, [type]);

  return (
    <mesh position={position} material={textures}>
      <boxGeometry args={[1, 1, 1]} />
    </mesh>
  );
}

function adjustBrightness(color: string, amount: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, ((num >> 16) & 0xff) + amount * 255));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amount * 255));
  const b = Math.max(0, Math.min(255, (num & 0xff) + amount * 255));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
