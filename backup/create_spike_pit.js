// filepath: c:\Users\minhpham\Desktop\HumanRun\create_spike_pit.js
// Script tạo sprite cho hố gai nhọn

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
const DARK_BROWN = '#5D4037';
const MEDIUM_BROWN = '#795548';
const SPIKE_GRAY = '#9E9E9E';
const SPIKE_SILVER = '#BDBDBD';

// Create spike pit (2 variations)
for (let variant = 0; variant < 2; variant++) {
    let pitWidth = 60 + variant * 20; // Kích thước hố gai (nhỏ và lớn)
    const pitHeight = 30;
    
    const pitCanvas = createCanvas(pitWidth, pitHeight);
    const pitCtx = pitCanvas.getContext('2d');
    
    // Clear background
    pitCtx.clearRect(0, 0, pitWidth, pitHeight);
    
    // Vẽ nền hố (tối)
    pitCtx.fillStyle = DARK_BROWN;
    pitCtx.beginPath();
    pitCtx.rect(0, 10, pitWidth, pitHeight - 10);
    pitCtx.fill();
    
    // Vẽ rìa hố phía trên
    pitCtx.fillStyle = MEDIUM_BROWN;
    pitCtx.beginPath();
    pitCtx.rect(0, 8, pitWidth, 4);
    pitCtx.fill();
    
    // Vẽ đường viền đất
    pitCtx.fillStyle = MID_GRAY;
    pitCtx.beginPath();
    pitCtx.rect(0, 8, pitWidth, 1);
    pitCtx.fill();
    
    // Thêm vân đất
    pitCtx.fillStyle = LIGHT_GRAY;
    for (let i = 0; i < pitWidth / 8; i++) {
        pitCtx.fillRect(i * 8 + 2, 9, 2, 1);
    }
    
    // Vẽ các gai nhọn
    const spikeCount = Math.floor(pitWidth / 8);
    for (let i = 0; i < spikeCount; i++) {
        // Tính vị trí gai
        const spikeX = i * 8 + 4;
        const spikeHeight = 10 + Math.random() * 6;
        
        // Vẽ gai (tam giác)
        pitCtx.fillStyle = SPIKE_GRAY;
        pitCtx.beginPath();
        pitCtx.moveTo(spikeX, 26);  // Đáy gai
        pitCtx.lineTo(spikeX - 3, 26 - spikeHeight); // Đỉnh gai
        pitCtx.lineTo(spikeX + 3, 26 - spikeHeight);
        pitCtx.fill();
        
        // Thêm ánh sáng cho gai
        pitCtx.fillStyle = SPIKE_SILVER;
        pitCtx.beginPath();
        pitCtx.moveTo(spikeX - 1, 26 - spikeHeight + 2);
        pitCtx.lineTo(spikeX - 2, 26 - spikeHeight / 2);
        pitCtx.lineTo(spikeX, 26 - spikeHeight / 2);
        pitCtx.fill();
    }
    
    // Vẽ một số gai nhỏ hơn xen kẽ
    for (let i = 0; i < spikeCount - 1; i++) {
        if (Math.random() > 0.3) continue; // Chỉ vẽ một số gai ngẫu nhiên
        
        const spikeX = i * 8 + 8;
        const spikeHeight = 6 + Math.random() * 4;
        
        pitCtx.fillStyle = SPIKE_GRAY;
        pitCtx.beginPath();
        pitCtx.moveTo(spikeX, 26);
        pitCtx.lineTo(spikeX - 2, 26 - spikeHeight);
        pitCtx.lineTo(spikeX + 2, 26 - spikeHeight);
        pitCtx.fill();
    }
    
    // Tạo hiệu ứng sâu cho hố
    pitCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    pitCtx.beginPath();
    pitCtx.rect(0, 22, pitWidth, 8);
    pitCtx.fill();
    
    // Lưu hình ảnh
    saveCanvas(pitCanvas, `spike_pit_${variant}`);
}