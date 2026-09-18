import * as THREE from 'three';
import type { Flavor } from './flavors';

const labelTextureCache = new Map<string, THREE.CanvasTexture>();
let bumpTextureCache: THREE.CanvasTexture | null = null;
let lidTextureCache: THREE.CanvasTexture | null = null;

/**
 * Generate a high-resolution 2048x1024 soda can label texture.
 * Front artwork is centered at u = 0.5 (x = width * 0.5).
 * In Can.tsx, rotating the cylinder mesh by Math.PI puts u = 0.5
 * directly facing the camera (+Z) with zero offset!
 * Back details (nutrition facts, barcode) are at u = 0.0 / 1.0 (on the back).
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

  // 1. Full Metallic Can Body (100% Flavor Color - NO white layer!)
  const bgGrad = ctx.createLinearGradient(0, 0, width, 0);
  bgGrad.addColorStop(0.0, flavor.color);
  bgGrad.addColorStop(0.2, flavor.accentColor);
  bgGrad.addColorStop(0.5, flavor.color);
  bgGrad.addColorStop(0.8, flavor.accentColor);
  bgGrad.addColorStop(1.0, flavor.color);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle metallic vertical brush lines (anisotropic aluminum sheen)
  ctx.save();
  ctx.globalAlpha = 0.05;
  for (let x = 0; x < width; x += 3) {
    ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#000000';
    ctx.fillRect(x, 0, 1.5, height);
  }
  ctx.restore();

  // Subtle vignette / lighting depth at top & bottom margins
  const topBottomGrad = ctx.createLinearGradient(0, 0, 0, height);
  topBottomGrad.addColorStop(0, 'rgba(0,0,0,0.25)');
  topBottomGrad.addColorStop(0.08, 'rgba(0,0,0,0)');
  topBottomGrad.addColorStop(0.92, 'rgba(0,0,0,0)');
  topBottomGrad.addColorStop(1, 'rgba(0,0,0,0.3)');
  ctx.fillStyle = topBottomGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. FRONT CENTER ARTWORK (centered at x = width * 0.5)
  const frontX = width * 0.5;

  // --- BLENDER SWIRL LOGO ---
  ctx.save();
  ctx.translate(frontX, height * 0.13);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(0, 0, 42, 0.45 * Math.PI, 1.85 * Math.PI);
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 0, 15, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, -15);
  ctx.quadraticCurveTo(22, -26, 44, 4);
  ctx.stroke();
  ctx.restore();

  // --- "BLENDER" TITLE ---
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 6;

  ctx.font = '900 114px "Syne", "Outfit", sans-serif';
  ctx.letterSpacing = '8px';
  ctx.fillText('BLENDER', frontX, height * 0.24);

  // --- "JUICE" TITLE ---
  ctx.font = '900 124px "Syne", "Outfit", sans-serif';
  ctx.letterSpacing = '10px';
  ctx.fillText('JUICE', frontX, height * 0.35);
  ctx.restore();

  // --- REALISTIC CENTER CITRUS GRAPHIC & SPLASH ---
  ctx.save();
  ctx.translate(frontX, height * 0.50);

  // Splash water droplets
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  for (let i = 0; i < 20; i++) {
    const angle = (i / 20) * Math.PI * 2;
    const dist = 85 + ((i * 19) % 30);
    const dropX = Math.cos(angle) * dist;
    const dropY = Math.sin(angle) * (dist * 0.65);
    const size = 3 + (i % 4);
    ctx.beginPath();
    ctx.arc(dropX, dropY, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Fruit Wheel Outer Rind
  const fruitR = 76;
  ctx.beginPath();
  ctx.arc(0, 0, fruitR, 0, Math.PI * 2);
  ctx.fillStyle = '#15803d';
  ctx.fill();
  ctx.lineWidth = 7;
  ctx.strokeStyle = '#166534';
  ctx.stroke();

  // White Pith Ring
  ctx.beginPath();
  ctx.arc(0, 0, fruitR - 7, 0, Math.PI * 2);
  ctx.fillStyle = '#f7fee7';
  ctx.fill();

  // Translucent Pulp Segments
  for (let s = 0; s < 8; s++) {
    ctx.save();
    ctx.rotate((s * Math.PI) / 4);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, fruitR - 14, -0.32, 0.32);
    ctx.closePath();
    ctx.fillStyle = flavor.id === 'lemon' ? '#a3e635' : flavor.accentColor;
    ctx.fill();

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#ffffff';
    ctx.globalAlpha = 0.5;
    ctx.stroke();
    ctx.restore();
  }

  // Center Core
  ctx.beginPath();
  ctx.arc(0, 0, 7, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  // Mint Leaves
  ctx.save();
  ctx.translate(60, 8);
  ctx.rotate(0.5);
  ctx.beginPath();
  ctx.ellipse(0, 0, 28, 14, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#22c55e';
  ctx.fill();
  ctx.strokeStyle = '#14532d';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.restore();

  ctx.restore();

  // --- LOWER CAN GRAPHICS (ALL ON GREEN CAN BODY - NO WHITE LAYER) ---
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Flavor text: e.g. "LEMON" in crisp bold white stencil
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 4;
  ctx.font = '900 88px "Syne", "Outfit", sans-serif';
  ctx.letterSpacing = '7px';
  const flavorText = flavor.id === 'lemon' ? 'LEMON' : flavor.name.toUpperCase();
  ctx.fillText(flavorText, frontX, height * 0.72);

  // Subtitle: "NO ADDED SUGAR, NO PRESERVATIVES"
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '800 22px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('NO ADDED SUGAR, NO PRESERVATIVES', frontX, height * 0.81);

  // "500 ML"
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 30px "Syne", "Outfit", sans-serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('500 ML', frontX, height * 0.88);
  ctx.restore();

  // 3. BACK SIDE DETAILS (at u = 0.0 and u = 1.0, hidden on the rear)
  const backX = width * 0.05;
  ctx.save();
  ctx.translate(backX, height * 0.32);

  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
  ctx.fillRect(-70, 0, 140, 220);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-70, 0, 140, 220);

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.font = '800 14px sans-serif';
  ctx.fillText('NUTRITION', -60, 24);
  ctx.font = '500 11px sans-serif';
  ctx.fillText(`Cal: ${flavor.nutrition.calories} kcal`, -60, 52);
  ctx.fillText(`Sugar: ${flavor.nutrition.sugar}`, -60, 76);
  ctx.fillText(`Juice: ${flavor.nutrition.realJuice}`, -60, 100);
  ctx.fillText(`Vit C: ${flavor.nutrition.vitaminC}`, -60, 124);
  ctx.fillText('Fat: 0g', -60, 148);
  ctx.fillText('Sodium: 5mg', -60, 172);

  // Barcode
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-55, 235, 110, 45);
  ctx.fillStyle = '#000000';
  for (let b = -45; b < 45; b += 4) {
    const bw = Math.random() > 0.4 ? 2 : 1;
    ctx.fillRect(b, 240, bw, 32);
  }
  ctx.font = '9px monospace';
  ctx.fillText('0 72549 19283 4', -40, 276);

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  labelTextureCache.set(flavor.id, texture);
  return texture;
}

/**
 * Lightweight procedural condensation bump map
 */
export function getCondensationBumpTexture(): THREE.CanvasTexture {
  if (bumpTextureCache) return bumpTextureCache;

  const size = 512; // Optimized from 1024 to 512 for instant 60fps performance
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 1500; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 2.2 + 0.6;

    const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.7, '#a8a8a8');
    grad.addColorStop(1, '#808080');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < 100; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 4 + 2;

    const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.5, '#cccccc');
    grad.addColorStop(1, '#808080');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
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
 * Brushed aluminum top lid
 */
export function getTopLidTexture(): THREE.CanvasTexture {
  if (lidTextureCache) return lidTextureCache;

  const size = 256; // Optimized size
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(0, 0, size, size);

  const center = size / 2;
  ctx.save();
  for (let r = 8; r < center; r += 3) {
    ctx.beginPath();
    ctx.arc(center, center, r, 0, Math.PI * 2);
    ctx.strokeStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Mouth opening score
  ctx.beginPath();
  ctx.ellipse(center, center - 35, 28, 18, 0, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(71, 85, 105, 0.65)';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Rivet
  ctx.beginPath();
  ctx.arc(center, center, 8, 0, Math.PI * 2);
  ctx.fillStyle = '#94a3b8';
  ctx.fill();
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  lidTextureCache = texture;
  return lidTextureCache;
}
