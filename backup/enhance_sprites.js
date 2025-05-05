// This script enhances the game with clouds and improved character animation

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
const CLOUD_COLOR = '#EEEEEE';

// Create cloud sprites in different sizes
for (let i = 0; i < 3; i++) {
    const cloudWidth = 80 + i * 40; // Varying cloud sizes
    const cloudHeight = 30 + i * 10;
    
    const cloudCanvas = createCanvas(cloudWidth, cloudHeight);
    const cloudCtx = cloudCanvas.getContext('2d');
    
    // Clear background
    cloudCtx.clearRect(0, 0, cloudWidth, cloudHeight);
    
    // Set cloud color with transparency
    cloudCtx.fillStyle = 'rgba(238, 238, 238, 0.8)';
    
    // Draw stylized cloud - multiple overlapping circles for soft edges
    const centerY = cloudHeight / 2;
    
    // Main body of cloud
    cloudCtx.beginPath();
    cloudCtx.arc(cloudWidth / 2, centerY, cloudHeight / 2, 0, Math.PI * 2);
    cloudCtx.fill();
    
    // Additional cloud puffs of varying sizes
    const puffCount = 3 + i;
    for (let j = 0; j < puffCount; j++) {
        const puffX = j * (cloudWidth / puffCount) + cloudWidth / (puffCount * 2);
        const puffSize = (cloudHeight / 2) * (0.7 + Math.random() * 0.5);
        
        cloudCtx.beginPath();
        cloudCtx.arc(puffX, centerY - 5 + Math.random() * 10, puffSize, 0, Math.PI * 2);
        cloudCtx.fill();
    }
    
    // Add light shadow/highlight
    cloudCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let j = 0; j < puffCount - 1; j++) {
        const puffX = j * (cloudWidth / puffCount) + cloudWidth / (puffCount * 2);
        const puffSize = (cloudHeight / 2) * 0.6 * (0.7 + Math.random() * 0.3);
        
        cloudCtx.beginPath();
        cloudCtx.arc(puffX, centerY - 8, puffSize, 0, Math.PI * 2);
        cloudCtx.fill();
    }
    
    saveCanvas(cloudCanvas, `cloud_${i}`);
}

// Update the running sprites with more detailed leg animations
for (let frame = 0; frame < 3; frame++) {
    const canvas = createCanvas(50, 70);
    const ctx = canvas.getContext('2d');
    
    // Clear background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw runner with enhanced detail
    ctx.fillStyle = BLACK;
    
    // Head with headband
    ctx.beginPath();
    ctx.arc(25, 15, 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Add facial features - focused expression
    ctx.fillStyle = WHITE;
    // Eyes
    ctx.fillRect(22, 13, 2, 2);
    ctx.fillRect(30, 13, 2, 2);
    // Determined mouth
    ctx.fillStyle = BLACK;
    ctx.fillRect(25, 20, 4, 1);
    
    // Headband
    ctx.fillStyle = LIGHT_GRAY;
    ctx.fillRect(15, 12, 20, 3);
    ctx.fillStyle = BLACK;
    
    // Torso - red shirt
    ctx.fillStyle = BRIGHT_RED;
    ctx.fillRect(20, 25, 15, 20);
    
    // Add shirt details - simple folds
    ctx.fillStyle = '#E00000'; // Slightly darker red for details
    ctx.fillRect(23, 28, 2, 13); // Shirt fold line
    ctx.fillRect(30, 30, 2, 10); // Shirt fold line
    
    // Arms with better definition
    ctx.fillStyle = BLACK;
    const armPosition = frame % 3;
    if (armPosition === 0) {
        // Arms forward and back
        ctx.fillRect(15, 25, 5, 15); // Left arm forward
        // Add elbow definition
        ctx.fillRect(14, 30, 2, 5);
        
        ctx.fillRect(35, 30, 5, 15); // Right arm back
        // Add elbow definition
        ctx.fillRect(39, 35, 2, 5);
    } else if (armPosition === 1) {
        // Arms middle
        ctx.fillRect(15, 28, 5, 15);
        ctx.fillRect(35, 28, 5, 15);
        // Add elbow definition
        ctx.fillRect(14, 33, 2, 5);
        ctx.fillRect(39, 33, 2, 5);
    } else {
        // Arms opposite of frame 0
        ctx.fillRect(15, 30, 5, 15); // Left arm back
        // Add elbow definition
        ctx.fillRect(14, 35, 2, 5);
        
        ctx.fillRect(35, 25, 5, 15); // Right arm forward
        // Add elbow definition
        ctx.fillRect(39, 30, 2, 5);
    }
    
    // Pants with folds
    ctx.fillStyle = DARK_GRAY;
    ctx.fillRect(20, 45, 15, 15);
    
    // Add pants folds/details
    ctx.fillStyle = '#2A2A2A'; // Slightly darker gray
    ctx.fillRect(23, 47, 2, 10); // Left fold
    ctx.fillRect(30, 49, 2, 8); // Right fold
    
    // Enhanced legs with anatomical structure
    if (frame === 0) {
        // Right leg forward (heel strike), left leg back
        
        // Right leg - extended forward
        ctx.fillStyle = DARK_GRAY;
        // Thigh
        ctx.beginPath();
        ctx.moveTo(26, 60);
        ctx.lineTo(32, 60);
        ctx.lineTo(30, 68);
        ctx.lineTo(24, 68);
        ctx.fill();
        
        // Calf/lower leg
        ctx.beginPath();
        ctx.moveTo(24, 68);
        ctx.lineTo(30, 68);
        ctx.lineTo(28, 75);
        ctx.lineTo(22, 75);
        ctx.fill();
        
        // Left leg - bent back
        // Thigh bent
        ctx.beginPath();
        ctx.moveTo(20, 60);
        ctx.lineTo(26, 60);
        ctx.lineTo(23, 67);
        ctx.lineTo(19, 65);
        ctx.fill();
        
        // Calf bent up
        ctx.beginPath();
        ctx.moveTo(19, 65);
        ctx.lineTo(23, 67);
        ctx.lineTo(18, 70);
        ctx.lineTo(16, 67);
        ctx.fill();
        
        // Shoes with details
        ctx.fillStyle = MID_GRAY;
        
        // Right shoe - front foot landing
        ctx.beginPath();
        ctx.moveTo(22, 75);
        ctx.lineTo(28, 75);
        ctx.lineTo(33, 76);
        ctx.lineTo(33, 78);
        ctx.lineTo(22, 78);
        ctx.fill();
        
        // Left shoe - back foot lifted
        ctx.beginPath();
        ctx.moveTo(16, 67);
        ctx.lineTo(18, 70);
        ctx.lineTo(16, 72);
        ctx.lineTo(13, 71);
        ctx.lineTo(14, 68);
        ctx.fill();
        
        // Add shoe details - treads
        ctx.fillStyle = '#555555';
        ctx.fillRect(23, 78, 9, 1); // Right shoe tread
        ctx.fillRect(14, 71, 2, 1); // Left shoe tread
        
    } else if (frame === 1) {
        // Mid-stride position
        
        // Both legs under body, slight bend
        ctx.fillStyle = DARK_GRAY;
        
        // Right leg - vertical, slight bend
        ctx.beginPath();
        ctx.moveTo(24, 60);
        ctx.lineTo(29, 60);
        ctx.lineTo(27, 70);
        ctx.lineTo(22, 70);
        ctx.fill();
        
        // Left leg - vertical, slight bend
        ctx.beginPath();
        ctx.moveTo(21, 60);
        ctx.lineTo(26, 60);
        ctx.lineTo(24, 70);
        ctx.lineTo(19, 70);
        ctx.fill();
        
        // Shoes
        ctx.fillStyle = MID_GRAY;
        
        // Right shoe
        ctx.beginPath();
        ctx.moveTo(22, 70);
        ctx.lineTo(27, 70);
        ctx.lineTo(30, 71);
        ctx.lineTo(30, 74);
        ctx.lineTo(22, 74);
        ctx.fill();
        
        // Left shoe
        ctx.beginPath();
        ctx.moveTo(19, 70);
        ctx.lineTo(24, 70);
        ctx.lineTo(27, 71);
        ctx.lineTo(27, 74);
        ctx.lineTo(19, 74);
        ctx.fill();
        
        // Add shoe details
        ctx.fillStyle = '#555555';
        ctx.fillRect(22, 74, 8, 1); // Right shoe tread
        ctx.fillRect(19, 74, 8, 1); // Left shoe tread
        
    } else {
        // Left leg forward (heel strike), right leg back - mirror of frame 0
        
        // Left leg - extended forward
        ctx.fillStyle = DARK_GRAY;
        // Thigh
        ctx.beginPath();
        ctx.moveTo(18, 60);
        ctx.lineTo(24, 60);
        ctx.lineTo(22, 68);
        ctx.lineTo(16, 68);
        ctx.fill();
        
        // Calf/lower leg
        ctx.beginPath();
        ctx.moveTo(16, 68);
        ctx.lineTo(22, 68);
        ctx.lineTo(20, 75);
        ctx.lineTo(14, 75);
        ctx.fill();
        
        // Right leg - bent back
        // Thigh bent
        ctx.beginPath();
        ctx.moveTo(24, 60);
        ctx.lineTo(30, 60);
        ctx.lineTo(27, 65);
        ctx.lineTo(23, 67);
        ctx.fill();
        
        // Calf bent up
        ctx.beginPath();
        ctx.moveTo(27, 65);
        ctx.lineTo(23, 67);
        ctx.lineTo(28, 70);
        ctx.lineTo(30, 67);
        ctx.fill();
        
        // Shoes with details
        ctx.fillStyle = MID_GRAY;
        
        // Left shoe - front foot landing
        ctx.beginPath();
        ctx.moveTo(14, 75);
        ctx.lineTo(20, 75);
        ctx.lineTo(25, 76);
        ctx.lineTo(25, 78);
        ctx.lineTo(14, 78);
        ctx.fill();
        
        // Right shoe - back foot lifted
        ctx.beginPath();
        ctx.moveTo(30, 67);
        ctx.lineTo(28, 70);
        ctx.lineTo(30, 72);
        ctx.lineTo(33, 71);
        ctx.lineTo(32, 68);
        ctx.fill();
        
        // Add shoe details - treads
        ctx.fillStyle = '#555555';
        ctx.fillRect(15, 78, 9, 1); // Left shoe tread
        ctx.fillRect(30, 71, 3, 1); // Right shoe tread
    }
    
    // Motion lines for running (horizontal speed lines)
    if (frame === 0 || frame === 2) {
        ctx.strokeStyle = LIGHT_GRAY;
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
            const y = 55 + i * 7;
            ctx.beginPath();
            ctx.moveTo(8, y);
            ctx.lineTo(12, y);
            ctx.stroke();
        }
    }
    
    // Add small backpack
    ctx.fillStyle = LIGHT_GRAY;
    ctx.fillRect(33, 30, 5, 12);
    
    // Add backpack details
    ctx.fillStyle = MID_GRAY;
    ctx.fillRect(33, 33, 5, 1); // Strap or zipper detail
    ctx.fillRect(35, 36, 2, 4); // Pocket detail
    
    saveCanvas(canvas, `player_run_${frame}`);
}

// Update the jump pose with enhanced leg detail
const jumpCanvas = createCanvas(50, 70);
const jumpCtx = jumpCanvas.getContext('2d');

// Clear background
jumpCtx.clearRect(0, 0, jumpCanvas.width, jumpCanvas.height);

// Draw jumping pose with enhanced detail
jumpCtx.fillStyle = BLACK;

// Head with headband
jumpCtx.beginPath();
jumpCtx.arc(25, 15, 10, 0, Math.PI * 2);
jumpCtx.fill();

// Add facial features - focused expression
jumpCtx.fillStyle = WHITE;
// Eyes
jumpCtx.fillRect(22, 13, 2, 2);
jumpCtx.fillRect(30, 13, 2, 2);
// Determined open mouth (effort)
jumpCtx.fillRect(25, 20, 3, 2);

// Headband
jumpCtx.fillStyle = LIGHT_GRAY;
jumpCtx.fillRect(15, 12, 20, 3);

// Torso - RED shirt
jumpCtx.fillStyle = BRIGHT_RED;
jumpCtx.fillRect(20, 25, 15, 20);

// Add shirt details - simple folds
jumpCtx.fillStyle = '#E00000'; // Slightly darker red for details
jumpCtx.fillRect(23, 28, 2, 13); // Shirt fold line
jumpCtx.fillRect(30, 30, 2, 10); // Shirt fold line

// Arms raised for jump with better definition
jumpCtx.fillStyle = BLACK;
jumpCtx.fillRect(15, 20, 5, 15); // Left arm up
jumpCtx.fillRect(35, 20, 5, 15); // Right arm up

// Add elbow definition
jumpCtx.fillRect(14, 25, 2, 5);
jumpCtx.fillRect(39, 25, 2, 5);

// Pants with enhanced detail
jumpCtx.fillStyle = DARK_GRAY;
jumpCtx.fillRect(20, 45, 15, 15);

// Add pants folds/details
jumpCtx.fillStyle = '#2A2A2A'; // Slightly darker gray
jumpCtx.fillRect(23, 47, 2, 10); // Left fold
jumpCtx.fillRect(30, 49, 2, 8); // Right fold

// Legs spread for jump with anatomical detail
// Left leg
jumpCtx.fillStyle = DARK_GRAY;
jumpCtx.beginPath();
jumpCtx.moveTo(20, 60);
jumpCtx.lineTo(24, 60);
jumpCtx.lineTo(19, 70);
jumpCtx.lineTo(15, 70);
jumpCtx.fill();

// Right leg
jumpCtx.beginPath();
jumpCtx.moveTo(26, 60);
jumpCtx.lineTo(30, 60);
jumpCtx.lineTo(35, 70);
jumpCtx.lineTo(31, 70);
jumpCtx.fill();

// Shoes with enhanced detail
jumpCtx.fillStyle = MID_GRAY;
// Left shoe
jumpCtx.beginPath();
jumpCtx.moveTo(15, 70);
jumpCtx.lineTo(19, 70);
jumpCtx.lineTo(20, 75);
jumpCtx.lineTo(14, 75);
jumpCtx.fill();

// Right shoe
jumpCtx.beginPath();
jumpCtx.moveTo(31, 70);
jumpCtx.lineTo(35, 70);
jumpCtx.lineTo(36, 75);
jumpCtx.lineTo(30, 75);
jumpCtx.fill();

// Add shoe details - treads
jumpCtx.fillStyle = '#555555';
jumpCtx.fillRect(14, 75, 6, 1); // Left shoe tread
jumpCtx.fillRect(30, 75, 6, 1); // Right shoe tread

// Add small backpack
jumpCtx.fillStyle = LIGHT_GRAY;
jumpCtx.fillRect(33, 30, 5, 12);

// Add backpack details
jumpCtx.fillStyle = MID_GRAY;
jumpCtx.fillRect(33, 33, 5, 1); // Strap or zipper detail
jumpCtx.fillRect(35, 36, 2, 4); // Pocket detail

saveCanvas(jumpCanvas, 'player_jump');

// Update the star jump with enhanced leg detail
const starJumpCanvas = createCanvas(70, 70);
const starJumpCtx = starJumpCanvas.getContext('2d');

// Clear background
starJumpCtx.clearRect(0, 0, starJumpCanvas.width, starJumpCanvas.height);

// Draw star jump pose with enhanced detail
starJumpCtx.fillStyle = BLACK;

// Head with headband
starJumpCtx.beginPath();
starJumpCtx.arc(35, 15, 10, 0, Math.PI * 2);
starJumpCtx.fill();

// Add facial features - focused expression with exertion
starJumpCtx.fillStyle = WHITE;
// Eyes
starJumpCtx.fillRect(32, 13, 2, 2);
starJumpCtx.fillRect(40, 13, 2, 2);
// Open mouth (exertion)
starJumpCtx.fillRect(34, 20, 3, 2);

// Headband
starJumpCtx.fillStyle = LIGHT_GRAY;
starJumpCtx.fillRect(25, 12, 20, 3);

// Torso - RED shirt
starJumpCtx.fillStyle = BRIGHT_RED;
starJumpCtx.fillRect(30, 25, 12, 20);

// Add shirt details - folds from movement
starJumpCtx.fillStyle = '#E00000'; // Slightly darker red
starJumpCtx.fillRect(32, 28, 2, 13); // Shirt fold line
starJumpCtx.fillRect(38, 30, 2, 10); // Shirt fold line

// Arms raised in V shape with muscle definition
starJumpCtx.fillStyle = BLACK;
// Left arm - draw as polygon for better shape
starJumpCtx.beginPath();
starJumpCtx.moveTo(30, 25); // Shoulder
starJumpCtx.lineTo(20, 10); // Hand
starJumpCtx.lineTo(15, 13); // Outside of arm
starJumpCtx.lineTo(25, 30); // Armpit
starJumpCtx.fill();

// Right arm - draw as polygon for better shape
starJumpCtx.beginPath();
starJumpCtx.moveTo(42, 25); // Shoulder
starJumpCtx.lineTo(52, 10); // Hand
starJumpCtx.lineTo(57, 13); // Outside of arm
starJumpCtx.lineTo(47, 30); // Armpit
starJumpCtx.fill();

// Add bicep definition
starJumpCtx.fillStyle = '#222222';
starJumpCtx.beginPath();
starJumpCtx.arc(26, 20, 3, 0, Math.PI, true);
starJumpCtx.fill();

starJumpCtx.beginPath();
starJumpCtx.arc(46, 20, 3, 0, Math.PI, true);
starJumpCtx.fill();

// Pants with detail
starJumpCtx.fillStyle = DARK_GRAY;
starJumpCtx.fillRect(30, 45, 12, 10);

// Add pants folds
starJumpCtx.fillStyle = '#2A2A2A';
starJumpCtx.fillRect(32, 47, 2, 6);
starJumpCtx.fillRect(38, 46, 2, 7);

// Legs spread wide in X shape with anatomical detail
// Left leg
starJumpCtx.fillStyle = DARK_GRAY;
starJumpCtx.beginPath();
starJumpCtx.moveTo(30, 55); // Hip joint
starJumpCtx.lineTo(15, 65); // Knee
starJumpCtx.lineTo(10, 62); // Inside calf
starJumpCtx.lineTo(27, 55); // Crotch
starJumpCtx.fill();

// Right leg
starJumpCtx.beginPath();
starJumpCtx.moveTo(42, 55); // Hip joint
starJumpCtx.lineTo(57, 65); // Knee
starJumpCtx.lineTo(62, 62); // Inside calf
starJumpCtx.lineTo(45, 55); // Crotch
starJumpCtx.fill();

// Left calf
starJumpCtx.beginPath();
starJumpCtx.moveTo(15, 65); // Knee
starJumpCtx.lineTo(10, 62); // Inside calf
starJumpCtx.lineTo(5, 60); // Foot
starJumpCtx.lineTo(12, 67); // Outside calf
starJumpCtx.fill();

// Right calf
starJumpCtx.beginPath();
starJumpCtx.moveTo(57, 65); // Knee
starJumpCtx.lineTo(62, 62); // Inside calf
starJumpCtx.lineTo(67, 60); // Foot
starJumpCtx.lineTo(60, 67); // Outside calf
starJumpCtx.fill();

// Shoes with detail
starJumpCtx.fillStyle = MID_GRAY;
// Left shoe
starJumpCtx.beginPath();
starJumpCtx.moveTo(5, 60); // Ankle
starJumpCtx.lineTo(12, 67); // Heel
starJumpCtx.lineTo(0, 65); // Toe
starJumpCtx.lineTo(3, 57); // Top of foot
starJumpCtx.fill();

// Right shoe
starJumpCtx.beginPath();
starJumpCtx.moveTo(67, 60); // Ankle
starJumpCtx.lineTo(60, 67); // Heel
starJumpCtx.lineTo(72, 65); // Toe
starJumpCtx.lineTo(69, 57); // Top of foot
starJumpCtx.fill();

// Add shoe details - treads
starJumpCtx.fillStyle = '#555555';
starJumpCtx.fillRect(1, 64, 10, 1); // Left shoe tread
starJumpCtx.fillRect(61, 64, 10, 1); // Right shoe tread

// Add small backpack
starJumpCtx.fillStyle = LIGHT_GRAY;
starJumpCtx.fillRect(42, 30, 5, 12);

// Add backpack details
starJumpCtx.fillStyle = MID_GRAY;
starJumpCtx.fillRect(42, 33, 5, 1); // Strap or zipper detail
starJumpCtx.fillRect(44, 36, 2, 4); // Pocket detail

saveCanvas(starJumpCanvas, 'player_star_jump');