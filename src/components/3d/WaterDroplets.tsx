import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface WaterDropletsProps {
  count?: number;
  canRadius?: number;
  canHeight?: number;
}

export function WaterDroplets({
  count = 140,
  canRadius = 0.85,
  canHeight = 3.3,
}: WaterDropletsProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Generate deterministic pseudo-random droplets around cylinder
  const dropletData = useMemo(() => {
    const dummy = new THREE.Object3D();
    const data: { position: THREE.Vector3; scale: THREE.Vector3; rotation: THREE.Euler }[] = [];

    // Simple deterministic LCG random generator
    let seed = 42;
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    for (let i = 0; i < count; i++) {
      const theta = rnd() * Math.PI * 2;
      // Distribute more droplets around the front and sides
      const y = (rnd() - 0.5) * (canHeight * 0.85);
      
      // Slight outward offset from cylinder skin
      const r = canRadius + 0.008;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;

      // Scale variation: some micro droplets, some medium droplets, a few droplets sliding
      const baseScale = 0.025 + rnd() * 0.035;
      const isTeardrop = rnd() > 0.75;
      const scaleY = isTeardrop ? baseScale * 1.6 : baseScale;
      const scaleX = baseScale;
      const scaleZ = baseScale * 0.6; // flattened against can

      // Normal rotation facing away from can center
      const rotY = -theta + Math.PI / 2;

      data.push({
        position: new THREE.Vector3(x, y, z),
        scale: new THREE.Vector3(scaleX, scaleY, scaleZ),
        rotation: new THREE.Euler(0, rotY, 0),
      });
    }

    return { data, dummy };
  }, [count, canRadius, canHeight]);

  useMemo(() => {
    // Initial transform setup
    if (!meshRef.current) return;
    const { data, dummy } = dropletData;
    for (let i = 0; i < data.length; i++) {
      dummy.position.copy(data[i].position);
      dummy.rotation.copy(data[i].rotation);
      dummy.scale.copy(data[i].scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [dropletData]);

  // Make sure matrices are applied on mount
  useFrame(() => {
    if (meshRef.current && meshRef.current.count !== count) {
      const { data, dummy } = dropletData;
      for (let i = 0; i < data.length; i++) {
        dummy.position.copy(data[i].position);
        dummy.rotation.copy(data[i].rotation);
        dummy.scale.copy(data[i].scale);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      castShadow={false}
      receiveShadow={false}
    >
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        color="#ffffff"
        roughness={0.04}
        metalness={0.15}
        transparent={true}
        opacity={0.82}
        envMapIntensity={2.4}
      />
    </instancedMesh>
  );
}
