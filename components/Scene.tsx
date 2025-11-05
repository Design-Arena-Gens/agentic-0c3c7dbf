import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import BlockComponent from './Block';

interface SceneProps {
  gameState: any;
  isPointerLocked: boolean;
}

export default function Scene({ gameState, isPointerLocked }: SceneProps) {
  const { camera, gl } = useThree();
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const rotation = useRef({ x: 0, y: 0 });
  const keys = useRef<Record<string, boolean>>({});

  useEffect(() => {
    camera.position.set(0, 5, 10);
    rotation.current.y = Math.PI;
  }, [camera]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPointerLocked) return;

      const sensitivity = gameState.gameSettings.mouseSensitivity * 0.002;
      rotation.current.y -= e.movementX * sensitivity;
      rotation.current.x -= e.movementY * sensitivity;
      rotation.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotation.current.x));
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (!isPointerLocked) return;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);

      const intersects: any[] = [];
      gameState.blocks.forEach((block: any) => {
        const box = new THREE.Box3().setFromCenterAndSize(
          new THREE.Vector3(...block.position),
          new THREE.Vector3(1, 1, 1)
        );
        const ray = raycaster.ray;
        const intersection = new THREE.Vector3();
        if (ray.intersectBox(box, intersection)) {
          const distance = camera.position.distanceTo(intersection);
          intersects.push({ distance, block, intersection });
        }
      });

      intersects.sort((a, b) => a.distance - b.distance);

      if (intersects.length > 0) {
        const closest = intersects[0];

        if (e.button === 0) {
          // Left click - destroy block
          gameState.removeBlock(closest.block.position);
        } else if (e.button === 2) {
          // Right click - place block
          const normal = new THREE.Vector3();
          const blockCenter = new THREE.Vector3(...closest.block.position);
          const diff = closest.intersection.clone().sub(blockCenter);

          // Determine which face was hit
          const absX = Math.abs(diff.x);
          const absY = Math.abs(diff.y);
          const absZ = Math.abs(diff.z);

          if (absX > absY && absX > absZ) {
            normal.set(Math.sign(diff.x), 0, 0);
          } else if (absY > absX && absY > absZ) {
            normal.set(0, Math.sign(diff.y), 0);
          } else {
            normal.set(0, 0, Math.sign(diff.z));
          }

          const newPos: [number, number, number] = [
            closest.block.position[0] + normal.x,
            closest.block.position[1] + normal.y,
            closest.block.position[2] + normal.z,
          ];

          gameState.addBlock(newPos);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    gl.domElement.addEventListener('mousemove', handleMouseMove);
    gl.domElement.addEventListener('mousedown', handleMouseDown);
    gl.domElement.addEventListener('contextmenu', (e) => e.preventDefault());

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      gl.domElement.removeEventListener('mousemove', handleMouseMove);
      gl.domElement.removeEventListener('mousedown', handleMouseDown);
    };
  }, [isPointerLocked, gameState, camera, gl]);

  useFrame((_, delta) => {
    if (!isPointerLocked) return;

    const { keybindings } = gameState.gameSettings;

    // Apply rotation
    camera.rotation.order = 'YXZ';
    camera.rotation.y = rotation.current.y;
    camera.rotation.x = rotation.current.x;

    // Movement
    direction.current.set(0, 0, 0);

    if (keys.current[keybindings.forward.toLowerCase()]) direction.current.z -= 1;
    if (keys.current[keybindings.backward.toLowerCase()]) direction.current.z += 1;
    if (keys.current[keybindings.left.toLowerCase()]) direction.current.x -= 1;
    if (keys.current[keybindings.right.toLowerCase()]) direction.current.x += 1;

    direction.current.normalize();
    direction.current.applyQuaternion(camera.quaternion);
    direction.current.y = 0;
    direction.current.normalize();

    const speed = 10;
    velocity.current.x = direction.current.x * speed * delta;
    velocity.current.z = direction.current.z * speed * delta;

    if (keys.current[keybindings.jump.toLowerCase()] && camera.position.y <= 5.5) {
      velocity.current.y = 5 * delta;
    } else {
      velocity.current.y = 0;
    }

    camera.position.add(velocity.current);

    // Keep camera above ground
    if (camera.position.y < 3) {
      camera.position.y = 3;
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <directionalLight position={[-10, 10, -5]} intensity={0.3} />

      {gameState.blocks.map((block: any, index: number) => (
        <BlockComponent
          key={`${block.position.join(',')}-${index}`}
          position={block.position}
          type={block.type}
        />
      ))}

      {/* Crosshair */}
      <mesh position={[0, 0, -2]}>
        <boxGeometry args={[0.02, 0.002, 0.001]} />
        <meshBasicMaterial color="white" />
      </mesh>
      <mesh position={[0, 0, -2]}>
        <boxGeometry args={[0.002, 0.02, 0.001]} />
        <meshBasicMaterial color="white" />
      </mesh>
    </>
  );
}
