// Khởi tạo các biến thời tiết
function initWeather() {
    return {
        isRaining: false,
        rainDrops: [],
        lightningFlash: false,
        lightningTimer: 0,
        lightningStrike: false,
        lightningX: 0,
        lightningY: 0,
        weatherTimer: 0,
        weatherDuration: 0,
        jumpLightningChance: 0.05,
        jumpCount: 0,
        playerElectrocuted: false,
        playerElectrocutionTimer: 0,
        rainCooldownTimer: 0,
        darkCloudWarning: false,
        darkCloudTimer: 0
    };
}

// Khởi tạo các biến động đất
function initEarthquake() {
    return {
        isEarthquake: false,
        earthquakeTimer: 0,
        earthquakeDuration: 0,
        earthquakeIntensity: 0,
        earthquakeCooldown: 0
    };
}

// Cập nhật hệ thống thời tiết
function updateWeather() {
    // Quản lý chuyển đổi trạng thái thời tiết ngẫu nhiên
    weather.weatherTimer++;

    // Chỉ cho phép mưa khi người chơi đạt đủ 150 điểm
    const currentScore = Math.floor(score / 10);

    if (!weather.isRaining && currentScore >= 150) {
        // Nếu đang trong thời gian nghỉ giữa các đợt mưa
        if (weather.rainCooldownTimer > 0) {
            weather.rainCooldownTimer--;

            // Hiển thị hiệu ứng bầu trời đang sáng dần sau mưa nếu thời gian nghỉ còn ít
            if (weather.rainCooldownTimer < 60 && weather.rainCooldownTimer % 10 === 0) {
                const brightnessLevel = 0.1 * (1 - weather.rainCooldownTimer / 60);
                ctx.fillStyle = `rgba(255, 255, 255, ${brightnessLevel})`;
                ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
            }
        } else {
            // Cơ hội bắt đầu mưa: khoảng 0.2% mỗi frame, tăng theo thời gian
            if (Math.random() < 0.002 + (weather.weatherTimer / 10000)) {
                startRain();
            }
        }
    } else if (weather.isRaining) {
        // Cập nhật thời gian mưa
        weather.weatherDuration--;

        // Kiểm tra kết thúc mưa
        if (weather.weatherDuration <= 0) {
            stopRain();
        }

        // Hiệu ứng chớp ngẫu nhiên
        if (Math.random() < 0.01 && !weather.lightningFlash && !weather.lightningStrike) {
            weather.lightningFlash = true;
            weather.lightningTimer = 5;
        }

        // Cập nhật hiệu ứng chớp
        if (weather.lightningFlash) {
            weather.lightningTimer--;
            if (weather.lightningTimer <= 0) {
                weather.lightningFlash = false;
            }
        }

        // Cập nhật hiệu ứng sét đánh
        if (weather.lightningStrike) {
            weather.lightningTimer--;
            if (weather.lightningTimer <= 0) {
                weather.lightningStrike = false;
            }
        }

        // Cập nhật cảnh báo đám mây đen
        if (weather.darkCloudWarning) {
            weather.darkCloudTimer--;
            if (weather.darkCloudTimer <= 0) {
                weather.darkCloudWarning = false;
            }
        }
    }
}

// Bắt đầu hiệu ứng mưa
function startRain() {
    weather.isRaining = true;
    weather.weatherDuration = 300 + Math.random() * 300; // Mưa kéo dài từ 5-10 giây (60fps)
    weather.jumpCount = 0; // Reset số lần nhảy khi bắt đầu mưa
    weather.jumpLightningChance = 0.05; // Reset tỉ lệ ban đầu bị sét đánh    
}

// Kết thúc hiệu ứng mưa
function stopRain() {
    weather.isRaining = false;
    weather.lightningFlash = false;
    weather.lightningStrike = false;
    weather.weatherTimer = 0;
    weather.jumpCount = 0;
    weather.rainCooldownTimer = RAIN_COOLDOWN; // Bắt đầu thời gian nghỉ giữa các đợt mưa
    
    // Đảm bảo đám mây đen biến mất khi hết mưa
    weather.darkCloudWarning = false;
    weather.darkCloudTimer = 0;    
}

// Kiểm tra bị sét đánh khi nhảy trong trời mưa
function checkLightningStrike() {
    weather.jumpCount++;

    // Tăng cơ hội bị sét đánh theo số lần nhảy
    const chance = weather.jumpLightningChance * Math.pow(1.5, weather.jumpCount - 1);

    // Hiển thị cảnh báo đám mây đen trước khi sét đánh
    weather.darkCloudWarning = true;
    weather.darkCloudTimer = DARK_CLOUD_DURATION;

    // Trì hoãn việc kiểm tra có bị sét đánh hay không để cho người chơi thời gian phản ứng
    setTimeout(() => {
        // Nếu đám mây đã biến mất (người chơi đã tránh được bằng cách ngồi xuống), bỏ qua
        if (!weather.darkCloudWarning) return;

        // Kiểm tra xem người chơi có bị sét đánh không
        if (Math.random() < chance) {
            // Nếu người chơi đang ngồi, không bị sét đánh
            if (player.ducking) {
                weather.darkCloudWarning = false;
                return;
            }

            // Người chơi bị sét đánh - ngừng chạy ngay lập tức
            gameOver = true;
            // Bật trạng thái điện giật và người chơi sẽ nằm xuống
            weather.playerElectrocuted = true;

            // Vị trí sét đánh (trên đầu người chơi)
            weather.lightningStrike = true;
            weather.lightningTimer = 30;
            weather.lightningX = player.x + player.width / 2 - 40;
            weather.lightningY = 0;
        } else {
            // Không bị sét đánh, chỉ dọa
            weather.darkCloudWarning = false;
        }
    }, 1000); // Cho người chơi 1 giây để phản ứng với đám mây đen
}

// Cập nhật hệ thống động đất
function updateEarthquake() {
    // Kiểm tra điều kiện để có thể xảy ra động đất (điểm > 100)
    const currentScore = Math.floor(score / 10);

    if (!earthquake.isEarthquake && currentScore >= EARTHQUAKE_MIN_SCORE) {
        // Nếu đang trong thời gian nghỉ giữa các đợt động đất
        if (earthquake.earthquakeCooldown > 0) {
            earthquake.earthquakeCooldown--;
        } else {
            // Xác suất nhỏ để bắt đầu động đất mỗi frame
            if (Math.random() < EARTHQUAKE_CHANCE) {
                startEarthquake();
            }
        }
    } else if (earthquake.isEarthquake) {
        earthquake.earthquakeTimer++;
        
        // Tạo hiệu ứng rung màn hình
        if (earthquake.earthquakeTimer % 2 === 0) {
            const shakeX = (Math.random() * earthquake.earthquakeIntensity * 2) - earthquake.earthquakeIntensity;
            const shakeY = (Math.random() * earthquake.earthquakeIntensity * 2) - earthquake.earthquakeIntensity;
            canvas.style.transform = `translate(${shakeX}px, ${shakeY}px)`;
            
            // Điều chỉnh vị trí mặt đất để tạo hiệu ứng lên xuống
            groundY = GROUND_Y + shakeY;
        }
        
        // Kết thúc động đất sau một khoảng thời gian
        if (earthquake.earthquakeTimer >= earthquake.earthquakeDuration) {
            stopEarthquake();
        }
    }
}

// Bắt đầu hiệu ứng động đất
function startEarthquake() {
    earthquake.isEarthquake = true;

    // Đặt thời gian và cường độ ngẫu nhiên cho động đất
    earthquake.earthquakeDuration = EARTHQUAKE_BASE_DURATION + Math.random() * 120; // 3-5 giây
    earthquake.earthquakeIntensity = 0.5 + Math.random() * 2.5; // Cường độ từ 0.5 đến 3.0
    earthquake.earthquakeTimer = 0;

    // Tạo hiệu ứng "cảnh báo" bằng việc làm rung màn hình nhẹ ngay lập tức
    canvas.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 2 - 1}px)`;
}

// Kết thúc hiệu ứng động đất
function stopEarthquake() {
    earthquake.isEarthquake = false;
    earthquake.earthquakeTimer = 0;
    earthquake.earthquakeCooldown = EARTHQUAKE_COOLDOWN; // 15 giây nghỉ giữa các đợt động đất (ở 60fps)
    canvas.style.transform = 'translate(0, 0)';
    groundY = GROUND_Y; // Đặt lại vị trí mặt đất
}