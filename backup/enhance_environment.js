// This script generates enhanced environmental elements for the Human Runner Offline game

const fs = require('fs');
const { createCanvas } = require('canvas');

// Function to create and save a canvas as a PNG image
function saveCanvas(canvas, fileName) {
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`./images/${fileName}.png`, buffer);
}

// Create a sky gradient background
const skyCanvas = createCanvas(800, 280);
const skyCtx = skyCanvas.getContext('2d');

// Create gradient from pale blue to light gray
const skyGradient = skyCtx.createLinearGradient(0, 0, 0, 280);
skyGradient.addColorStop(0, '#D6E6F2'); // Light gray-blue at top
skyGradient.addColorStop(0.7, '#E8F1F8'); // Pale blue
skyGradient.addColorStop(1, '#F7F9FA');   // Almost white near horizon

skyCtx.fillStyle = skyGradient;
skyCtx.fillRect(0, 0, 800, 280);

// Save sky background
saveCanvas(skyCanvas, 'sky_background');

// Enhanced cloud styles
const cloudColors = [
    { base: '#FFFFFF', shadow: '#E6E6E6', highlight: '#FFFFFF' }, // White
    { base: '#F8F8F8', shadow: '#E0E0E0', highlight: '#FFFFFF' }, // Light gray
    { base: '#FFF6F0', shadow: '#F0E0D6', highlight: '#FFFFFF' }, // Pale orange tint
    { base: '#F8F0FF', shadow: '#E6D6F0', highlight: '#FFFFFF' }  // Pale lavender tint
];

// Create enhanced foreground clouds (3 variations)
for (let i = 0; i < 3; i++) {
    const cloudWidth = 120 + i * 50; // Larger clouds
    const cloudHeight = 40 + i * 15;
    
    const cloudCanvas = createCanvas(cloudWidth, cloudHeight);
    const cloudCtx = cloudCanvas.getContext('2d');
    
    // Clear background
    cloudCtx.clearRect(0, 0, cloudWidth, cloudHeight);
    
    // Randomly select cloud color
    const colorIndex = Math.floor(Math.random() * cloudColors.length);
    const cloudColor = cloudColors[colorIndex];
    
    // Set cloud color with transparency for foreground clouds
    cloudCtx.fillStyle = cloudColor.base;
    
    // Draw stylized cloud - multiple overlapping circles for fluffy edges
    const centerY = cloudHeight / 2;
    
    // Main body of cloud (larger, more distinct)
    cloudCtx.beginPath();
    cloudCtx.arc(cloudWidth / 2, centerY, cloudHeight / 1.8, 0, Math.PI * 2);
    cloudCtx.fill();
    
    // Additional cloud puffs of varying sizes
    const puffCount = 4 + i;
    for (let j = 0; j < puffCount; j++) {
        const puffX = j * (cloudWidth / puffCount) + cloudWidth / (puffCount * 2) + Math.random() * 10 - 5;
        const puffSize = (cloudHeight / 1.8) * (0.7 + Math.random() * 0.5);
        
        // Draw shadow first (for depth)
        cloudCtx.fillStyle = cloudColor.shadow;
        cloudCtx.beginPath();
        cloudCtx.arc(puffX + 2, centerY + 2, puffSize, 0, Math.PI * 2);
        cloudCtx.fill();
        
        // Draw main puff
        cloudCtx.fillStyle = cloudColor.base;
        cloudCtx.beginPath();
        cloudCtx.arc(puffX, centerY - 5 + Math.random() * 10, puffSize, 0, Math.PI * 2);
        cloudCtx.fill();
    }
    
    // Add highlights for volume
    cloudCtx.fillStyle = cloudColor.highlight;
    for (let j = 0; j < puffCount - 1; j++) {
        const puffX = j * (cloudWidth / puffCount) + cloudWidth / (puffCount * 2) - 3;
        const puffSize = (cloudHeight / 2) * 0.6 * (0.7 + Math.random() * 0.3);
        
        cloudCtx.beginPath();
        cloudCtx.arc(puffX, centerY - 10, puffSize, 0, Math.PI * 2);
        cloudCtx.fill();
    }
    
    saveCanvas(cloudCanvas, `cloud_foreground_${i}`);
}

// Create smaller background clouds (2 variations)
for (let i = 0; i < 2; i++) {
    const cloudWidth = 80 + i * 30; // Smaller clouds
    const cloudHeight = 25 + i * 10;
    
    const cloudCanvas = createCanvas(cloudWidth, cloudHeight);
    const cloudCtx = cloudCanvas.getContext('2d');
    
    // Clear background
    cloudCtx.clearRect(0, 0, cloudWidth, cloudHeight);
    
    // Randomly select cloud color
    const colorIndex = Math.floor(Math.random() * cloudColors.length);
    const cloudColor = cloudColors[colorIndex];
    
    // Set cloud color with more transparency for background clouds
    cloudCtx.fillStyle = cloudColor.base;
    cloudCtx.globalAlpha = 0.85; // More transparent for background clouds
    
    // Draw stylized cloud - softer, less defined
    const centerY = cloudHeight / 2;
    
    // Main body of cloud
    cloudCtx.beginPath();
    cloudCtx.arc(cloudWidth / 2, centerY, cloudHeight / 1.7, 0, Math.PI * 2);
    cloudCtx.fill();
    
    // Additional cloud puffs (fewer, smaller)
    const puffCount = 3 + i;
    for (let j = 0; j < puffCount; j++) {
        const puffX = j * (cloudWidth / puffCount) + cloudWidth / (puffCount * 2);
        const puffSize = (cloudHeight / 2) * (0.65 + Math.random() * 0.35);
        
        cloudCtx.beginPath();
        cloudCtx.arc(puffX, centerY - 3 + Math.random() * 6, puffSize, 0, Math.PI * 2);
        cloudCtx.fill();
    }
    
    // Simpler highlights for background clouds
    cloudCtx.fillStyle = cloudColor.highlight;
    cloudCtx.globalAlpha = 0.5;
    cloudCtx.beginPath();
    cloudCtx.arc(cloudWidth / 3, centerY - 5, cloudHeight / 3, 0, Math.PI * 2);
    cloudCtx.fill();
    
    saveCanvas(cloudCanvas, `cloud_background_${i}`);
}

// Color palettes for cacti
const cactiColors = [
    { base: '#5D8A66', highlight: '#7EAD89', shadow: '#3D6A46', spines: '#2A4A30' }, // Sage green
    { base: '#4A7A3D', highlight: '#6A9A5D', shadow: '#2A5A1D', spines: '#1A3A0D' }, // Forest green
    { base: '#7D9A63', highlight: '#9DBA83', shadow: '#5D7A43', spines: '#3D5A23' }  // Olive green
];

// Flower accent colors
const flowerColors = [
    '#E55A5A', // Red
    '#FFCC66', // Yellow
    '#FF99CC'  // Pink
];

// Create barrel cactus
for (let i = 0; i < cactiColors.length; i++) {
    const cactusWidth = 30;
    const cactusHeight = 40;
    
    const cactusCanvas = createCanvas(cactusWidth, cactusHeight);
    const cactusCtx = cactusCanvas.getContext('2d');
    
    // Clear background
    cactusCtx.clearRect(0, 0, cactusWidth, cactusHeight);
    
    const colors = cactiColors[i];
    
    // Draw base/shadow
    cactusCtx.fillStyle = '#8A7A5D'; // Sandy brown color
    cactusCtx.beginPath();
    cactusCtx.ellipse(cactusWidth / 2, cactusHeight - 3, cactusWidth / 2, 5, 0, 0, Math.PI * 2);
    cactusCtx.fill();
    
    // Draw main barrel body
    cactusCtx.fillStyle = colors.base;
    cactusCtx.beginPath();
    cactusCtx.ellipse(cactusWidth / 2, cactusHeight / 2, cactusWidth / 2 - 2, cactusHeight / 2 - 5, 0, 0, Math.PI * 2);
    cactusCtx.fill();
    
    // Add shadow side
    cactusCtx.fillStyle = colors.shadow;
    cactusCtx.beginPath();
    cactusCtx.ellipse(cactusWidth / 2 + 5, cactusHeight / 2, cactusWidth / 4 - 2, cactusHeight / 2 - 5, 0, 0, Math.PI * 2);
    cactusCtx.fill();
    
    // Add highlight side
    cactusCtx.fillStyle = colors.highlight;
    cactusCtx.beginPath();
    cactusCtx.ellipse(cactusWidth / 2 - 5, cactusHeight / 2, cactusWidth / 4 - 2, cactusHeight / 2 - 5, 0, 0, Math.PI * 2);
    cactusCtx.fill();
    
    // Add vertical ridges
    cactusCtx.strokeStyle = colors.shadow;
    cactusCtx.lineWidth = 1;
    for (let j = 0; j < 8; j++) {
        const x = cactusWidth / 2 + Math.cos(j * Math.PI / 4) * (cactusWidth / 2 - 3);
        cactusCtx.beginPath();
        cactusCtx.moveTo(x, 10);
        cactusCtx.lineTo(x, cactusHeight - 10);
        cactusCtx.stroke();
    }
    
    // Add spines
    cactusCtx.fillStyle = colors.spines;
    for (let j = 0; j < 20; j++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = (cactusWidth / 2 - 2) * 0.9;
        const x = cactusWidth / 2 + Math.cos(angle) * distance;
        const y = cactusHeight / 2 + Math.sin(angle) * (cactusHeight / 2 - 5) * 0.9;
        
        cactusCtx.fillRect(x, y, 1, 1);
    }
    
    // Add flower on top (50% chance)
    if (Math.random() > 0.5) {
        const flowerColor = flowerColors[Math.floor(Math.random() * flowerColors.length)];
        cactusCtx.fillStyle = flowerColor;
        
        // Draw flower
        cactusCtx.beginPath();
        cactusCtx.arc(cactusWidth / 2, 5, 4, 0, Math.PI * 2);
        cactusCtx.fill();
        
        // Flower center
        cactusCtx.fillStyle = '#FFFF00'; // Yellow center
        cactusCtx.beginPath();
        cactusCtx.arc(cactusWidth / 2, 5, 2, 0, Math.PI * 2);
        cactusCtx.fill();
    }
    
    saveCanvas(cactusCanvas, `cactus_barrel_${i}`);
}

// Create tall saguaro cactus with branches
for (let i = 0; i < cactiColors.length; i++) {
    for (let branches = 0; branches < 3; branches++) {
        const cactusWidth = 60 + branches * 15;
        const cactusHeight = 90;
        
        const cactusCanvas = createCanvas(cactusWidth, cactusHeight);
        const cactusCtx = cactusCanvas.getContext('2d');
        
        // Clear background
        cactusCtx.clearRect(0, 0, cactusWidth, cactusHeight);
        
        const colors = cactiColors[i];
        
        // Draw base/shadow
        cactusCtx.fillStyle = '#8A7A5D'; // Sandy brown color
        cactusCtx.beginPath();
        cactusCtx.ellipse(25, cactusHeight - 3, 12, 5, 0, 0, Math.PI * 2);
        cactusCtx.fill();
        
        // Draw main stem
        cactusCtx.fillStyle = colors.base;
        cactusCtx.fillRect(20, 10, 10, cactusHeight - 10);
        
        // Add stem shading/highlight
        cactusCtx.fillStyle = colors.shadow;
        cactusCtx.fillRect(26, 10, 4, cactusHeight - 10);
        cactusCtx.fillStyle = colors.highlight;
        cactusCtx.fillRect(20, 10, 4, cactusHeight - 10);
        
        // Draw branches
        if (branches >= 1) {
            // Right branch
            cactusCtx.fillStyle = colors.base;
            cactusCtx.beginPath();
            cactusCtx.moveTo(30, 25);
            cactusCtx.lineTo(45, 15);
            cactusCtx.lineTo(50, 15);
            cactusCtx.lineTo(50, 45);
            cactusCtx.lineTo(45, 45);
            cactusCtx.lineTo(30, 35);
            cactusCtx.fill();
            
            // Branch shading
            cactusCtx.fillStyle = colors.shadow;
            cactusCtx.beginPath();
            cactusCtx.moveTo(45, 15);
            cactusCtx.lineTo(50, 15);
            cactusCtx.lineTo(50, 45);
            cactusCtx.lineTo(45, 45);
            cactusCtx.fill();
        }
        
        if (branches >= 2) {
            // Left branch
            cactusCtx.fillStyle = colors.base;
            cactusCtx.beginPath();
            cactusCtx.moveTo(20, 40);
            cactusCtx.lineTo(5, 30);
            cactusCtx.lineTo(0, 30);
            cactusCtx.lineTo(0, 60);
            cactusCtx.lineTo(5, 60);
            cactusCtx.lineTo(20, 50);
            cactusCtx.fill();
            
            // Branch highlight
            cactusCtx.fillStyle = colors.highlight;
            cactusCtx.beginPath();
            cactusCtx.moveTo(5, 30);
            cactusCtx.lineTo(0, 30);
            cactusCtx.lineTo(0, 60);
            cactusCtx.lineTo(5, 60);
            cactusCtx.fill();
        }
        
        // Add vertical ridges to main stem
        cactusCtx.strokeStyle = colors.shadow;
        cactusCtx.lineWidth = 1;
        for (let j = 0; j < 3; j++) {
            const x = 20 + j * 5;
            cactusCtx.beginPath();
            cactusCtx.moveTo(x, 10);
            cactusCtx.lineTo(x, cactusHeight - 10);
            cactusCtx.stroke();
        }
        
        // Add spines to main stem
        cactusCtx.fillStyle = colors.spines;
        for (let j = 0; j < 15; j++) {
            const y = 15 + j * 5;
            // Left spines
            cactusCtx.fillRect(18, y, 2, 1);
            // Right spines
            cactusCtx.fillRect(30, y, 2, 1);
        }
        
        // Add spines to branches
        if (branches >= 1) {
            for (let j = 0; j < 6; j++) {
                const y = 18 + j * 5;
                cactusCtx.fillRect(48, y, 2, 1);
            }
        }
        
        if (branches >= 2) {
            for (let j = 0; j < 6; j++) {
                const y = 33 + j * 5;
                cactusCtx.fillRect(0, y, 2, 1);
            }
        }
        
        // Add flowers (25% chance)
        if (Math.random() > 0.75) {
            const flowerColor = flowerColors[Math.floor(Math.random() * flowerColors.length)];
            cactusCtx.fillStyle = flowerColor;
            
            // Draw flower on main stem
            cactusCtx.beginPath();
            cactusCtx.arc(25, 10, 4, 0, Math.PI * 2);
            cactusCtx.fill();
            
            // Flower center
            cactusCtx.fillStyle = '#FFFF00'; // Yellow center
            cactusCtx.beginPath();
            cactusCtx.arc(25, 10, 2, 0, Math.PI * 2);
            cactusCtx.fill();
            
            // Add flowers to branch tips if they exist
            if (branches >= 1) {
                cactusCtx.fillStyle = flowerColor;
                cactusCtx.beginPath();
                cactusCtx.arc(50, 15, 3, 0, Math.PI * 2);
                cactusCtx.fill();
            }
            
            if (branches >= 2) {
                cactusCtx.fillStyle = flowerColor;
                cactusCtx.beginPath();
                cactusCtx.arc(0, 30, 3, 0, Math.PI * 2);
                cactusCtx.fill();
            }
        }
        
        saveCanvas(cactusCanvas, `cactus_saguaro_${i}_${branches}`);
    }
}

// Create thin multi-stem cactus clusters
for (let i = 0; i < cactiColors.length; i++) {
    const cactusWidth = 50;
    const cactusHeight = 70;
    
    const cactusCanvas = createCanvas(cactusWidth, cactusHeight);
    const cactusCtx = cactusCanvas.getContext('2d');
    
    // Clear background
    cactusCtx.clearRect(0, 0, cactusWidth, cactusHeight);
    
    const colors = cactiColors[i];
    
    // Draw base/shadow
    cactusCtx.fillStyle = '#8A7A5D'; // Sandy brown color
    cactusCtx.beginPath();
    cactusCtx.ellipse(cactusWidth / 2, cactusHeight - 3, cactusWidth / 2 - 5, 5, 0, 0, Math.PI * 2);
    cactusCtx.fill();
    
    // Draw multiple thin stems
    const stemCount = 3 + Math.floor(Math.random() * 3); // 3-5 stems
    
    for (let j = 0; j < stemCount; j++) {
        const stemX = 10 + j * ((cactusWidth - 20) / (stemCount - 1));
        const stemHeight = 30 + Math.random() * 35;
        const stemWidth = 4 + Math.random() * 2;
        
        // Main stem
        cactusCtx.fillStyle = colors.base;
        cactusCtx.fillRect(stemX - stemWidth / 2, cactusHeight - stemHeight, stemWidth, stemHeight);
        
        // Stem shading/highlight
        cactusCtx.fillStyle = colors.shadow;
        cactusCtx.fillRect(stemX, cactusHeight - stemHeight, stemWidth / 2, stemHeight);
        cactusCtx.fillStyle = colors.highlight;
        cactusCtx.fillRect(stemX - stemWidth / 2, cactusHeight - stemHeight, stemWidth / 4, stemHeight);
        
        // Add ridges
        cactusCtx.strokeStyle = colors.shadow;
        cactusCtx.lineWidth = 0.5;
        cactusCtx.beginPath();
        cactusCtx.moveTo(stemX - stemWidth / 4, cactusHeight - stemHeight);
        cactusCtx.lineTo(stemX - stemWidth / 4, cactusHeight);
        cactusCtx.stroke();
        
        cactusCtx.beginPath();
        cactusCtx.moveTo(stemX + stemWidth / 4, cactusHeight - stemHeight);
        cactusCtx.lineTo(stemX + stemWidth / 4, cactusHeight);
        cactusCtx.stroke();
        
        // Add spines
        cactusCtx.fillStyle = colors.spines;
        for (let k = 0; k < stemHeight / 5; k++) {
            const y = cactusHeight - stemHeight + k * 5;
            
            // Left spine
            cactusCtx.fillRect(stemX - stemWidth / 2 - 1, y, 1, 1);
            // Right spine
            cactusCtx.fillRect(stemX + stemWidth / 2, y, 1, 1);
        }
        
        // Add flower (30% chance per stem)
        if (Math.random() > 0.7) {
            const flowerColor = flowerColors[Math.floor(Math.random() * flowerColors.length)];
            cactusCtx.fillStyle = flowerColor;
            
            cactusCtx.beginPath();
            cactusCtx.arc(stemX, cactusHeight - stemHeight, 3, 0, Math.PI * 2);
            cactusCtx.fill();
            
            // Flower center
            cactusCtx.fillStyle = '#FFFF00'; // Yellow center
            cactusCtx.beginPath();
            cactusCtx.arc(stemX, cactusHeight - stemHeight, 1.5, 0, Math.PI * 2);
            cactusCtx.fill();
        }
    }
    
    saveCanvas(cactusCanvas, `cactus_cluster_${i}`);
}