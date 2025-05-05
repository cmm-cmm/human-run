// Tệp này tạo lại sprite đất với màu sắc tự nhiên hơn
const fs = require('fs');
const { createCanvas } = require('canvas');

// Hàm lưu canvas dưới dạng hình ảnh PNG
function saveCanvas(canvas, fileName) {
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`./images/${fileName}.png`, buffer);
}

// Màu sắc tự nhiên cho đất
const EARTH_BROWN = '#8B6F3D';      // Màu nâu đất chính
const LIGHT_BROWN = '#A88A5C';      // Màu nâu sáng cho các chi tiết
const DARK_BROWN = '#6E5831';       // Màu nâu đậm cho các chi tiết
const SMALL_STONE = '#C4BAA5';      // Màu sỏi nhỏ

// Tạo sprite đất mới
const groundCanvas = createCanvas(50, 20);
const groundCtx = groundCanvas.getContext('2d');

// Vẽ nền đất chính
groundCtx.fillStyle = EARTH_BROWN;
groundCtx.fillRect(0, 0, 50, 20);

// Thêm họa tiết để tạo cảm giác đất tự nhiên
// Các mảng màu sắc nhỏ phía trên
groundCtx.fillStyle = LIGHT_BROWN;
for (let i = 0; i < 10; i++) {
    groundCtx.fillRect(i * 5 + 2, 0, 1, 2);
    groundCtx.fillRect(i * 5, 5, 2, 1);
}

// Các mảng màu tối ở dưới cùng
groundCtx.fillStyle = DARK_BROWN;
for (let i = 0; i < 12; i++) {
    groundCtx.fillRect(i * 4 + 3, 15, 2, 3);
}

// Thêm một số hạt đá nhỏ
groundCtx.fillStyle = SMALL_STONE;
groundCtx.fillRect(5, 7, 1, 1);
groundCtx.fillRect(15, 3, 1, 1);
groundCtx.fillRect(25, 5, 1, 1);
groundCtx.fillRect(35, 2, 1, 1);
groundCtx.fillRect(45, 9, 1, 1);
groundCtx.fillRect(10, 12, 1, 1);
groundCtx.fillRect(20, 8, 1, 1);
groundCtx.fillRect(30, 11, 1, 1);
groundCtx.fillRect(40, 6, 1, 1);

// Lưu hình ảnh
saveCanvas(groundCanvas, 'ground');