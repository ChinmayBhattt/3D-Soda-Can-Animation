import * as THREE from 'three';
import type { Flavor } from './flavors';

/**
 * Generate a clean 100% solid metallic soda can label texture.
 * NO WHITE LAYER, NO WHITE WRAP, NO CACHE ISSUES.
 * Every call creates a fresh CanvasTexture with needsUpdate = true.
 */
export function getCanLabelTexture(flavor: Flavor): THREE.CanvasTexture {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // 1. Clear any previous canvas data completely
  ctx.clearRect(0, 0, width, height);

  // 2. Full Metallic Can Body (100% Solid Flavor Color - NO white layer anywhere!)
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

  // 3. FRONT CENTER ARTWORK (centered at x = width * 0.5)
  const frontX = width * 0.5;

  // --- BLENDER SWIRL LOGO ---
  ctx.save();
  ctx.translate(frontX, height * 0.14);
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

  ctx.font = '900 118px "Syne", "Outfit", sans-serif';
  ctx.letterSpacing = '8px';
  ctx.fillText('BLENDER', frontX, height * 0.26);

  // --- "JUICE" TITLE ---
  ctx.font = '900 128px "Syne", "Outfit", sans-serif';
  ctx.letterSpacing = '10px';
  ctx.fillText('JUICE', frontX, height * 0.38);
  ctx.restore();

  // --- LOWER CAN GRAPHICS (ALL ON 100% METALLIC CAN BODY - NO WHITE LAYER) ---
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Flavor text: e.g. "LEMON" in crisp bold white stencil
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 4;
  ctx.font = '900 96px "Syne", "Outfit", sans-serif';
  ctx.letterSpacing = '8px';
  const flavorText = flavor.id === 'lemon' ? 'LEMON' : flavor.name.toUpperCase();
  ctx.fillText(flavorText, frontX, height * 0.68);

  // Subtitle: "NO ADDED SUGAR, NO PRESERVATIVES"
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '800 24px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '5px';
  ctx.fillText('NO ADDED SUGAR, NO PRESERVATIVES', frontX, height * 0.79);

  // "500 ML"
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 32px "Syne", "Outfit", sans-serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('500 ML', frontX, height * 0.88);
  ctx.restore();

  // 4. BACK SIDE DETAILS (at u = 0.0 and u = 1.0, hidden on the rear)
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

  // Create Three.js Texture with sRGB color space & force update
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

/**
 * Lightweight procedural condensation bump map
 */
export function getCondensationBumpTexture(): THREE.CanvasTexture {
  const size = 512;
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

  return texture;
}

/**
 * Brushed aluminum top lid
 */
export function getTopLidTexture(): THREE.CanvasTexture {
  const size = 256;
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
  return texture;
}
