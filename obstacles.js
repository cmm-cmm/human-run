// Quản lý và tạo các chướng ngại vật trong game
// Không khai báo lại biến obstacles và spears ở đây vì đã được khai báo trong game.js

// Cache các đối tượng để tái sử dụng (object pooling)
const objectPool = {
    spears: [],
    explosions: [],
    rocks: []  // Thêm đối tượng pool cho đá
};

// Khởi tạo mảng chướng ngại vật
function initObstacles() {
    obstacles = [];
    spears = [];
    lastObstacleTime = 0;
    birdsJumpedOver = 0;
    hasReverseBird = false;
    
    // Đặt lại object pool
    objectPool.spears = [];
    objectPool.explosions = [];
    objectPool.rocks = [];  // Đặt lại object pool cho đá
    
    return obstacles;
}

// Khởi tạo mảng phi tiêu
function initSpears() {
    return [];
}

// Cập nhật và tạo mới chướng ngại vật
function updateObstacles(effectiveGameSpeed) {
    const currentTime = Date.now();

    // Điều chỉnh tần suất xuất hiện chướng ngại vật theo tốc độ game
    const obstacleInterval = Math.max(500, 2000 - gameSpeed * 50);
    
    // Biến giảm tải xử lý với mật độ chướng ngại vật cao
    const maxActiveObstacles = window.lowDetailMode ? 6 : 10;

    // Tạo mới chướng ngại vật khi đủ điều kiện
    if (currentTime - lastObstacleTime > obstacleInterval && obstacles.length < maxActiveObstacles) {
        // Tạo chướng ngại vật mới
        createNewObstacle();
        lastObstacleTime = currentTime;
    }

    // Tối ưu bằng cách chỉ cập nhật các chướng ngại vật trong vùng hiển thị
    // Filter trước khi cập nhật để giảm số lượng lần lặp
    const activeObstacles = obstacles.filter(obstacle => !obstacle.isOffScreen());
    
    // Cập nhật và vẽ từng chướng ngại vật đang hoạt động
    for (let i = 0; i < activeObstacles.length; i++) {
        const obstacle = activeObstacles[i];
        
        // Phân loại và xử lý khác nhau cho từng đối tượng
        let collided = false;
        
        // Cập nhật đối tượng theo loại
        if (obstacle instanceof Cactus) {
            collided = obstacle.update(effectiveGameSpeed);
        } else if (obstacle instanceof Bird) {
            collided = obstacle.update(effectiveGameSpeed);
        } else if (obstacle instanceof Native) {
            collided = obstacle.update(effectiveGameSpeed, spears, boomerangs);
        } else if (obstacle instanceof Mine) {
            collided = obstacle.update(effectiveGameSpeed);
        } else if (obstacle instanceof Teepee) {
            collided = obstacle.update(effectiveGameSpeed);
        }
        
        // Nếu có va chạm và kết thúc game, dừng vòng lặp
        if (collided && gameOver) {
            return;
        }
    }
    
    // Cập nhật mảng obstacles dựa trên chướng ngại vật đang hoạt động
    obstacles = obstacles.filter(obstacle => !obstacle.isOffScreen());
    
    // Tối ưu bộ nhớ: Tái sử dụng các vật thể khi có thể
    recycleOffscreenObjects();
}

// Tối ưu bộ nhớ bằng cách tái sử dụng các đối tượng không còn hiển thị
function recycleOffscreenObjects() {
    // Thu thập các phi tiêu không còn hiển thị vào object pool
    for (let i = spears.length - 1; i >= 0; i--) {
        if (spears[i].isOffScreen()) {
            objectPool.spears.push(spears.splice(i, 1)[0]);
        }
    }
    
    // Giới hạn kích thước của object pool để tránh dùng quá nhiều bộ nhớ
    if (objectPool.spears.length > 10) {
        objectPool.spears.length = 10;
    }
    
    // Thu thập các đá không còn hiển thị (nếu có các đối tượng đá riêng biệt)
    if (objectPool.rocks.length > 5) {
        objectPool.rocks.length = 5;
    }
}

// Tạo chướng ngại vật mới
function createNewObstacle() {
    // Phân bổ tỷ lệ xuất hiện các loại chướng ngại vật
    const currentScore = Math.floor(score / 10);
    const canSpawnNative = currentScore >= NATIVE_MIN_SCORE;
    const canSpawnMine = currentScore >= MINE_MIN_SCORE;
    const canSpawnGrayBird = currentScore >= GRAY_BIRD_MIN_SCORE;
    const canSpawnTeepee = currentScore >= 50; // Chỉ xuất hiện liều sau khi đạt 50 điểm
    
    // Giảm xác suất tạo kết hợp phức tạp trong chế độ chi tiết thấp
    const createBirdMineCombination = canSpawnMine && 
                                     Math.random() < (window.lowDetailMode ? 0.05 : 0.15);
    
    let obstacle;
    
    // Lựa chọn loại chướng ngại vật dựa trên tỷ lệ
    if (canSpawnTeepee && Math.random() < 0.1) {
        // Tạo liều của người thổ dân
        obstacle = Teepee.create();
    } else if (canSpawnNative && Math.random() < NATIVE_CHANCE) {
        // Tạo thổ dân
        obstacle = Native.create();
    } else if (canSpawnMine && !createBirdMineCombination && Math.random() < MINE_CHANCE) {
        // Tạo mìn
        obstacle = Mine.create();
    } else if (canSpawnGrayBird && Math.random() < GRAY_BIRD_CHANCE) {
        // Tạo chim xám
        obstacle = Bird.create('gray');
    } else {
        // Lựa chọn ngẫu nhiên giữa chim thường và xương rồng
        const randomType = Math.random();
        obstacle = randomType < 0.3 ? Bird.create('normal') : Cactus.create();
    }
    
    // Thêm chướng ngại vật vào mảng
    obstacles.push(obstacle);
    
    // Nếu đây là chim và chúng ta cần tạo kết hợp chim-mìn
    if (obstacle instanceof Bird && createBirdMineCombination) {
        // Tạo quả mìn ngay bên dưới con chim
        const mine = Mine.create();
        // Điều chỉnh vị trí mìn để đặt phía dưới con chim
        mine.x = obstacle.x + Math.random() * 20 - 10; // Thêm một chút độ lệch ngẫu nhiên
        obstacles.push(mine);
    }
}

// Hàm render tất cả các chướng ngại vật
function renderObstacles(ctx, isLowDetail = false) {
    // Vẽ tất cả chướng ngại vật đang hoạt động
    for (const obstacle of obstacles) {
        // Sao lưu vị trí gốc để áp dụng nội suy chuyển động
        const originalX = obstacle.x;
        const originalY = obstacle.y;
        
        // Áp dụng nội suy chuyển động để vẽ mượt hơn
        obstacle.x = Math.round(obstacle.x * 10) / 10;
        obstacle.y = Math.round(obstacle.y * 10) / 10;
        
        // Vẽ chướng ngại vật
        obstacle.render(ctx, isLowDetail);
        
        // Khôi phục vị trí gốc
        obstacle.x = originalX;
        obstacle.y = originalY;
    }
}