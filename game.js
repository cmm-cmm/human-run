// Biến kiểm tra thiết bị
let isMobile = false;
let canvasScale = 1;

// Biến xử lý cảm ứng
let touchStartTime = 0;
let lastTouchTime = 0;
let touchDoubleTapSpeed = 300; // ms
let hasTouchControl = false;
let firstJumpTime = 0; // Thêm biến để theo dõi thời điểm nhảy lần đầu
let waitingForSecondTap = false; // Biến để theo dõi trạng thái chờ tap thứ hai

// Biến chính của game
let canvas;
let ctx;
let player;
let dog;
let obstacles = [];
let spears = [];
let boomerangs = []; // Thêm mảng cho bumerang
let gameSpeed = INITIAL_GAME_SPEED;
let speedMultiplier = 1.0;
let lastSpeedIncreaseScore = 0;
let score = 0;
let highScore = 0;
let gameOver = false;
let animationFrame;
let lastObstacleTime = 0;
let backgroundItems = [];
let dogCatchupRate = 0.0005;
let dogSpeedVariation = 0;
let dogApproachMode = false;
let birdsJumpedOver = 0;
let hasReverseBird = false;
let groundY = GROUND_Y;
let lastFrameTime = 0;
let currentDogRageStartScore; // Biến lưu trữ điểm kích hoạt cuồng nộ ngẫu nhiên

// Biến thể thời tiết
let weather;
let earthquake;

// Biến sprite
let playerRunningSprites = [];
let playerJumpingSprite;
let playerStarJumpSprite;
let playerDuckingSprite;
let cactusSingleSprite;
let cactusDoubleSprite;
let cactusTripleSprite;
let birdFlyingSprites = [];
let grayBirdSprites = [];
let dogRunningSprites = [];
let dogAttackSprite;
let dogJumpSprite;
let spikePitSprites = []; 
let groundSpikeSprites = [];
let rainPattern;
let lightningSprites = [];
let groundSprite;
let mountainSprite;
let nativeSprite;
let nativeThrowSprite;
let spearSprite;
let boomerangSprite; // Sprite bumerang
let boomerangSprite1; // Sprite bumerang xoay
let mineSprite;
let teepeeSprite; // Sprite liều (teepee)
let rockSprite; // Sprite đá (rock)
let explosionSprites = [];
let imagesLoaded = 0;
let totalImages = 35; // Tăng số lượng hình ảnh từ 33 lên 35
let gameStarted = false;

// Biến hoạt ảnh
let frameCounter = 0;
let birdFrameCounter = 0;
let currentBirdFrame = 0;
let dogFrameCounter = 0;
let currentDogFrame = 0;
let currentPlayerFrame = 0;

// Khởi tạo game
window.onload = function() {
    canvas = document.getElementById('game');
    ctx = canvas.getContext('2d');
    
    // Tải điểm cao nhất từ local storage nếu có
    if (localStorage.getItem('humanRunHighScore')) {
        highScore = parseInt(localStorage.getItem('humanRunHighScore'));
        document.getElementById('high-score').textContent = `High Score: ${highScore}`;
    }
    
    // Kiểm tra xem người dùng đang sử dụng thiết bị di động
    checkMobileDevice();
    
    // Thiết lập kích thước canvas tùy theo thiết bị
    setupCanvas();
    
    // Thiết lập điều khiển cảm ứng nếu là thiết bị di động
    if (isMobile) {
        setupTouchControls();
    }
    
    loadSprites();
    
    // Khởi tạo người chơi
    player = initPlayer();
    
    // Khởi tạo chó
    dog = initDog();
    
    // Khởi tạo thời tiết
    weather = initWeather();
    
    // Khởi tạo động đất
    earthquake = initEarthquake();
    
    // Khởi tạo chướng ngại vật
    obstacles = initObstacles();
    
    // Khởi tạo phi tiêu
    spears = initSpears();
    
    // Tạo các phần tử nền cho hiệu ứng parallax
    generateBackgroundItems();
    
    // Thêm trình lắng nghe sự kiện cho điều khiển
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Lắng nghe sự kiện thay đổi kích thước màn hình để điều chỉnh canvas
    window.addEventListener('resize', setupCanvas);
    
    // Lắng nghe sự kiện thay đổi hướng màn hình
    window.addEventListener('orientationchange', handleOrientationChange);
};

// Tạo các phần tử nền cho hiệu ứng parallax
function generateBackgroundItems() {
    // Thêm núi (nền parallax)
    for (let i = 0; i < 3; i++) {
        backgroundItems.push({
            type: 'mountain',
            x: i * 300,
            y: GROUND_Y - 60,
            width: 120,
            height: 60,
            speed: 0.5
        });
    }
    
    // Thêm đá nhỏ
    for (let i = 0; i < 8; i++) {
        backgroundItems.push({
            type: 'stone',
            x: Math.random() * GAME_WIDTH,
            y: GROUND_Y - Math.random() * 5,
            width: 2 + Math.random() * 4,
            height: 2 + Math.random() * 3,
            speed: 1
        });
    }
}

// Tải tất cả các hình ảnh sprite
function loadSprites() {
    // Tải sprites người chơi đang chạy
    for(let i = 0; i < PLAYER_FRAMES; i++) {
        const playerSprite = new Image();
        playerSprite.src = `images/player_run_${i}.png`;
        playerSprite.onload = imageLoaded;
        playerRunningSprites.push(playerSprite);
    }
    
    // Tải sprite người chơi đang nhảy
    playerJumpingSprite = new Image();
    playerJumpingSprite.src = 'images/player_jump.png';
    playerJumpingSprite.onload = imageLoaded;
    
    // Tải sprite nhảy sao
    playerStarJumpSprite = new Image();
    playerStarJumpSprite.src = 'images/player_star_jump.png';
    playerStarJumpSprite.onload = imageLoaded;
    
    // Tải sprite người chơi đang cúi
    playerDuckingSprite = new Image();
    playerDuckingSprite.src = 'images/player_duck.png';
    playerDuckingSprite.onload = imageLoaded;
    
    // Tải sprite cactus
    cactusSingleSprite = new Image();
    cactusSingleSprite.src = 'images/cactus_small.png';
    cactusSingleSprite.onload = imageLoaded;
    
    cactusDoubleSprite = new Image();
    cactusDoubleSprite.src = 'images/cactus_medium.png';
    cactusDoubleSprite.onload = imageLoaded;
    
    cactusTripleSprite = new Image();
    cactusTripleSprite.src = 'images/cactus_large.png';
    cactusTripleSprite.onload = imageLoaded;
    
    // Tải sprite chim
    for(let i = 0; i < 2; i++) {
        const birdSprite = new Image();
        birdSprite.src = `images/bird_${i}.png`;
        birdSprite.onload = imageLoaded;
        birdFlyingSprites.push(birdSprite);
    }
    
    // Tải sprite chim xám
    for(let i = 0; i < 2; i++) {
        const grayBirdSprite = new Image();
        grayBirdSprite.src = `images/gray_bird_${i}.png`;
        grayBirdSprite.onload = imageLoaded;
        grayBirdSprites.push(grayBirdSprite);
    }
    
    // Tải sprite chó
    for(let i = 0; i < 3; i++) {
        const dogSprite = new Image();
        dogSprite.src = `images/dog_run_${i}.png`;
        dogSprite.onload = imageLoaded;
        dogRunningSprites.push(dogSprite);
    }
    
    // Tải sprite chó tấn công
    dogAttackSprite = new Image();
    dogAttackSprite.src = 'images/dog_attack.png';
    dogAttackSprite.onload = imageLoaded;
    
    // Tải sprite chó nhảy
    dogJumpSprite = new Image();
    dogJumpSprite.src = 'images/dog_jump.png';
    dogJumpSprite.onload = imageLoaded;
    
    // Tải sprite hố gai
    for (let i = 0; i < 2; i++) {
        const spikePitSprite = new Image();
        spikePitSprite.src = `images/spike_pit_${i}.png`;
        spikePitSprite.onload = imageLoaded;
        spikePitSprites.push(spikePitSprite);
    }
    
    // Tải sprite gai nhọn mặt đất
    for (let i = 0; i < 3; i++) {
        const groundSpikeSprite = new Image();
        groundSpikeSprite.src = `images/ground_spike_${i}.png`;
        groundSpikeSprite.onload = imageLoaded;
        groundSpikeSprites.push(groundSpikeSprite);
    }
    
    // Tải sprite sét
    for(let i = 0; i < 3; i++) {
        const lightningSprite = new Image();
        lightningSprite.src = `images/lightning_${i}.png`;
        lightningSprite.onload = imageLoaded;
        lightningSprites.push(lightningSprite);
    }
    
    // Tải pattern mưa
    rainPattern = new Image();
    rainPattern.src = 'images/rain_pattern.png';
    rainPattern.onload = imageLoaded;
    
    // Tải sprite môi trường
    groundSprite = new Image();
    groundSprite.src = 'images/ground.png';
    groundSprite.onload = imageLoaded;
    
    mountainSprite = new Image();
    mountainSprite.src = 'images/mountain.png';
    mountainSprite.onload = imageLoaded;
    
    // Tải sprite người thổ dân
    nativeSprite = new Image();
    nativeSprite.src = 'images/native.png';
    nativeSprite.onload = imageLoaded;
    
    // Tải sprite người thổ dân ném lao
    nativeThrowSprite = new Image();
    nativeThrowSprite.src = 'images/native_throw.png';
    nativeThrowSprite.onload = imageLoaded;
    
    // Tải sprite phi tiêu
    spearSprite = new Image();
    spearSprite.src = 'images/spear.png';
    spearSprite.onload = imageLoaded;
    
    // Tải sprite bumerang
    boomerangSprite = new Image();
    boomerangSprite.src = 'images/boomerang.png';
    boomerangSprite.onload = imageLoaded;
    
    // Tải sprite bumerang xoay
    boomerangSprite1 = new Image();
    boomerangSprite1.src = 'images/boomerang_1.png';
    boomerangSprite1.onload = imageLoaded;
    
    // Tải sprite mìn
    mineSprite = new Image();
    mineSprite.src = 'images/mine.png';
    mineSprite.onload = imageLoaded;
    
    // Tải sprite liều (teepee)
    teepeeSprite = new Image();
    teepeeSprite.src = 'images/teepee.png';
    teepeeSprite.onload = imageLoaded;
    
    // Tải sprite đá (rock)
    rockSprite = new Image();
    rockSprite.src = 'images/rock.png';
    rockSprite.onload = imageLoaded;
    
    // Tải sprite cho hiệu ứng nổ
    for (let i = 0; i < 3; i++) {
        const explosionSprite = new Image();
        explosionSprite.src = `images/explosion_${i}.png`;
        explosionSprite.onload = imageLoaded;
        explosionSprites.push(explosionSprite);
    }
}

// Đếm số lượng hình ảnh đã tải
function imageLoaded() {
    imagesLoaded++;
    
    if (imagesLoaded === totalImages) {
        // Tất cả hình ảnh đã tải xong, bắt đầu game
        gameStarted = true;
        // Bắt đầu vòng lặp game
        gameLoop();
    }
}

// Vòng lặp game chính
function gameLoop(timestamp) {
    if (!gameStarted) {
        animationFrame = requestAnimationFrame(gameLoop);
        return;
    }
    
    // Tính toán delta time để chuẩn hóa tốc độ trò chơi
    // Giới hạn deltaTime tối đa để tránh "time jump" khi tab không được nhìn thấy
    let deltaTime = timestamp - lastFrameTime || 0;
    
    // Tối ưu deltaTime với tỷ lệ khung hình thấp
    if (deltaTime > 100) {
        // Nếu deltaTime quá lớn (>100ms, tương đương <10fps), áp dụng cơ chế giới hạn
        // Tránh độ trễ tích lũy khi chuyển tab hoặc CPU bị quá tải
        deltaTime = 50;
        console.log("Phát hiện khung hình bị drop! Đang tối ưu hóa...");
    } else {
        // Giới hạn deltaTime tối đa là 50ms (~20fps) để đảm bảo tính ổn định
        deltaTime = Math.min(deltaTime, 50);
    }
    
    // Lưu thời gian frame hiện tại
    lastFrameTime = timestamp;
    
    // Tính toán FPS hiện tại (cập nhật mỗi giây)
    if (!window.fpsTimer) window.fpsTimer = 0;
    if (!window.fpsCounter) window.fpsCounter = 0;
    if (!window.currentFps) window.currentFps = 60;
    
    window.fpsCounter++;
    window.fpsTimer += deltaTime;
    
    if (window.fpsTimer >= 1000) {
        window.currentFps = window.fpsCounter;
        window.fpsCounter = 0;
        window.fpsTimer = 0;
        
        // Điều chỉnh mức độ chi tiết dựa trên FPS
        adjustDetailLevel(window.currentFps);
        
        // Ghi lại hiệu suất nếu FPS thấp
        if (window.currentFps < 30) {
            console.log(`[Performance Warning] FPS thấp: ${window.currentFps}`);
        }
    }
    
    // Lên lịch cho các tác vụ không quan trọng thực hiện trong thời gian rảnh
    scheduleBackgroundTasks();
    
    // Cập nhật cây không gian (QuadTree) cho kiểm tra va chạm
    const collisionObjects = [...obstacles];
    if (dog.active) {
        collisionObjects.push(dog);
    }
    
    // Cập nhật QuadTree với danh sách đối tượng hiện tại
    updateSpatialTree(collisionObjects);
    
    // Cập nhật trạng thái game với deltaTime
    update(deltaTime);
    
    // Vẽ khung hình với nội suy để làm mượt
    draw();
    
    if (!gameOver) {
        // Sử dụng window.requestAnimationFrame để đồng bộ với tần số làm mới màn hình
        animationFrame = window.requestAnimationFrame(gameLoop);
    }
}

/**
 * Lên lịch cho các tác vụ nền (background tasks) thực hiện khi CPU rảnh
 */
function scheduleBackgroundTasks() {
    // Nếu có nhiều tác vụ không quan trọng, lên lịch thực hiện chúng ở đây
    if (!window.backgroundTasksScheduled && window.currentFps > 30) {
        window.backgroundTasksScheduled = true;
        
        scheduleIdleTask(() => {
            // Pre-render các vật thể tĩnh nếu chưa có trong cache
            preRenderStaticObjects();
            
            // Đặt lại cờ để cho phép lên lịch lại trong tương lai
            window.backgroundTasksScheduled = false;
        });
    }
}

/**
 * Pre-render các vật thể tĩnh để tối ưu hiệu suất
 */
function preRenderStaticObjects() {
    // Pre-render cactus nếu chưa được cache
    if (!preRenderedCache['cactus_small']) {
        preRender((ctx, x, y, width, height) => {
            ctx.drawImage(cactusSingleSprite, x, y, width, height);
        }, 30, 60, 'cactus_small');
    }
    
    if (!preRenderedCache['cactus_medium']) {
        preRender((ctx, x, y, width, height) => {
            ctx.drawImage(cactusDoubleSprite, x, y, width, height);
        }, 50, 60, 'cactus_medium');
    }
    
    if (!preRenderedCache['cactus_large']) {
        preRender((ctx, x, y, width, height) => {
            ctx.drawImage(cactusTripleSprite, x, y, width, height);
        }, 70, 70, 'cactus_large');
    }
    
    // Pre-render mìn
    if (!preRenderedCache['mine']) {
        preRender((ctx, x, y, width, height) => {
            ctx.drawImage(mineSprite, x, y, width, height);
        }, MINE_WIDTH, MINE_HEIGHT, 'mine');
    }
    
    // Pre-render núi nền
    if (!preRenderedCache['mountain']) {
        preRender((ctx, x, y, width, height) => {
            ctx.drawImage(mountainSprite, x, y, width, height);
        }, 120, 60, 'mountain');
    }
}

// Cập nhật trạng thái game
function update(deltaTime) {
    // Sử dụng deltaTime để đảm bảo tốc độ cập nhật nhất quán
    const timeCoefficient = deltaTime / (1000 / 60); // Chuẩn hóa cho 60fps
    
    // Cập nhật điểm số với hệ thống tính điểm đơn giản
    updateScore(deltaTime);
    
    // Tấn công đặc biệt khi người chơi đạt 999 điểm
    if (Math.floor(score / 10) === 999 && dog.active && !dog.specialAttack) {
        dog.specialAttack = true;
        dog.speed = dog.speed * 2;
        dog.behaviorState = 'attack';
        dog.prepareAttack = true;
        dog.biteTimer = 60;
    }
    
    // Sử dụng QuadTree để tìm các đối tượng tiềm năng có thể va chạm với người chơi
    let playerNearObstacle = false;
    const playerHitbox = {
        x: player.x,
        y: player.y,
        width: player.width,
        height: player.height
    };
    
    // Tìm các đối tượng có thể va chạm với người chơi
    const potentialColliders = findPotentialColliders(playerHitbox);
    
    // Kiểm tra khoảng cách an toàn với các đối tượng tiềm năng
    const safetyDistance = 100;
    for (const obstacle of potentialColliders) {
        const distanceToObstacle = Math.abs((player.x + player.width/2) - (obstacle.x + obstacle.width/2));
        if (distanceToObstacle < safetyDistance) {
            playerNearObstacle = true;
            break;
        }
    }
    
    // Tăng tốc độ game dần dần
    if (score - lastSpeedIncreaseScore >= SPEED_INCREASE_INTERVAL) {
        // Tăng tốc độ dựa trên mức điểm hiện tại
        const currentScore = Math.floor(score / 10);
        
        // Giảm hệ số tăng tốc để tăng tốc độ từ từ hơn
        const progressiveFactor = Math.min(score / 15000, 0.7);
        const speedIncrement = BASE_SPEED_INCREMENT * (1 + progressiveFactor * PROGRESSIVE_SPEED_FACTOR * score);
        
        // Giới hạn tốc độ tối đa thấp hơn
        gameSpeed = Math.min(MAX_GAME_SPEED - 2, gameSpeed + speedIncrement);
        
        // Cập nhật hệ số nhân tốc độ cho hiển thị (1x, 1.5x, 2x, etc.)
        speedMultiplier = gameSpeed / INITIAL_GAME_SPEED;
        
        // Cập nhật điểm gần nhất khi tăng tốc độ
        lastSpeedIncreaseScore = score;
        
        // Hiển thị tốc độ hiện tại trên màn hình
        document.getElementById('game-speed').textContent = `Speed: ${speedMultiplier.toFixed(1)}x`;
    }
    
    // Kích hoạt chó sau điểm số nhất định (500 điểm)
    if (score >= 500 && !dog.active) {
        dog.active = true;
        dog.x = -100;
        player.targetX = PLAYER_CENTER_X;
    }
    
    // Cập nhật người chơi
    updatePlayer();
    
    // Cập nhật chó
    updateDog(playerNearObstacle);
    
    // Nếu chó đang tấn công, thực thi kiểu tấn công tương ứng
    if (dog.prepareAttack) {
        const distanceToPlayer = player.x - dog.x - dog.width;
        executeAttackPattern(distanceToPlayer);
    }
    
    // Kiểm tra va chạm giữa chó và người chơi
    if (dog.active && checkDogCollision(dog, player)) {
        // Ghi nhận tấn công thành công cho chó học hỏi
        recordAttackResult(true);
        
        // Nếu người chơi không bất tử, game over
        if (!player.invincible) {
            handleGameOver();
        }
    } else if (dog.attacking && dog.biteTimer <= 5) {
        // Nếu chó đã tấn công và hết thời gian tấn công mà không va chạm
        // thì xem như tấn công thất bại
        recordAttackResult(false);
    }
    
    // Tính toán tốc độ hiệu quả dựa trên tốc độ game
    let effectiveGameSpeed = gameSpeed;
    
    // Cập nhật chướng ngại vật
    updateObstacles(effectiveGameSpeed);
    
    // Cập nhật phi tiêu
    updateSpears();
    
    // Cập nhật bumerang
    updateBoomerangs();
    
    // Cập nhật các phần tử nền (núi và đá)
    for (let i = 0; i < backgroundItems.length; i++) {
        backgroundItems[i].x -= backgroundItems[i].speed * effectiveGameSpeed * timeCoefficient;
        
        // Đặt lại các phần tử nền đã ra khỏi màn hình
        if (backgroundItems[i].x + backgroundItems[i].width < 0) {
            if (backgroundItems[i].type === 'mountain') {
                backgroundItems[i].x = GAME_WIDTH;
            } else {
                backgroundItems[i].x = GAME_WIDTH + Math.random() * 100;
                backgroundItems[i].y = GROUND_Y - Math.random() * 5;
            }
        }
    }
    
    // Cập nhật hoạt ảnh người chơi
    frameCounter += timeCoefficient;
    if (frameCounter >= 5) { // Thay đổi frame mỗi 5 vòng lặp game
        currentPlayerFrame = (currentPlayerFrame + 1) % PLAYER_FRAMES;
        frameCounter = 0;
    }
    
    // Cập nhật hoạt ảnh chim
    birdFrameCounter += timeCoefficient;
    if (birdFrameCounter >= 10) { // Thay đổi frame chim mỗi 10 vòng lặp game
        currentBirdFrame = (currentBirdFrame + 1) % 2;
        birdFrameCounter = 0;
    }
    
    // Cập nhật hoạt ảnh chó với thời gian thay đổi dựa trên tốc độ
    dogFrameCounter += timeCoefficient;
    const dogFrameSpeed = dog.attacking ? 3 : Math.max(3, 6 - dog.speed / 2); // Chân chó chạy nhanh hơn khi tốc độ cao
    if (dogFrameCounter >= dogFrameSpeed) {
        currentDogFrame = (currentDogFrame + 1) % 3;
        dogFrameCounter = 0;
    }
    
    // Cập nhật hệ thống thời tiết
    updateWeather();
    
    // Cập nhật hệ thống động đất
    updateEarthquake();
}

// Hàm để bắt đầu nhảy sao (double jump)
function startStarJump() {
    // Kiểm tra điều kiện để nhảy sao (cần đang nhảy và độ cao nhảy đủ)
    if (player.jumping && player.jumpHeight > 50 && !player.doubleJumpPressed) {
        player.doubleJumpPressed = true;
        
        // Nếu đã đạt đỉnh của nhảy, kích hoạt star jump ngay lập tức
        if (player.jumpPeak) {
            player.starJumping = true;
            player.width = PLAYER_WIDTH + 20;
            player.velocityY = -5; // Thêm boost nhỏ khi star jump
        }
    }
}

// Xử lý phím tắt
function handleKeyDown(event) {
    const key = event.key.toLowerCase();
    
    // Nếu game đã kết thúc, chỉ cho phép khởi động lại
    if (gameOver) {
        if (key === 'r' || key === ' ' || key === 'enter') {
            resetGame();
        }
        return;
    }
    
    // Xử lý điều khiển người chơi
    if (key === 'arrowup' || key === 'w' || key === ' ') {
        // Nếu chưa nhảy, bắt đầu nhảy
        if (!player.jumping) {
            jump(); // Thay startJump() bằng jump() từ player.js
        } else if (!player.doubleJumpPressed && !weather.playerElectrocuted) {
            // Nhảy sao (double jump) nếu đã nhảy lần đầu và chưa sử dụng double jump
            startStarJump();
        }
    } else if (key === 'arrowdown' || key === 's') {
        // Cúi xuống (nếu đang ở trên mặt đất)
        if (!player.jumping) {
            player.ducking = true;
            player.height = PLAYER_HEIGHT / 2;
            player.y = GROUND_Y - player.height;
        }
    }
}

// Đặt lại game
function resetGame() {
    // Đặt lại người chơi
    player.y = PLAYER_Y + 2;
    player.x = PLAYER_START_X;
    player.targetX = PLAYER_START_X;
    player.velocityY = 0;
    player.jumping = false;
    player.jumpPeak = false;
    player.starJumping = false;
    player.ducking = false;
    player.height = PLAYER_HEIGHT;
    player.width = PLAYER_WIDTH;
    player.invincible = false;
    player.invincibleTime = 0;
    player.doubleJumpPressed = false;
    
    // Đặt lại chó
    dog.x = DOG_START_X;
    dog.y = DOG_Y + 3;
    dog.speed = DOG_BASE_SPEED;
    dog.attacking = false;
    dog.active = false;
    dog.barkTimer = 0;
    dog.lastBarkTime = 0;
    dogApproachMode = false;
    dog.jumping = false;
    dog.velocityY = 0;
    dog.jumpCooldown = 0;
    dog.obstacleAwareness = 800;
    dog.behaviorTimer = 0;
    dog.behaviorState = 'steady';
    dog.lastBehaviorChange = 0;
    dog.prepareAttack = false;
    dog.biteTimer = 0;
    dog.biteCooldown = 0;
    dog.jumpStrength = 1.0;
    dog.nextObstacleType = null;
    dog.pounceReady = false;
    dog.specialAttack = false;
    
    // Đặt lại các thuộc tính trí thông minh cấp cao 
    // (Lưu ý: không đặt lại intelligence để chó tiếp tục học qua nhiều lần chơi)
    dog.emotionalState.frustration = 0;
    dog.emotionalState.confidence = 0.5;
    dog.emotionalState.aggression = 0.5;
    dog.advancedTactics.fakeRetreat = false;
    dog.advancedTactics.rhythmDisruption = false;
    dog.advancedTactics.patternRecognition.patternLength = 0;
    dog.advancedTactics.patternRecognition.lastPatterns = [];
    dog.advancedTactics.territorialAwareness.dangerZones = [];
    dog.advancedTactics.territorialAwareness.safeZones = [];
    dog.advancedTactics.territorialAwareness.optimalAttackZones = [];
    
    // Tạo ngẫu nhiên điểm kích hoạt cuồng nộ của chó
    // Phạm vi từ 120 đến 250, đôi khi có thể bắt đầu rất sớm!
    currentDogRageStartScore = DOG_RAGE_START_SCORE + Math.floor(Math.random() * 70) - Math.floor(Math.random() * 60);
    
    // Có xác suất nhỏ (10%) chó sẽ có trạng thái cuồng nộ ngay từ đầu!
    if (Math.random() < 0.1) {
        currentDogRageStartScore = 50 + Math.floor(Math.random() * 50);
    }

    // Đặt lại theo dõi chim
    birdsJumpedOver = 0;
    hasReverseBird = false;

    // Đặt lại thời tiết
    weather.isRaining = false;
    weather.lightningFlash = false;
    weather.lightningStrike = false;
    weather.weatherTimer = 0;
    weather.jumpCount = 0;
    weather.rainCooldownTimer = RAIN_COOLDOWN;
    weather.darkCloudWarning = false;
    weather.darkCloudTimer = 0;
    weather.playerElectrocuted = false;
    weather.playerElectrocutionTimer = 0;
    
    // Đặt lại động đất
    earthquake.isEarthquake = false;
    earthquake.earthquakeTimer = 0;
    earthquake.earthquakeDuration = 0;
    earthquake.earthquakeIntensity = 0;
    earthquake.earthquakeCooldown = 0;

    obstacles = [];
    spears = [];
    boomerangs = []; // Đặt lại bumerang
    gameSpeed = INITIAL_GAME_SPEED;
    speedMultiplier = 1.0;
    lastSpeedIncreaseScore = 0;
    score = 0;
    gameOver = false; 

    // Cập nhật màn hình
    document.getElementById('game-over').classList.add('hidden');
    document.getElementById('score').textContent = `Score: 0`;
    document.getElementById('game-speed').textContent = `Speed: 1.0x`;
    
    // Đảm bảo hiển thị đúng thông báo Game Over cho từng loại thiết bị
    if (isMobile) {
        document.querySelector('#game-over .desktop-only').style.display = 'none';
        document.querySelector('#game-over .mobile-only').style.display = 'block';
    } else {
        document.querySelector('#game-over .desktop-only').style.display = 'block';
        document.querySelector('#game-over .mobile-only').style.display = 'none';
    }

    // Đặt lại hiệu ứng rung màn hình
    canvas.style.transform = 'translate(0, 0)';

    // Đặt lại vị trí mặt đất
    groundY = GROUND_Y;

    lastObstacleTime = Date.now();
    gameLoop();
}

// Xử lý khi game over
function handleGameOver() {
    gameOver = true;
    
    // Cập nhật cảm xúc chó khi thắng
    if (dog.active) {
        dog.emotionalState.confidence = Math.min(1.0, dog.emotionalState.confidence + 0.3);
        dog.emotionalState.frustration = Math.max(0, dog.emotionalState.frustration - 0.2);
    }
    
    // Cập nhật và lưu điểm cao nhất
    if (Math.floor(score / 10) > highScore) {
        highScore = Math.floor(score / 10);
        document.getElementById('high-score').textContent = `High Score: ${highScore}`;
        localStorage.setItem('humanRunHighScore', highScore);
    }
    
    // Hiển thị màn hình game over
    document.getElementById('game-over').classList.remove('hidden');
    
    // Hủy vòng lặp game
    cancelAnimationFrame(animationFrame);
}

// Ghi nhận kết quả tấn công để học hỏi
function recordAttackResult(wasSuccessful) {
    if (wasSuccessful) {
        dog.tacticalDecision.successfulAttacks++;
        
        // Tăng trí thông minh khi tấn công thành công
        increaseDogIntelligence(0.02);
        
        // Cập nhật trạng thái cảm xúc
        dog.emotionalState.confidence = Math.min(1.0, dog.emotionalState.confidence + 0.1);
        dog.emotionalState.frustration = Math.max(0, dog.emotionalState.frustration - 0.05);
        
        // Lưu lại tấn công thành công vào hệ thống ghi nhớ
        dog.memorySystem.successfulAttacks.push({
            position: player.x,
            playerState: player.jumping ? 'jumping' : (player.ducking ? 'ducking' : 'running'),
            attackPattern: dog.currentAttackPattern,
            time: Date.now()
        });
        
        // Giới hạn kích thước lịch sử
        if (dog.memorySystem.successfulAttacks.length > 10) {
            dog.memorySystem.successfulAttacks.shift();
        }
    } else {
        dog.tacticalDecision.failedAttacks++;
        
        // Cập nhật trạng thái cảm xúc
        dog.emotionalState.frustration = Math.min(1.0, dog.emotionalState.frustration + 0.1);
        dog.emotionalState.confidence = Math.max(0, dog.emotionalState.confidence - 0.05);
    }
    
    // Điều chỉnh khoảng cách tấn công tối ưu dựa trên tỷ lệ thành công
    const attackSuccessRate = dog.tacticalDecision.successfulAttacks / 
                             (dog.tacticalDecision.successfulAttacks + dog.tacticalDecision.failedAttacks);
    
    // Nếu tỷ lệ tấn công thành công cao, duy trì khoảng cách hiện tại
    // Nếu thấp, điều chỉnh khoảng cách
    if (attackSuccessRate < 0.3 && dog.tacticalDecision.optimalDistance > DOG_ATTACK_DISTANCE) {
        // Giảm khoảng cách tấn công nếu tỷ lệ thành công thấp
        dog.tacticalDecision.optimalDistance -= 2;
    } else if (attackSuccessRate > 0.7 && dog.intelligence > 1.2) {
        // Tăng khoảng cách tấn công nếu tỷ lệ thành công cao
        dog.tacticalDecision.optimalDistance += 1;
    }
}

// Xác định hàm để kiểm tra va chạm đã nhảy qua chướng ngại vật
function checkObstacleJumped(obstacle) {
    // Kiểm tra xem người chơi đã nhảy qua chướng ngại vật chưa
    if (!obstacle.jumped && 
        player.x > obstacle.x + obstacle.width && 
        player.jumping) {
        
        obstacle.jumped = true;
        
        // Kiểm tra loại chướng ngại vật chỉ để theo dõi
        if (obstacle.type === 'bird') {
            birdsJumpedOver++;
        }
        
        return true;
    }
    
    return false;
}

// Hàm kiểm tra xem người dùng đang sử dụng thiết bị di động
function checkMobileDevice() {
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
              (window.matchMedia && window.matchMedia('(max-width: 768px)').matches);
    
    // Xử lý giao diện dựa trên loại thiết bị
    if (isMobile) {
        // Đây là thiết bị di động
        document.body.classList.add('mobile-device');
        
        // Ẩn phần tử desktop-only và hiện phần tử mobile-only
        const desktopElements = document.querySelectorAll('.desktop-only');
        const mobileElements = document.querySelectorAll('.mobile-only');
        
        desktopElements.forEach(elem => {
            elem.style.display = 'none';
        });
        
        mobileElements.forEach(elem => {
            elem.style.display = 'block';
        });
        
        // Ẩn hướng dẫn phím điều khiển PC
        const controlsGuide = document.querySelector('.controls-guide');
        if (controlsGuide) {
            controlsGuide.style.display = 'none';
        }
        
        // Hiện các nút điều khiển cảm ứng
        const touchControls = document.querySelector('.touch-controls');
        if (touchControls) {
            touchControls.style.display = 'block';
        }
    } else {
        // Đây là thiết bị PC
        document.body.classList.remove('mobile-device');
        
        // Hiện phần tử desktop-only và ẩn phần tử mobile-only
        const desktopElements = document.querySelectorAll('.desktop-only');
        const mobileElements = document.querySelectorAll('.mobile-only');
        
        desktopElements.forEach(elem => {
            elem.style.display = 'block';
        });
        
        mobileElements.forEach(elem => {
            elem.style.display = 'none';
        });
        
        // Hiện hướng dẫn phím điều khiển PC
        const controlsGuide = document.querySelector('.controls-guide');
        if (controlsGuide) {
            controlsGuide.style.display = 'flex';
        }
        
        // Ẩn các nút điều khiển cảm ứng
        const touchControls = document.querySelector('.touch-controls');
        if (touchControls) {
            touchControls.style.display = 'none';
        }
    }
}

// Hàm thiết lập kích thước canvas
function setupCanvas() {
    const gameContainer = document.querySelector('.game-container');
    const containerWidth = gameContainer.clientWidth;
    
    // Tính toán tỷ lệ scale dựa trên kích thước container
    canvasScale = containerWidth / canvas.width;
    
    // Cập nhật chiều cao dựa trên tỷ lệ khung hình
    const scaledHeight = canvas.height * canvasScale;
    
    // Cập nhật style cho canvas
    canvas.style.width = '100%';
    canvas.style.height = 'auto';
}

// Hàm xử lý thay đổi hướng màn hình
function handleOrientationChange() {
    // Đợi một chút để đảm bảo kích thước đã được cập nhật
    setTimeout(setupCanvas, 300);
}

// Hàm thiết lập điều khiển cảm ứng
function setupTouchControls() {
    hasTouchControl = true;
    
    // Lấy các phần tử điều khiển cảm ứng
    const touchLeft = document.querySelector('.touch-left');
    const touchRight = document.querySelector('.touch-right');
    
    if (!touchLeft || !touchRight) {
        console.error("Touch control elements not found!");
        return;
    }
    
    // Xử lý cúi (bên trái màn hình)
    touchLeft.addEventListener('touchstart', function(e) {
        e.preventDefault(); // Ngăn chặn hành vi mặc định
        
        // Nếu game đã kết thúc, khởi động lại khi chạm
        if (gameOver) {
            resetGame();
            return;
        }
        
        // Cúi xuống (nếu đang ở trên mặt đất)
        if (!player.jumping) {
            player.ducking = true;
            player.height = PLAYER_HEIGHT / 2;
            player.y = GROUND_Y - player.height;
        }
    });
    
    // Xử lý kết thúc chạm (hết cúi)
    touchLeft.addEventListener('touchend', function(e) {
        e.preventDefault();
        
        // Ngừng cúi khi nhả
        if (player.ducking) {
            player.ducking = false;
            player.height = PLAYER_HEIGHT;
            player.y = GROUND_Y - player.height;
        }
    });
    
    // Xử lý nhảy (bên phải màn hình)
    touchRight.addEventListener('touchstart', function(e) {
        e.preventDefault(); // Ngăn chặn hành vi mặc định
        
        const now = Date.now();
        
        // Nếu game đã kết thúc, khởi động lại khi chạm
        if (gameOver) {
            resetGame();
            return;
        }
        
        // Xử lý nhảy đơn và nhảy kép (Star Jump)
        if (!player.jumping) {
            // Nhảy bình thường - lần nhảy đầu tiên
            jump();
            
            // Đánh dấu đã bắt đầu nhảy lần đầu và lưu thời gian
            firstJumpTime = now;
            waitingForSecondTap = true;
        } else if (waitingForSecondTap && !player.doubleJumpPressed && 
                  now - firstJumpTime < touchDoubleTapSpeed && 
                  !weather.playerElectrocuted) {
            // Nhảy sao nếu chạm lần thứ hai đủ nhanh sau lần nhảy đầu tiên
            startStarJump();
            waitingForSecondTap = false; // Đã xử lý tap thứ hai
        }
        
        // Lưu thời gian chạm cuối cùng
        lastTouchTime = now;
    });
    
    // Thêm xử lý cho game over
    document.getElementById('game-over').addEventListener('touchstart', function(e) {
        e.preventDefault();
        if (gameOver) {
            resetGame();
        }
    });

    console.log("Touch controls set up successfully!");
}

// Hàm khởi tạo bumerang
function initBoomerangs() {
    return [];
}

// Cập nhật phi tiêu
function updateSpears() {
    // Cập nhật từng phi tiêu và kiểm tra va chạm
    for (let i = spears.length - 1; i >= 0; i--) {
        // Kiểm tra va chạm với người chơi
        if (player && spears[i].update(player)) {
            // Va chạm với người chơi, game over đã được xử lý trong hàm update
            // của từng phi tiêu
            return;
        }
        
        // Xóa phi tiêu đã ra khỏi màn hình
        if (spears[i].isOffScreen()) {
            spears.splice(i, 1);
        }
    }
}

// Cập nhật bumerang
function updateBoomerangs() {
    // Cập nhật từng bumerang và kiểm tra va chạm
    for (let i = boomerangs.length - 1; i >= 0; i--) {
        // Kiểm tra va chạm với người chơi
        if (player && boomerangs[i].update(player)) {
            // Va chạm với người chơi, game over đã được xử lý trong hàm update
            // của từng bumerang
            return;
        }
        
        // Xóa bumerang không còn hoạt động
        if (!boomerangs[i].active) {
            boomerangs.splice(i, 1);
        }
    }
}

// Hàm điều chỉnh mức độ chi tiết dựa trên FPS
function adjustDetailLevel(fps) {
    if (fps < 30) {
        // FPS thấp - giảm chi tiết đồ họa
        if (!window.lowDetailMode) {
            window.lowDetailMode = true;
            console.log("Chuyển sang chế độ chi tiết thấp để cải thiện hiệu suất");
        }
    } else if (fps > 45) {
        // FPS cao - có thể tăng chi tiết đồ họa
        if (window.lowDetailMode) {
            window.lowDetailMode = false;
            console.log("Chuyển sang chế độ chi tiết cao");
        }
    }
}
