// This script creates the star jump sprite with a red shirt

const fs = require('fs');
const { createCanvas } = require('canvas');

// Function to create and save a canvas as a PNG image
function saveCanvas(canvas, fileName) {
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`./images/${fileName}.png`, buffer);
}

// Colors
const BLACK = '#000000';
const DARK_GRAY = '#333333';
const MID_GRAY = '#777777';
const LIGHT_GRAY = '#BBBBBB';
const WHITE = '#FFFFFF';
const BRIGHT_RED = '#FF0000';

// Create star jump sprite
const starJumpCanvas = createCanvas(70, 70);
const starJumpCtx = starJumpCanvas.getContext('2d');

// Clear background
starJumpCtx.clearRect(0, 0, starJumpCanvas.width, starJumpCanvas.height);

// Draw star jump pose - X shape posture
starJumpCtx.fillStyle = BLACK;

// Head with headband
starJumpCtx.beginPath();
starJumpCtx.arc(35, 15, 10, 0, Math.PI * 2);
starJumpCtx.fill();

// Headband
starJumpCtx.fillStyle = LIGHT_GRAY;
starJumpCtx.fillRect(25, 12, 20, 3);
starJumpCtx.fillStyle = BLACK;

// Torso in center - red shirt
starJumpCtx.fillStyle = BRIGHT_RED;
starJumpCtx.fillRect(30, 25, 12, 20);
starJumpCtx.fillStyle = BLACK;

// Arms raised in V shape
starJumpCtx.fillRect(20, 10, 5, 20); // Left arm raised diagonally
starJumpCtx.fillRect(45, 10, 5, 20); // Right arm raised diagonally

// Pants
starJumpCtx.fillStyle = DARK_GRAY;
starJumpCtx.fillRect(30, 45, 12, 10);

// Legs spread wide in X shape
starJumpCtx.fillRect(15, 55, 15, 5); // Left leg spread outward
starJumpCtx.fillRect(42, 55, 15, 5); // Right leg spread outward

// Shoes
starJumpCtx.fillStyle = MID_GRAY;
starJumpCtx.fillRect(10, 55, 10, 5); // Left shoe
starJumpCtx.fillRect(52, 55, 10, 5); // Right shoe

// Add small backpack
starJumpCtx.fillStyle = LIGHT_GRAY;
starJumpCtx.fillRect(42, 30, 5, 12);

// Add slightly open mouth (exertion expression)
starJumpCtx.fillStyle = WHITE;
starJumpCtx.fillRect(34, 20, 3, 2);

// Save the image
saveCanvas(starJumpCanvas, 'player_star_jump');

// Update existing jumping sprite to have red shirt too
const jumpCanvas = createCanvas(50, 70);
const jumpCtx = jumpCanvas.getContext('2d');

// Clear background
jumpCtx.clearRect(0, 0, jumpCanvas.width, jumpCanvas.height);

// Draw jumping pose
jumpCtx.fillStyle = BLACK;

// Head with headband
jumpCtx.beginPath();
jumpCtx.arc(25, 15, 10, 0, Math.PI * 2);
jumpCtx.fill();

// Headband
jumpCtx.fillStyle = LIGHT_GRAY;
jumpCtx.fillRect(15, 12, 20, 3);
jumpCtx.fillStyle = BLACK;

// Torso - RED shirt
jumpCtx.fillStyle = BRIGHT_RED;
jumpCtx.fillRect(20, 25, 15, 20);
jumpCtx.fillStyle = BLACK;

// Arms raised for jump
jumpCtx.fillRect(15, 20, 5, 15); // Left arm up
jumpCtx.fillRect(35, 20, 5, 15); // Right arm up

// Pants
jumpCtx.fillStyle = DARK_GRAY;
jumpCtx.fillRect(20, 45, 15, 15);

// Legs spread for jump
jumpCtx.fillRect(17, 60, 6, 10); // Left leg spread
jumpCtx.fillRect(32, 60, 6, 10); // Right leg spread

// Shoes
jumpCtx.fillStyle = MID_GRAY;
jumpCtx.fillRect(15, 70, 8, 5); // Left shoe
jumpCtx.fillRect(30, 70, 8, 5); // Right shoe

// Add small backpack
jumpCtx.fillStyle = LIGHT_GRAY;
jumpCtx.fillRect(33, 30, 5, 12);

// Save the image
saveCanvas(jumpCanvas, 'player_jump');

// Update all running sprites to have red shirts too
for (let frame = 0; frame < 3; frame++) {
    const canvas = createCanvas(50, 70);
    const ctx = canvas.getContext('2d');
    
    // Clear background (transparent)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw runner - athletic male in tracksuit
    ctx.fillStyle = BLACK;
    
    // Head with headband
    ctx.beginPath();
    ctx.arc(25, 15, 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Headband
    ctx.fillStyle = LIGHT_GRAY;
    ctx.fillRect(15, 12, 20, 3);
    ctx.fillStyle = BLACK;
    
    // Torso - RED shirt
    ctx.fillStyle = BRIGHT_RED;
    ctx.fillRect(20, 25, 15, 20);
    ctx.fillStyle = BLACK;
    
    // Arms
    const armPosition = frame % 3;
    if (armPosition === 0) {
        // Arms forward and back
        ctx.fillRect(15, 25, 5, 15); // Left arm forward
        ctx.fillRect(35, 30, 5, 15); // Right arm back
    } else if (armPosition === 1) {
        // Arms middle
        ctx.fillRect(15, 28, 5, 15);
        ctx.fillRect(35, 28, 5, 15);
    } else {
        // Arms opposite of frame 0
        ctx.fillRect(15, 30, 5, 15); // Left arm back
        ctx.fillRect(35, 25, 5, 15); // Right arm forward
    }
    
    // Pants
    ctx.fillStyle = DARK_GRAY;
    ctx.fillRect(20, 45, 15, 15);
    
    // Legs
    if (frame === 0) {
        // Right leg forward, left leg back
        ctx.fillRect(23, 60, 6, 10); // Right leg
        ctx.fillRect(28, 60, 6, 5);  // Left leg bent
    } else if (frame === 1) {
        // Legs in middle position
        ctx.fillRect(23, 60, 6, 8);
        ctx.fillRect(28, 60, 6, 8);
    } else {
        // Left leg forward, right leg back
        ctx.fillRect(23, 60, 6, 5);  // Right leg bent
        ctx.fillRect(28, 60, 6, 10); // Left leg
    }
    
    // Shoes
    ctx.fillStyle = MID_GRAY;
    if (frame === 0) {
        ctx.fillRect(21, 70, 8, 5); // Right shoe
        ctx.fillRect(27, 65, 8, 5); // Left shoe
    } else if (frame === 1) {
        ctx.fillRect(21, 68, 8, 5);
        ctx.fillRect(27, 68, 8, 5);
    } else {
        ctx.fillRect(21, 65, 8, 5); // Right shoe
        ctx.fillRect(27, 70, 8, 5); // Left shoe
    }
    
    // Add small backpack
    ctx.fillStyle = LIGHT_GRAY;
    ctx.fillRect(33, 30, 5, 12);
    
    // Save the image
    saveCanvas(canvas, `player_run_${frame}`);
}

// Update ducking sprite to have red shirt
const duckCanvas = createCanvas(50, 35);
const duckCtx = duckCanvas.getContext('2d');

// Clear background
duckCtx.clearRect(0, 0, duckCanvas.width, duckCanvas.height);

// Draw ducking pose
duckCtx.fillStyle = BLACK;

// Head with headband (lowered)
duckCtx.beginPath();
duckCtx.arc(25, 15, 10, 0, Math.PI * 2);
duckCtx.fill();

// Headband
duckCtx.fillStyle = LIGHT_GRAY;
duckCtx.fillRect(15, 12, 20, 3);
duckCtx.fillStyle = BLACK;

// Crouched body - RED shirt
duckCtx.fillStyle = BRIGHT_RED;
duckCtx.fillRect(15, 20, 25, 10); // Torso flattened
duckCtx.fillStyle = BLACK;

// Arms tucked
duckCtx.fillRect(12, 20, 3, 10); // Left arm
duckCtx.fillRect(40, 20, 3, 10); // Right arm

// Legs crouched
duckCtx.fillStyle = DARK_GRAY;
duckCtx.fillRect(20, 25, 15, 10); // Pants

// Shoes
duckCtx.fillStyle = MID_GRAY;
duckCtx.fillRect(15, 30, 8, 5); // Left shoe
duckCtx.fillRect(32, 30, 8, 5); // Right shoe

// Save the image
saveCanvas(duckCanvas, 'player_duck');