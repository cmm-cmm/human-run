// filepath: c:\Users\minhpham\Desktop\HumanRun\create_lightning_effect.js
// Script tạo sprite cho hiệu ứng sét đánh

const fs = require('fs');
const { createCanvas } = require('canvas');

// Function to create and save a canvas as a PNG image
function saveCanvas(canvas, fileName) {
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`./images/${fileName}.png`, buffer);
}

// Colors
const LIGHTNING_YELLOW = '#FFFF00';
const LIGHTNING_WHITE = '#FFFFFF';
const LIGHTNING_BLUE = '#00AAFF';

// Create lightning sprites (3 frames for animation)
for (let frame = 0; frame < 3; frame++) {
    const lightningWidth = 80;
    const lightningHeight = 200;
    
    const lightningCanvas = createCanvas(lightningWidth, lightningHeight);
    const lightningCtx = lightningCanvas.getContext('2d');
    
    // Clear background
    lightningCtx.clearRect(0, 0, lightningWidth, lightningHeight);
    
    // Tạo hiệu ứng ngẫu nhiên cho tia sét
    const randomOffset = () => Math.random() * 10 - 5;
    
    // Điểm bắt đầu ở giữa trên cùng
    const startX = lightningWidth / 2;
    let currentX = startX;
    
    // Vẽ tia sét chính - đường zigzag từ trên xuống dưới
    lightningCtx.beginPath();
    lightningCtx.moveTo(currentX, 0);
    
    // Số đoạn zigzag
    const segments = 8;
    const segmentHeight = lightningHeight / segments;
    
    // Màu của tia sét thay đổi theo frame
    if (frame === 0) {
        lightningCtx.strokeStyle = LIGHTNING_BLUE;
    } else if (frame === 1) {
        lightningCtx.strokeStyle = LIGHTNING_WHITE;
    } else {
        lightningCtx.strokeStyle = LIGHTNING_YELLOW;
    }
    
    lightningCtx.lineWidth = 3 + frame * 2; // Độ dày tăng dần qua các frame
    
    // Tạo đường zigzag ngẫu nhiên
    for (let i = 1; i <= segments; i++) {
        // Độ lệch ngẫu nhiên tăng dần khi xuống dưới
        currentX += randomOffset() * (i / 2);
        // Đảm bảo tia sét không đi ra ngoài canvas
        currentX = Math.max(10, Math.min(lightningWidth - 10, currentX));
        
        lightningCtx.lineTo(currentX, i * segmentHeight);
    }
    lightningCtx.stroke();
    
    // Thêm hiệu ứng sáng xung quanh tia sét
    lightningCtx.shadowColor = frame === 2 ? LIGHTNING_YELLOW : LIGHTNING_BLUE;
    lightningCtx.shadowBlur = 15;
    lightningCtx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    lightningCtx.lineWidth = 1;
    lightningCtx.stroke();
    
    // Thêm các nhánh phụ cho tia sét (chỉ cho frame 1 và 2)
    if (frame > 0) {
        const branchCount = frame === 1 ? 2 : 4;
        
        for (let i = 0; i < branchCount; i++) {
            // Điểm bắt đầu của nhánh phụ trên tia sét chính
            const branchStartY = (i + 1) * segmentHeight * 1.5;
            if (branchStartY >= lightningHeight) continue;
            
            // Tính toán điểm bắt đầu x dựa trên vị trí y
            const branchSegment = Math.floor(branchStartY / segmentHeight);
            const branchStartX = startX + (branchSegment * randomOffset() * (branchSegment / 2));
            
            // Vẽ nhánh phụ
            lightningCtx.beginPath();
            lightningCtx.moveTo(branchStartX, branchStartY);
            
            // Độ dài ngẫu nhiên của nhánh phụ
            const branchLength = 15 + Math.random() * 30;
            const branchEndX = branchStartX + (Math.random() > 0.5 ? branchLength : -branchLength);
            const branchEndY = branchStartY + 10 + Math.random() * 20;
            
            // Thêm điểm zigzag cho nhánh phụ
            const midX = (branchStartX + branchEndX) / 2 + randomOffset() * 5;
            const midY = (branchStartY + branchEndY) / 2;
            
            lightningCtx.lineTo(midX, midY);
            lightningCtx.lineTo(branchEndX, branchEndY);
            
            lightningCtx.lineWidth = 1 + frame;
            lightningCtx.strokeStyle = frame === 2 ? LIGHTNING_YELLOW : LIGHTNING_WHITE;
            lightningCtx.stroke();
        }
    }
    
    // Lưu hình ảnh
    saveCanvas(lightningCanvas, `lightning_${frame}`);
}

// Tạo sprite cho hiệu ứng mưa
const rainCanvas = createCanvas(100, 100);
const rainCtx = rainCanvas.getContext('2d');

// Clear background
rainCtx.clearRect(0, 0, 100, 100);

// Vẽ các giọt mưa
rainCtx.strokeStyle = 'rgba(180, 200, 255, 0.7)';
rainCtx.lineWidth = 1;

for (let i = 0; i < 40; i++) {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const length = 5 + Math.random() * 15;
    const angle = Math.PI / 6; // Góc nghiêng của mưa
    
    rainCtx.beginPath();
    rainCtx.moveTo(x, y);
    rainCtx.lineTo(x - length * Math.cos(angle), y + length * Math.sin(angle));
    rainCtx.stroke();
}

// Lưu sprite mưa
saveCanvas(rainCanvas, 'rain_pattern');