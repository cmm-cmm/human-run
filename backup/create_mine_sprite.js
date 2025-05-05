// Script tạo sprite quả mìn cho game
const canvas = document.createElement('canvas');
const MINE_WIDTH = 30;
const MINE_HEIGHT = 20;
canvas.width = MINE_WIDTH;
canvas.height = MINE_HEIGHT;
const ctx = canvas.getContext('2d');

// Tạo một quả mìn với màu sắc gần giống màu đất để khó nhận biết
function createMineSprite() {
    // Vẽ phần thân quả mìn
    ctx.fillStyle = '#C8AA74'; // Gần với màu đất sa mạc
    ctx.beginPath();
    ctx.ellipse(MINE_WIDTH/2, MINE_HEIGHT - 6, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Thêm một chút đường viền để tạo chiều sâu
    ctx.strokeStyle = '#A88E60';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(MINE_WIDTH/2, MINE_HEIGHT - 6, 12, 8, 0, 0, Math.PI * 2);
    ctx.stroke();
    
    // Vẽ ngòi nổ
    ctx.fillStyle = '#555';
    ctx.beginPath();
    ctx.arc(MINE_WIDTH/2, MINE_HEIGHT - 14, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Thêm dây ngòi
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(MINE_WIDTH/2, MINE_HEIGHT - 15);
    ctx.lineTo(MINE_WIDTH/2, MINE_HEIGHT - 20);
    ctx.stroke();
    
    // Thêm một ít chi tiết trên quả mìn để tạo điểm nhấn
    ctx.fillStyle = '#AA8E60';
    ctx.beginPath();
    ctx.arc(MINE_WIDTH/2 - 5, MINE_HEIGHT - 5, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(MINE_WIDTH/2 + 5, MINE_HEIGHT - 5, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Lưu sprite vào file
    saveCanvas(canvas, 'mine');
    
    // Tạo sprite cho hiệu ứng nổ
    createExplosionSprites();
}

// Tạo sprites cho hiệu ứng nổ
function createExplosionSprites() {
    // Tạo 3 frames hiệu ứng nổ
    for (let i = 0; i < 3; i++) {
        const explosionCanvas = document.createElement('canvas');
        explosionCanvas.width = 80; // Kích thước lớn hơn quả mìn
        explosionCanvas.height = 80;
        const expCtx = explosionCanvas.getContext('2d');
        
        // Cột khói và lửa
        const gradient = expCtx.createRadialGradient(40, 40, 5, 40, 40, 40);
        gradient.addColorStop(0, 'rgba(255, 200, 50, 1)');     // Lõi vàng
        gradient.addColorStop(0.3, 'rgba(255, 100, 50, 0.8)'); // Cam
        gradient.addColorStop(0.6, 'rgba(150, 50, 50, 0.6)');  // Đỏ sẫm
        gradient.addColorStop(1, 'rgba(80, 80, 80, 0.2)');     // Rìa khói
        
        expCtx.fillStyle = gradient;
        expCtx.beginPath();
        expCtx.arc(40, 40, 35 + i * 5, 0, Math.PI * 2);
        expCtx.fill();
        
        // Thêm các mảnh vỡ bay ra
        expCtx.fillStyle = '#AA8E60';
        for (let j = 0; j < 8 + i * 4; j++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 15 + Math.random() * (20 + i * 5);
            const size = 1 + Math.random() * 3;
            
            expCtx.beginPath();
            expCtx.arc(
                40 + Math.cos(angle) * distance,
                40 + Math.sin(angle) * distance,
                size, 0, Math.PI * 2
            );
            expCtx.fill();
        }
        
        // Lưu sprite vụ nổ
        saveCanvas(explosionCanvas, `explosion_${i}`);
    }
}

// Hàm hỗ trợ lưu canvas thành hình ảnh
function saveCanvas(canvas, name) {
    const link = document.createElement('a');
    link.download = `${name}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Chạy script khi tải trang
window.onload = function() {
    createMineSprite();
};