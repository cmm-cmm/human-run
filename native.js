// Quản lý các đối tượng thổ dân trong game
class Native {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = NATIVE_WIDTH;
        this.height = NATIVE_HEIGHT;
        this.sprite = nativeSprite;
        this.type = 'native'; // Thuộc tính type cho kiểm tra va chạm
        this.jumped = false;
        
        // Trạng thái phóng lao
        this.throwingSpear = false;
        this.spearThrown = false;
        this.throwDelay = 20; // Delay trước khi phóng lao (frames)
        this.throwSprite = nativeThrowSprite; // Sprite khi đang phóng lao
        
        // Trạng thái ném bumerang
        this.throwingBoomerang = false;
        this.boomerangThrown = false;
        this.throwBoomerangDelay = 30; // Delay trước khi ném bumerang (frames)
        this.useBoomerang = Math.random() < BOOMERANG_THROW_CHANCE; // Xác định xem có ném bumerang không
    }
    
    update(effectiveGameSpeed, spears, boomerangs) {
        // Di chuyển thổ dân từ phải sang trái
        this.x -= effectiveGameSpeed;
        
        // Kiểm tra va chạm với người chơi
        if (player && checkCollision(player, this)) {
            handleGameOver();
            return true; // Đã va chạm
        }
        
        // Kiểm tra xem người chơi đã nhảy qua thổ dân chưa
        if (player && !this.jumped && player.x > this.x + this.width && player.jumping) {
            this.jumped = true;
            
            // Thổ dân bắt đầu chuẩn bị phóng lao hoặc ném bumerang
            if (this.useBoomerang) {
                this.throwingBoomerang = true;
            } else {
                this.throwingSpear = true;
            }
        }
        
        // Xử lý phóng lao
        if (this.throwingSpear && !this.spearThrown) {
            this.throwDelay--;
            
            // Khi hết thời gian trễ, phóng lao
            if (this.throwDelay <= 0) {
                this.spearThrown = true;
                
                // Tạo cây lao mới
                spears.push(this.createSpear());
            }
        }
        
        // Xử lý ném bumerang
        if (this.throwingBoomerang && !this.boomerangThrown) {
            this.throwBoomerangDelay--;
            
            // Khi hết thời gian trễ, ném bumerang
            if (this.throwBoomerangDelay <= 0) {
                this.boomerangThrown = true;
                
                // Tạo bumerang mới
                boomerangs.push(this.createBoomerang());
            }
        }
        
        return false; // Không có va chạm
    }
    
    createSpear() {
        return {
            x: this.x,
            y: this.y + 20, // Vị trí phóng lao từ giữa người
            width: SPEAR_WIDTH,
            height: SPEAR_HEIGHT,
            velocityX: SPEAR_SPEED,
            active: true,
            sprite: spearSprite,
            
            update: function(player) {
                // Di chuyển cây lao
                this.x += this.velocityX;
                
                // Kiểm tra va chạm với người chơi
                if (this.active && checkCollisionWithSpear(player, this)) {
                    handleGameOver();
                    return true; // Đã va chạm
                }
                
                return false; // Không có va chạm
            },
            
            isOffScreen: function() {
                // Kiểm tra nếu lao đã ra khỏi màn hình
                return this.x > GAME_WIDTH;
            },
            
            render: function(ctx) {
                // Vẽ lao lên canvas
                ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
                
                // Hiển thị hitbox trong chế độ debug
                if (typeof DEBUG !== 'undefined' && DEBUG) {
                    ctx.strokeStyle = 'red';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(this.x, this.y, this.width, this.height);
                }
            }
        };
    }
    
    createBoomerang() {
        const boomerang = {
            x: this.x,
            y: this.y + 20, // Vị trí ném bumerang từ giữa người
            width: BOOMERANG_WIDTH,
            height: BOOMERANG_HEIGHT,
            // Thêm hitbox nhỏ hơn cho bumerang
            hitboxWidth: BOOMERANG_HITBOX_WIDTH,
            hitboxHeight: BOOMERANG_HITBOX_HEIGHT,
            velocityX: BOOMERANG_SPEED,
            velocityY: 0, // Vận tốc theo chiều dọc để tạo đường bay cong
            active: true,
            rotation: 0,
            returning: false, // Trạng thái bumerang đang quay về
            frameCount: 0, // Đếm số frame để xác định khi nào bumerang bắt đầu quay lại
            originX: this.x, // Lưu vị trí ban đầu để bumerang quay về
            originY: this.y + 20,
            currentSprite: 0, // Chỉ số sprite hiện tại (0 hoặc 1 cho hiệu ứng xoay)
            animationCounter: 0, // Bộ đếm cho animation
            curveDirection: -1, // Hướng cong (-1: lên trên, 1: xuống dưới)
            hitCounter: 0, // Số lần đã va chạm với người chơi (để tránh va chạm liên tục)
            flightPhase: 0, // Pha bay: 0 = bay đi, 1 = bay qua người chơi, 2 = quay về
            pastPlayerX: false, // Đã bay qua người chơi chưa
            targetX: 0, // Vị trí đích khi quay về
            targetY: 0,
            
            update: function(player) {
                this.animationCounter++;
                
                // Đổi sprite mỗi 5 frames để tạo hiệu ứng xoay
                if (this.animationCounter >= 5) {
                    this.currentSprite = this.currentSprite === 0 ? 1 : 0;
                    this.animationCounter = 0;
                }
                
                // Xoay bumerang
                this.rotation += BOOMERANG_ROTATION_SPEED;
                
                if (this.flightPhase === 0) {
                    // Pha 0: Bumerang đang bay về phía người chơi
                    this.x += this.velocityX;
                    
                    // Tạo chuyển động cong cho bumerang
                    this.velocityY = Math.sin(this.frameCount * 0.05) * BOOMERANG_CURVE_FACTOR * this.curveDirection;
                    this.y += this.velocityY;
                    
                    this.frameCount++;
                    
                    // Khi bumerang bay qua vị trí của người chơi, chuyển sang pha tiếp theo
                    if (player && this.x <= player.x + player.width / 2) {
                        this.flightPhase = 1;
                        this.pastPlayerX = true;
                        
                        // Bay thêm một đoạn nữa sau khi vượt qua người chơi
                        this.frameCount = 0;
                    }
                    
                    // Nếu bumerang bay quá xa mà vẫn chưa qua người chơi, chuyển sang pha quay về
                    if (this.frameCount >= BOOMERANG_FLIGHT_FRAMES * 1.5) {
                        this.flightPhase = 2;
                        this.returning = true;
                        this.targetX = this.originX;
                        this.targetY = this.originY;
                    }
                }
                else if (this.flightPhase === 1) {
                    // Pha 1: Đã bay qua người chơi, tiếp tục bay thêm một đoạn
                    this.x += this.velocityX * 0.7; // Giảm tốc độ
                    this.velocityY = Math.sin(this.frameCount * 0.1) * BOOMERANG_CURVE_FACTOR * this.curveDirection * 1.5;
                    this.y += this.velocityY;
                    
                    this.frameCount++;
                    
                    // Sau một khoảng thời gian, bắt đầu quay lại
                    if (this.frameCount >= BOOMERANG_FLIGHT_FRAMES / 2) {
                        this.flightPhase = 2;
                        this.returning = true;
                        this.targetX = this.originX;
                        this.targetY = this.originY;
                    }
                }
                else if (this.flightPhase === 2) {
                    // Pha 2: Bumerang đang quay về
                    // Tính toán vectơ từ vị trí hiện tại đến vị trí ban đầu
                    const dx = this.targetX - this.x;
                    const dy = this.targetY - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 10) {
                        // Nếu bumerang đã về gần vị trí ban đầu, vô hiệu hóa nó
                        this.active = false;
                    } else {
                        // Di chuyển bumerang về vị trí ban đầu
                        const normalizedDx = dx / distance;
                        const normalizedDy = dy / distance;
                        
                        this.x += normalizedDx * BOOMERANG_RETURN_SPEED;
                        this.y += normalizedDy * BOOMERANG_RETURN_SPEED;
                        
                        // Thêm một chuyển động lắc nhẹ khi quay về
                        this.y += Math.sin(this.frameCount * 0.1) * 0.5;
                        this.frameCount++;
                    }
                }
                
                // Kiểm tra va chạm với người chơi sử dụng hitbox nhỏ hơn
                if (this.active && this.hitCounter === 0) {
                    // Tạo đối tượng hitbox với kích thước nhỏ hơn
                    const hitbox = {
                        x: this.x + (this.width - this.hitboxWidth) / 2,
                        y: this.y + (this.height - this.hitboxHeight) / 2,
                        width: this.hitboxWidth,
                        height: this.hitboxHeight
                    };
                    
                    if (checkCollision(player, hitbox)) {
                        this.hitCounter = 10; // Tạm vô hiệu hóa va chạm trong 10 frames
                        handleGameOver();
                        return true; // Đã va chạm
                    }
                }
                
                // Giảm bộ đếm va chạm nếu đang dương
                if (this.hitCounter > 0) {
                    this.hitCounter--;
                }
                
                return false; // Không có va chạm
            },
            
            isOffScreen: function() {
                // Nếu bumerang bay quá xa khỏi màn hình, vô hiệu hóa nó
                if (this.x > GAME_WIDTH + 200 || this.x < -200 || this.y < -100 || this.y > GAME_HEIGHT + 100) {
                    this.active = false;
                    return true;
                }
                return !this.active; // Trả về đã vô hiệu hóa
            },
            
            render: function(ctx) {
                // Lưu trạng thái canvas
                ctx.save();
                
                // Di chuyển tâm vẽ tới vị trí bumerang
                ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
                
                // Xoay canvas theo góc quay của bumerang
                ctx.rotate(this.rotation);
                
                // Vẽ bumerang lên canvas (đã xoay)
                const sprite = this.currentSprite === 0 ? boomerangSprite : boomerangSprite1;
                ctx.drawImage(sprite, -this.width / 2, -this.height / 2, this.width, this.height);
                
                // Hiển thị hitbox trong chế độ debug
                if (typeof DEBUG !== 'undefined' && DEBUG) {
                    // Hiển thị hitbox thực tế (nhỏ hơn)
                    ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)';
                    ctx.lineWidth = 2;
                    const hitboxOffsetX = (this.width - this.hitboxWidth) / 2;
                    const hitboxOffsetY = (this.height - this.hitboxHeight) / 2;
                    ctx.strokeRect(
                        -this.width / 2 + hitboxOffsetX, 
                        -this.height / 2 + hitboxOffsetY, 
                        this.hitboxWidth, 
                        this.hitboxHeight
                    );
                    
                    // Hiển thị sprite boundary
                    ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
                }
                
                // Khôi phục trạng thái canvas
                ctx.restore();
            }
        };
        
        return boomerang;
    }
    
    isOffScreen() {
        // Kiểm tra nếu thổ dân đã ra khỏi màn hình
        return this.x + this.width < 0;
    }
    
    render(ctx) {
        // Vẽ thổ dân lên canvas - sử dụng sprite phóng lao nếu đang trong trạng thái phóng
        if ((this.throwingSpear && !this.spearThrown) || (this.throwingBoomerang && !this.boomerangThrown)) {
            ctx.drawImage(this.throwSprite, this.x, this.y, this.width, this.height);
        } else {
            ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
        }
        
        // Hiển thị hitbox trong chế độ debug
        if (typeof DEBUG !== 'undefined' && DEBUG) {
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
    
    // Hàm tạo thổ dân mới
    static create() {
        const y = GROUND_Y - NATIVE_HEIGHT;
        return new Native(GAME_WIDTH, y);
    }
}