// filepath: c:\Users\minhpham\Desktop\HumanRun\create_dog_sprites.js
// This script generates dog sprites for the Human Runner Offline game

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

// Create dog running sprites (3 frames)
for (let frame = 0; frame < 3; frame++) {
    const canvas = createCanvas(45, 35);
    const ctx = canvas.getContext('2d');
    
    // Clear background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw dog body
    ctx.fillStyle = MEDIUM_BROWN;
    ctx.beginPath();
    ctx.ellipse(20, 22, 12, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw dog head
    ctx.fillStyle = MEDIUM_BROWN;
    ctx.beginPath();
    ctx.arc(35, 18, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw dog face details
    // Eyes
    ctx.fillStyle = BLACK;
    ctx.beginPath();
    ctx.arc(37, 16, 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Nose
    ctx.fillStyle = BLACK;
    ctx.beginPath();
    ctx.arc(42, 18, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Mouth/Jaw
    ctx.fillStyle = DARK_BROWN;
    ctx.beginPath();
    ctx.ellipse(39, 22, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Tongue (when barking - frame 2)
    if (frame === 2) {
        ctx.fillStyle = PINK;
        ctx.beginPath();
        ctx.ellipse(42, 23, 2, 1, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Ears
    ctx.fillStyle = DARK_BROWN;
    ctx.beginPath();
    ctx.moveTo(35, 12);
    ctx.lineTo(30, 5);
    ctx.lineTo(38, 10);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(37, 13);
    ctx.lineTo(42, 6);
    ctx.lineTo(40, 12);
    ctx.fill();
    
    // Tail
    ctx.fillStyle = MEDIUM_BROWN;
    // Wag tail based on frame
    if (frame === 0) {
        ctx.beginPath();
        ctx.moveTo(8, 20);
        ctx.lineTo(0, 15);
        ctx.lineTo(4, 22);
        ctx.fill();
    } else if (frame === 1) {
        ctx.beginPath();
        ctx.moveTo(8, 20);
        ctx.lineTo(2, 20);
        ctx.lineTo(5, 22);
        ctx.fill();
    } else {
        ctx.beginPath();
        ctx.moveTo(8, 20);
        ctx.lineTo(0, 25);
        ctx.lineTo(4, 18);
        ctx.fill();
    }
    
    // Draw legs based on running frame
    ctx.fillStyle = MEDIUM_BROWN;
    
    if (frame === 0) {
        // Front right leg forward, back right leg back
        ctx.fillRect(30, 25, 3, 8); // Front right leg
        ctx.fillRect(12, 25, 3, 6); // Back right leg
        
        // Front left leg back, back left leg forward
        ctx.fillRect(24, 25, 3, 6); // Front left leg
        ctx.fillRect(18, 25, 3, 8); // Back left leg
    } else if (frame === 1) {
        // Legs in middle position
        ctx.fillRect(27, 25, 3, 7); // Front right leg
        ctx.fillRect(15, 25, 3, 7); // Back right leg
        
        ctx.fillRect(24, 25, 3, 7); // Front left leg
        ctx.fillRect(18, 25, 3, 7); // Back left leg
    } else {
        // Front right leg back, back right leg forward
        ctx.fillRect(27, 25, 3, 6); // Front right leg
        ctx.fillRect(15, 25, 3, 8); // Back right leg
        
        // Front left leg forward, back left leg back
        ctx.fillRect(30, 25, 3, 8); // Front left leg
        ctx.fillRect(12, 25, 3, 6); // Back left leg
    }
    
    // Add barking effect (on frame 2)
    if (frame === 2) {
        ctx.fillStyle = WHITE;
        // "Bark" text or teeth indicator
        ctx.beginPath();
        ctx.arc(43, 20, 1, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(41, 21, 1, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Save the image
    saveCanvas(canvas, `dog_run_${frame}`);
}

// Create dog attack sprite (with mouth open and lunging)
const attackCanvas = createCanvas(45, 35);
const attackCtx = attackCanvas.getContext('2d');

// Clear background
attackCtx.clearRect(0, 0, attackCanvas.width, attackCanvas.height);

// Draw dog body (stretched during attack lunge)
attackCtx.fillStyle = MEDIUM_BROWN;
attackCtx.beginPath();
attackCtx.ellipse(17, 22, 14, 7, 0, 0, Math.PI * 2);
attackCtx.fill();

// Draw dog head (lunging forward)
attackCtx.fillStyle = MEDIUM_BROWN;
attackCtx.beginPath();
attackCtx.arc(36, 18, 8, 0, Math.PI * 2);
attackCtx.fill();

// Draw dog face details
// Angry eyes
attackCtx.fillStyle = BLACK;
attackCtx.beginPath();
attackCtx.arc(38, 16, 1.5, 0, Math.PI * 2);
attackCtx.fill();

// Add angry eyebrows
attackCtx.beginPath();
attackCtx.moveTo(36, 14);
attackCtx.lineTo(40, 13);
attackCtx.lineTo(40, 14);
attackCtx.lineTo(36, 15);
attackCtx.fill();

// Nose
attackCtx.fillStyle = BLACK;
attackCtx.beginPath();
attackCtx.arc(43, 18, 1.5, 0, Math.PI * 2);
attackCtx.fill();

// Open mouth with teeth for attack
attackCtx.fillStyle = DARK_BROWN;
attackCtx.beginPath();
attackCtx.ellipse(39, 23, 6, 4, 0, 0, Math.PI, false);
attackCtx.fill();

// Teeth
attackCtx.fillStyle = WHITE;
for (let i = 0; i < 4; i++) {
    attackCtx.fillRect(36 + i * 2, 23, 1, 2);
}

// Ears flat back (aggressive posture)
attackCtx.fillStyle = DARK_BROWN;
attackCtx.beginPath();
attackCtx.moveTo(35, 12);
attackCtx.lineTo(28, 8);
attackCtx.lineTo(33, 14);
attackCtx.fill();

attackCtx.beginPath();
attackCtx.moveTo(37, 13);
attackCtx.lineTo(42, 8);
attackCtx.lineTo(39, 14);
attackCtx.fill();

// Tail straight (alert position)
attackCtx.fillStyle = MEDIUM_BROWN;
attackCtx.beginPath();
attackCtx.moveTo(4, 20);
attackCtx.lineTo(0, 17);
attackCtx.lineTo(5, 22);
attackCtx.fill();

// Draw legs in lunging position
attackCtx.fillStyle = MEDIUM_BROWN;
attackCtx.fillRect(30, 25, 4, 8); // Front right leg stretched
attackCtx.fillRect(12, 25, 3, 8); // Back right leg stretched
attackCtx.fillRect(24, 25, 4, 8); // Front left leg stretched
attackCtx.fillRect(6, 25, 3, 8);  // Back left leg stretched

// Save the image
saveCanvas(attackCanvas, 'dog_attack');

console.log("Dog sprite images generated successfully!");