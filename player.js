// Khởi tạo người chơi
function initPlayer() {
    return {
        x: PLAYER_START_X,
        y: PLAYER_Y + 2,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
        velocityY: 0,
        jumping: false,
        starJumping: false,
        jumpPeak: false,
        jumpHeight: 0,
        ducking: false,
        targetX: PLAYER_START_X,
        // Thêm thuộc tính cho cơ chế mệt mỏi khi ngồi
        duckDuration: 0,
        duckFatigue: 0,
        forcedStand: false,
        forcedStandTimer: 0
    };
}

// Xử lý người chơi nhảy
function jump() {
    if (player.jumping) return; // Ngăn chặn nhảy hai lần
    
    player.jumping = true;
    player.velocityY = JUMP_FORCE;
    player.jumpHeight = 0;
    player.jumpPeak = false;
    player.starJumping = false;
    
    // Thêm âm thanh nhảy nếu tồn tại
    if (window.jumpSound) {
        window.jumpSound.currentTime = 0;
        window.jumpSound.play().catch(e => console.log("Sound play failed:", e));
    }
}

// Cập nhật vị trí và trạng thái người chơi
function updatePlayer() {
    // Di chuyển người chơi từ từ ra giữa màn hình khi chó xuất hiện
    if (dog.active && player.x < player.targetX) {
        player.x += PLAYER_REPOSITION_SPEED * gameSpeed;
        if (player.x > player.targetX) {
            player.x = player.targetX;
        }
    }
    
    // Cập nhật vị trí người chơi (trọng lực và nhảy)
    if (player.jumping) {
        player.velocityY += GRAVITY;
        player.y += player.velocityY;
        
        // Theo dõi độ cao nhảy từ mặt đất
        player.jumpHeight = PLAYER_Y - player.y;
        
        // Kiểm tra ở đỉnh cao của cú nhảy (khi vận tốc chuyển từ âm sang dương)
        if (player.velocityY >= 0 && !player.jumpPeak) {
            player.jumpPeak = true;
            
            // Kích hoạt "star jump" ở đỉnh cú nhảy nếu nhảy đủ cao và người chơi đã nhấn nút nhảy lần thứ 2
            if (player.jumpHeight > 80 && player.doubleJumpPressed) {
                player.starJumping = true;
                player.width = PLAYER_WIDTH + 20;
                player.velocityY = -5; // Thêm boost nhỏ khi star jump
                player.doubleJumpPressed = false; // Reset trạng thái
                
                // Nếu người chơi có hiệu ứng bất tử
                if (player.invincible) {
                    // Hiệu ứng ánh sáng xung quanh người chơi
                    createStarEffect(player.x + player.width/2, player.y + player.height/2);
                }
            }
            
            // Kiểm tra bị sét đánh khi nhảy trong trời mưa
            if (weather.isRaining && !weather.lightningStrike) {
                checkLightningStrike();
            }
        }
        
        // Khi đang rơi xuống, chuyển về tư thế nhảy thông thường
        if (player.velocityY > 5 && player.starJumping) {
            player.starJumping = false;
            player.width = PLAYER_WIDTH;
        }
        
        // Kiểm tra người chơi đã hạ cánh chưa
        if (player.y >= groundY - player.height) {
            // Đảm bảo vị trí chính xác trên mặt đất
            player.y = groundY - player.height;
            player.jumping = false;
            player.jumpPeak = false;
            player.starJumping = false;
            player.velocityY = 0;
            player.width = PLAYER_WIDTH;
            player.doubleJumpPressed = false; // Reset trạng thái double jump
            
            // Thêm hiệu ứng bụi khi hạ cánh nếu nhảy từ độ cao nhất định
            if (player.jumpHeight > 60) {
                createDustEffect(player.x + player.width/2, groundY);
            }
        }
    } else {
        // Đảm bảo người chơi luôn ở đúng vị trí trên mặt đất khi không nhảy
        player.y = groundY - player.height;
    }
    
    // Xử lý trạng thái mệt mỏi khi ngồi
    if (player.ducking) {
        // Tăng thời gian ngồi và độ mệt mỏi
        player.duckDuration++;
        player.duckFatigue = Math.min(player.duckFatigue + 1, DUCK_MAX_DURATION);
        
        // Kiểm tra nếu người chơi đã ngồi quá lâu
        if (player.duckFatigue >= DUCK_MAX_DURATION) {
            // Buộc người chơi đứng dậy
            player.ducking = false;
            player.forcedStand = true;
            player.forcedStandTimer = DUCK_FORCED_STAND_DURATION;
            player.height = PLAYER_HEIGHT;
            player.y = groundY - player.height;
        }
    } else {
        // Giảm độ mệt mỏi khi đứng
        player.duckDuration = 0;
        player.duckFatigue = Math.max(0, player.duckFatigue - DUCK_RECOVERY_RATE);
        
        // Cập nhật thời gian bắt buộc đứng
        if (player.forcedStand) {
            player.forcedStandTimer--;
            if (player.forcedStandTimer <= 0) {
                player.forcedStand = false;
            }
        }
    }
    
    // Cập nhật thời gian hiệu ứng bất tử nếu có
    if (player.invincible) {
        player.invincibleTime--;
        if (player.invincibleTime <= 0) {
            player.invincible = false;
        }
    }
}

// Hiển thị chỉ báo mệt mỏi khi ngồi quá lâu
function drawFatigueIndicator() {
    if (player.ducking && player.duckFatigue > DUCK_FATIGUE_THRESHOLD) {
        // Tính toán mức độ mệt mỏi từ 0-1
        const fatigueLevel = (player.duckFatigue - DUCK_FATIGUE_THRESHOLD) / (DUCK_MAX_DURATION - DUCK_FATIGUE_THRESHOLD);
        
        // Hiển thị thanh mệt mỏi
        ctx.save();
        
        // Vị trí của thanh mệt mỏi (phía trên đầu người chơi)
        const barWidth = 40;
        const barHeight = 5;
        const barX = player.x + (player.width - barWidth) / 2;
        const barY = player.y - 15;
        
        // Vẽ nền cho thanh mệt mỏi
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Vẽ thanh mệt mỏi (màu đỏ khi gần hết)
        const color = fatigueLevel > 0.7 ? 'red' : 'orange';
        ctx.fillStyle = color;
        
        // Hiệu ứng nhấp nháy khi gần hết sức
        if (fatigueLevel > 0.8 && Math.floor(frameCounter / 5) % 2 === 0) {
            ctx.fillStyle = 'red';
        }
        
        ctx.fillRect(barX, barY, barWidth * fatigueLevel, barHeight);
        
        // Hiển thị biểu tượng hoặc chữ để cho biết người chơi đang mệt
        if (fatigueLevel > 0.9) {
            ctx.font = '10px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.fillText('Mệt!', barX + barWidth / 2, barY - 3);
        }
        
        ctx.restore();
    } else if (player.forcedStand) {
        // Hiển thị biểu tượng khi người chơi bị buộc phải đứng (thay đổi từ văn bản sang biểu tượng)
        ctx.save();
        
        // Vị trí biểu tượng (phía trên đầu người chơi)
        const centerX = player.x + player.width / 2;
        const iconY = player.y - 20;
        const size = 16;
        
        // Vẽ biểu tượng hồi phục (vòng tròn xoay)
        ctx.translate(centerX, iconY);
        
        // Hiệu ứng xoay cho biểu tượng
        const rotationAngle = (frameCounter % 60) / 60 * Math.PI * 2;
        ctx.rotate(rotationAngle);
        
        // Vẽ vòng tròn nền
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.arc(0, 0, size/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Vẽ biểu tượng mũi tên hồi phục
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        // Vẽ mũi tên cong
        ctx.arc(0, 0, size/3, 0.2 * Math.PI, 1.8 * Math.PI);
        
        // Vẽ đầu mũi tên
        const arrowX = size/3 * Math.cos(0.2 * Math.PI);
        const arrowY = size/3 * Math.sin(0.2 * Math.PI);
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX + 4, arrowY - 1);
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX + 1, arrowY + 4);
        
        ctx.stroke();
        
        // Hiển thị thời gian phục hồi còn lại (phần trăm)
        if ((player.forcedStandTimer / DUCK_FORCED_STAND_DURATION) > 0.3) {
            const percent = Math.round((player.forcedStandTimer / DUCK_FORCED_STAND_DURATION) * 100);
            ctx.rotate(-rotationAngle); // Đặt lại góc xoay để văn bản dễ đọc
            ctx.font = '8px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(percent + '%', 0, 0);
        }
        
        ctx.restore();
    }
}

// Xử lý phím nhấn
function handleKeyDown(event) {
    if ((event.code === 'Space' || event.code === 'ArrowUp') && !gameOver) {
        if (!player.jumping) {
            jump();
        } else if (!player.doubleJumpPressed && player.jumpHeight > 50) {
            // Cho phép star jump bằng cách nhấn phím nhảy lần thứ 2 khi đang ở trên không
            player.doubleJumpPressed = true;
        }
    } else if (event.code === 'ArrowDown' && !gameOver) {
        // Chỉ cho phép ngồi khi không trong trạng thái bắt buộc đứng
        if (!player.forcedStand) {
            player.ducking = true;
            player.height = PLAYER_HEIGHT * 0.6;
            player.y = groundY - player.height;
            
            // Tắt đám mây đen cảnh báo nếu đang hiển thị
            if (weather.darkCloudWarning) {
                weather.darkCloudWarning = false;
                weather.darkCloudTimer = 0;
            }
        }
    } else if (event.code === 'Space' && gameOver) {
        resetGame();
    }
}

// Xử lý phím thả ra
function handleKeyUp(event) {
    if (event.code === 'ArrowDown' && !gameOver) {
        // Khi thả phím mũi tên xuống, trở lại trạng thái đứng bình thường
        if (player.ducking) {
            player.ducking = false;
            player.height = PLAYER_HEIGHT;
            player.y = groundY - player.height;
        }
    }
}

// Tạo hiệu ứng bụi khi hạ cánh
function createDustEffect(x, y) {
    ctx.save();
    ctx.fillStyle = 'rgba(180, 180, 180, 0.6)';
    
    // Tạo các hạt bụi
    for (let i = 0; i < 8; i++) {
        const size = Math.random() * 5 + 2;
        const xOffset = (Math.random() - 0.5) * 15;
        ctx.beginPath();
        ctx.arc(x + xOffset, y - size/2, size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.restore();
}

// Tạo hiệu ứng ngôi sao cho star jump
function createStarEffect(x, y) {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 100, 0.7)';
    
    // Tạo các tia sáng hình ngôi sao
    for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 / 8) * i;
        const length = 15 + Math.random() * 10;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(
            x + Math.cos(angle) * length,
            y + Math.sin(angle) * length
        );
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(255, 255, 0, 0.8)';
        ctx.stroke();
    }
    
    ctx.restore();
}