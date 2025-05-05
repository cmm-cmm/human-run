// Script để vẽ lại hình ảnh xương rồng
// Sử dụng Canvas API của trình duyệt để tạo hình ảnh

// Hàm tạo canvas mới
function createCanvas(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
}

// Hàm lưu canvas thành hình ảnh
function saveCanvas(canvas, filename) {
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log(`Đã lưu ${filename}.png`);
}

// Màu sắc
const GREEN = '#2D7A32'; // Màu xanh lá cây đậm cho xương rồng
const DARK_GREEN = '#1D5A22'; // Màu xanh đậm hơn cho bóng
const LIGHT_GREEN = '#3D9A42'; // Màu xanh nhạt hơn cho highlight
const SPINE_COLOR = '#CCDDAA'; // Màu gai
const SAND_COLOR = '#DFD6A7'; // Màu cát/đất

// Vẽ xương rồng nhỏ
function drawSmallCactus() {
    const canvas = createCanvas(25, 50);
    const ctx = canvas.getContext('2d');
    
    // Vẽ bóng đổ xuống đất
    ctx.fillStyle = SAND_COLOR;
    ctx.beginPath();
    ctx.ellipse(12, 48, 10, 2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Thân chính
    ctx.fillStyle = GREEN;
    ctx.fillRect(10, 0, 8, 48);
    
    // Nhánh bên trái
    ctx.fillRect(0, 20, 10, 6);
    
    // Nhánh bên phải
    ctx.fillRect(18, 15, 7, 5);
    
    // Bóng đổ trên thân
    ctx.fillStyle = DARK_GREEN;
    ctx.fillRect(14, 0, 4, 48);
    
    // Highlight trên thân
    ctx.fillStyle = LIGHT_GREEN;
    ctx.fillRect(10, 0, 2, 48);
    
    // Thêm gai
    ctx.fillStyle = SPINE_COLOR;
    for (let i = 0; i < 10; i++) {
        // Gai bên trái
        ctx.fillRect(8, i * 5 + 2, 2, 1);
        // Gai bên phải
        ctx.fillRect(18, i * 5, 2, 1);
    }
    
    // Gai trên nhánh
    ctx.fillRect(0, 18, 2, 1);
    ctx.fillRect(0, 22, 2, 1);
    ctx.fillRect(22, 13, 2, 1);
    ctx.fillRect(22, 17, 2, 1);
    
    saveCanvas(canvas, 'cactus_small');
}

// Vẽ xương rồng trung bình
function drawMediumCactus() {
    const canvas = createCanvas(35, 60);
    const ctx = canvas.getContext('2d');
    
    // Vẽ bóng đổ xuống đất
    ctx.fillStyle = SAND_COLOR;
    ctx.beginPath();
    ctx.ellipse(17, 58, 14, 2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Thân chính
    ctx.fillStyle = GREEN;
    ctx.fillRect(15, 0, 10, 58);
    
    // Nhánh bên trái
    ctx.fillRect(0, 15, 15, 7);
    ctx.fillRect(5, 35, 10, 6);
    
    // Nhánh bên phải
    ctx.fillRect(25, 25, 10, 8);
    
    // Bóng đổ trên thân
    ctx.fillStyle = DARK_GREEN;
    ctx.fillRect(20, 0, 5, 58);
    
    // Highlight trên thân
    ctx.fillStyle = LIGHT_GREEN;
    ctx.fillRect(15, 0, 3, 58);
    
    // Thêm gai
    ctx.fillStyle = SPINE_COLOR;
    for (let i = 0; i < 12; i++) {
        // Gai bên trái
        ctx.fillRect(12, i * 5 + 2, 3, 1);
        // Gai bên phải
        ctx.fillRect(25, i * 5, 3, 1);
    }
    
    // Gai trên nhánh
    ctx.fillRect(0, 13, 3, 1);
    ctx.fillRect(0, 17, 3, 1);
    ctx.fillRect(5, 33, 3, 1);
    ctx.fillRect(5, 37, 3, 1);
    ctx.fillRect(32, 24, 3, 1);
    ctx.fillRect(32, 28, 3, 1);
    
    saveCanvas(canvas, 'cactus_medium');
}

// Vẽ xương rồng lớn
function drawLargeCactus() {
    const canvas = createCanvas(45, 70);
    const ctx = canvas.getContext('2d');
    
    // Vẽ bóng đổ xuống đất
    ctx.fillStyle = SAND_COLOR;
    ctx.beginPath();
    ctx.ellipse(22, 68, 18, 2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Thân chính
    ctx.fillStyle = GREEN;
    ctx.fillRect(20, 0, 12, 68);
    
    // Nhánh bên trái
    ctx.fillRect(0, 20, 20, 8);
    ctx.fillRect(5, 45, 15, 7);
    
    // Nhánh bên phải
    ctx.fillRect(32, 15, 13, 8);
    ctx.fillRect(32, 35, 13, 7);
    
    // Bóng đổ trên thân
    ctx.fillStyle = DARK_GREEN;
    ctx.fillRect(26, 0, 6, 68);
    
    // Highlight trên thân
    ctx.fillStyle = LIGHT_GREEN;
    ctx.fillRect(20, 0, 3, 68);
    
    // Thêm gai
    ctx.fillStyle = SPINE_COLOR;
    for (let i = 0; i < 14; i++) {
        // Gai bên trái
        ctx.fillRect(17, i * 5 + 2, 3, 1);
        // Gai bên phải
        ctx.fillRect(32, i * 5, 3, 1);
    }
    
    // Gai trên nhánh
    ctx.fillRect(0, 18, 3, 1);
    ctx.fillRect(0, 22, 3, 1);
    ctx.fillRect(5, 43, 3, 1);
    ctx.fillRect(5, 47, 3, 1);
    ctx.fillRect(42, 14, 3, 1);
    ctx.fillRect(42, 17, 3, 1);
    ctx.fillRect(42, 34, 3, 1);
    ctx.fillRect(42, 37, 3, 1);
    
    saveCanvas(canvas, 'cactus_large');
}

// Hàm chính để tạo tất cả các hình ảnh
function generateAllCactusSprites() {
    drawSmallCactus();
    drawMediumCactus();
    drawLargeCactus();
    console.log('Đã tạo xong tất cả hình ảnh xương rồng!');
}

// Thêm button vào trang HTML để người dùng có thể tạo hình ảnh
document.addEventListener('DOMContentLoaded', function() {
    const container = document.createElement('div');
    container.style.textAlign = 'center';
    container.style.margin = '20px';
    
    const heading = document.createElement('h1');
    heading.textContent = 'Tạo hình ảnh xương rồng';
    container.appendChild(heading);
    
    const description = document.createElement('p');
    description.textContent = 'Nhấn nút bên dưới để tạo và tải xuống hình ảnh xương rồng mới';
    container.appendChild(description);
    
    const button = document.createElement('button');
    button.textContent = 'Tạo hình ảnh xương rồng';
    button.style.padding = '10px 20px';
    button.style.fontSize = '16px';
    button.style.margin = '10px';
    button.addEventListener('click', generateAllCactusSprites);
    container.appendChild(button);
    
    document.body.appendChild(container);
});