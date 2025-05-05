// Vẽ tất cả các thành phần của game
function draw() {
    // Áp dụng hiệu ứng rung khi có động đất
    applyEarthquakeEffect();
    
    // Xóa canvas với các phương pháp tối ưu
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    // Sử dụng biến môi trường chi tiết thấp (được điều chỉnh trong game.js) 
    // để giảm chi tiết khi FPS thấp
    const isLowDetail = window.lowDetailMode || false;
    
    // Bật tối ưu hiệu suất rendering theo mức chi tiết
    ctx.imageSmoothingEnabled = !isLowDetail;  // Tắt khi ở chế độ chi tiết thấp để tăng tốc
    ctx.imageSmoothingQuality = isLowDetail ? 'low' : 'high';
    
    // Vẽ nền (bầu trời)
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, GAME_WIDTH, GROUND_Y);
    
    // Hiệu ứng chớp
    if (weather.lightningFlash || weather.lightningStrike) {
        // Tạo hiệu ứng lóe sáng trên toàn màn hình
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }
    
    // Vẽ núi nền với sub-pixel rendering cho chuyển động mượt mà hơn
    for (const item of backgroundItems) {
        if (item.type === 'mountain') {
            // Áp dụng nội suy chuyển động cho núi
            const smoothX = Math.round(item.x * 10) / 10; // Làm tròn đến 1 chữ số thập phân để chuyển động mượt mà
            ctx.drawImage(mountainSprite, smoothX, item.y, item.width, item.height);
        }
    }
    
    // Vẽ mặt đất - đơn giản hóa khi ở chế độ chi tiết thấp
    ctx.save();

    // Điều chỉnh màu đất sang màu vàng nhạt giống cát sa mạc
    ctx.fillStyle = '#E6C88C'; // Màu vàng nhạt chính cho cát sa mạc
    ctx.fillRect(0, GROUND_Y, GAME_WIDTH, GROUND_HEIGHT);

    if (!isLowDetail) {
        // Thêm các chi tiết để tạo hiệu ứng cát sa mạc (giảm số lượng chi tiết để tăng hiệu suất)
        const tileSize = 80; // Tăng kích thước tile để giảm số chi tiết
        for (let x = 0; x < GAME_WIDTH; x += tileSize) {
            // Thêm các chi tiết sáng hơn (cát sáng) - giảm số lượng chi tiết
            ctx.fillStyle = '#F2DCB1'; // Màu cát sáng hơn
            for (let i = 0; i < 2; i++) { // Giảm từ 3 xuống 2
                const smallX = x + Math.random() * tileSize;
                const smallY = GROUND_Y + Math.random() * 5;
                const smallWidth = 1 + Math.random() * 2;
                const smallHeight = 1 + Math.random() * 2;
                ctx.fillRect(smallX, smallY, smallWidth, smallHeight);
            }
            
            // Thêm các chi tiết tối hơn ở phần dưới (bóng của cát) - giảm số lượng chi tiết
            ctx.fillStyle = '#C8AA74'; // Màu cát tối hơn
            for (let i = 0; i < 1; i++) { // Giảm từ 2 xuống 1
                const smallX = x + Math.random() * tileSize;
                const smallY = GROUND_Y + GROUND_HEIGHT - 5 + Math.random() * 3;
                const smallWidth = 2 + Math.random() * 3;
                const smallHeight = 1 + Math.random() * 3;
                ctx.fillRect(smallX, smallY, smallWidth, smallHeight);
            }
            
            // Thêm vài hạt đá nhỏ hoặc tinh thể muối trên sa mạc (chỉ 1% cơ hội xuất hiện)
            if (Math.random() > 0.99) {
                ctx.fillStyle = '#FFFFFF'; // Màu trắng nhạt cho tinh thể muối
                const smallX = x + Math.random() * tileSize;
                const smallY = GROUND_Y + 5 + Math.random() * 10;
                ctx.fillRect(smallX, smallY, 1, 1);
            }
        }
    }

    ctx.restore();
    
    // Vẽ đá nhỏ với nội suy chuyển động - bỏ qua khi ở chế độ chi tiết thấp
    if (!isLowDetail) {
        ctx.fillStyle = '#777';
        for (const item of backgroundItems) {
            if (item.type === 'stone') {
                const smoothX = Math.round(item.x * 10) / 10; // Làm tròn để chuyển động mượt mà
                ctx.fillRect(smoothX, item.y, item.width, item.height);
            }
        }
    }
    
    // Vẽ hiệu ứng thời tiết mưa - đơn giản hóa hiệu ứng trên chế độ chi tiết thấp
    if (weather.isRaining) {
        if (isLowDetail) {
            // Hiệu ứng mưa đơn giản hóa cho chế độ chi tiết thấp
            ctx.save();
            ctx.fillStyle = 'rgba(120, 150, 200, 0.2)';
            const rainLines = 20; // Giảm số đường mưa
            
            for (let i = 0; i < rainLines; i++) {
                const x = Math.random() * GAME_WIDTH;
                const y = Math.random() * GAME_HEIGHT;
                const length = 5 + Math.random() * 10;
                
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x - 1, y + length);
                ctx.stroke();
            }
            ctx.restore();
            
            // Làm tối bầu trời khi mưa
            ctx.fillStyle = 'rgba(50, 70, 100, 0.2)';
            ctx.fillRect(0, 0, GAME_WIDTH, GROUND_Y);
        } else {
            // Sử dụng pattern mưa
            const rainCtx = document.createElement('canvas').getContext('2d');
            rainCtx.canvas.width = 100;
            rainCtx.canvas.height = 100;
            
            // Tạo pattern từ hình ảnh rain_pattern
            const pattern = rainCtx.createPattern(rainPattern, 'repeat');
            ctx.save();
            
            // Di chuyển pattern để tạo hiệu ứng mưa rơi - sử dụng nội suy cho mượt mà hơn
            const rainOffset = frameCounter % 100;
            ctx.translate(-Math.floor(rainOffset), Math.floor(rainOffset));
            ctx.fillStyle = pattern;
            ctx.globalAlpha = 0.7;
            ctx.fillRect(-100, -100, GAME_WIDTH + 200, GAME_HEIGHT + 200);
            ctx.globalAlpha = 1.0;
            ctx.restore();
            
            // Làm tối bầu trời khi mưa
            ctx.fillStyle = 'rgba(50, 70, 100, 0.2)';
            ctx.fillRect(0, 0, GAME_WIDTH, GROUND_Y);
        }
    }
    
    // Vẽ đám mây đen cảnh báo sét đánh - đơn giản hóa khi ở chế độ chi tiết thấp
    if (weather.darkCloudWarning) {
        // Vẽ đám mây đen ở vị trí cao hơn trên bầu trời
        ctx.fillStyle = 'rgba(50, 50, 50, 0.8)';
        ctx.beginPath();
        
        // Đặt vị trí đám mây ngang với người chơi nhưng cao hơn
        const cloudX = Math.floor(player.x + player.width / 2 - 25);
        const cloudY = 50; // Đặt ở vị trí cao hơn
        
        if (isLowDetail) {
            // Vẽ đám mây đơn giản khi ở chế độ chi tiết thấp
            ctx.arc(cloudX, cloudY, 25, 0, Math.PI * 2);
            ctx.fill();
            
            // Thêm hiệu ứng ánh sáng nhấp nháy đơn giản
            if (Math.random() > 0.7) {
                ctx.fillStyle = 'rgba(255, 255, 150, 0.5)';
                ctx.beginPath();
                ctx.arc(cloudX, cloudY, 8, 0, Math.PI * 2);
                ctx.fill();
            }
        } else {
            // Vẽ đám mây chi tiết cao
            ctx.arc(cloudX, cloudY, 25, 0, Math.PI * 2); // Phần giữa
            ctx.arc(cloudX + 20, cloudY - 5, 20, 0, Math.PI * 2); // Phần phải
            ctx.arc(cloudX - 20, cloudY - 5, 20, 0, Math.PI * 2); // Phần trái
            ctx.arc(cloudX, cloudY - 15, 15, 0, Math.PI * 2); // Phần trên
            ctx.fill();
            
            // Thêm hiệu ứng ánh sáng nhấp nháy trong đám mây mạnh hơn
            if (Math.random() > 0.5) {
                ctx.fillStyle = 'rgba(255, 255, 150, 0.5)';
                ctx.beginPath();
                ctx.arc(cloudX + (Math.random() * 25 - 12), cloudY, 8, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Thêm hiệu ứng tia sét nhỏ từ đám mây xuống - chỉ hiển thị thỉnh thoảng
            if (Math.random() > 0.85) {
                ctx.strokeStyle = 'rgba(255, 255, 150, 0.7)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                
                const startX = cloudX + (Math.random() * 30 - 15);
                const startY = cloudY + 20;
                
                // Vẽ tia sét nhỏ dạng zigzag từ đám mây xuống một đoạn
                ctx.moveTo(startX, startY);
                ctx.lineTo(startX + (Math.random() * 10 - 5), startY + 15);
                ctx.lineTo(startX + (Math.random() * 15 - 7), startY + 30);
                ctx.stroke();
            }
        }
    }
    
    // Sử dụng object pooling để vẽ tia sét khi người chơi bị trúng sét
    if (weather.lightningStrike) {
        // Chọn frame hiệu ứng sét dựa trên lightningTimer
        const lightningFrame = Math.min(2, Math.floor(weather.lightningTimer / 10));
        ctx.drawImage(lightningSprites[lightningFrame], weather.lightningX, weather.lightningY, 80, 200);
        
        // Thêm hiệu ứng sáng xung quanh người chơi khi bị sét đánh, giảm chi tiết khi FPS thấp
        if (!isLowDetail) {
            ctx.fillStyle = 'rgba(255, 255, 150, 0.3)';
            ctx.beginPath();
            ctx.arc(player.x + player.width / 2, player.y + player.height / 2, 30, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Vẽ con chó (nếu đang hoạt động) - áp dụng nội suy chuyển động và tối ưu hiệu suất
    if (dog.active && dog.x >= 0) {
        // Vị trí nội suy cho chuyển động mượt mà
        const smoothX = Math.round(dog.x * 10) / 10;
        const smoothY = Math.round(dog.y * 10) / 10;
        
        // Vẽ hiệu ứng bụi khi chạy - chỉ hiển thị ở chế độ chi tiết cao và khi chạy nhanh
        if (!dog.jumping && dog.speed > DOG_BASE_SPEED && !isLowDetail) {
            ctx.fillStyle = 'rgba(200, 200, 200, 0.3)';
            for (let i = 0; i < 2; i++) { // Giảm số lượng hạt bụi từ 3 xuống 2
                const dustSize = Math.random() * 4 + 2;
                ctx.beginPath();
                // Chỉ vẽ bụi ở phía sau chó
                ctx.arc(smoothX - 20 - i * 5, smoothY + dog.height - 2, dustSize, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        if (dog.attacking) {
            // Vẽ chú chó tấn công - sử dụng sprite chạy thay vì sprite tấn công
            ctx.drawImage(dogRunningSprites[currentDogFrame], smoothX, smoothY, dog.width, dog.height);
            
            // Thêm hiệu ứng chân chạy khi đang tấn công - chỉ hiển thị ở chế độ chi tiết cao
            if (!dog.jumping && !isLowDetail) {
                // Vẽ bóng chân chạy với chuyển động rõ ràng
                const legPhase = currentDogFrame;
                
                // Màu bóng chân chạy
                ctx.fillStyle = 'rgba(90, 90, 90, 0.4)';
                
                // Vị trí chân
                const leftX = smoothX + dog.width * 0.3 + (legPhase === 0 ? -3 : legPhase === 1 ? 0: 3);
                const leftY = smoothY + dog.height - (legPhase === 1 ? 4 : 2);
                const rightX = smoothX + dog.width * 0.5 + (legPhase === 0 ? 3 : legPhase === 1 ? 0 : -3);
                const rightY = smoothY + dog.height - (legPhase === 2 ? 4 : 2);
                
                // Vẽ chân sau
                ctx.beginPath();
                ctx.ellipse(leftX, leftY, 4, 2, 0, 0, Math.PI * 2);
                ctx.fill();
                
                // Vẽ chân trước
                ctx.beginPath();
                ctx.ellipse(rightX, rightY, 4, 2, 0, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Vẽ hiệu ứng sủa/cắn - chỉ hiển thị ở chế độ chi tiết cao
            if (dog.biteTimer < 15 && !isLowDetail) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                ctx.beginPath();
                ctx.arc(smoothX + dog.width + 3, smoothY + dog.height/2, 4, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (dog.jumping) {
            // Vẽ chó đang nhảy
            ctx.drawImage(dogJumpSprite, smoothX, smoothY, dog.width, dog.height);
            
            // Vẽ hiệu ứng nhảy - chỉ hiển thị ở chế độ chi tiết cao
            if (dog.velocityY < 0 && !isLowDetail) {
                ctx.fillStyle = 'rgba(200, 200, 200, 0.2)';
                ctx.beginPath();
                ctx.moveTo(smoothX + 5, smoothY + dog.height);
                ctx.lineTo(smoothX + 10, smoothY + dog.height + 10);
                ctx.lineTo(smoothX, smoothY + dog.height + 10);
                ctx.fill();
            }
        } else {
            // Vẽ chó đang chạy với hoạt ảnh
            ctx.drawImage(dogRunningSprites[currentDogFrame], smoothX, smoothY, dog.width, dog.height);
        }
        
        // Bỏ qua vẽ hiệu ứng chân chó trong thời gian hồi chiêu khi ở chế độ chi tiết thấp
        if (dog.biteCooldown > 0 && !dog.attacking && !dog.jumping && !isLowDetail) {
            // Vẽ hiệu ứng chân chạy với dao động nhanh hơn 
            const cooldownLegPhase = Math.floor((dog.biteCooldown % 15) / 5);
            
            // Màu bóng chân
            ctx.fillStyle = 'rgba(90, 90, 90, 0.35)';
            
            // Vị trí chân
            const cLeftX = smoothX + dog.width * 0.25 + (cooldownLegPhase === 0 ? -2 : cooldownLegPhase === 1 ? 0 : 2);
            const cLeftY = smoothY + dog.height - (cooldownLegPhase === 1 ? 3 : 1);
            const cRightX = smoothX + dog.width * 0.45 + (cooldownLegPhase === 0 ? 2 : cooldownLegPhase === 1 ? 0 : -2);
            const cRightY = smoothY + dog.height - (cooldownLegPhase === 2 ? 3 : 1);
            
            // Vẽ chân sau
            ctx.beginPath();
            ctx.ellipse(cLeftX, cLeftY, 3, 2, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Vẽ chân trước
            ctx.beginPath();
            ctx.ellipse(cRightX, cRightY, 3, 2, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Vẽ người chơi với nội suy chuyển động
    const smoothPlayerX = Math.round(player.x * 10) / 10;
    const smoothPlayerY = Math.round(player.y * 10) / 10;
    
    if (weather.playerElectrocuted) {
        // Vẽ người chơi bị sét đánh nằm xuống
        ctx.save();
        
        // Xoay người chơi 90 độ để nằm xuống
        ctx.translate(smoothPlayerX + player.width / 2, smoothPlayerY + player.height / 2);
        ctx.rotate(Math.PI / 2); // Xoay 90 độ
        
        // Vẽ người chơi bị sét đánh (dùng sprite đang nhảy nhưng xoay ngang)
        ctx.drawImage(playerJumpingSprite, 
                     -player.width / 2, -player.height / 2, 
                     player.width, player.height);
        
        // Hiệu ứng khói từ cơ thể - chỉ ở chế độ chi tiết cao
        if (Math.random() > 0.3 && !isLowDetail) {
            ctx.fillStyle = 'rgba(100, 100, 100, 0.3)';
            ctx.beginPath();
            ctx.arc(0, -player.height / 3, Math.random() * 5 + 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    } else if (player.ducking) {
        // Người chơi đang cúi
        ctx.drawImage(playerDuckingSprite, smoothPlayerX, smoothPlayerY, player.width, player.height);
    } else if (player.jumping) {
        if (player.starJumping) {
            // Tư thế nhảy sao ở đỉnh của cú nhảy
            ctx.drawImage(playerStarJumpSprite, smoothPlayerX - 10, smoothPlayerY - 5, player.width, player.height + 10);
            
            // Hiệu ứng đặc biệt cho người chơi khi star jump - chỉ ở chế độ chi tiết cao
            if (Math.random() > 0.6 && !isLowDetail) {
                ctx.fillStyle = 'rgba(255, 255, 100, 0.3)';
                for (let i = 0; i < 2; i++) { // Giảm từ 3 xuống 2
                    const starX = smoothPlayerX + Math.random() * player.width;
                    const starY = smoothPlayerY + Math.random() * player.height;
                    const starSize = Math.random() * 3 + 1;
                    ctx.beginPath();
                    ctx.arc(starX, starY, starSize, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        } else {
            // Tư thế nhảy thông thường
            ctx.drawImage(playerJumpingSprite, smoothPlayerX, smoothPlayerY, player.width, player.height);
        }
    } else {
        // Người chơi đang chạy - sử dụng frame hiện tại từ hoạt ảnh chạy
        ctx.drawImage(playerRunningSprites[currentPlayerFrame], smoothPlayerX, smoothPlayerY, player.width, player.height);
    }
    
    // Vẽ chỉ báo mệt mỏi khi ngồi quá lâu
    drawFatigueIndicator();
    
    // Hiệu ứng đặc biệt khi powerup đang hoạt động
    if (player.invincible) {
        // Hiệu ứng khiên bảo vệ - vẽ một đường viền phát sáng xung quanh người chơi
        ctx.save();
        ctx.strokeStyle = 'rgba(100, 100, 255, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.rect(smoothPlayerX - 2, smoothPlayerY - 2, player.width + 4, player.height + 4);
        ctx.stroke();
        
        // Hiệu ứng phát sáng cho người chơi bất tử - chỉ ở chế độ chi tiết cao
        if (Math.random() > 0.7 && !isLowDetail) {
            ctx.fillStyle = 'rgba(150, 150, 255, 0.2)';
            ctx.beginPath();
            ctx.arc(
                smoothPlayerX + player.width/2 + (Math.random() * 20 - 10),
                smoothPlayerY + player.height/2 + (Math.random() * 20 - 10), 
                Math.random() * 5 + 2, 
                0, 
                Math.PI * 2
            );
            ctx.fill();
        }
        ctx.restore();
    }
    
    // Sử dụng hàm renderObstacles từ file obstacles.js để vẽ tất cả chướng ngại vật
    renderObstacles(ctx, isLowDetail);
    
    // Vẽ phi tiêu với nội suy chuyển động
    for (const spear of spears) {
        // Sao lưu vị trí gốc
        const originalX = spear.x;
        const originalY = spear.y;
        
        // Áp dụng nội suy chuyển động
        spear.x = Math.round(spear.x * 10) / 10;
        spear.y = Math.round(spear.y * 10) / 10;
        
        // Vẽ phi tiêu
        spear.render(ctx);
        
        // Khôi phục vị trí gốc
        spear.x = originalX;
        spear.y = originalY;
    }
    
    // Vẽ bumerang
    for (const boomerang of boomerangs) {
        // Sao lưu vị trí gốc
        const originalX = boomerang.x;
        const originalY = boomerang.y;
        
        // Áp dụng nội suy chuyển động
        boomerang.x = Math.round(boomerang.x * 10) / 10;
        boomerang.y = Math.round(boomerang.y * 10) / 10;
        
        // Vẽ bumerang
        boomerang.render(ctx);
        
        // Khôi phục vị trí gốc
        boomerang.x = originalX;
        boomerang.y = originalY;
    }
    
    // Vẽ FPS hiện tại ở góc màn hình (chỉ hiển thị khi mức chi tiết thấp)
    if (window.lowDetailMode && window.currentFps) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.font = '10px Arial';
        ctx.fillText(`FPS: ${window.currentFps}`, 10, 15);
        ctx.restore();
    }
}

// Hàm áp dụng hiệu ứng rung khi có động đất
function applyEarthquakeEffect() {
    if (earthquake.isEarthquake) {
        // Mức độ rung dựa trên cường độ động đất
        const shakeX = Math.random() * 2 * earthquake.earthquakeIntensity - earthquake.earthquakeIntensity;
        const shakeY = Math.random() * 2 * earthquake.earthquakeIntensity - earthquake.earthquakeIntensity;
        
        // Áp dụng rung cho canvas
        canvas.style.transform = `translate(${shakeX}px, ${shakeY}px)`;
    } else {
        // Đặt lại transform khi không có động đất
        canvas.style.transform = 'translate(0, 0)';
    }
}