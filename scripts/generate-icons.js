const fs = require('fs');
const path = require('path');

// Create SVG template for Eco-fuel icon
const createSvgIcon = (size) => {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#059669;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0284c7;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="${size/2}" cy="${size/2}" r="${size/2-4}" fill="url(#grad1)" stroke="#ffffff" stroke-width="2"/>
  
  <!-- Fuel drop icon -->
  <g transform="translate(${size*0.25}, ${size*0.2})">
    <!-- Drop shape -->
    <path d="M${size*0.25} ${size*0.15} C${size*0.25} ${size*0.35}, ${size*0.4} ${size*0.5}, ${size*0.25} ${size*0.6} C${size*0.1} ${size*0.5}, ${size*0.25} ${size*0.35}, ${size*0.25} ${size*0.15} Z" 
          fill="#ffffff" opacity="0.9"/>
    
    <!-- Leaf accent -->
    <path d="M${size*0.32} ${size*0.25} C${size*0.42} ${size*0.22}, ${size*0.45} ${size*0.32}, ${size*0.38} ${size*0.38} C${size*0.35} ${size*0.35}, ${size*0.32} ${size*0.3}, ${size*0.32} ${size*0.25} Z" 
          fill="#10b981" opacity="0.8"/>
  </g>
  
  <!-- Text at bottom -->
  <text x="${size/2}" y="${size*0.85}" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="${size*0.08}" font-weight="bold">ECO</text>
</svg>`;
};

// Icon sizes for PWA
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG icons
iconSizes.forEach(size => {
  const svgContent = createSvgIcon(size);
  const fileName = `icon-${size}x${size}.svg`;
  const filePath = path.join(iconsDir, fileName);
  
  fs.writeFileSync(filePath, svgContent);
  console.log(`Generated ${fileName}`);
});

// Generate Apple touch icons
const appleSizes = [57, 60, 72, 76, 114, 120, 144, 152, 180];
appleSizes.forEach(size => {
  const svgContent = createSvgIcon(size);
  const fileName = `apple-touch-icon-${size}x${size}.svg`;
  const filePath = path.join(iconsDir, fileName);
  
  fs.writeFileSync(filePath, svgContent);
  console.log(`Generated Apple icon ${fileName}`);
});

// Generate MS tile icon
const msSvgContent = createSvgIcon(144);
const msFileName = 'ms-icon-144x144.svg';
const msFilePath = path.join(iconsDir, msFileName);
fs.writeFileSync(msFilePath, msSvgContent);
console.log(`Generated MS tile icon ${msFileName}`);

// Create favicon.ico alternative
const faviconSvg = createSvgIcon(32);
const faviconPath = path.join(iconsDir, 'favicon.svg');
fs.writeFileSync(faviconPath, faviconSvg);
console.log('Generated favicon.svg');

console.log('✅ All PWA icons generated successfully!');
console.log('📝 Note: For production, convert SVG icons to PNG format for better compatibility.'); 