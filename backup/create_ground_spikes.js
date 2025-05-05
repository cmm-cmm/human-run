// filepath: c:\Users\minhpham\Desktop\HumanRun\create_ground_spikes.js
// Script tạo sprite cho gai nhọn từ mặt đất

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
const DARK_GRAY = '#333333';
const MID_GRAY = '#777777';
const LIGHT_GRAY = '#BBBBBB';
const DARK_BROWN = '#5D4037';
const MEDIUM_BROWN = '#795548';
const SPIKE_COLOR = '#606060';
const SPIKE_SHINE = '#A0A0A0';

// Create ground spikes (3 variations with different widths)
for (let variant = 0; variant < 3; variant++) {
    let spikeWidth = 30 + variant * 15; // 30px, 45px, 60px
    const spikeHeight = 40;
    
    const spikeCanvas = createCanvas(spikeWidth, spikeHeight);
    const spikeCtx = spikeCanvas.getContext('2d');
    
    // Clear background
    spikeCtx.clearRect(0, 0, spikeWidth, spikeHeight);
    
    // Vẽ móng gai (phần chìm dưới đất)
    spikeCtx.fillStyle = DARK_BROWN;
    spikeCtx.beginPath();
    spikeCtx.rect(0, spikeHeight - 5, spikeWidth, 5);
    spikeCtx.fill();
    
    // Vẽ mặt đất xung quanh gai
    spikeCtx.fillStyle = MEDIUM_BROWN;
    spikeCtx.beginPath();
    spikeCtx.rect(0, spikeHeight - 7, spikeWidth, 2);
    spikeCtx.fill();
    
    // Tính toán số lượng gai dựa trên chiều rộng
    const spikeCount = Math.floor(variant + 3); // 3, 4, hoặc 5 gai
    const spikeSpacing = spikeWidth / spikeCount;
    
    // Vẽ các gai nhọn tam giác
    for (let i = 0; i < spikeCount; i++) {
        // Tính vị trí chính giữa của mỗi gai
        const centerX = (i + 0.5) * spikeSpacing;
        const baseWidth = spikeSpacing * 0.8; // Chiều rộng đáy tam giác
        const spikeHeight = 30 + Math.random() * 5; // Chiều cao có chút ngẫu nhiên
        
        // Vẽ gai chính (tam giác)
        spikeCtx.fillStyle = SPIKE_COLOR;
        spikeCtx.beginPath();
        spikeCtx.moveTo(centerX, spikeHeight - spikeHeight); // Đỉnh gai
        spikeCtx.lineTo(centerX - baseWidth / 2, spikeHeight - 5); // Góc trái đáy
        spikeCtx.lineTo(centerX + baseWidth / 2, spikeHeight - 5); // Góc phải đáy
        spikeCtx.closePath();
        spikeCtx.fill();
        
        // Thêm hiệu ứng ánh sáng cho gai
        spikeCtx.fillStyle = SPIKE_SHINE;
        spikeCtx.beginPath();
        spikeCtx.moveTo(centerX - 1, spikeHeight - spikeHeight + 5);
        spikeCtx.lineTo(centerX - 2, spikeHeight - spikeHeight / 2);
        spikeCtx.lineTo(centerX, spikeHeight - spikeHeight / 2 - 3);
        spikeCtx.closePath();
        spikeCtx.fill();
        
        // Thêm nét đen tạo bóng cho gai
        spikeCtx.strokeStyle = BLACK;
        spikeCtx.lineWidth = 1;
        spikeCtx.beginPath();
        spikeCtx.moveTo(centerX, spikeHeight - spikeHeight); // Đỉnh
        spikeCtx.lineTo(centerX + baseWidth / 2, spikeHeight - 5); // Đường bên phải
        spikeCtx.stroke();
    }
    
    // Lưu hình ảnh
    saveCanvas(spikeCanvas, `ground_spike_${variant}`);
}

console.log("Ground spike sprites generated successfully!");