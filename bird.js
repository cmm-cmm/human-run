// Quản lý các đối tượng chim trong game
class Bird {
    constructor(x, y, birdType = 'normal') {
        this.x = x;
        this.y = y;
        this.birdType = birdType; // 'normal' hoặc 'gray'
        this.type = birdType === 'gray' ? 'graybird' : 'bird'; // Thuộc tính type cho kiểm tra va chạm
        this.width = birdType === 'gray' ? GRAY_BIRD_WIDTH : 40;
        this.height = birdType === 'gray' ? GRAY_BIRD_HEIGHT : 30;
        this.sprite = birdType === 'gray' ? grayBirdSprites[0] : birdFlyingSprites[0];
        this.spriteIndex = 0;
        this.frameCount = 0;
        this.frameDelay = 15; // Tăng thời gian giữa các frame để animation chậm hơn
        this.jumped = false;
        this.reversed = false;
        this.reverseY = 0;
        this.reverseSpeed = birdType === 'gray' ? gameSpeed * 1.5 : gameSpeed * 1.2;
        this.canReverse = birdType === 'normal' && !hasReverseBird && birdsJumpedOver === 6;
        
        // Tham số chuyển động
        this.originalY = y;
        this.amplitude = birdType === 'gray' ? 4 : 3; // Giảm biên độ bay (thay đổi cao độ ít hơn)
        this.frequency = birdType === 'gray' ? 0.0015 : 0.001; // Giảm tần số bay (chuyển động chậm hơn)
        this.flyProgress = Math.random() * 100; // Vị trí bắt đầu ngẫu nhiên trong chu kỳ bay
        
        // Cache cho memoization
        this.lastX = x;
        this.lastY = y;
        this.lastSpriteIndex = this.spriteIndex;
        this.cachedBirdCanvas = null;
    }
    
    update(effectiveGameSpeed) {
        // Chuyển đổi sprite để tạo hoạt ảnh bay
        this.frameCount++;
        if (this.frameCount >= this.frameDelay) {
            this.frameCount = 0;
            this.spriteIndex = (this.spriteIndex + 1) % (this.birdType === 'gray' ? grayBirdSprites.length : birdFlyingSprites.length);
            this.sprite = this.birdType === 'gray' ? grayBirdSprites[this.spriteIndex] : birdFlyingSprites[this.spriteIndex];
            
            // Reset cache khi sprite thay đổi
            this.cachedBirdCanvas = null;
        }
        
        // Tăng tiến trình bay để tạo chuyển động mượt mà
        this.flyProgress += this.birdType === 'gray' ? 0.08 : 0.05;
        
        if (this.reversed) {
            // Chim quay đầu lại đuổi theo người chơi
            this.x -= this.reverseSpeed * -1;
            
            // Chuyển động lên xuống theo hàm sin với tiến trình bay mượt mà hơn
            this.y = this.reverseY + Math.sin(this.flyProgress * this.frequency * 100) * (this.amplitude * 2);
            
            // Kiểm tra va chạm khi đã quay đầu
            if (player && checkCollision(player, this)) {
                handleGameOver();
                return true; // Đã va chạm
            }
        } else {
            // Di chuyển từ phải sang trái
            this.x -= effectiveGameSpeed;
            
            // Chuyển động lên xuống nhẹ nhàng, mượt mà
            this.y = this.originalY + Math.sin(this.flyProgress * this.frequency * 100) * this.amplitude;
            
            // Kiểm tra va chạm
            if (player && checkCollision(player, this)) {
                handleGameOver();
                return true; // Đã va chạm
            }
            
            // Kiểm tra xem người chơi đã nhảy qua chim chưa
            if (!this.jumped && player.x > this.x + this.width && player.jumping) {
                this.jumped = true;
                
                if (this.birdType === 'normal') {
                    birdsJumpedOver++;
                    
                    // Kiểm tra xem chim có thể quay đầu không
                    if (this.canReverse) {
                        setTimeout(() => {
                            if (!this.reversed) {
                                this.reversed = true;
                                this.reverseY = this.y;
                                hasReverseBird = true;
                                birdsJumpedOver = 0;
                                
                                // Reset cache khi chim quay đầu
                                this.cachedBirdCanvas = null;
                            }
                        }, GRAY_BIRD_REVERSE_DELAY);
                    }
                } else if (this.birdType === 'gray') {
                    // Chim xám có xác suất quay đầu cao hơn
                    if (Math.random() < 0.5 || birdsJumpedOver >= 3) {
                        setTimeout(() => {
                            if (!this.reversed) {
                                this.reversed = true;
                                this.reverseY = this.y;
                                hasReverseBird = true;
                                birdsJumpedOver = 0;
                                
                                // Reset cache khi chim quay đầu
                                this.cachedBirdCanvas = null;
                            }
                        }, GRAY_BIRD_REVERSE_DELAY / 2);
                    }
                }
            }
        }
        
        return false; // Không có va chạm
    }
    
    isOffScreen() {
        // Kiểm tra nếu chim đã ra khỏi màn hình
        if (this.reversed) {
            return this.x > GAME_WIDTH + 100;
        } else {
            return this.x + this.width < 0;
        }
    }
    
    render(ctx, isLowDetail = false) {
        // Tối ưu: chỉ tạo lại canvas nếu vị trí hoặc sprite thay đổi
        const positionChanged = this.lastX !== this.x || this.lastY !== this.y;
        const spriteChanged = this.lastSpriteIndex !== this.spriteIndex;
        
        // Tạo key cho cache dựa trên trạng thái chim
        const cacheKey = `bird_${this.birdType}_${this.spriteIndex}_${this.reversed ? 'r' : 'n'}`;
        
        if (this.reversed) {
            // Sử dụng pre-rendered cache nếu có
            if (preRenderedCache[cacheKey] && !window.lowDetailMode) {
                ctx.drawImage(preRenderedCache[cacheKey], this.x, this.y);
            } else {
                // Lật ngược hình ảnh nếu chim quay đầu
                ctx.save();
                ctx.translate(this.x + this.width, 0);
                ctx.scale(-1, 1);
                ctx.drawImage(this.sprite, 0, this.y, this.width, this.height);
                ctx.restore();
                
                // Tạo pre-rendered cache khi CPU rảnh
                if (!window.lowDetailMode && !window.backgroundTasksScheduled) {
                    scheduleIdleTask(() => {
                        preRender((renderCtx, x, y, width, height) => {
                            renderCtx.save();
                            renderCtx.translate(width, 0);
                            renderCtx.scale(-1, 1);
                            renderCtx.drawImage(this.sprite, 0, 0, width, height);
                            renderCtx.restore();
                        }, this.width, this.height, cacheKey);
                    });
                }
            }
        } else {
            // Sử dụng pre-rendered cache nếu có
            if (preRenderedCache[cacheKey] && !window.lowDetailMode) {
                ctx.drawImage(preRenderedCache[cacheKey], this.x, this.y);
            } else {
                // Vẽ chim thông thường
                ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
                
                // Tạo pre-rendered cache khi CPU rảnh
                if (!window.lowDetailMode && !window.backgroundTasksScheduled) {
                    scheduleIdleTask(() => {
                        preRender((renderCtx, x, y, width, height) => {
                            renderCtx.drawImage(this.sprite, x, y, width, height);
                        }, this.width, this.height, cacheKey);
                    });
                }
            }
        }
        
        // Cập nhật vị trí và sprite cuối cùng
        this.lastX = this.x;
        this.lastY = this.y;
        this.lastSpriteIndex = this.spriteIndex;
    }
    
    // Hàm tạo chim mới
    static create(type = 'normal') {
        let y;
        
        if (type === 'gray') {
            // Chim xám xuất hiện ở độ cao trung bình hoặc cao
            // để người chơi có khả năng né được khi chim quay lại
            const grayBirdHeight = Math.floor(Math.random() * 2); // 0 hoặc 1
            
            if (grayBirdHeight === 0) {
                // Chim xám bay ở độ cao trung bình
                y = GROUND_Y - GRAY_BIRD_HEIGHT - 45;
            } else {
                // Chim xám bay cao
                y = GROUND_Y - GRAY_BIRD_HEIGHT - 75;
            }
        } else {
            // Chim thường bay ở 3 độ cao khác nhau
            const birdHeight = Math.floor(Math.random() * 3);
            const height = 30; // Chiều cao của con chim
            
            if (birdHeight === 0) {
                // Chim bay thấp
                y = GROUND_Y - height - 5;
            } else if (birdHeight === 1) {
                // Chim bay ở độ cao trung bình
                y = GROUND_Y - height - 40;
            } else {
                // Chim bay cao
                y = GROUND_Y - height - 70;
            }
        }
        
        return new Bird(GAME_WIDTH, y, type);
    }
}