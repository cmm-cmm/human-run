// This script generates spear sprite for the Human Runner Offline game

const fs = require('fs');
const { createCanvas } = require('canvas');

// Function to create and save a canvas as a PNG image
function saveCanvas(canvas, fileName) {
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`./images/${fileName}.png`, buffer);
    console.log(`Created: images/${fileName}.png`);
}

// Colors
const BLACK = '#000000';
const DARK_BROWN = '#8B4513';
const MEDIUM_BROWN = '#A0522D';
const LIGHT_BROWN = '#D2B48C';
const GRAY = '#808080';
const DARK_GRAY = '#696969';
const SILVER = '#C0C0C0';

// Create spear sprite
const canvas = createCanvas(60, 10);
const ctx = canvas.getContext('2d');

// Clear background
ctx.clearRect(0, 0, canvas.width, canvas.height);

// Draw spear shaft (wooden part)
ctx.fillStyle = MEDIUM_BROWN;
ctx.fillRect(10, 4, 40, 2);

// Add wood grain texture to the shaft
ctx.fillStyle = DARK_BROWN;
for (let i = 0; i < 5; i++) {
    ctx.fillRect(15 + i * 8, 3, 3, 1); // Top grain
    ctx.fillRect(12 + i * 8, 6, 4, 1); // Bottom grain
}

// Add wrapped area for grip
ctx.fillStyle = LIGHT_BROWN;
ctx.fillRect(30, 3, 10, 4);

// Add binding/wrapping details
ctx.fillStyle = BLACK;
for (let i = 0; i < 5; i++) {
    ctx.fillRect(31 + i * 2, 3, 1, 4);
}

// Draw spear tip (stone/metal)
ctx.fillStyle = SILVER;
// Main arrowhead/spearhead shape
ctx.beginPath();
ctx.moveTo(0, 5);  // Tip point
ctx.lineTo(10, 2); // Top edge connection to shaft
ctx.lineTo(10, 8); // Bottom edge connection to shaft
ctx.closePath();
ctx.fill();

// Add shading/detail to spearhead
ctx.fillStyle = DARK_GRAY;
ctx.beginPath();
ctx.moveTo(0, 5);
ctx.lineTo(7, 3); // Inner detail line
ctx.lineTo(10, 4);
ctx.lineTo(7, 5);
ctx.closePath();
ctx.fill();

// Add decorative feathers at the end
ctx.fillStyle = 'red';
// Top feather
ctx.beginPath();
ctx.moveTo(50, 3);
ctx.lineTo(60, 0);
ctx.lineTo(55, 4);
ctx.closePath();
ctx.fill();

// Bottom feather
ctx.beginPath();
ctx.moveTo(50, 7);
ctx.lineTo(60, 10);
ctx.lineTo(55, 6);
ctx.closePath();
ctx.fill();

// Save the image
saveCanvas(canvas, 'spear');

console.log("Spear sprite image generated successfully!");
