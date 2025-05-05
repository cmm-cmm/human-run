// Class Cactus để quản lý và vẽ xương rồng
class Cactus {
    constructor(x, y, width, height, type) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = 'cactus';
        this.jumped = false;
        this.cactusType = type; // 'small', 'medium', hoặc 'large'
        this.sprite = this.getCactusSprite(type);
    }
    
    // Lấy sprite xương rồng dựa trên loại
    getCactusSprite(type) {
        switch(type) {
            case 'small':
                return cactusSingleSprite;
            case 'medium':
                return cactusDoubleSprite;
            case 'large':
                return cactusTripleSprite;
            default:
                return cactusSingleSprite;
        }
    }
    
    // Cập nhật vị trí xương rồng
    update(effectiveGameSpeed) {
        // Di chuyển xương rồng về phía trái với tốc độ game
        this.x -= effectiveGameSpeed;
        
        // Kiểm tra va chạm với người chơi (nếu không bất tử)
        if (!player.invincible && checkCollision(player, this)) {
            handleGameOver();
            return true;
        }
        
        return false;
    }
    
    // Kiểm tra xem xương rồng đã ra khỏi màn hình chưa
    isOffScreen() {
        return this.x + this.width < 0;
    }
    
    // Render xương rồng
    render(ctx, isLowDetail = false) {
        // Sử dụng cache pre-rendered nếu có thể
        const cacheKey = `cactus_${this.cactusType}`;
        
        // Sử dụng ảnh đã vẽ trước nếu có trong cache
        if (preRenderedCache[cacheKey]) {
            ctx.drawImage(preRenderedCache[cacheKey], this.x, this.y);
        } else {
            // Nếu chưa có trong cache, vẽ trực tiếp
            ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
            
            // Lên lịch tạo bản vẽ trước nếu đủ điều kiện (canvas rảnh)
            if (!window.lowDetailMode && !window.backgroundTasksScheduled) {
                scheduleIdleTask(() => {
                    preRender((renderCtx, x, y, width, height) => {
                        renderCtx.drawImage(this.sprite, x, y, width, height);
                    }, this.width, this.height, cacheKey);
                });
            }
        }
    }
    
    // Tạo một xương rồng mới
    static create() {
        // Xác định loại xương rồng ngẫu nhiên
        const types = ['small', 'medium', 'large'];
        const randomTypeIndex = Math.floor(Math.random() * types.length);
        const selectedType = types[randomTypeIndex];
        
        // Xác định kích thước dựa trên loại
        let width, height, yOffset;
        switch(selectedType) {
            case 'small':
                width = 30;
                height = 60;
                yOffset = 2; // Điều chỉnh thêm 2px để xương rồng nhỏ thấp hơn
                break;
            case 'medium':
                width = 50;
                height = 60;
                yOffset = 2; // Điều chỉnh thêm 2px cho xương rồng trung bình
                break;
            case 'large':
                width = 70;
                height = 70;
                yOffset = 3; // Điều chỉnh thêm 3px cho xương rồng lớn
                break;
            default:
                width = 30;
                height = 60;
                yOffset = 2;
        }
        
        // Tạo xương rồng mới với vị trí đầu màn hình
        // Điều chỉnh vị trí Y để xương rồng nằm thấp hơn và chạm đất
        return new Cactus(GAME_WIDTH, GROUND_Y - height + yOffset, width, height, selectedType);
    }
}