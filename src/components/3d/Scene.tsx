import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';
import type { Flavor } from '../../utils/flavors';
import { Can } from './Can';
import { FloatingFruits } from './FloatingFruits';
import { MistParticles } from './MistParticles';

interface SceneProps {
  flavor: Flavor;
  scrollProgress: number;
  isExplodedManual?: boolean;
  onCanClick?: () => void;
}

// Internal 3D Controller to handle scroll tracking, user drag, and smooth return
function CanRig({
  flavor,
  scrollProgress,
  isExplodedManual,
  onCanClick,
}: {
  flavor: Flavor;
  scrollProgress: number;
  isExplodedManual?: boolean;
  onCanClick?: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { size, pointer } = useThree();
  const isMobile = size.width < 768;

  // Interaction Drag State
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const manualRotation = useRef({ x: 0, y: 0 });
  const lastInteractionTime = useRef(0);
  const [activeInteracting, setActiveInteracting] = useState(false);

  // Exploded progress: strictly triggered when user clicks 'Explode 3D Layers' in Anatomy section
  const explodedAmount = isExplodedManual ? 1 : 0;

  // Pointer Drag Handlers
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      // Only drag if left click or touch
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      isDragging.current = true;
      dragStart.current = { x: e.clientX, y: e.clientY };
      lastInteractionTime.current = Date.now();
      setActiveInteracting(true);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      dragStart.current = { x: e.clientX, y: e.clientY };

      manualRotation.current.y += dx * 0.008;
      manualRotation.current.x += dy * 0.008;
      // Clamp vertical tilt
      manualRotation.current.x = THREE.MathUtils.clamp(
        manualRotation.current.x,
        -Math.PI / 4,
        Math.PI / 4
      );

      lastInteractionTime.current = Date.now();
    };

    const handlePointerUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  // Frame Loop for Smooth Cinematic Animation & Lerping
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const now = Date.now();
    const timeSinceInteraction = now - lastInteractionTime.current;
    const isAutoResuming = timeSinceInteraction > 2200 && !isDragging.current;

    if (isAutoResuming && activeInteracting) {
      setActiveInteracting(false);
    }

    // Target rotation calculated from scroll
    // At scrollProgress = 0, initial pose matches the reference image:
    // Front label ("BLENDER JUICE") faces directly at viewer with dynamic ~12° Z-tilt and slight forward X-pitch
    const scrollTargetY = scrollProgress * Math.PI * 2;
    const scrollTargetX = 0.14 + Math.sin(scrollProgress * Math.PI) * 0.12;
    const scrollTargetZ = -0.18 - Math.cos(scrollProgress * Math.PI) * 0.08;

    // Mouse Parallax Influence
    const mouseInfluenceX = pointer.x * 0.12;
    const mouseInfluenceY = pointer.y * 0.12;

    // Blend manual drag with scroll target
    let targetRotY: number;
    let targetRotX: number;
    let targetRotZ: number;

    if (isDragging.current || timeSinceInteraction < 2200) {
      // User is actively inspecting
      targetRotY = manualRotation.current.y;
      targetRotX = manualRotation.current.x;
      targetRotZ = 0;
    } else {
      // Auto-sync back to scroll
      manualRotation.current.y = THREE.MathUtils.lerp(
        manualRotation.current.y,
        scrollTargetY + mouseInfluenceX,
        delta * 3
      );
      manualRotation.current.x = THREE.MathUtils.lerp(
        manualRotation.current.x,
        scrollTargetX + mouseInfluenceY,
        delta * 3
      );
      targetRotY = manualRotation.current.y;
      targetRotX = manualRotation.current.x;
      targetRotZ = scrollTargetZ;
    }

    // Position & Scale based on scroll section
    // Section 0 (Hero): can is nicely framed to the right on desktop, centered on mobile
    // Section 1 (Flavors): can shifts left
    // Section 2 (Anatomy): can is centered for exploded view
    // Section 3 (Ingredients/CTA): can is framed to the right
    let targetPosY = 0;
    let targetPosX = 0;
    let targetScale = isMobile ? 0.72 : 0.92;

    if (scrollProgress < 0.22) {
      // Hero: cleanly on right side
      targetPosX = isMobile ? 0 : 1.2;
      targetPosY = 0.05;
    } else if (scrollProgress >= 0.22 && scrollProgress < 0.52) {
      // Flavors: shift left so right side cards are readable
      targetPosX = isMobile ? 0 : -1.2;
      targetPosY = 0;
    } else if (scrollProgress >= 0.52 && scrollProgress < 0.78) {
      // Anatomy: center stage for exploded view
      targetPosX = 0;
      targetPosY = 0.15;
      targetScale *= 1.05;
    } else {
      // CTA / Footer: right side
      targetPosX = isMobile ? 0 : 1.1;
      targetPosY = -0.1;
    }

    // Apply smooth damping
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      targetRotY,
      7,
      delta
    );
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      targetRotX,
      7,
      delta
    );
    groupRef.current.rotation.z = THREE.MathUtils.damp(
      groupRef.current.rotation.z,
      targetRotZ,
      7,
      delta
    );

    groupRef.current.position.x = THREE.MathUtils.damp(
      groupRef.current.position.x,
      targetPosX,
      5,
      delta
    );
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      targetPosY,
      5,
      delta
    );

    const currentScale = groupRef.current.scale.x;
    const nextScale = THREE.MathUtils.damp(currentScale, targetScale, 6, delta);
    groupRef.current.scale.set(nextScale, nextScale, nextScale);
  });

  return (
    <group ref={groupRef}>
      {/* Floating Gentle Bobbing */}
      <Float speed={2.5} rotationIntensity={0.15} floatIntensity={0.25}>
        <group onClick={onCanClick}>
          <Can key={flavor.id} flavor={flavor} explodedProgress={explodedAmount} />
        </group>
      </Float>

      {/* Floating 3D Lime Slices, Wedges & Mint Leaves */}
      <FloatingFruits flavor={flavor} scrollProgress={scrollProgress} />

      {/* Ambient Mist Effervescence */}
      <MistParticles count={isMobile ? 60 : 130} color={flavor.accentColor} />

      {/* Soft Contact Shadows below can */}
      <ContactShadows
        position={[0, -2.1, 0]}
        opacity={0.65}
        scale={6.5}
        blur={2.4}
        far={3.8}
        color="#000000"
      />
    </group>
  );
}

export function Scene({
  flavor,
  scrollProgress,
  isExplodedManual,
  onCanClick,
}: SceneProps) {
  return (
    <div className="fixed inset-0 z-10 pointer-events-auto select-none">
      <Canvas
        camera={{ position: [0, 0, 7.2], fov: 36 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        dpr={[1, 1.5]}
      >
        {/* Studio Lighting: 3-Point Lighting */}
        <directionalLight
          position={[4.5, 6.0, 5.0]}
          intensity={2.6}
          color="#fffdf5"
        />

        <directionalLight
          position={[-5.0, 2.0, 3.0]}
          intensity={1.0}
          color="#dbeafe"
        />

        <directionalLight
          position={[0, 4.0, -5.0]}
          intensity={3.0}
          color={flavor.accentColor}
        />

        <directionalLight
          position={[0, -4.0, 2.0]}
          intensity={0.6}
          color={flavor.color}
        />

        <ambientLight intensity={0.7} />

        {/* Studio HDRI Environment for Photorealistic Reflections */}
        <Environment preset="studio" />

        {/* Can Rig with Scroll & Drag Physics */}
        <CanRig
          flavor={flavor}
          scrollProgress={scrollProgress}
          isExplodedManual={isExplodedManual}
          onCanClick={onCanClick}
        />
      </Canvas>
    </div>
  );
}
