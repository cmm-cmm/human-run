// Script tạo hình ảnh bumerang và lưu vào thư mục images
const fs = require('fs');
const { createCanvas } = require('canvas');

// Tạo canvas
const canvas = createCanvas(40, 40);
const ctx = canvas.getContext('2d');

// Xóa canvas
ctx.clearRect(0, 0, canvas.width, canvas.height);

// Thiết lập các màu sắc
const boomerangColor = '#8B4513'; // Màu nâu gỗ
const highlightColor = '#D2B48C'; // Màu be sáng cho highlight

// Di chuyển tâm vẽ vào giữa canvas
ctx.save();
ctx.translate(canvas.width / 2, canvas.height / 2);

// Vẽ bumerang (hình chữ V)
ctx.beginPath();
ctx.moveTo(0, -10);
ctx.quadraticCurveTo(15, 0, 10, 10);
ctx.quadraticCurveTo(5, 7, 0, 0);
ctx.quadraticCurveTo(-5, 7, -10, 10);
ctx.quadraticCurveTo(-15, 0, 0, -10);
ctx.closePath();

// Đổ màu cho bumerang
ctx.fillStyle = boomerangColor;
ctx.fill();

// Vẽ các chi tiết và highlight
ctx.beginPath();
ctx.moveTo(0, -8);
ctx.quadraticCurveTo(12, 0, 8, 8);
ctx.quadraticCurveTo(4, 6, 0, 1);
ctx.closePath();
ctx.fillStyle = highlightColor;
ctx.globalAlpha = 0.5;
ctx.fill();

// Vẽ chi tiết bên trái
ctx.beginPath();
ctx.moveTo(0, 1);
ctx.quadraticCurveTo(-4, 6, -8, 8);
ctx.quadraticCurveTo(-12, 0, 0, -8);
ctx.closePath();
ctx.fill();

// Viền đường bao quanh
ctx.globalAlpha = 1.0;
ctx.strokeStyle = '#553311';
ctx.lineWidth = 1;

ctx.beginPath();
ctx.moveTo(0, -10);
ctx.quadraticCurveTo(15, 0, 10, 10);
ctx.quadraticCurveTo(5, 7, 0, 0);
ctx.quadraticCurveTo(-5, 7, -10, 10);
ctx.quadraticCurveTo(-15, 0, 0, -10);
ctx.closePath();
ctx.stroke();

// Khôi phục trạng thái
ctx.restore();

// Lưu file
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('./images/boomerang.png', buffer);
console.log('Đã tạo hình ảnh bumerang và lưu vào thư mục images');

// Tạo phiên bản xoay 45 độ
const canvas2 = createCanvas(40, 40);
const ctx2 = canvas2.getContext('2d');

// Xóa canvas
ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

// Di chuyển tâm vẽ vào giữa canvas và xoay 45 độ
ctx2.save();
ctx2.translate(canvas2.width / 2, canvas2.height / 2);
ctx2.rotate(Math.PI / 4); // Xoay 45 độ

// Vẽ bumerang (hình chữ V)
ctx2.beginPath();
ctx2.moveTo(0, -10);
ctx2.quadraticCurveTo(15, 0, 10, 10);
ctx2.quadraticCurveTo(5, 7, 0, 0);
ctx2.quadraticCurveTo(-5, 7, -10, 10);
ctx2.quadraticCurveTo(-15, 0, 0, -10);
ctx2.closePath();

// Đổ màu cho bumerang
ctx2.fillStyle = boomerangColor;
ctx2.fill();

// Vẽ các chi tiết và highlight
ctx2.beginPath();
ctx2.moveTo(0, -8);
ctx2.quadraticCurveTo(12, 0, 8, 8);
ctx2.quadraticCurveTo(4, 6, 0, 1);
ctx2.closePath();
ctx2.fillStyle = highlightColor;
ctx2.globalAlpha = 0.5;
ctx2.fill();

// Vẽ chi tiết bên trái
ctx2.beginPath();
ctx2.moveTo(0, 1);
ctx2.quadraticCurveTo(-4, 6, -8, 8);
ctx2.quadraticCurveTo(-12, 0, 0, -8);
ctx2.closePath();
ctx2.fill();

// Viền đường bao quanh
ctx2.globalAlpha = 1.0;
ctx2.strokeStyle = '#553311';
ctx2.lineWidth = 1;

ctx2.beginPath();
ctx2.moveTo(0, -10);
ctx2.quadraticCurveTo(15, 0, 10, 10);
ctx2.quadraticCurveTo(5, 7, 0, 0);
ctx2.quadraticCurveTo(-5, 7, -10, 10);
ctx2.quadraticCurveTo(-15, 0, 0, -10);
ctx2.closePath();
ctx2.stroke();

// Khôi phục trạng thái
ctx2.restore();

// Lưu file
const buffer2 = canvas2.toBuffer('image/png');
fs.writeFileSync('./images/boomerang_1.png', buffer2);
console.log('Đã tạo hình ảnh bumerang xoay và lưu vào thư mục images');