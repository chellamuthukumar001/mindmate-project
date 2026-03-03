const sharp = require('sharp');
const path = require('path');

const publicDir = path.resolve('public');

// Purple gradient SVG for MindMate icon
const svgIcon = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6D28D9"/>
      <stop offset="100%" stop-color="#8B5CF6"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="115" fill="url(#bg)"/>
  <text x="256" y="340" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="270" text-anchor="middle" fill="white" fill-opacity="0.92">M</text>
  <circle cx="380" cy="100" r="22" fill="white" fill-opacity="0.9"/>
  <circle cx="378" cy="100" r="10" fill="#a78bfa"/>
</svg>`);

const sizes = [64, 192, 512];

async function generate() {
    for (const size of sizes) {
        await sharp(svgIcon).resize(size, size).png().toFile(path.join(publicDir, `pwa-${size}x${size}.png`));
        console.log(`Generated pwa-${size}x${size}.png`);
    }
    await sharp(svgIcon).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
    console.log('Generated apple-touch-icon.png');
    await sharp(svgIcon).resize(32, 32).png().toFile(path.join(publicDir, 'favicon.ico'));
    console.log('Generated favicon.ico');
}

generate().then(() => console.log('All icons generated!')).catch(console.error);
