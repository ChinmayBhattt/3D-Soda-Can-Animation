import * as THREE from 'three';
import type { Flavor } from './flavors';

const labelTextureCache = new Map<string, THREE.CanvasTexture>();
let bumpTextureCache: THREE.CanvasTexture | null = null;
let lidTextureCache: THREE.CanvasTexture | null = null;

/**
 * Generate a high-resolution 2048x1024 soda can label texture.
 * In Three.js CylinderGeometry, UV coordinates map:
 * u = 0.0 -> -X / back
 * u = 0.5 -> +X / back
 * u = 0.75 or u = 0.5 depending on rotation.
 * We will center the FRONT label at u = 0.5 (center of the canvas: x = width * 0.5)
 * and in Can.tsx we rotate the cylinder so u = 0.5 faces directly towards +Z (the camera).
 */
export function getCanLabelTexture(flavor: Flavor): THREE.CanvasTexture {
  if (labelTextureCache.has(flavor.id)) {
    return labelTextureCache.get(flavor.id)!;
  }

  const width = 2048;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // 1. Base Metallic Flavor Gradient (Satin Aluminum Finish)
  const bgGrad = ctx.createLinearGradient(0, 0, width, 0);
  bgGrad.addColorStop(0.0, flavor.color);
  bgGrad.addColorStop(0.25, flavor.accentColor);
  bgGrad.addColorStop(0.5, flavor.color);
  bgGrad.addColorStop(0.75, flavor.accentColor);
  bgGrad.addColorStop(1.0, flavor.color);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Vertical brushing sheen (simulate anisotropic brushed aluminum can)
  ctx.save();
  ctx.globalAlpha = 0.08;
  for (let x = 0; x < width; x += 4) {
    ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#000000';
    ctx.fillRect(x, 0, 2, height);
  }
  ctx.restore();

  // 2. White Wrap Section at the Bottom (as seen in the reference image)
  const whiteWrapY = height * 0.62;

  ctx.save();
  // Soft curved top edge for white wrap
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(0, whiteWrapY + 20);
  ctx.bezierCurveTo(
    width * 0.25, whiteWrapY - 20,
    width * 0.75, whiteWrapY - 20,
    width, whiteWrapY + 20
  );
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  // Subtle metallic silver gradient on the white wrap
  const silverGrad = ctx.createLinearGradient(0, whiteWrapY, 0, height);
  silverGrad.addColorStop(0, 'rgba(255,255,255,0.95)');
  silverGrad.addColorStop(0.85, 'rgba(241,245,249,0.95)');
  silverGrad.addColorStop(1, 'rgba(203,213,225,0.95)');
  ctx.fillStyle = silverGrad;
  ctx.fill();

  // Drop shadow just above the white wrap
  const shadowGrad = ctx.createLinearGradient(0, whiteWrapY - 30, 0, whiteWrapY);
  shadowGrad.addColorStop(0, 'rgba(0,0,0,0)');
  shadowGrad.addColorStop(1, 'rgba(0,0,0,0.22)');
  ctx.fillStyle = shadowGrad;
  ctx.fillRect(0, whiteWrapY - 30, width, 30);
  ctx.restore();

  // 3. FRONT CENTER AREA (centered at x = width * 0.5)
  const frontX = width * 0.5;

  // --- BLENDER LOGO (Iconic 3-prong swirl) ---
  ctx.save();
  ctx.translate(frontX, height * 0.14);

  // Outer circle with opening
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 16;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(0, 0, 44, 0.45 * Math.PI, 1.85 * Math.PI);
  ctx.stroke();

  // Center dot
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 0, 16, 0, Math.PI * 2);
  ctx.fill();

  // Radiating arm
  ctx.beginPath();
  ctx.moveTo(0, -16);
  ctx.quadraticCurveTo(24, -28, 48, 4);
  ctx.stroke();
  ctx.restore();

  // --- "BLENDER" TITLE ---
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 6;

  ctx.font = '900 110px "Syne", "Outfit", sans-serif';
  ctx.letterSpacing = '8px';
  ctx.fillText('BLENDER', frontX, height * 0.25);

  // --- "JUICE" TITLE ---
  ctx.font = '900 120px "Syne", "Outfit", sans-serif';
  ctx.letterSpacing = '10px';
  ctx.fillText('JUICE', frontX, height * 0.36);
  ctx.restore();

  // --- REALISTIC LEMON SLICE GRAPHIC IN THE CENTER ---
  ctx.save();
  ctx.translate(frontX, height * 0.51);

  // Splash water droplets around the center fruit
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  for (let i = 0; i < 22; i++) {
    const angle = (i / 22) * Math.PI * 2;
    const dist = 95 + ((i * 17) % 35);
    const dropX = Math.cos(angle) * dist;
    const dropY = Math.sin(angle) * (dist * 0.7);
    const size = 3 + (i % 5);
    ctx.beginPath();
    ctx.arc(dropX, dropY, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Fruit Wheel (Outer Green Rind)
  const fruitR = 82;
  ctx.beginPath();
  ctx.arc(0, 0, fruitR, 0, Math.PI * 2);
  ctx.fillStyle = '#22c55e';
  ctx.fill();
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#15803d';
  ctx.stroke();

  // White Pith Ring
  ctx.beginPath();
  ctx.arc(0, 0, fruitR - 8, 0, Math.PI * 2);
  ctx.fillStyle = '#f7fee7';
  ctx.fill();

  // Translucent Pulp Segments
  for (let s = 0; s < 8; s++) {
    ctx.save();
    ctx.rotate((s * Math.PI) / 4);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, fruitR - 15, -0.32, 0.32);
    ctx.closePath();
    ctx.fillStyle = flavor.id === 'lemon' ? '#a3e635' : flavor.accentColor;
    ctx.fill();

    // Segment inner highlight
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff';
    ctx.globalAlpha = 0.4;
    ctx.stroke();
    ctx.restore();
  }

  // Center Core Pip
  ctx.beginPath();
  ctx.arc(0, 0, 8, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  // Mint Leaves next to fruit graphic
  ctx.save();
  ctx.translate(65, 10);
  ctx.rotate(0.5);
  ctx.beginPath();
  ctx.ellipse(0, 0, 32, 16, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#16a34a';
  ctx.fill();
  ctx.strokeStyle = '#14532d';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();

  ctx.restore();

  // --- LOWER WHITE WRAP DETAILS (LEMON / 500 ML / NO ADDED SUGAR) ---
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Flavor text: "LEMON" in bold green
  ctx.fillStyle = flavor.color;
  ctx.font = '900 86px "Syne", "Outfit", sans-serif';
  ctx.letterSpacing = '6px';
  const flavorText = flavor.id === 'lemon' ? 'LEMON' : flavor.name.toUpperCase();
  ctx.fillText(flavorText, frontX, whiteWrapY + 110);

  // Subtitle: "NO ADDED SUGAR, NO PRESERVATIVES"
  ctx.fillStyle = '#475569';
  ctx.font = '800 24px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('NO ADDED SUGAR, NO PRESERVATIVES', frontX, whiteWrapY + 190);

  // "500 ML"
  ctx.fillStyle = '#64748b';
  ctx.font = '900 32px "Syne", "Outfit", sans-serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('500 ML', frontX, whiteWrapY + 255);
  ctx.restore();

  // 4. BACK SIDE DETAILS (at x = width * 0.08 & width * 0.92)
  // Nutrition Facts Box on the back
  const backX = width * 0.08;
  ctx.save();
  ctx.translate(backX, height * 0.28);

  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(-90, 0, 180, 240);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.strokeRect(-90, 0, 180, 240);

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.font = '800 16px sans-serif';
  ctx.fillText('NUTRITION FACTS', -80, 26);
  ctx.font = '500 12px sans-serif';
  ctx.fillText(`Calories: ${flavor.nutrition.calories} kcal`, -80, 58);
  ctx.fillText(`Sugar: ${flavor.nutrition.sugar}`, -80, 84);
  ctx.fillText(`Juice: ${flavor.nutrition.realJuice}`, -80, 110);
  ctx.fillText(`Vitamin C: ${flavor.nutrition.vitaminC}`, -80, 136);
  ctx.fillText('Sodium: 5mg', -80, 162);
  ctx.fillText('Total Fat: 0g', -80, 188);

  // Barcode
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-70, 260, 140, 55);
  ctx.fillStyle = '#000000';
  for (let b = -60; b < 60; b += 4) {
    const bw = Math.random() > 0.4 ? 2.5 : 1.5;
    ctx.fillRect(b, 265, bw, 40);
  }
  ctx.font = '10px monospace';
  ctx.fillText('0 72549 19283 4', -50, 310);

  // Alu 41 recycling symbol
  ctx.strokeStyle = '#ffffff';
  ctx.strokeRect(-40, 335, 80, 26);
  ctx.font = '11px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('ALU 41 ♻', 0, 353);
  ctx.restore();

  // Create Three.js Texture with sRGB color space
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  labelTextureCache.set(flavor.id, texture);
  return texture;
}

/**
 * Procedural condensation bump map with realistic micro-droplets
 */
export function getCondensationBumpTexture(): THREE.CanvasTexture {
  if (bumpTextureCache) return bumpTextureCache;

  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);

  // 3000+ tiny condensation dew drops
  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 2.5 + 0.6;

    const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.7, '#a8a8a8');
    grad.addColorStop(1, '#808080');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // 220 larger beads with gravity runoff teardrop shapes
  for (let i = 0; i < 220; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 5 + 2.5;

    const isStreak = Math.random() > 0.6;
    const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.5, '#cccccc');
    grad.addColorStop(0.85, '#999999');
    grad.addColorStop(1, '#808080');

    ctx.fillStyle = grad;
    ctx.beginPath();
    if (isStreak) {
      ctx.ellipse(x, y, r * 0.8, r * 2.2, 0, 0, Math.PI * 2);
    } else {
      ctx.arc(x, y, r, 0, Math.PI * 2);
    }
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 3);
  texture.needsUpdate = true;

  bumpTextureCache = texture;
  return bumpTextureCache;
}

/**
 * Top lid texture with brushed concentric rings and drinking mouth score
 */
export function getTopLidTexture(): THREE.CanvasTexture {
  if (lidTextureCache) return lidTextureCache;

  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(0, 0, size, size);

  const center = size / 2;
  ctx.save();
  for (let r = 8; r < center; r += 2) {
    ctx.beginPath();
    ctx.arc(center, center, r, 0, Math.PI * 2);
    ctx.strokeStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Mouth opening score oval
  ctx.beginPath();
  ctx.ellipse(center, center - 65, 52, 34, 0, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(71, 85, 105, 0.65)';
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // Center rivet dot
  ctx.beginPath();
  ctx.arc(center, center, 14, 0, Math.PI * 2);
  ctx.fillStyle = '#94a3b8';
  ctx.fill();
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  lidTextureCache = texture;
  return lidTextureCache;
}
