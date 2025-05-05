// This script generates more fierce-looking gray bird sprites
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
const RED = '#FF0000';
const DARK_RED = '#990000';
const WHITE = '#FFFFFF';
const YELLOW = '#FFFF00';

// Create fierce gray bird sprites (2 frames for animation)
for (let frame = 0; frame < 2; frame++) {
    const birdCanvas = createCanvas(40, 30);
    const birdCtx = birdCanvas.getContext('2d');
    
    // Clear background
    birdCtx.clearRect(0, 0, birdCanvas.width, birdCanvas.height);
    
    // Bird body - slightly larger than normal birds
    birdCtx.fillStyle = DARK_GRAY;
    birdCtx.beginPath();
    birdCtx.ellipse(20, 20, 14, 9, 0, 0, Math.PI * 2);
    birdCtx.fill();
    
    // Bird head - darker gray
    birdCtx.fillStyle = MID_GRAY;
    birdCtx.beginPath();
    birdCtx.arc(32, 16, 7, 0, Math.PI * 2);
    birdCtx.fill();
    
    // Add some texture/feathers to make it look more menacing
    birdCtx.fillStyle = BLACK;
    for (let i = 0; i < 5; i++) {
        birdCtx.beginPath();
        birdCtx.moveTo(15 + i*3, 16);
        birdCtx.lineTo(17 + i*3, 14);
        birdCtx.lineTo(19 + i*3, 16);
        birdCtx.fill();
    }
    
    // Bird beak - sharp and menacing
    birdCtx.fillStyle = DARK_RED;
    birdCtx.beginPath();
    birdCtx.moveTo(38, 15);
    birdCtx.lineTo(48, 16);
    birdCtx.lineTo(38, 18);
    birdCtx.lineTo(39, 16.5);
    birdCtx.fill();
    
    // Add some serrations to the beak to make it look more predatory
    birdCtx.fillStyle = RED;
    birdCtx.beginPath();
    birdCtx.moveTo(39, 15);
    birdCtx.lineTo(42, 14);
    birdCtx.lineTo(44, 15);
    birdCtx.lineTo(46, 14);
    birdCtx.lineTo(47, 15);
    birdCtx.lineTo(39, 15);
    birdCtx.fill();
    
    // Fierce eyes - red with yellow pupils
    birdCtx.fillStyle = RED;
    birdCtx.beginPath();
    birdCtx.arc(34, 15, 2, 0, Math.PI * 2);
    birdCtx.fill();
    
    // Pupils - slight vertical slit
    birdCtx.fillStyle = YELLOW;
    birdCtx.beginPath();
    birdCtx.ellipse(34, 15, 0.5, 1, 0, 0, Math.PI * 2);
    birdCtx.fill();
    
    // Bird wings - more angular and threatening
    birdCtx.fillStyle = DARK_GRAY;
    if (frame === 0) {
        // Wings up with sharp edges
        birdCtx.beginPath();
        birdCtx.moveTo(15, 20);
        birdCtx.lineTo(5, 3);  // More pointed
        birdCtx.lineTo(12, 4);
        birdCtx.lineTo(18, 2);
        birdCtx.lineTo(25, 5);
        birdCtx.lineTo(25, 20);
        birdCtx.fill();
    } else {
        // Wings down with sharp edges
        birdCtx.beginPath();
        birdCtx.moveTo(15, 20);
        birdCtx.lineTo(3, 28);  // More pointed
        birdCtx.lineTo(10, 30);
        birdCtx.lineTo(18, 32);
        birdCtx.lineTo(25, 28);
        birdCtx.lineTo(25, 20);
        birdCtx.fill();
    }
    
    // Bird tail - sharper and more threatening
    birdCtx.beginPath();
    birdCtx.moveTo(8, 20);
    birdCtx.lineTo(0, 13);
    birdCtx.lineTo(2, 18);
    birdCtx.lineTo(0, 22);
    birdCtx.lineTo(6, 20);
    birdCtx.fill();
    
    // Add some claws/talons at the bottom
    birdCtx.fillStyle = RED;
    birdCtx.beginPath();
    birdCtx.moveTo(15, 29);
    birdCtx.lineTo(12, 32);
    birdCtx.lineTo(15, 31);
    birdCtx.lineTo(18, 32);
    birdCtx.lineTo(21, 31);
    birdCtx.lineTo(24, 32);
    birdCtx.lineTo(21, 29);
    birdCtx.fill();
    
    // Save the image, overwriting the existing gray bird images
    saveCanvas(birdCanvas, `gray_bird_${frame}`);
}

console.log('Fierce gray bird sprites created successfully!');