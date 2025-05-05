// This script generates native character sprites for the Human Runner Offline game

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
const LIGHT_BROWN = '#CD853F';
const RED = '#B22222';
const WHITE = '#FFFFFF';
const YELLOW = '#FFD700';
const GREEN = '#228B22';

// Create native character sprite
const canvas = createCanvas(40, 70);
const ctx = canvas.getContext('2d');

// Clear background
ctx.clearRect(0, 0, canvas.width, canvas.height);

// Draw native head with headband
ctx.fillStyle = MEDIUM_BROWN;
ctx.beginPath();
ctx.arc(20, 15, 10, 0, Math.PI * 2);
ctx.fill();

// Headband with feather
ctx.fillStyle = RED;
ctx.fillRect(10, 12, 20, 3);

// Feather
ctx.fillStyle = YELLOW;
ctx.beginPath();
ctx.moveTo(28, 8);
ctx.lineTo(35, 2);
ctx.lineTo(33, 10);
ctx.lineTo(28, 8);
ctx.fill();

// Face details
ctx.fillStyle = BLACK;
// Eyes
ctx.fillRect(16, 14, 2, 2);
ctx.fillRect(24, 14, 2, 2);
// Serious mouth/war paint
ctx.fillRect(18, 21, 5, 1);

// War paint stripes on cheeks
ctx.fillStyle = RED;
ctx.fillRect(10, 16, 4, 1);
ctx.fillRect(26, 16, 4, 1);

// Torso - bare chest with tribal markings
ctx.fillStyle = MEDIUM_BROWN;
ctx.fillRect(15, 25, 12, 20);

// Tribal markings on chest
ctx.fillStyle = WHITE;
ctx.beginPath();
ctx.moveTo(18, 28);
ctx.lineTo(22, 30);
ctx.lineTo(18, 32);
ctx.lineTo(22, 34);
ctx.stroke();

// Arms
ctx.fillStyle = MEDIUM_BROWN;
ctx.fillRect(8, 25, 7, 15); // Left arm
ctx.fillRect(27, 25, 7, 15); // Right arm

// Bracelets
ctx.fillStyle = GREEN;
ctx.fillRect(8, 30, 7, 2); // Left arm bracelet
ctx.fillRect(27, 30, 7, 2); // Right arm bracelet

// Bottom cloths/skirt
ctx.fillStyle = LIGHT_BROWN;
ctx.fillRect(14, 45, 14, 10);

// Decorative patterns on skirt
ctx.fillStyle = RED;
ctx.beginPath();
ctx.moveTo(14, 48);
ctx.lineTo(28, 48);
ctx.lineTo(28, 50);
ctx.lineTo(14, 50);
ctx.fill();

// Legs
ctx.fillStyle = MEDIUM_BROWN;
ctx.fillRect(17, 55, 4, 15); // Left leg
ctx.fillRect(24, 55, 4, 15); // Right leg

// Feet/moccasins
ctx.fillStyle = DARK_BROWN;
ctx.fillRect(15, 68, 6, 2); // Left foot
ctx.fillRect(23, 68, 6, 2); // Right foot

// Spear ready pose with arm back
ctx.fillStyle = MEDIUM_BROWN;
// Redraw right arm in throwing position
ctx.clearRect(27, 25, 7, 15);
ctx.beginPath();
ctx.moveTo(27, 25);
ctx.lineTo(32, 20); // Arm goes back for throwing
ctx.lineTo(37, 23);
ctx.lineTo(33, 35);
ctx.lineTo(27, 35);
ctx.fill();

// Save the image
saveCanvas(canvas, 'native');

// Create a second native sprite version for animation
const canvas2 = createCanvas(40, 70);
const ctx2 = canvas2.getContext('2d');

// Start with a copy of the first frame
ctx2.drawImage(canvas, 0, 0);

// Modify arm position to show throwing motion
ctx2.fillStyle = MEDIUM_BROWN;
// Clear and redraw right arm in different position
ctx2.clearRect(27, 20, 15, 20);
ctx2.beginPath();
ctx2.moveTo(27, 25);
ctx2.lineTo(35, 25); // Arm extended forward for throwing
ctx2.lineTo(38, 30);
ctx2.lineTo(35, 35);
ctx2.lineTo(27, 35);
ctx2.fill();

// Save the second frame
saveCanvas(canvas2, 'native_throw');

console.log("Native character sprite images generated successfully!");
