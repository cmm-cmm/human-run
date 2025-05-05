// filepath: c:\Users\minhpham\Desktop\HumanRun\create_dog_jump_sprite.js
// Script tạo sprite cho chú chó đang nhảy

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
const DARK_BROWN = '#613E28';
const MEDIUM_BROWN = '#8B5A2B';
const LIGHT_BROWN = '#C09A6B';
const WHITE = '#FFFFFF';
const PINK = '#FFC0CB';

// Create dog jumping sprite
const jumpCanvas = createCanvas(45, 35);
const jumpCtx = jumpCanvas.getContext('2d');

// Clear background
jumpCtx.clearRect(0, 0, jumpCanvas.width, jumpCanvas.height);

// Draw dog body (stretched when jumping)
jumpCtx.fillStyle = MEDIUM_BROWN;
jumpCtx.beginPath();
jumpCtx.ellipse(20, 15, 14, 6, 0, 0, Math.PI * 2); // Body raised up
jumpCtx.fill();

// Draw dog head (looking forward)
jumpCtx.fillStyle = MEDIUM_BROWN;
jumpCtx.beginPath();
jumpCtx.arc(36, 14, 8, 0, Math.PI * 2);
jumpCtx.fill();

// Draw dog face details
// Alert eyes
jumpCtx.fillStyle = BLACK;
jumpCtx.beginPath();
jumpCtx.arc(38, 12, 1.5, 0, Math.PI * 2);
jumpCtx.fill();

// Nose
jumpCtx.fillStyle = BLACK;
jumpCtx.beginPath();
jumpCtx.arc(43, 14, 2, 0, Math.PI * 2);
jumpCtx.fill();

// Mouth/Jaw
jumpCtx.fillStyle = DARK_BROWN;
jumpCtx.beginPath();
jumpCtx.ellipse(39, 18, 5, 3, 0, 0, Math.PI * 2);
jumpCtx.fill();

// Ears perked up (alert)
jumpCtx.fillStyle = DARK_BROWN;
jumpCtx.beginPath();
jumpCtx.moveTo(35, 8);
jumpCtx.lineTo(30, 2);
jumpCtx.lineTo(37, 6);
jumpCtx.fill();

jumpCtx.beginPath();
jumpCtx.moveTo(38, 8);
jumpCtx.lineTo(43, 2);
jumpCtx.lineTo(41, 6);
jumpCtx.fill();

// Tail up and alert
jumpCtx.fillStyle = MEDIUM_BROWN;
jumpCtx.beginPath();
jumpCtx.moveTo(6, 14);
jumpCtx.lineTo(0, 8);
jumpCtx.lineTo(8, 12);
jumpCtx.fill();

// Front legs tucked
jumpCtx.fillStyle = MEDIUM_BROWN;
jumpCtx.fillRect(26, 20, 3, 12); // Front right leg extended down
jumpCtx.fillRect(30, 20, 3, 12); // Front left leg extended down

// Back legs bent for jumping
jumpCtx.fillRect(14, 20, 3, 5); // Back right leg bent up
jumpCtx.fillRect(18, 20, 3, 5); // Back left leg bent up

// Save the image
saveCanvas(jumpCanvas, 'dog_jump');

console.log("Dog jump sprite generated successfully!");