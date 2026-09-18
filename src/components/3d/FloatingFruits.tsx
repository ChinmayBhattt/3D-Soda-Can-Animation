import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { Flavor } from '../../utils/flavors';

// Procedural Juicy Lime Slice Texture Generator (Shared texture)
let limeTextureCache: THREE.CanvasTexture | null = null;
function getLimeTexture(flavorColor: string): THREE.CanvasTexture {
  if (limeTextureCache) return limeTextureCache;

  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const center = size / 2;
  const radius = size * 0.48;

  // 1. Dark Green Outer Rind
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.fillStyle = '#166534';
  ctx.fill();

  // Subtle zest texture on outer rind
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#14532d';
  ctx.stroke();

  // 2. Light Green / White Pith Ring
  ctx.beginPath();
  ctx.arc(center, center, radius - 14, 0, Math.PI * 2);
  ctx.fillStyle = '#f0fdf4';
  ctx.fill();

  // 3. Juicy Pulp Triangle Segments (8 segments)
  const segmentCount = 9;
  for (let i = 0; i < segmentCount; i++) {
    const angle = (i / segmentCount) * Math.PI * 2;
    const nextAngle = ((i + 0.88) / segmentCount) * Math.PI * 2;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, radius - 26, angle, nextAngle);
    ctx.closePath();

    // Radial juicy pulp gradient
    const pulpGrad = ctx.createRadialGradient(center, center, 20, center, center, radius);
    pulpGrad.addColorStop(0, '#bef264');
    pulpGrad.addColorStop(0.7, flavorColor || '#84cc16');
    pulpGrad.addColorStop(1, '#4d7c0f');
    ctx.fillStyle = pulpGrad;
    ctx.fill();

    // Vesicle / juice sac speckles
    ctx.strokeStyle = '#ecfccb';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.45;
    for (let v = 0; v < 8; v++) {
      const vR = 60 + v * 38;
      const vA = angle + Math.random() * (nextAngle - angle);
      const vx = center + Math.cos(vA) * vR;
      const vy = center + Math.sin(vA) * vR;
      ctx.beginPath();
      ctx.arc(vx, vy, 4, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  // 4. Center Core
  ctx.beginPath();
  ctx.arc(center, center, 22, 0, Math.PI * 2);
  ctx.fillStyle = '#f7fee7';
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  limeTextureCache = texture;
  return limeTextureCache;
}

// 3D Juicy Lime Slice Wheel or Wedge
function RealisticLimeSlice({
  radius = 0.85,
  thickness = 0.12,
  isWedge = false,
  flavorColor = '#a3e635',
}: {
  radius?: number;
  thickness?: number;
  isWedge?: boolean;
  flavorColor?: string;
}) {
  const texture = useMemo(() => getLimeTexture(flavorColor), [flavorColor]);

  // If wedge: half cylinder, if full: full wheel
  const arcLength = isWedge ? Math.PI * 0.85 : Math.PI * 2;

  return (
    <group dispose={null}>
      {/* Lime Body with Texture on Top & Bottom Face */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry
          args={[radius, radius, thickness, 32, 1, false, 0, arcLength]}
        />
        <meshStandardMaterial
          color="#ffffff"
          map={texture}
          roughness={0.25}
          metalness={0.08}
        />
      </mesh>
    </group>
  );
}

// 3D Organic Mint Leaf
function RealisticMintLeaf({ scale = 1 }: { scale?: number }) {
  const leafGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(-0.35, 0.3, -0.5, 0.8, -0.05, 1.4);
    shape.bezierCurveTo(0.1, 1.6, 0.1, 1.6, 0, 1.7);
    shape.bezierCurveTo(0.35, 1.4, 0.5, 0.8, 0.35, 0.3);
    shape.bezierCurveTo(0.2, 0.1, 0.05, 0.02, 0, 0);

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.015,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.005,
      bevelThickness: 0.005,
    });
  }, []);

  return (
    <group scale={scale} dispose={null}>
      <mesh geometry={leafGeometry} rotation={[-0.15, 0, 0]}>
        <meshStandardMaterial
          color="#22c55e"
          roughness={0.35}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Central Leaf Vein */}
      <mesh position={[0, 0.75, 0.012]}>
        <boxGeometry args={[0.02, 1.4, 0.015]} />
        <meshStandardMaterial color="#15803d" roughness={0.4} />
      </mesh>
    </group>
  );
}

interface FloatingFruitsProps {
  flavor: Flavor;
  scrollProgress: number;
}

export function FloatingFruits({ flavor, scrollProgress }: FloatingFruitsProps) {
  const fruit1Ref = useRef<THREE.Group>(null);
  const fruit2Ref = useRef<THREE.Group>(null);
  const fruit3Ref = useRef<THREE.Group>(null);
  const fruit4Ref = useRef<THREE.Group>(null);
  const leaf1Ref = useRef<THREE.Group>(null);
  const leaf2Ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Fruit Slices subtle bobbing and rotating (matching reference image)
    if (fruit1Ref.current) {
      fruit1Ref.current.position.y = 1.9 + Math.sin(t * 1.1) * 0.12 - scrollProgress * 0.5;
      fruit1Ref.current.rotation.x = 0.5 + Math.sin(t * 0.7) * 0.1;
      fruit1Ref.current.rotation.z = -0.4 + Math.cos(t * 0.6) * 0.1;
    }

    if (fruit2Ref.current) {
      fruit2Ref.current.position.y = 0.9 + Math.cos(t * 1.3) * 0.1 - scrollProgress * 0.7;
      fruit2Ref.current.rotation.y += delta * 0.2;
    }

    if (fruit3Ref.current) {
      fruit3Ref.current.position.y = -1.6 + Math.sin(t * 1.4 + 1) * 0.14 - scrollProgress * 0.8;
      fruit3Ref.current.rotation.z = -0.6 + Math.cos(t * 0.9) * 0.12;
    }

    if (fruit4Ref.current) {
      fruit4Ref.current.position.y = -2.1 + Math.cos(t * 1.2 + 2) * 0.12 - scrollProgress * 1.0;
      fruit4Ref.current.rotation.y -= delta * 0.18;
    }

    // Mint leaf flutter
    if (leaf1Ref.current) {
      leaf1Ref.current.position.y = 0.1 + Math.sin(t * 1.5) * 0.1 - scrollProgress * 0.6;
      leaf1Ref.current.rotation.z = 0.6 + Math.sin(t * 1.2) * 0.12;
    }

    if (leaf2Ref.current) {
      leaf2Ref.current.position.y = -0.5 + Math.cos(t * 1.4) * 0.1 - scrollProgress * 0.8;
    }
  });

  return (
    <group dispose={null}>
      {/* 1. Top-Left Lime Wheel (matching reference image) */}
      <group
        ref={fruit1Ref}
        position={[-1.9, 1.9, -0.4]}
        rotation={[0.5, 0.3, -0.4]}
        scale={0.9}
      >
        <RealisticLimeSlice radius={0.9} thickness={0.14} flavorColor={flavor.color} />
      </group>

      {/* 2. Top-Right Lime Wedge (matching reference image) */}
      <group
        ref={fruit2Ref}
        position={[2.0, 0.9, -0.5]}
        rotation={[-0.3, -0.5, 0.7]}
        scale={0.8}
      >
        <RealisticLimeSlice radius={0.85} thickness={0.12} isWedge={true} flavorColor={flavor.color} />
      </group>

      {/* 3. Bottom-Left Lime Wedge (matching reference image) */}
      <group
        ref={fruit3Ref}
        position={[-2.1, -1.6, 0.3]}
        rotation={[0.4, 0.2, -1.0]}
        scale={0.82}
      >
        <RealisticLimeSlice radius={0.8} thickness={0.12} isWedge={true} flavorColor={flavor.color} />
      </group>

      {/* 4. Bottom-Right Lime Slice (matching reference image) */}
      <group
        ref={fruit4Ref}
        position={[1.7, -2.1, 0.1]}
        rotation={[-0.5, 0.2, 0.3]}
        scale={0.88}
      >
        <RealisticLimeSlice radius={0.92} thickness={0.14} flavorColor={flavor.color} />
      </group>

      {/* 5. Center-Right Main Mint Leaf (matching reference image) */}
      <group
        ref={leaf1Ref}
        position={[1.3, 0.1, 0.7]}
        rotation={[0.3, -0.4, 0.6]}
        scale={0.9}
      >
        <RealisticMintLeaf scale={0.75} />
      </group>

      {/* 6. Secondary Mint Leaf */}
      <group
        ref={leaf2Ref}
        position={[1.6, -0.5, 0.3]}
        rotation={[0.2, 0.6, -0.3]}
        scale={0.65}
      >
        <RealisticMintLeaf scale={0.6} />
      </group>

      {/* Floating Water Droplet Beads */}
      {Array.from({ length: 14 }).map((_, i) => {
        const theta = (i / 14) * Math.PI * 2;
        const dist = 1.7 + (i % 3) * 0.4;
        const y = -1.8 + (i % 7) * 0.6;
        const x = Math.cos(theta) * dist;
        const z = Math.sin(theta) * dist * 0.6;
        const size = 0.035 + (i % 3) * 0.02;

        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[size, 6, 6]} />
            <meshStandardMaterial
              color="#ffffff"
              roughness={0.08}
              metalness={0.2}
              transparent
              opacity={0.75}
            />
          </mesh>
        );
      })}
    </group>
  );
}
