import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface MistParticlesProps {
  count?: number;
  color?: string;
}

export function MistParticles({ count = 120, color = '#ffffff' }: MistParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Cylinder distribution around can
      const theta = Math.random() * Math.PI * 2;
      const radius = 1.3 + Math.random() * 1.8;
      pos[i * 3] = Math.cos(theta) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 5.0;
      pos[i * 3 + 2] = Math.sin(theta) * radius;

      spd[i] = Math.random() * 0.4 + 0.2;
    }

    return [pos, spd];
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      // Float gently upwards
      pos[i * 3 + 1] += delta * speeds[i] * 0.5;
      // Wrap around vertically
      if (pos[i * 3 + 1] > 2.8) {
        pos[i * 3 + 1] = -2.8;
      }
      // Subtle swirl
      const x = pos[i * 3];
      const z = pos[i * 3 + 2];
      const angle = delta * 0.15;
      pos[i * 3] = x * Math.cos(angle) - z * Math.sin(angle);
      pos[i * 3 + 2] = x * Math.sin(angle) + z * Math.cos(angle);
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color={color}
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
