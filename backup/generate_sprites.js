// This script generates pixel art sprites for the Human Runner Offline game
// Run this script once to generate the sprite images

const fs = require('fs');
const { createCanvas } = require('canvas');

// Create images directory if it doesn't exist
if (!fs.existsSync('./images')) {
    fs.mkdirSync('./images');
}

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

// Create player running sprites (3 frames)
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
    
    // Torso (t-shirt)
    ctx.fillStyle = WHITE;
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

// Create player jumping sprite
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

// Torso (t-shirt) - slightly tilted
jumpCtx.fillStyle = WHITE;
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

// Create player ducking sprite
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

// Crouched body
duckCtx.fillStyle = WHITE;
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

// Create cactus obstacles (3 sizes)
// Small cactus
const smallCactusCanvas = createCanvas(25, 50);
const smallCactusCtx = smallCactusCanvas.getContext('2d');

smallCactusCtx.fillStyle = BLACK;
// Main stem
smallCactusCtx.fillRect(10, 0, 8, 50);
// Left branch
smallCactusCtx.fillRect(0, 20, 10, 6);
// Right branch
smallCactusCtx.fillRect(18, 15, 7, 5);

// Add texture (spines)
smallCactusCtx.fillStyle = DARK_GRAY;
for (let i = 0; i < 10; i++) {
    smallCactusCtx.fillRect(9, i * 5 + 2, 1, 1);
    smallCactusCtx.fillRect(18, i * 5, 1, 1);
}

saveCanvas(smallCactusCanvas, 'cactus_small');

// Medium cactus
const mediumCactusCanvas = createCanvas(35, 60);
const mediumCactusCtx = mediumCactusCanvas.getContext('2d');

mediumCactusCtx.fillStyle = BLACK;
// Main stem
mediumCactusCtx.fillRect(15, 0, 10, 60);
// Left branches
mediumCactusCtx.fillRect(0, 15, 15, 7);
mediumCactusCtx.fillRect(5, 35, 10, 6);
// Right branch
mediumCactusCtx.fillRect(25, 25, 10, 8);

// Add texture (spines)
mediumCactusCtx.fillStyle = DARK_GRAY;
for (let i = 0; i < 12; i++) {
    mediumCactusCtx.fillRect(14, i * 5 + 2, 1, 1);
    mediumCactusCtx.fillRect(25, i * 5, 1, 1);
}

saveCanvas(mediumCactusCanvas, 'cactus_medium');

// Large cactus
const largeCactusCanvas = createCanvas(45, 70);
const largeCactusCtx = largeCactusCanvas.getContext('2d');

largeCactusCtx.fillStyle = BLACK;
// Main stem
largeCactusCtx.fillRect(20, 0, 12, 70);
// Left branches
largeCactusCtx.fillRect(0, 20, 20, 8);
largeCactusCtx.fillRect(5, 45, 15, 7);
// Right branches
largeCactusCtx.fillRect(32, 15, 13, 8);
largeCactusCtx.fillRect(32, 35, 13, 7);

// Add texture (spines)
largeCactusCtx.fillStyle = DARK_GRAY;
for (let i = 0; i < 14; i++) {
    largeCactusCtx.fillRect(19, i * 5 + 2, 1, 1);
    largeCactusCtx.fillRect(32, i * 5, 1, 1);
}

saveCanvas(largeCactusCanvas, 'cactus_large');

// Create bird sprites (2 frames for animation)
for (let frame = 0; frame < 2; frame++) {
    const birdCanvas = createCanvas(40, 30);
    const birdCtx = birdCanvas.getContext('2d');
    
    birdCtx.fillStyle = BLACK;
    
    // Bird body
    birdCtx.beginPath();
    birdCtx.ellipse(20, 20, 12, 8, 0, 0, Math.PI * 2);
    birdCtx.fill();
    
    // Bird head
    birdCtx.beginPath();
    birdCtx.arc(32, 16, 6, 0, Math.PI * 2);
    birdCtx.fill();
    
    // Bird beak
    birdCtx.fillStyle = DARK_GRAY;
    birdCtx.beginPath();
    birdCtx.moveTo(38, 16);
    birdCtx.lineTo(45, 16);
    birdCtx.lineTo(38, 18);
    birdCtx.fill();
    
    // Bird eye
    birdCtx.fillStyle = WHITE;
    birdCtx.beginPath();
    birdCtx.arc(34, 15, 1, 0, Math.PI * 2);
    birdCtx.fill();
    
    // Bird wings - different position based on frame
    birdCtx.fillStyle = BLACK;
    if (frame === 0) {
        // Wings up
        birdCtx.beginPath();
        birdCtx.moveTo(15, 20);
        birdCtx.lineTo(5, 5);
        birdCtx.lineTo(25, 5);
        birdCtx.lineTo(25, 20);
        birdCtx.fill();
    } else {
        // Wings down
        birdCtx.beginPath();
        birdCtx.moveTo(15, 20);
        birdCtx.lineTo(5, 30);
        birdCtx.lineTo(25, 30);
        birdCtx.lineTo(25, 20);
        birdCtx.fill();
    }
    
    // Bird tail
    birdCtx.beginPath();
    birdCtx.moveTo(8, 20);
    birdCtx.lineTo(0, 15);
    birdCtx.lineTo(5, 20);
    birdCtx.fill();
    
    saveCanvas(birdCanvas, `bird_${frame}`);
}

// Create ground sprite
const groundCanvas = createCanvas(50, 20);
const groundCtx = groundCanvas.getContext('2d');

groundCtx.fillStyle = DARK_GRAY;
groundCtx.fillRect(0, 0, 50, 20);

// Add texture to ground
groundCtx.fillStyle = MID_GRAY;
for (let i = 0; i < 10; i++) {
    groundCtx.fillRect(i * 5 + 2, 0, 1, 2);
    groundCtx.fillRect(i * 5, 5, 2, 1);
    groundCtx.fillRect(i * 5 + 3, 12, 2, 1);
}

saveCanvas(groundCanvas, 'ground');

// Create mountain background
const mountainCanvas = createCanvas(120, 60);
const mountainCtx = mountainCanvas.getContext('2d');

mountainCtx.fillStyle = MID_GRAY;
// Draw mountain silhouette
mountainCtx.beginPath();
mountainCtx.moveTo(0, 60);
mountainCtx.lineTo(30, 10);
mountainCtx.lineTo(50, 30);
mountainCtx.lineTo(80, 5);
mountainCtx.lineTo(110, 40);
mountainCtx.lineTo(120, 60);
mountainCtx.fill();

// Add some details/texture
mountainCtx.fillStyle = DARK_GRAY;
mountainCtx.beginPath();
mountainCtx.moveTo(30, 10);
mountainCtx.lineTo(40, 20);
mountainCtx.lineTo(35, 25);
mountainCtx.fill();

mountainCtx.beginPath();
mountainCtx.moveTo(80, 5);
mountainCtx.lineTo(90, 15);
mountainCtx.lineTo(85, 20);
mountainCtx.fill();

saveCanvas(mountainCanvas, 'mountain');