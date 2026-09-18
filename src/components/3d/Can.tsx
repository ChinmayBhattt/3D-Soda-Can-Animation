import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { Flavor } from '../../utils/flavors';
import {
  getCanLabelTexture,
  getCondensationBumpTexture,
  getTopLidTexture,
} from '../../utils/canTextures';
import { WaterDroplets } from './WaterDroplets';

interface CanProps {
  flavor: Flavor;
  explodedProgress?: number; // 0 = assembled, 1 = exploded
}

export function Can({ flavor, explodedProgress = 0 }: CanProps) {
  const canGroupRef = useRef<THREE.Group>(null);
  const lidGroupRef = useRef<THREE.Group>(null);
  const tabRef = useRef<THREE.Group>(null);
  const labelSleeveRef = useRef<THREE.Mesh>(null);
  const liquidCoreRef = useRef<THREE.Group>(null);
  const bottomChimeRef = useRef<THREE.Group>(null);

  // Proportions for realistic 500ml sleek aluminum beverage can
  const CAN_RADIUS = 0.85;
  const BODY_HEIGHT = 3.3;
  const HALF_HEIGHT = BODY_HEIGHT / 2; // 1.65

  // Textures
  const labelTexture = useMemo(() => getCanLabelTexture(flavor), [flavor]);
  const bumpTexture = useMemo(() => getCondensationBumpTexture(), []);
  const lidTexture = useMemo(() => getTopLidTexture(), []);

  // Brushed Aluminum PBR Material
  const aluminumMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#d4d8de',
        metalness: 0.94,
        roughness: 0.22,
        bumpMap: bumpTexture,
        bumpScale: 0.005,
        envMapIntensity: 2.2,
      }),
    [bumpTexture]
  );

  // Top Lid Material
  const lidPlateMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#e2e8f0',
        metalness: 0.92,
        roughness: 0.28,
        map: lidTexture,
        bumpMap: bumpTexture,
        bumpScale: 0.004,
        envMapIntensity: 2.4,
      }),
    [lidTexture, bumpTexture]
  );

  // Lathe Geometry for Top Shoulder & Double-Seam Rim (Smooth, seamless profile!)
  const topRimGeometry = useMemo(() => {
    // Cross-section points along (x=radius, y=height)
    const points: THREE.Vector2[] = [
      new THREE.Vector2(CAN_RADIUS, 0), // Bottom of shoulder joining can cylinder
      new THREE.Vector2(CAN_RADIUS * 0.96, 0.08),
      new THREE.Vector2(CAN_RADIUS * 0.90, 0.16),
      new THREE.Vector2(0.74, 0.24), // Shoulder inward taper
      new THREE.Vector2(0.72, 0.30), // Neck straight section
      new THREE.Vector2(0.72, 0.35),
      new THREE.Vector2(0.76, 0.40), // Outer flare of double seam rim
      new THREE.Vector2(0.76, 0.44), // Rim peak
      new THREE.Vector2(0.74, 0.45), // Rounded top of rim
      new THREE.Vector2(0.71, 0.43), // Inner descent of rim
      new THREE.Vector2(0.70, 0.38), // Countersunk inner bottom
    ];
    return new THREE.LatheGeometry(points, 64);
  }, [CAN_RADIUS]);

  // Lathe Geometry for Bottom Chime & Concave Dome
  const bottomChimeGeometry = useMemo(() => {
    const points: THREE.Vector2[] = [
      new THREE.Vector2(CAN_RADIUS, 0), // Top joining cylinder
      new THREE.Vector2(CAN_RADIUS * 0.98, -0.06),
      new THREE.Vector2(0.76, -0.14), // Taper inward to base
      new THREE.Vector2(0.72, -0.22), // Bottom chime contact ring
      new THREE.Vector2(0.70, -0.24),
      new THREE.Vector2(0.66, -0.22),
      new THREE.Vector2(0.55, -0.15), // Concave dome arching upward
      new THREE.Vector2(0.35, -0.08),
      new THREE.Vector2(0.0, -0.04), // Center apex of concave dome
    ];
    return new THREE.LatheGeometry(points, 64);
  }, [CAN_RADIUS]);

  // Pull Tab Geometry
  const tabGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    // Rounded rectangular pull tab
    const w = 0.22;
    const l = 0.52;
    const r = 0.08;
    shape.moveTo(-w / 2 + r, 0);
    shape.lineTo(w / 2 - r, 0);
    shape.quadraticCurveTo(w / 2, 0, w / 2, r);
    shape.lineTo(w / 2, l - r);
    shape.quadraticCurveTo(w / 2, l, w / 2 - r, l);
    shape.lineTo(-w / 2 + r, l);
    shape.quadraticCurveTo(-w / 2, l, -w / 2, l - r);
    shape.lineTo(-w / 2, r);
    shape.quadraticCurveTo(-w / 2, 0, -w / 2 + r, 0);

    // Finger pull hole inside tab
    const holePath = new THREE.Path();
    holePath.absellipse(0, l * 0.68, 0.065, 0.085, 0, Math.PI * 2, true, 0);
    shape.holes.push(holePath);

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.018,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.006,
      bevelThickness: 0.006,
    });
  }, []);

  // Smooth exploded view lerp
  useFrame((_, delta) => {
    const target = explodedProgress;

    // 1. Lid pops upward
    if (lidGroupRef.current) {
      const targetY = HALF_HEIGHT + target * 1.5;
      lidGroupRef.current.position.y = THREE.MathUtils.damp(
        lidGroupRef.current.position.y,
        targetY,
        8,
        delta
      );
    }

    // 2. Tab lifts and tilts
    if (tabRef.current) {
      const targetTabY = target * 0.45;
      const targetTabRotX = target * 0.55;
      tabRef.current.position.y = THREE.MathUtils.damp(
        tabRef.current.position.y,
        0.39 + targetTabY,
        8,
        delta
      );
      tabRef.current.rotation.x = THREE.MathUtils.damp(
        tabRef.current.rotation.x,
        targetTabRotX,
        8,
        delta
      );
    }

    // 3. Outer Label Sleeve expands outward
    if (labelSleeveRef.current) {
      const targetScale = 1.0 + target * 0.35;
      labelSleeveRef.current.scale.x = THREE.MathUtils.damp(
        labelSleeveRef.current.scale.x,
        targetScale,
        8,
        delta
      );
      labelSleeveRef.current.scale.z = THREE.MathUtils.damp(
        labelSleeveRef.current.scale.z,
        targetScale,
        8,
        delta
      );
    }

    // 4. Liquid Core visibility & rotation
    if (liquidCoreRef.current) {
      liquidCoreRef.current.visible = target > 0.02;
      liquidCoreRef.current.rotation.y += delta * 0.4;
    }

    // 5. Bottom chime drops downward
    if (bottomChimeRef.current) {
      const targetBottomY = -HALF_HEIGHT - target * 1.0;
      bottomChimeRef.current.position.y = THREE.MathUtils.damp(
        bottomChimeRef.current.position.y,
        targetBottomY,
        8,
        delta
      );
    }
  });

  return (
    <group ref={canGroupRef} dispose={null}>
      {/* 1. MAIN PRINTED CAN SLEEVE (Cylinder) */}
      {/* Rotated by Math.PI so u=0.5 (front artwork) faces directly toward +Z / camera! */}
      <mesh
        ref={labelSleeveRef}
        castShadow
        receiveShadow
        position={[0, 0, 0]}
        rotation={[0, Math.PI, 0]}
      >
        <cylinderGeometry args={[CAN_RADIUS, CAN_RADIUS, BODY_HEIGHT, 64, 1, true]} />
        <meshStandardMaterial
          map={labelTexture}
          bumpMap={bumpTexture}
          bumpScale={0.012}
          roughness={0.24}
          metalness={0.68}
          envMapIntensity={1.6}
          side={THREE.DoubleSide}
        />
        {/* Physical 3D Water Droplets on Can Surface */}
        <WaterDroplets count={100} canRadius={CAN_RADIUS} canHeight={BODY_HEIGHT} />
      </mesh>

      {/* 2. INNER CAN BODY (Visible during exploded separation) */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[CAN_RADIUS * 0.98, CAN_RADIUS * 0.98, BODY_HEIGHT - 0.04, 48]} />
        <primitive object={aluminumMaterial} attach="material" />
      </mesh>

      {/* 3. GLOWING LIQUID CORE WITH BUBBLES (Exploded view only) */}
      <group ref={liquidCoreRef} visible={false}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[CAN_RADIUS * 0.88, CAN_RADIUS * 0.88, BODY_HEIGHT - 0.25, 32]} />
          <meshPhysicalMaterial
            color={flavor.color}
            emissive={flavor.accentColor}
            emissiveIntensity={0.3}
            transmission={0.88}
            roughness={0.08}
            ior={1.34}
            transparent={true}
            opacity={0.82}
            thickness={0.4}
          />
        </mesh>
        {/* Rising Effervescent Bubbles */}
        {Array.from({ length: 28 }).map((_, i) => {
          const angle = (i / 28) * Math.PI * 2 + (i % 4);
          const rad = 0.15 + (i % 6) * 0.09;
          const y = -1.2 + (i / 28) * 2.4;
          return (
            <mesh key={i} position={[Math.cos(angle) * rad, y, Math.sin(angle) * rad]}>
              <sphereGeometry args={[0.028, 8, 8]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
            </mesh>
          );
        })}
      </group>

      {/* 4. TOP SHOULDER, SEAM RIM & PULL TAB */}
      <group ref={lidGroupRef} position={[0, HALF_HEIGHT, 0]}>
        {/* Seamless Lathe Top Shoulder and Double Seam Rim */}
        <mesh geometry={topRimGeometry}>
          <primitive object={aluminumMaterial} attach="material" />
        </mesh>

        {/* Countersunk Top Lid Plate */}
        <mesh position={[0, 0.38, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.70, 48]} />
          <primitive object={lidPlateMaterial} attach="material" />
        </mesh>

        {/* Pull-Tab Group */}
        <group ref={tabRef} position={[0, 0.39, 0]}>
          {/* Rivet Pin */}
          <mesh position={[0, 0.012, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.025, 16]} />
            <primitive object={aluminumMaterial} attach="material" />
          </mesh>

          {/* Tab Plate */}
          <mesh
            geometry={tabGeometry}
            position={[0, 0.01, -0.08]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <primitive object={aluminumMaterial} attach="material" />
          </mesh>
        </group>
      </group>

      {/* 5. BOTTOM CHIME & CONCAVE DIMPLE */}
      <group ref={bottomChimeRef} position={[0, -HALF_HEIGHT, 0]}>
        <mesh geometry={bottomChimeGeometry}>
          <primitive object={aluminumMaterial} attach="material" />
        </mesh>
      </group>
    </group>
  );
}
