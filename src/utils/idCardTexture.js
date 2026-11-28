const W = 1024;
const H = 1440;
const SCALE = 0.75;

let cachedPhotoSrc = '';
let cachedPhotoPromise = null;
const textureCache = new Map();

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let cy = y;
  for (let i = 0; i < words.length; i++) {
    const test = line ? `${line} ${words[i]}` : words[i];
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, cy);
      line = words[i];
      cy += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, cy);
  return cy;
}

function drawBarcode(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  let cx = x;
  let i = 0;
  while (cx < x + w) {
    const barW = ((i * 7 + 3) % 4) * 3 + 3;
    const gap = ((i * 5 + 1) % 3) * 3 + 4;
    if (cx + barW <= x + w) {
      ctx.fillRect(cx, y, barW, h);
    }
    cx += barW + gap;
    i++;
  }
}

function loadPhoto(src) {
  if (src === cachedPhotoSrc && cachedPhotoPromise) {
    return cachedPhotoPromise;
  }
  cachedPhotoSrc = src;
  cachedPhotoPromise = new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
  return cachedPhotoPromise;
}

function palette(isDark) {
  return isDark
    ? {
        bg: '#121215',
        surface: '#1a1a1f',
        ink: '#f4f4f5',
        muted: '#a1a1aa',
        line: 'rgba(255,255,255,0.14)',
        pill: 'rgba(255,255,255,0.08)',
        accent: '#34d399',
      }
    : {
        bg: '#f8fafc',
        surface: '#ffffff',
        ink: '#09090b',
        muted: '#52525b',
        line: 'rgba(9,9,11,0.12)',
        pill: 'rgba(9,9,11,0.06)',
        accent: '#059669',
      };
}

function renderFront(photo, p, isDark) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(W * SCALE);
  canvas.height = Math.round(H * SCALE);
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  ctx.scale(SCALE, SCALE);

  // Base card background
  ctx.fillStyle = p.bg;
  ctx.fillRect(0, 0, W, H);

  // Subtle inner frame
  ctx.strokeStyle = p.line;
  ctx.lineWidth = 3;
  roundRect(ctx, 28, 28, W - 56, H - 56, 44);
  ctx.stroke();

  // Header row (placed cleanly below the lanyard slot)
  const pad = 76;
  ctx.fillStyle = p.ink;
  ctx.font = '800 44px Inter, system-ui, sans-serif';
  ctx.fillText('B.', pad, 195);

  ctx.fillStyle = p.muted;
  ctx.font = '500 22px "JetBrains Mono", ui-monospace, monospace';
  ctx.textAlign = 'right';
  ctx.fillText('ID · BD-2026', W - pad, 192);
  ctx.textAlign = 'left';

  ctx.strokeStyle = p.line;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pad, 230);
  ctx.lineTo(W - pad, 230);
  ctx.stroke();

  // Portrait photo frame (matches 788x1024 portrait aspect ratio)
  const photoX = pad;
  const photoY = 264;
  const photoW = 430;
  const photoH = 556;

  ctx.save();
  roundRect(ctx, photoX, photoY, photoW, photoH, 28);
  ctx.clip();
  ctx.fillStyle = '#000000';
  ctx.fillRect(photoX, photoY, photoW, photoH);

  if (photo) {
    const scale = Math.max(photoW / photo.width, photoH / photo.height);
    const dw = photo.width * scale;
    const dh = photo.height * scale;
    const dx = photoX + (photoW - dw) / 2;
    const dy = photoY;
    ctx.drawImage(photo, dx, dy, dw, dh);
  }
  ctx.restore();

  ctx.strokeStyle = p.line;
  ctx.lineWidth = 2;
  roundRect(ctx, photoX, photoY, photoW, photoH, 28);
  ctx.stroke();

  // Right-side identity column beside the photo
  const metaX = photoX + photoW + 46;
  ctx.fillStyle = p.ink;
  ctx.font = '800 50px Inter, system-ui, sans-serif';
  ctx.fillText('BIKASH', metaX, 326);
  ctx.fillText('DHAKAL', metaX, 384);

  ctx.fillStyle = p.muted;
  ctx.font = '600 24px Inter, system-ui, sans-serif';
  ctx.fillText('Full Stack & DevOps Engineer', metaX, 434);

  ctx.strokeStyle = p.line;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(metaX, 470);
  ctx.lineTo(W - pad, 470);
  ctx.stroke();

  const drawField = (label, value, yPos) => {
    ctx.fillStyle = p.muted;
    ctx.font = '600 18px "JetBrains Mono", ui-monospace, monospace';
    ctx.fillText(label, metaX, yPos);
    ctx.fillStyle = p.ink;
    ctx.font = '600 24px Inter, system-ui, sans-serif';
    ctx.fillText(value, metaX, yPos + 34);
  };

  drawField('BASED IN', 'Kathmandu, NP', 524);
  drawField('FOCUS', 'Full Stack & DevOps', 626);

  ctx.fillStyle = p.muted;
  ctx.font = '600 18px "JetBrains Mono", ui-monospace, monospace';
  ctx.fillText('STATUS', metaX, 728);

  ctx.fillStyle = p.accent;
  ctx.beginPath();
  ctx.arc(metaX + 9, 760, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = p.ink;
  ctx.font = '600 22px "JetBrains Mono", ui-monospace, monospace';
  ctx.fillText('AVAILABLE', metaX + 28, 768);

  // Bio section below photo + metadata
  ctx.strokeStyle = p.line;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pad, 876);
  ctx.lineTo(W - pad, 876);
  ctx.stroke();

  ctx.fillStyle = p.muted;
  ctx.font = '600 20px "JetBrains Mono", ui-monospace, monospace';
  ctx.fillText('BIO', pad, 932);

  ctx.fillStyle = p.ink;
  ctx.font = '400 29px Inter, system-ui, sans-serif';
  drawWrappedText(
    ctx,
    'Rooted in Kathmandu, trained in computer science. Building full stack apps and shipping them with Docker and CI/CD.',
    pad,
    992,
    W - pad * 2,
    44
  );

  // Bottom divider
  ctx.strokeStyle = p.line;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pad, 1175);
  ctx.lineTo(W - pad, 1175);
  ctx.stroke();

  ctx.fillStyle = p.ink;
  ctx.font = '500 22px "JetBrains Mono", ui-monospace, monospace';
  ctx.fillText('github.com/Dhakal009', pad, 1244);
  ctx.fillStyle = p.muted;
  ctx.font = '400 20px "JetBrains Mono", ui-monospace, monospace';
  ctx.fillText('CLICK TO FLIP CARD', pad, 1284);

  // Barcode on bottom right
  drawBarcode(ctx, W - pad - 240, 1212, 240, 74, p.ink);

  canvas.toString = () => `idcard:front:${isDark ? 'dark' : 'light'}`;
  return canvas;
}

function renderBack(p, isDark) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(W * SCALE);
  canvas.height = Math.round(H * SCALE);
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  ctx.scale(SCALE, SCALE);

  ctx.fillStyle = p.bg;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = p.line;
  ctx.lineWidth = 3;
  roundRect(ctx, 28, 28, W - 56, H - 56, 44);
  ctx.stroke();

  const pad = 76;
  ctx.fillStyle = p.ink;
  ctx.font = '800 44px Inter, system-ui, sans-serif';
  ctx.fillText('B.', pad, 195);

  ctx.fillStyle = p.muted;
  ctx.font = '500 22px "JetBrains Mono", ui-monospace, monospace';
  ctx.textAlign = 'right';
  ctx.fillText('ENGINEER PASS', W - pad, 192);
  ctx.textAlign = 'left';

  ctx.strokeStyle = p.line;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pad, 230);
  ctx.lineTo(W - pad, 230);
  ctx.stroke();

  // Bio block
  ctx.fillStyle = p.muted;
  ctx.font = '600 22px "JetBrains Mono", ui-monospace, monospace';
  ctx.fillText('ABOUT', pad, 315);

  ctx.fillStyle = p.ink;
  ctx.font = '400 30px Inter, system-ui, sans-serif';
  drawWrappedText(
    ctx,
    'Computer science undergraduate focused on clean architecture, fluid motion, and thoughtful frontend engineering.',
    pad,
    375,
    W - pad * 2,
    46
  );

  // Core Stack
  ctx.fillStyle = p.muted;
  ctx.font = '600 22px "JetBrains Mono", ui-monospace, monospace';
  ctx.fillText('CORE STACK', pad, 590);

  const skills = ['React 19', 'Node.js', 'MongoDB', 'Docker', 'CI/CD', 'Linux'];
  let px = pad;
  let py = 630;
  ctx.font = '500 24px "JetBrains Mono", ui-monospace, monospace';
  skills.forEach((skill) => {
    const tw = ctx.measureText(skill).width + 44;
    if (px + tw > W - pad) {
      px = pad;
      py += 68;
    }
    ctx.fillStyle = p.pill;
    roundRect(ctx, px, py, tw, 50, 25);
    ctx.fill();
    ctx.strokeStyle = p.line;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = p.ink;
    ctx.fillText(skill, px + 22, py + 33);
    px += tw + 16;
  });

  // Contact
  ctx.fillStyle = p.muted;
  ctx.font = '600 22px "JetBrains Mono", ui-monospace, monospace';
  ctx.fillText('CONTACT', pad, 880);

  ctx.fillStyle = p.ink;
  ctx.font = '500 28px Inter, system-ui, sans-serif';
  ctx.fillText('bikashdhakal546@gmail.com', pad, 935);
  ctx.fillStyle = p.muted;
  ctx.fillText('github.com/Dhakal009', pad, 985);

  // Bottom strip
  ctx.strokeStyle = p.line;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pad, 1175);
  ctx.lineTo(W - pad, 1175);
  ctx.stroke();

  ctx.fillStyle = p.muted;
  ctx.font = '400 22px "JetBrains Mono", ui-monospace, monospace';
  ctx.fillText('CLICK TO FLIP CARD', pad, 1245);

  drawBarcode(ctx, W - pad - 240, 1212, 240, 74, p.ink);

  canvas.toString = () => `idcard:back:${isDark ? 'dark' : 'light'}`;
  return canvas;
}

export async function createIdCardTextures(photoSrc, isDark) {
  if (typeof document === 'undefined') return { front: photoSrc, back: photoSrc };
  const key = `${photoSrc}|${isDark}`;
  if (textureCache.has(key)) return textureCache.get(key);
  const photo = await loadPhoto(photoSrc);
  const p = palette(isDark);
  const result = {
    front: renderFront(photo, p, isDark) || photoSrc,
    back: renderBack(p, isDark) || photoSrc,
  };
  textureCache.set(key, result);
  return result;
}
