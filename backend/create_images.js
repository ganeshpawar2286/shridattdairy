import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');

if (!fs.existsSync(PUBLIC_IMAGES_DIR)) {
  fs.mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true });
}

const products = [
  { name: 'Peda', base: 'peda', color1: '#FFF3E0', color2: '#FFE0B2', accent: '#E65100', icon: '🧁', desc: 'Fresh Dharwad & Mathura Style Peda' },
  { name: 'Khova', base: 'khova', color1: '#FFFDE7', color2: '#FFF59D', accent: '#F57F17', icon: '🧈', desc: 'Unsweetened Mawa / Khova' },
  { name: 'Basundi', base: 'basundi', color1: '#FFF8E1', color2: '#FFECB3', accent: '#FF6F00', icon: '🥛', desc: 'Cardamom & Dryfruit Basundi' },
  { name: 'Kalakand', base: 'kalakand', color1: '#F1F8E9', color2: '#DCEDC8', accent: '#33691E', icon: '🍰', desc: 'Soft Granular Milk Kalakand' },
  { name: 'Curd (Dahi)', base: 'curd', color1: '#FAFAFA', color2: '#E0E0E0', accent: '#2E7D32', icon: '🥣', desc: 'Pure Creamy Set Dahi' },
  { name: 'Shrikhand', base: 'shrikhand', color1: '#FFFDE7', color2: '#FFF176', accent: '#F57F17', icon: '🍨', desc: 'Kesar Saffron Shrikhand' },
  { name: 'Milk Cake', base: 'milk_cake', color1: '#EFEBE9', color2: '#D7CCC8', accent: '#4E342E', icon: '🍰', desc: 'Caramelized Dense Milk Cake' },
  { name: 'Milk', base: 'milk', color1: '#E3F2FD', color2: '#BBDEFB', accent: '#1565C0', icon: '🥛', desc: 'Farm Fresh Pure Whole Milk' },
  { name: 'Kunda', base: 'kunda', color1: '#D7CCC8', color2: '#BCAAA4', accent: '#3E2723', icon: '🍮', desc: 'Belagavi Special Sweet Kunda' },
  { name: 'Ghee', base: 'ghee', color1: '#FFF8E1', color2: '#FFE082', accent: '#FF8F00', icon: '🫙', desc: 'Aromatic Desi Cow Ghee' },
  { name: 'Lassi', base: 'lassi', color1: '#F3E5F5', color2: '#E1BEE7', accent: '#7B1FA2', icon: '🥤', desc: 'Sweet Churned Cream Lassi' },
  { name: 'Paneer', base: 'paneer', color1: '#FAFAFA', color2: '#EEEEEE', accent: '#2E7D32', icon: '🧀', desc: 'Fresh Soft Malai Paneer' },
  { name: 'Butter', base: 'butter', color1: '#FFFDE7', color2: '#FFF59D', accent: '#F9A825', icon: '🧈', desc: 'Pure Farm Churned Butter' }
];

const generateSVG = (p) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
  <defs>
    <linearGradient id="bg_${p.base}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${p.color1}" />
      <stop offset="100%" stop-color="${p.color2}" />
    </linearGradient>
    <linearGradient id="badge_${p.base}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1b5e20" />
      <stop offset="100%" stop-color="#2e7d32" />
    </linearGradient>
  </defs>

  <rect width="600" height="450" fill="url(#bg_${p.base})" rx="16" />

  <circle cx="500" cy="80" r="140" fill="#ffffff" opacity="0.3" />
  <circle cx="80" cy="380" r="160" fill="#ffffff" opacity="0.3" />

  <rect x="150" y="70" width="300" height="230" fill="#ffffff" rx="20" opacity="0.95" />
  
  <text x="300" y="195" font-size="90" text-anchor="middle" dominant-baseline="middle">${p.icon}</text>

  <text x="300" y="350" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="${p.accent}" text-anchor="middle">${p.name}</text>
  <text x="300" y="385" font-family="Arial, sans-serif" font-size="17" font-weight="bold" fill="#444444" text-anchor="middle">${p.desc}</text>

  <rect x="20" y="20" width="160" height="36" fill="url(#badge_${p.base})" rx="18" />
  <text x="100" y="43" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">100% PURE DAIRY</text>
</svg>
`;

products.forEach(p => {
  const svgContent = generateSVG(p).trim();
  
  // Save both .svg and .jpg versions
  fs.writeFileSync(path.join(PUBLIC_IMAGES_DIR, `${p.base}.svg`), svgContent, 'utf-8');
  fs.writeFileSync(path.join(PUBLIC_IMAGES_DIR, `${p.base}.jpg`), svgContent, 'utf-8');
});

// Generic placeholder
const placeholderSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
  <rect width="600" height="450" fill="#f8fafc" rx="16" />
  <text x="300" y="210" font-size="80" text-anchor="middle" dominant-baseline="middle">🥛</text>
  <text x="300" y="300" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#1b5e20" text-anchor="middle">Shri Datta Dairy Ingali</text>
</svg>
`;
fs.writeFileSync(path.join(PUBLIC_IMAGES_DIR, 'placeholder.jpg'), placeholderSVG.trim(), 'utf-8');
fs.writeFileSync(path.join(PUBLIC_IMAGES_DIR, 'placeholder.svg'), placeholderSVG.trim(), 'utf-8');

console.log('Fixed SVG placeholder images generated!');
