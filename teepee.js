// Class Teepee để quản lý và vẽ liều của người thổ dân
class Teepee {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = 'teepee';
        this.passed = false;
        this.hasThrowRock = false;
        this.rockThrowDelay = ROCK_THROW_DELAY; // Sử dụng hằng số thay vì giá trị cứng
        this.rockThrowTimer = 0;
        this.sprite = teepeeSprite;
        
        // Khởi tạo mảng đá
        this.rocks = [];
    }
    
    // Cập nhật vị trí liều và xử lý ném đá
    update(effectiveGameSpeed) {
        // Di chuyển liều về phía trái với tốc độ game
        this.x -= effectiveGameSpeed;
        
        // Kiểm tra nếu người chơi vừa chạy qua liều
        if (!this.passed && player.x > this.x + this.width / 2) {
            this.passed = true;
            this.rockThrowTimer = setTimeout(() => {
                this.throwRock();
            }, this.rockThrowDelay);
        }
        
        // Cập nhật vị trí các viên đá
        for (let i = this.rocks.length - 1; i >= 0; i--) {
            const rock = this.rocks[i];
            
            // Di chuyển đá với tốc độ game (không giảm tốc độ nữa)
            rock.x -= effectiveGameSpeed;
            
            // Di chuyển đá theo vận tốc riêng
            rock.x += rock.velocityX;
            rock.y += rock.velocityY;
            
            // Áp dụng trọng lực vào vận tốc theo chiều y
            rock.velocityY += rock.gravity;
            
            // Xoay đá khi bay
            rock.rotation = (rock.rotation || 0) + 5;
            
            // Kiểm tra va chạm đá với người chơi sử dụng hitbox nhỏ hơn
            if (!player.invincible) {
                // Tính toán vị trí hitbox (ở giữa viên đá)
                const rockHitboxX = rock.x + (rock.width - rock.hitboxWidth) / 2;
                const rockHitboxY = rock.y + (rock.height - rock.hitboxHeight) / 2;
                
                // Tạo đối tượng hitbox cho va chạm
                const rockHitbox = {
                    x: rockHitboxX,
                    y: rockHitboxY,
                    width: rock.hitboxWidth,
                    height: rock.hitboxHeight
                };
                
                if (checkCollision(player, rockHitbox)) {
                    handleGameOver();
                    return true;
                }
            }
            
            // Loại bỏ đá chỉ khi ra khỏi màn hình hoặc đã chạm đất và nằm ít nhất 500ms
            if (rock.x + rock.width < 0) {
                // Đá ra khỏi màn hình bên trái
                this.rocks.splice(i, 1);
            } else if (rock.y >= GROUND_Y - rock.height) {
                // Đá chạm đất - đặt y chính xác và đánh dấu đã chạm đất
                if (!rock.hasHitGround) {
                    rock.y = GROUND_Y - rock.height;
                    rock.velocityY = 0;
                    rock.velocityX *= 0.3; // Giảm vận tốc ngang khi chạm đất nhưng vẫn giữ chút đà
                    rock.hasHitGround = true;
                    rock.groundHitTime = Date.now();
                } else if (Date.now() - rock.groundHitTime > ROCK_GROUND_STAY_TIME) {
                    // Chỉ xóa sau khi đã nằm trên mặt đất theo thời gian quy định
                    this.rocks.splice(i, 1);
                }
            }
        }
        
        // Liều không gây va chạm, người chơi có thể đi qua
        return false;
    }
    
    // Ném đá về phía người chơi
    throwRock() {
        if (this.hasThrowRock) return;
        
        this.hasThrowRock = true;
        
        // Vị trí bắt đầu của đá (từ trên liều)
        const sourceX = this.x + this.width / 2;
        const sourceY = this.y + this.height / 3;
        
        // Tính toán vận tốc theo đường parabol tự nhiên
        // Sử dụng kỹ thuật ném dựa trên góc và tốc độ ban đầu
        const angle = -30 * (Math.PI / 180); // Góc 30 độ hướng lên (âm là hướng lên trong hệ tọa độ)
        const speed = ROCK_THROW_SPEED;
        
        // Tính toán vận tốc theo hướng x và y dựa trên góc
        const velocityX = Math.cos(angle) * speed;
        const velocityY = Math.sin(angle) * speed;
        
        // Tạo viên đá
        const rock = {
            x: sourceX - 15,
            y: sourceY,
            width: ROCK_WIDTH,
            height: ROCK_HEIGHT,
            velocityX: velocityX,
            velocityY: velocityY,
            rotation: 0,
            sprite: rockSprite,
            gravity: ROCK_GRAVITY,
            // Thêm một hitbox nhỏ hơn cho việc va chạm
            hitboxWidth: ROCK_HITBOX_WIDTH,
            hitboxHeight: ROCK_HITBOX_HEIGHT
        };
        
        this.rocks.push(rock);
        
        // Phát âm thanh ném đá nếu có
        if (typeof playSoundEffect === 'function') {
            playSoundEffect('rock_throw');
        }
    }
    
    // Kiểm tra xem liều đã ra khỏi màn hình chưa
    isOffScreen() {
        // Chỉ coi là ra khỏi màn hình khi liều và tất cả đá đã ra khỏi màn hình
        return this.x + this.width < 0 && this.rocks.length === 0;
    }
    
    // Render liều và đá
    render(ctx, isLowDetail = false) {
        // Vẽ liều
        ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
        
        // Vẽ các viên đá với hiệu ứng xoay
        for (const rock of this.rocks) {
            ctx.save();
            
            // Di chuyển tâm vẽ đến vị trí viên đá
            ctx.translate(rock.x + rock.width / 2, rock.y + rock.height / 2);
            
            // Xoay viên đá
            ctx.rotate(rock.rotation * Math.PI / 180);
            
            // Vẽ đá tại vị trí gốc (0,0) sau khi đã dịch chuyển và xoay
            ctx.drawImage(rock.sprite, -rock.width / 2, -rock.height / 2, rock.width, rock.height);
            
            // Visualize hitbox in debug mode
            if (typeof DEBUG !== 'undefined' && DEBUG) {
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 2;
                ctx.strokeRect(
                    -rock.hitboxWidth / 2,
                    -rock.hitboxHeight / 2,
                    rock.hitboxWidth,
                    rock.hitboxHeight
                );
            }
            
            ctx.restore();
        }
    }
    
    // Tạo một liều mới
    static create() {
        // Sử dụng hằng số cho kích thước
        return new Teepee(GAME_WIDTH, GROUND_Y - TEEPEE_HEIGHT + 5, TEEPEE_WIDTH, TEEPEE_HEIGHT);
    }
}