// Quản lý các đối tượng mìn trong game
class Mine {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = MINE_WIDTH * 1.0; // Giảm kích thước của mìn (từ 1.5 xuống còn 1.0)
        this.height = MINE_HEIGHT * 1.0; // Giảm kích thước của mìn (từ 1.5 xuống còn 1.0)
        this.sprite = mineSprite;
        this.type = 'mine'; // Thuộc tính type cho kiểm tra va chạm
        this.jumped = false;
        
        // Các thông số cho hiệu ứng nổ
        this.explosionFrames = explosionSprites || []; // Chuỗi sprite hiệu ứng nổ
        this.isExploding = false;
        this.explosionFrame = 0;
        this.explosionDelay = 3; // Số frame chờ trước khi chuyển sang frame nổ tiếp theo
        this.explosionCounter = 0;
    }
    
    update(effectiveGameSpeed) {
        // Nếu mìn đang nổ, xử lý hoạt ảnh nổ
        if (this.isExploding) {
            this.explosionCounter++;
            
            if (this.explosionCounter >= this.explosionDelay) {
                this.explosionCounter = 0;
                this.explosionFrame++;
                
                // Nếu đã hết chuỗi sprite nổ, đánh dấu đã xử lý xong
                if (this.explosionFrame >= this.explosionFrames.length) {
                    return true; // Báo hiệu đã xử lý xong vụ nổ, có thể loại bỏ mìn
                }
            }
            
            return false; // Đang trong quá trình nổ
        }
        
        // Di chuyển mìn từ phải sang trái
        this.x -= effectiveGameSpeed;
        
        // Kiểm tra va chạm với người chơi
        if (checkCollision(player, this)) {
            // Bắt đầu hiệu ứng nổ
            this.explode();
            
            // Game over ngay lập tức
            gameOver = true;
            
            // Dừng vòng lặp game ngay lập tức
            cancelAnimationFrame(animationFrame);
            
            return true; // Đã va chạm
        }
        
        // Kiểm tra xem người chơi đã nhảy qua mìn chưa
        if (!this.jumped && player.x > this.x + this.width && player.jumping) {
            this.jumped = true;
            // Có thể thêm điểm hoặc hiệu ứng khi nhảy qua thành công
        }
        
        return false; // Không có va chạm
    }
    
    explode() {
        // Phát hiệu ứng nổ
        this.isExploding = true;
        this.explosionFrame = 0;
        
        // Tạo hiệu ứng rung màn hình
        if (typeof createScreenShake === 'function') {
            createScreenShake(10, 300); // 10 độ rung, kéo dài 300ms
        }
        
        // Tạo nhiều hiệu ứng nổ liên tiếp
        let explosionCount = EXPLOSION_DURATION;
        
        const explosionInterval = setInterval(() => {
            // Tạo thêm hiệu ứng nổ mới ở vị trí lân cận
            const offsetX = (Math.random() * 10) - 5;
            const offsetY = (Math.random() * 10) - 5;
            createExplosion(this.x + this.width/2 + offsetX, this.y + this.height/2 + offsetY);
            
            // Giảm số lượng hiệu ứng nổ còn lại
            explosionCount--;
            if (explosionCount <= 0 || gameReset) {
                clearInterval(explosionInterval);
                
                // Hiển thị thông báo Game Over sau khi hiệu ứng nổ hoàn tất
                document.getElementById('game-over').classList.remove('hidden');
                
                // Cập nhật điểm cao nếu cần
                updateHighScore();
            }
        }, 50);
    }
    
    isOffScreen() {
        // Kiểm tra nếu mìn đã ra khỏi màn hình
        return this.x + this.width < 0;
    }
    
    render(ctx) {
        // Nếu đang nổ, vẽ sprite nổ
        if (this.isExploding && this.explosionFrames.length > 0) {
            const explosionSprite = this.explosionFrames[this.explosionFrame];
            // Vẽ sprite nổ với kích thước lớn hơn
            const explosionWidth = this.width * 4;  // Tăng từ 2 lên 4 lần
            const explosionHeight = this.height * 4; // Tăng từ 2 lên 4 lần
            // Canh giữa vụ nổ tại vị trí của mìn
            const explosionX = this.x - (explosionWidth - this.width) / 2;
            const explosionY = this.y - (explosionHeight - this.height) / 2;
            
            ctx.drawImage(explosionSprite, explosionX, explosionY, explosionWidth, explosionHeight);
        } else {
            // Vẽ mìn bình thường
            ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
        }
    }
    
    // Hàm tạo mìn mới
    static create() {
        const y = GROUND_Y - MINE_HEIGHT + 5; // Đặt mìn hơi chìm xuống đất một chút
        return new Mine(GAME_WIDTH, y);
    }
}

// Hàm tạo hiệu ứng nổ tại vị trí x, y
function createExplosion(x, y) {
    // Tạo hiệu ứng nổ tại vị trí được chỉ định
    // Hàm này có thể được mở rộng để tạo các phần tử hiệu ứng hoặc hiệu ứng âm thanh
    
    // Có thể thêm hiệu ứng ánh sáng nháy
    if (typeof createFlashEffect === 'function') {
        createFlashEffect(200); // Hiệu ứng nháy sáng kéo dài 200ms
    }
    
    // Có thể thêm hạt vụ nổ
    if (typeof createParticles === 'function') {
        createParticles(x, y, 20, ['#ff6b1a', '#ff9c40', '#ffb873', '#fed672', '#e25822']);
    }
}