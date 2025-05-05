// Khởi tạo chó
function initDog() {
    return {
        x: DOG_START_X,
        y: DOG_Y + 3,
        width: DOG_WIDTH,
        height: DOG_HEIGHT,
        speed: DOG_BASE_SPEED,
        attacking: false,
        active: false,
        barkTimer: 0,
        lastBarkTime: 0,
        jumping: false,
        velocityY: 0,
        jumpCooldown: 0,
        obstacleAwareness: 800,
        behaviorTimer: 0,
        behaviorState: 'steady',
        lastBehaviorChange: 0,
        prepareAttack: false,
        biteTimer: 0,
        biteCooldown: 0,
        jumpStrength: 1.0,
        nextObstacleType: null,
        pounceReady: false,
        specialAttack: false,
        // Thêm các thuộc tính mới cho AI
        learningEnabled: true,
        intelligence: 1.0,
        playerJumpPattern: [],
        lastPlayerJumpTime: 0,
        attackPatterns: ['standard', 'feint', 'ambush', 'combo'],
        currentAttackPattern: 'standard',
        adaptationRate: 0.05,
        playerBehaviorAnalysis: {
            jumpFrequency: 0,
            averageJumpDistance: 0,
            predictiveJumping: false,
            jumpCount: 0,
            totalAnalyzedTime: 0
        },
        tacticalDecision: {
            feintCount: 0,
            successfulAttacks: 0,
            failedAttacks: 0,
            optimalDistance: DOG_ATTACK_DISTANCE
        },
        // Thêm các thuộc tính mới để nâng cao trí thông minh
        memorySystem: {
            playerTendencies: {
                jumpFrequency: 0,
                jumpTimingPreference: 'early', // 'early', 'optimal', 'late'
                dodgeDirection: 'jump',        // 'jump', 'duck'
                reactionSpeed: 1.0,             // Tốc độ phản ứng của người chơi
                patternRecognized: false        // Có nhận ra mẫu lặp lại hay không
            },
            obstacleHistory: [],                // Lưu lịch sử các chướng ngại vật đã vượt qua
            successfulAttacks: []               // Lưu các cuộc tấn công thành công
        },
        emotionalState: {
            frustration: 0,                    // Tăng khi tấn công thất bại nhiều lần
            confidence: 0.5,                   // Tăng khi tấn công thành công
            aggression: 0.5                    // Ảnh hưởng đến tần suất tấn công
        },
        advancedTactics: {
            fakeRetreat: false,                // Giả vờ lui lại để đánh lừa người chơi
            rhythmDisruption: false,           // Phá vỡ nhịp điệu chạy để bất ngờ tấn công
            patternRecognition: {
                enabled: true,
                patternLength: 0,
                lastPatterns: []
            },
            territorialAwareness: {            // Nhận thức về môi trường xung quanh
                dangerZones: [],               // Khu vực nguy hiểm cần tránh
                safeZones: [],                 // Khu vực an toàn để di chuyển
                optimalAttackZones: []         // Khu vực tối ưu để tấn công
            }
        },
        skillLevels: {
            jumping: 1.0,                      // Kỹ năng nhảy
            attacking: 1.0,                    // Kỹ năng tấn công
            dodging: 1.0,                      // Kỹ năng né tránh
            prediction: 1.0,                   // Kỹ năng dự đoán
            learning: 1.0                      // Tốc độ học tập
        },
        adaptiveParameters: {                  // Tham số thích ứng theo thời gian
            optimalAttackDistance: DOG_ATTACK_DISTANCE,
            jumpTiming: 1.0,                   // Hệ số thời điểm nhảy (1.0 là tối ưu)
            attackFrequency: 1.0,              // Hệ số tần suất tấn công
            riskTolerance: 0.5                 // Mức độ chấp nhận rủi ro (0-1)
        }
    };
}

// Cập nhật trạng thái và vị trí của chó
function updateDog(playerNearObstacle) {
    if (!dog.active) return;
    
    // Thêm biến thể tốc độ chó để tạo chuyển động tự nhiên
    const currentTime = Date.now();
    const gameFrameTime = score;
    // Tăng biến thiên của dao động sin để tạo chuyển động tự nhiên hơn
    dogSpeedVariation = Math.sin(currentTime / 200) * 0.3;
    
    // Lấy điểm số hiện tại để kiểm tra mức độ cuồng nộ của chó
    const currentScore = Math.floor(score / 10);
    
    // Kiểm tra nếu điểm đã đạt đến mức kích hoạt trạng thái cuồng nộ
    // Sử dụng giá trị ngẫu nhiên currentDogRageStartScore thay vì DOG_RAGE_START_SCORE
    const dogRageLevel = Math.max(0, Math.floor((currentScore - currentDogRageStartScore) / 200));
    
    // Phân tích hành vi người chơi nếu chức năng học tập được bật
    if (dog.learningEnabled) {
        analyzePlayerBehavior();
    }
    
    // Cập nhật trạng thái cảm xúc của chó
    updateDogEmotionalState();
    
    // Cập nhật và phân tích môi trường
    updateEnvironmentMemory(obstacles, gameSpeed);
    
    // Cập nhật nhận thức mẫu
    enhancedPatternRecognition();
    
    // Cập nhật kỹ năng và tham số
    updateDogSkillsAndParameters();
    
    // Quản lý trạng thái hành vi của chú chó
    dog.behaviorTimer++;
    
    // Thay đổi hành vi chó theo thời gian để tạo cảm giác tự nhiên
    if (dog.behaviorTimer > DOG_BEHAVIOR_CHANGE_DELAY && 
        gameFrameTime - dog.lastBehaviorChange > DOG_BEHAVIOR_CHANGE_DELAY * 
        (currentScore > currentDogRageStartScore ? Math.max(0.5, 1 - dogRageLevel * DOG_RAGE_ATTACK_INTERVAL_REDUCTION) : 1)) {
        
        // Lưu thời gian thay đổi hành vi
        dog.lastBehaviorChange = gameFrameTime;
        dog.behaviorTimer = 0;
        
        // Xác định hành vi tiếp theo dựa trên xác suất và khoảng cách
        const distanceToPlayer = player.x - dog.x - dog.width;
        const random = Math.random();
        
        // Điều chỉnh khoảng cách tấn công dựa vào điểm số và phân tích hành vi
        let attackDistance = DOG_ATTACK_DISTANCE;
        
        // Điều chỉnh khoảng cách tấn công dựa trên dữ liệu học tập
        if (dog.tacticalDecision.successfulAttacks > 5) {
            // Sử dụng khoảng cách tối ưu đã học được
            attackDistance = dog.tacticalDecision.optimalDistance;
        }
        
        // Tăng khoảng cách tấn công khi điểm cao
        if (currentScore > currentDogRageStartScore) {
            attackDistance += dogRageLevel * 5;
        }
        
        // Tăng xác suất tấn công khi điểm cao
        let attackChance = 0.3;
        if (currentScore > currentDogRageStartScore) {
            attackChance += dogRageLevel * DOG_RAGE_ATTACK_CHANCE_INCREASE;
        }
        
        // Điều chỉnh xác suất tấn công dựa trên phân tích hành vi người chơi
        if (dog.playerBehaviorAnalysis.jumpCount > 10) {
            // Nếu người chơi nhảy dự đoán, tăng xác suất tấn công khi họ vừa nhảy
            if (dog.playerBehaviorAnalysis.predictiveJumping && player.jumping) {
                attackChance += 0.2;
            }
        }
        
        // Thêm biến đánh giá tâm trạng của chó để quyết định hành vi
        let dogAggression = Math.random() + (dogRageLevel * 0.2);
        
        // Tăng mức độ hung hăng dựa trên mức độ thông minh
        dogAggression *= dog.intelligence;
        
        // Thêm biến kiểm tra không gian xung quanh để quyết định hành vi thông minh hơn
        const playerIsJumping = player.jumping;
        const nearObstacle = playerNearObstacle;
        
        // Chó sẽ trở nên thông minh hơn khi điểm số cao
        if (currentScore > 500 || dog.intelligence > 1.5) {
            // Chọn phương thức tấn công thông minh
            selectAttackPatternByIntelligence(dogRageLevel);
            
            // Có nhiều khả năng tấn công khi người chơi không thể né tránh
            if (nearObstacle || playerIsJumping) {
                if (random < 0.4 + (dog.intelligence * 0.05) && distanceToPlayer < attackDistance * 1.5) {
                    dog.behaviorState = 'attack';
                } else if (random < 0.6) {
                    dog.behaviorState = 'closing';
                } else {
                    dog.behaviorState = 'steady';
                }
            } else {
                // Người chơi đang ở trạng thái có thể né tránh, quyết định thông minh hơn
                if (random < attackChance && distanceToPlayer < attackDistance * 1.2) {
                    dog.behaviorState = 'attack';
                } else if (random < 0.5) {
                    // Hành vi thông minh hơn - nếu người chơi thường nhảy, lùi lại để chuẩn bị cho đợt tấn công tiếp theo
                    dog.behaviorState = (dog.playerBehaviorAnalysis.jumpFrequency > 0.6) ? 'backing' : 'closing';
                } else {
                    dog.behaviorState = 'steady';
                }
            }
        } else {
            // Hành vi đơn giản hơn ở điểm thấp
            if (random < 0.2) {
                dog.behaviorState = 'backing';
            } else if (random < 0.5) {
                dog.behaviorState = 'closing';
            } else if (random < 0.7) {
                dog.behaviorState = 'steady';
            } else if (random < attackChance && distanceToPlayer < attackDistance) {
                dog.behaviorState = 'attack';
            } else {
                dog.behaviorState = 'steady';
            }
        }
    }
    
    // Cập nhật tốc độ dựa trên trạng thái hành vi
    let speedMultiplier = 1.0;
    
    // Tăng tốc độ tổng thể của chó khi điểm cao
    if (currentScore > currentDogRageStartScore) {
        // Tăng tốc độ theo cấp độ cuồng nộ, nhưng làm mịn mà hơn
        const rageSpeedBonus = 1.0 + (dogRageLevel * DOG_RAGE_SPEED_FACTOR * 0.8);
        speedMultiplier *= rageSpeedBonus;
    }
    
    // Điều chỉnh tốc độ dựa trên hành vi
    if (dog.behaviorState === 'closing') {
        // Tốc độ khi đuổi theo, tăng dần khi càng xa
        const distanceFactor = Math.min(1.5, 1.0 + ((player.x - dog.x) / GAME_WIDTH) * 0.5);
        speedMultiplier *= 1.3 * distanceFactor;
    } else if (dog.behaviorState === 'backing') {
        // Giảm tốc độ khi lùi lại
        speedMultiplier *= 0.7;
    } else if (dog.behaviorState === 'attack') {
        // Tăng tốc độ khi tấn công
        speedMultiplier *= 1.8;
    } else {
        // Tốc độ bình thường
        speedMultiplier *= 1.0;
    }
    
    // Điều chỉnh thêm tốc độ dựa trên chướng ngại vật phía trước
    // Chó sẽ giảm tốc độ khi thấy chướng ngại vật phía trước
    let obstacleAhead = false;
    let obstacleDistance = Infinity;
    
    for (const obstacle of obstacles) {
        // Kiểm tra chướng ngại vật ở phía trước chó
        if (obstacle.x > dog.x + dog.width) {
            const distance = obstacle.x - (dog.x + dog.width);
            if (distance < dog.obstacleAwareness && distance < obstacleDistance) {
                obstacleAhead = true;
                obstacleDistance = distance;
                dog.nextObstacleType = obstacle.type;
            }
        }
    }
    
    // Nếu có chướng ngại vật phía trước và đủ gần, điều chỉnh tốc độ
    if (obstacleAhead && obstacleDistance < 100 && !dog.jumping) {
        // Giảm tốc độ khi gần chướng ngại vật để chuẩn bị nhảy hoặc né tránh
        const slowdownFactor = Math.max(0.7, obstacleDistance / 100);
        speedMultiplier *= slowdownFactor;
    }
    
    // Dog enters the screen and maintains a chase distance
    if (dog.x < 0) {
        dog.x += dog.speed * 1.5; // Di chuyển nhanh hơn để vào màn hình
    } else {
        // Chuyển động dựa trên trạng thái hành vi
        dog.x += ((dog.speed + dogSpeedVariation) * speedMultiplier) - gameSpeed;
        
        // Đảm bảo chó không di chuyển quá xa so với người chơi
        const distanceToPlayer = player.x - dog.x - dog.width;
        if (distanceToPlayer > DOG_CHASE_DISTANCE * 2) {
            dog.x += dog.speed * 0.5;
        } else if (distanceToPlayer < DOG_MIN_CHASE_DISTANCE * 0.5) {
            dog.x -= dog.speed * 0.3;
        }
        
        // Đảm bảo chó không vượt qua vị trí của người chơi trong mọi trường hợp
        if (dog.x + dog.width > player.x) {
            dog.x = player.x - dog.width;
        }
        
        // Tăng tốc độ chó theo thời gian, nhanh hơn khi điểm cao
        if (score > 1000) {
            // Tăng tốc độ theo thời gian với mức tăng thấp hơn
            const catchupRateMultiplier = currentScore > currentDogRageStartScore ? 1 + (dogRageLevel * 0.5) : 1;
            // Giảm tốc độ tăng một chút để không trở nên quá khó
            dog.speed += (dogCatchupRate * 0.8) * gameSpeed * catchupRateMultiplier;
            
            // Giới hạn tốc độ tối đa của chó để không trở nên quá khó
            const maxDogSpeed = gameSpeed * 1.1;
            if (dog.speed > maxDogSpeed) {
                dog.speed = maxDogSpeed;
            }
        }
    }
    
    // Xử lý há miệng cắn người chơi
    if (dog.prepareAttack) {
        dog.biteTimer--;
        
        // Chó há miệng cắn
        if (dog.biteTimer > 0) {
            dog.attacking = true;
            
            // Thêm hiệu ứng lao về phía trước khi cắn
            if (dog.biteTimer < 10 && !dog.jumping && dog.pounceReady) {
                dog.jumping = true;
                dog.velocityY = DOG_POUNCE_FORCE * 0.8; // Lực nhảy khi tấn công nhẹ hơn
                dog.pounceReady = false;
            }
        } else {
            dog.prepareAttack = false;
            dog.attacking = false;
            // Giảm thời gian hồi chiêu cắn khi điểm cao để tấn công thường xuyên hơn
            const cooldownReduction = currentScore > currentDogRageStartScore ? Math.max(0.5, 1 - (dogRageLevel * 0.1)) : 1;
            dog.biteCooldown = Math.floor(50 * cooldownReduction);
        }
    } else if (dog.biteCooldown > 0) {
        dog.biteCooldown--;
        
        // Ngắt thời gian hồi chiêu khi điểm cao và chó ở trạng thái cuồng nộ (xác suất nhỏ)
        if (currentScore > currentDogRageStartScore && Math.random() < 0.01 * dogRageLevel) {
            dog.biteCooldown = 0;
        }
    }
    
    // Make sure dog doesn't go beyond left edge
    if (dog.x < 0) {
        dog.x = 0;
    }
    
    // Check if dog is getting close to player (attack mode)
    const distanceToPlayer = player.x - dog.x - dog.width;
    
    // Tính khoảng cách tấn công dựa trên điểm số
    const effectiveAttackDistance = DOG_ATTACK_DISTANCE + 
                                    (currentScore > currentDogRageStartScore ? dogRageLevel * 5 : 0);
                                    
    if (distanceToPlayer < effectiveAttackDistance && !playerNearObstacle) {
        // Khoảng cách rất gần và người chơi không ở gần vật cản - chuẩn bị tấn công
        if (!dog.prepareAttack && dog.biteCooldown <= 0 && !dog.jumping) {
            dog.prepareAttack = true;
            dog.biteTimer = 30;
            dog.pounceReady = true;            
            
            // Hiệu ứng cuồng nộ cho chó khi điểm cao
            if (currentScore > currentDogRageStartScore && Math.random() < 0.3) {
                dog.biteTimer = 20; // Tấn công nhanh hơn khi cuồng nộ
            }
        }
    }
    
    // Triển khai các chiến thuật nâng cao
    implementAdvancedTactics(distanceToPlayer, playerNearObstacle);
    
    // Dự đoán hành vi người chơi
    predictPlayerBehavior();
    
    // Cập nhật hành vi nhảy của chó
    updateDogJumping();
}

// Cập nhật hành vi nhảy của chó
function updateDogJumping() {
    // Xử lý nhảy của chú chó
    if (dog.jumping) {
        dog.velocityY += GRAVITY;
        dog.y += dog.velocityY;

        // Kiểm tra chú chó đã hạ cánh chưa
        if (dog.y >= DOG_Y) {
            dog.y = DOG_Y;
            dog.jumping = false;
            dog.velocityY = 0;
            
            // Tăng trí thông minh khi chó nhảy qua vật cản thành công
            increaseDogIntelligence(0.01);
        }
    } else if (dog.jumpCooldown > 0) {
        // Giảm thời gian hồi chiêu nhảy
        dog.jumpCooldown--;

        // Đảm bảo chú chó luôn ở trên mặt đất khi không nhảy
        if (!dog.jumping) {
            dog.y = DOG_Y;
        }
    } else {
        // Đảm bảo chú chó luôn ở trên mặt đất khi không nhảy
        dog.y = DOG_Y;

        // Phân tích các chướng ngại vật phía trước để quyết định nhảy
        let needToJump = false;
        let obstacleToJump = null;
        let minDistance = DOG_JUMP_DETECT_DISTANCE;
        
        // Tăng phạm vi phát hiện khi trí thông minh cao
        const detectionRange = DOG_JUMP_DETECT_DISTANCE * (1 + (dog.intelligence - 1) * 0.5);

        // Tìm chướng ngại vật gần nhất phía trước
        for (const obstacle of obstacles) {
            // Tính khoảng cách từ chó đến chướng ngại vật
            const distanceToObstacle = obstacle.x - (dog.x + dog.width);

            // Chỉ xem xét các chướng ngại vật phía trước trong phạm vi phát hiện
            if (distanceToObstacle > 0 && distanceToObstacle < detectionRange) {
                // Xác định xem có cần nhảy qua chướng ngại vật này không
                let shouldJumpThisObstacle = false;

                if (obstacle.type === 'cactus' || obstacle.type === 'groundspike') {
                    // Luôn nhảy qua xương rồng và gai nhọn tam giác
                    shouldJumpThisObstacle = true;
                } else if (obstacle.type === 'spikepit') {
                    // Luôn nhảy qua hố gai
                    shouldJumpThisObstacle = true;
                } else if (obstacle.type === 'mine' && dog.intelligence > 1.2) {
                    // Chó thông minh hơn có thể nhảy qua mìn
                    shouldJumpThisObstacle = true;
                }

                // Nếu cần nhảy và chướng ngại vật này gần hơn
                if (shouldJumpThisObstacle && distanceToObstacle < minDistance) {
                    minDistance = distanceToObstacle;
                    needToJump = true;
                    obstacleToJump = obstacle;
                }
            }
        }

        // Quyết định nhảy dựa trên loại chướng ngại vật và độ thông minh
        if (needToJump && obstacleToJump) {
            // Điều chỉnh lực nhảy dựa trên loại chướng ngại vật và trí thông minh
            let jumpMultiplier = 1.0 * dog.jumpStrength;
            
            // Chó thông minh hơn có thể nhảy tối ưu hơn
            if (dog.intelligence > 1.3) {
                jumpMultiplier *= 1.1;
            }

            // Thêm phân tích cao cấp về loại chướng ngại vật và hoàn cảnh
            const gameplayContext = {
                gameSpeed: gameSpeed,
                playerDistance: player.x - dog.x,
                obstacleSequence: false,
                nextObstacleClose: false,
                playerJumpedRecently: (Date.now() - dog.lastPlayerJumpTime < 1000),
                playerIsJumping: player.jumping
            };

            // Phân tích chuỗi chướng ngại vật phía trước chi tiết hơn
            const nextObstacles = analyzeObstacleSequence(obstacles, obstacleToJump);
            
            if (nextObstacles.hasSequence) {
                gameplayContext.obstacleSequence = true;
                gameplayContext.nextObstacleClose = nextObstacles.isClose;
                
                // Chó thông minh có thể nhảy vượt qua nhiều chướng ngại liên tiếp
                if (dog.intelligence > 1.5 && nextObstacles.isClose) {
                    jumpMultiplier += 0.2;
                }
            }

            // Phân tích chi tiết hơn về loại chướng ngại vật
            if (obstacleToJump.type === 'spikepit') {
                // Nhảy mạnh hơn cho hố gai rộng
                jumpMultiplier = 1.2;
                if (obstacleToJump.width > 70) {
                    jumpMultiplier = 1.3;
                }
                
                // Nếu tốc độ game cao, tăng thêm lực nhảy
                if (gameSpeed > 10) {
                    jumpMultiplier += 0.1;
                }
                
                // Nếu có chuỗi chướng ngại vật, tăng lực nhảy để vượt qua cả hai
                if (gameplayContext.obstacleSequence && gameplayContext.nextObstacleClose) {
                    jumpMultiplier += 0.2;
                }
            } else if (obstacleToJump.type === 'cactus') {
                // Nhảy với lực cơ bản cho xương rồng
                jumpMultiplier = 1.0;
                
                // Nhảy mạnh hơn nếu là xương rồng cao
                if (obstacleToJump.height > 50) {
                    jumpMultiplier = 1.1;
                }
            } else if (obstacleToJump.type === 'mine' && dog.intelligence > 1.2) {
                // Nhảy với lực đặc biệt cho mìn (chó thông minh)
                jumpMultiplier = 1.15;
            } else {
                // Lực nhảy mặc định cho các chướng ngại vật khác
                jumpMultiplier = 1.0;
            }
            
            // Điều chỉnh hợp lý theo điểm số và trí thông minh
            const intelligenceBonus = Math.min(0.2, (dog.intelligence - 1) * 0.1);
            jumpMultiplier *= (1 + intelligenceBonus);

            // Tính thời điểm nhảy tối ưu - bây giờ thông minh hơn
            let distanceToJump = minDistance;
            
            // Tính khoảng cách nhảy tối ưu dựa trên nhiều yếu tố và trí thông minh
            let optimalJumpDistance = obstacleToJump.width + DOG_OBSTACLE_MARGIN;
            
            // Chó thông minh hơn có thể tính toán khoảng cách nhảy chính xác hơn
            if (dog.intelligence > 1.2) {
                optimalJumpDistance = calculateOptimalJumpDistance(obstacleToJump, gameplayContext);
            } else {
                // Điều chỉnh khoảng cách nhảy dựa trên tốc độ
                if (gameSpeed > 8) {
                    optimalJumpDistance -= (gameSpeed - 8) * 2;
                }
                
                // Nếu có chuỗi chướng ngại vật, điều chỉnh khoảng cách nhảy tối ưu
                if (gameplayContext.obstacleSequence) {
                    optimalJumpDistance += 10;
                }
            }

            // Nhảy khi đến khoảng cách phù hợp
            if (distanceToJump <= optimalJumpDistance && distanceToJump > 0) {
                dog.jumping = true;
                dog.velocityY = DOG_JUMP_FORCE * jumpMultiplier;
                
                // Đặt thời gian hồi chiêu nhảy - thông minh hơn dựa trên khoảng cách và tốc độ
                const baseCooldown = 10;
                dog.jumpCooldown = baseCooldown + Math.floor(obstacleToJump.width / 10);
                
                // Chó thông minh hơn có thể giảm thời gian hồi chiêu
                const intelligenceCooldownReduction = Math.min(5, Math.floor(dog.intelligence * 3));
                
                // Giảm thời gian hồi chiêu nếu tốc độ game cao để không bị rơi vào vị trí nguy hiểm
                if (gameSpeed > 10 || dog.intelligence > 1.3) {
                    dog.jumpCooldown = Math.max(3, dog.jumpCooldown - intelligenceCooldownReduction);
                }
            }
        }
    }
}

// Hàm phân tích chuỗi chướng ngại vật phía trước
function analyzeObstacleSequence(obstacles, currentObstacle) {
    const result = {
        hasSequence: false,
        isClose: false,
        nextObstacle: null,
        gapDistance: 0
    };
    
    // Tìm vị trí của chướng ngại vật hiện tại trong mảng
    let currentIndex = -1;
    for (let i = 0; i < obstacles.length; i++) {
        if (obstacles[i] === currentObstacle) {
            currentIndex = i;
            break;
        }
    }
    
    // Nếu tìm thấy và còn chướng ngại vật tiếp theo
    if (currentIndex >= 0 && currentIndex < obstacles.length - 1) {
        const nextObstacle = obstacles[currentIndex + 1];
        const distanceBetween = nextObstacle.x - (currentObstacle.x + currentObstacle.width);
        
        result.nextObstacle = nextObstacle;
        result.gapDistance = distanceBetween;
        
        // Xác định nếu đây là một chuỗi chướng ngại vật gần nhau
        if (distanceBetween < 200) {
            result.hasSequence = true;
            // Chuỗi rất gần nhau, khó để vượt qua
            if (distanceBetween < 80) {
                result.isClose = true;
            }
        }
    }
    
    return result;
}

// Tính toán khoảng cách nhảy tối ưu dựa trên nhiều yếu tố
function calculateOptimalJumpDistance(obstacle, context) {
    // Khoảng cách cơ bản dựa trên chiều rộng chướng ngại vật
    let optimalDistance = obstacle.width + DOG_OBSTACLE_MARGIN;
    
    // Điều chỉnh dựa trên tốc độ game
    if (context.gameSpeed > 8) {
        optimalDistance -= (context.gameSpeed - 8) * 1.5;
    }
    
    // Điều chỉnh dựa trên loại chướng ngại vật
    if (obstacle.type === 'spikepit') {
        // Cần nhảy sớm hơn cho hố gai
        optimalDistance += 10;
        
        // Nếu hố gai rất rộng, cần nhảy sớm hơn nữa
        if (obstacle.width > 80) {
            optimalDistance += 5;
        }
    } else if (obstacle.type === 'cactus') {
        // Điều chỉnh dựa trên chiều cao xương rồng
        if (obstacle.height > 50) {
            optimalDistance += 5;
        }
    } else if (obstacle.type === 'mine') {
        // Mìn có thể nổ, nên cần nhảy ở khoảng cách an toàn hơn
        optimalDistance += 8;
    }
    
    // Điều chỉnh dựa trên chuỗi chướng ngại vật
    if (context.obstacleSequence) {
        // Cần nhảy sớm hơn để có thể vượt qua cả hai
        optimalDistance += context.nextObstacleClose ? 15 : 8;
    }
    
    // Điều chỉnh dựa trên người chơi
    if (context.playerJumpedRecently) {
        // Học hỏi từ người chơi về thời điểm nhảy
        optimalDistance -= 5;
    }
    
    return Math.max(10, optimalDistance);
}

// Phân tích hành vi của người chơi
function analyzePlayerBehavior() {
    // Phân tích mẫu nhảy của người chơi
    if (player.jumping && !player.wasJumping) {
        // Người chơi vừa bắt đầu nhảy
        const currentTime = Date.now();
        
        // Lưu thời gian nhảy của người chơi
        dog.lastPlayerJumpTime = currentTime;
        
        // Thêm vào mẫu nhảy (giữ tối đa 10 lần nhảy gần nhất)
        const jumpData = {
            time: currentTime,
            position: player.x,
            nearestObstacleDistance: getDistanceToNearestObstacle(player)
        };
        
        dog.playerJumpPattern.push(jumpData);
        if (dog.playerJumpPattern.length > 10) {
            dog.playerJumpPattern.shift();
        }
        
        // Phân tích mẫu nhảy để tìm xu hướng
        if (dog.playerJumpPattern.length >= 3) {
            analyzeJumpPattern();
        }
        
        // Tăng số lần nhảy được phân tích
        dog.playerBehaviorAnalysis.jumpCount++;
    }
    
    // Cập nhật biến theo dõi trạng thái nhảy trước đó
    player.wasJumping = player.jumping;
}

// Phân tích mẫu nhảy để tìm xu hướng
function analyzeJumpPattern() {
    let predictiveJumpCount = 0;
    let totalJumpDistance = 0;
    
    // Phân tích từng lần nhảy để xác định nếu người chơi nhảy dự đoán
    for (let i = 0; i < dog.playerJumpPattern.length; i++) {
        const jump = dog.playerJumpPattern[i];
        
        // Nhảy được coi là dự đoán nếu không có chướng ngại vật gần
        if (jump.nearestObstacleDistance > 100) {
            predictiveJumpCount++;
        }
        
        // Tính tổng khoảng cách nhảy
        if (i > 0) {
            const prevJump = dog.playerJumpPattern[i-1];
            totalJumpDistance += (jump.position - prevJump.position);
        }
    }
    
    // Tính tần suất nhảy dự đoán
    const predictiveJumpFrequency = predictiveJumpCount / dog.playerJumpPattern.length;
    
    // Cập nhật phân tích hành vi
    dog.playerBehaviorAnalysis.predictiveJumping = predictiveJumpFrequency > 0.5;
    dog.playerBehaviorAnalysis.jumpFrequency = Math.min(1.0, dog.playerJumpPattern.length / 10);
    
    // Tính khoảng cách nhảy trung bình (nếu có đủ dữ liệu)
    if (dog.playerJumpPattern.length > 1) {
        dog.playerBehaviorAnalysis.averageJumpDistance = totalJumpDistance / (dog.playerJumpPattern.length - 1);
    }
}

// Lấy khoảng cách từ người chơi đến chướng ngại vật gần nhất
function getDistanceToNearestObstacle(entity) {
    let minDistance = Infinity;
    
    for (const obstacle of obstacles) {
        // Tính khoảng cách từ thực thể đến chướng ngại vật
        const distance = obstacle.x - (entity.x + entity.width);
        
        // Chỉ xem xét chướng ngại vật phía trước
        if (distance > 0 && distance < minDistance) {
            minDistance = distance;
        }
    }
    
    return minDistance;
}

// Tăng độ thông minh của chó khi học từ trải nghiệm
function increaseDogIntelligence(amount) {
    if (dog.learningEnabled) {
        // Tăng thông minh theo thời gian nhưng có giới hạn tối đa
        dog.intelligence = Math.min(2.0, dog.intelligence + amount);
        
        // Cập nhật lực nhảy dựa trên độ thông minh
        dog.jumpStrength = 1.0 + (dog.intelligence - 1.0) * 0.2;
    }
}

// Chọn kiểu tấn công dựa trên độ thông minh và hoàn cảnh
function selectAttackPatternByIntelligence(rageLevel) {
    // Chó chưa đủ thông minh sẽ sử dụng kiểu tấn công cơ bản
    if (dog.intelligence < 1.2) {
        dog.currentAttackPattern = 'standard';
        return;
    }
    
    // Phân tích tình huống để chọn kiểu tấn công phù hợp
    const random = Math.random();
    
    // Tính xác suất tấn công phức tạp dựa trên độ thông minh và cấp độ cuồng nộ
    const advancedAttackChance = 0.2 + ((dog.intelligence - 1.0) * 0.3) + (rageLevel * 0.05);
    
    // Tăng tính đa dạng trong hành vi tấn công khi thông minh cao
    if (random < advancedAttackChance) {
        // Chọn ngẫu nhiên một kiểu tấn công nâng cao
        const selectedPattern = Math.floor(Math.random() * 3);
        
        if (selectedPattern === 0) {
            dog.currentAttackPattern = 'feint';  // Giả vờ tấn công rồi rút lui
        } else if (selectedPattern === 1) {
            dog.currentAttackPattern = 'ambush'; // Tấn công bất ngờ sau khi đợi thời cơ
        } else {
            dog.currentAttackPattern = 'combo';  // Tấn công liên tiếp
        }
        
        // Tăng số lần sử dụng tấn công giả (học hỏi từ kinh nghiệm)
        if (dog.currentAttackPattern === 'feint') {
            dog.tacticalDecision.feintCount++;
        }
    } else {
        // Sử dụng tấn công tiêu chuẩn
        dog.currentAttackPattern = 'standard';
    }
    
    // Cập nhật khoảng cách tấn công tối ưu dựa trên kinh nghiệm
    if (dog.tacticalDecision.successfulAttacks > dog.tacticalDecision.failedAttacks) {
        dog.tacticalDecision.optimalDistance = DOG_ATTACK_DISTANCE + (dog.tacticalDecision.successfulAttacks * 0.5);
    } else {
        dog.tacticalDecision.optimalDistance = DOG_ATTACK_DISTANCE;
    }
}

// Triển khai tấn công theo kiểu tấn công đã chọn
function executeAttackPattern(distanceToPlayer) {
    // Nếu không phải tấn công hoặc đang nhảy, không thực hiện
    if (!dog.prepareAttack || dog.jumping) {
        return;
    }
    
    // Lấy kiểu tấn công hiện tại
    const attackType = dog.currentAttackPattern;
    
    // Triển khai các kiểu tấn công khác nhau
    switch (attackType) {
        case 'feint':
            // Tấn công giả - giả vờ tấn công rồi rút lui
            if (dog.biteTimer === 15) {
                // Đột ngột đổi hướng và lùi lại
                dog.prepareAttack = false;
                dog.attacking = false;
                dog.behaviorState = 'backing';
                dog.biteCooldown = 10; // Hồi chiêu ngắn hơn để có thể tấn công lại
                
                // Tăng trí thông minh khi thực hiện tấn công nâng cao
                increaseDogIntelligence(0.02);
            }
            break;
            
        case 'ambush':
            // Tấn công phục kích - chờ đợi thời cơ và tấn công bất ngờ
            if (dog.biteTimer > 20) {
                // Giảm tốc độ, làm như đang lùi lại
                dog.x -= 1;
            } else if (dog.biteTimer <= 20 && dog.biteTimer > 5) {
                // Sau đó đột ngột tăng tốc để tấn công bất ngờ
                dog.x += 3;
            }
            break;
            
        case 'combo':
            // Tấn công liên hoàn - nhiều cú tấn công nhanh liên tiếp
            if (dog.biteTimer === 15) {
                // Thực hiện cú tấn công đầu tiên
                dog.pounceReady = true;
            } else if (dog.biteTimer === 5) {
                // Thực hiện cú tấn công thứ hai ngay lập tức
                dog.pounceReady = true;
                dog.velocityY = DOG_POUNCE_FORCE * 0.6;
                dog.jumping = true;
            }
            
            // Tăng trí thông minh khi thực hiện tấn công phức tạp
            if (dog.biteTimer === 5) {
                increaseDogIntelligence(0.03);
            }
            break;
            
        case 'standard':
        default:
            // Tấn công tiêu chuẩn - được xử lý bởi mã hiện có
            break;
    }
}

// Ghi nhận kết quả tấn công để học hỏi
function recordAttackResult(wasSuccessful) {
    if (wasSuccessful) {
        dog.tacticalDecision.successfulAttacks++;
        
        // Tăng trí thông minh khi tấn công thành công
        increaseDogIntelligence(0.02);
    } else {
        dog.tacticalDecision.failedAttacks++;
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

// Thêm hàm mới để cập nhật hệ thống cảm xúc của chó
function updateDogEmotionalState() {
    // Cập nhật trạng thái cảm xúc của chó dựa trên các sự kiện trong game
    
    // Giảm dần mức độ cảm xúc theo thời gian để quay về trạng thái bình thường
    dog.emotionalState.frustration *= 0.995;
    dog.emotionalState.confidence *= 0.998;
    
    // Cập nhật mức độ hung hăng dựa trên sự kết hợp của nhiều yếu tố
    dog.emotionalState.aggression = 0.5 + 
                                   (dog.emotionalState.confidence * 0.2) - 
                                   (dog.emotionalState.frustration * 0.1) +
                                   (dog.intelligence * 0.1);
    
    // Giới hạn mức độ cảm xúc
    dog.emotionalState.frustration = Math.max(0, Math.min(1, dog.emotionalState.frustration));
    dog.emotionalState.confidence = Math.max(0, Math.min(1, dog.emotionalState.confidence));
    dog.emotionalState.aggression = Math.max(0.1, Math.min(1, dog.emotionalState.aggression));
    
    // Ảnh hưởng của trạng thái cảm xúc đến chỉ số thích ứng
    if (dog.emotionalState.confidence > 0.7) {
        // Chó tự tin sẽ tấn công thường xuyên hơn và mạo hiểm hơn
        dog.adaptiveParameters.attackFrequency = 1.2;
        dog.adaptiveParameters.riskTolerance = 0.7;
    } else if (dog.emotionalState.frustration > 0.7) {
        // Chó thất vọng sẽ tấn công liều lĩnh hơn
        dog.adaptiveParameters.attackFrequency = 1.5;
        dog.adaptiveParameters.riskTolerance = 0.8;
    } else {
        // Trạng thái bình thường
        dog.adaptiveParameters.attackFrequency = 1.0;
        dog.adaptiveParameters.riskTolerance = 0.5;
    }
}

// Hàm lưu trữ và phân tích dữ liệu từ môi trường
function updateEnvironmentMemory(obstacles, gameSpeed) {
    // Tính mật độ chướng ngại vật và mô hình xuất hiện
    let obstacleDensity = obstacles.length / (GAME_WIDTH / 100);
    
    // Lưu lại chướng ngại vật đã vượt qua thành công
    for (const obstacle of obstacles) {
        // Nếu chướng ngại vật đã đi qua chó
        if (obstacle.x + obstacle.width < dog.x) {
            // Kiểm tra xem chướng ngại vật này đã được ghi nhận chưa
            const alreadyRecorded = dog.memorySystem.obstacleHistory.some(
                historyItem => historyItem.id === obstacle.id
            );
            
            if (!alreadyRecorded && obstacle.id) {
                // Thêm vào lịch sử
                dog.memorySystem.obstacleHistory.push({
                    id: obstacle.id,
                    type: obstacle.type,
                    width: obstacle.width,
                    height: obstacle.height,
                    gameSpeed: gameSpeed
                });
                
                // Giới hạn kích thước lịch sử
                if (dog.memorySystem.obstacleHistory.length > 20) {
                    dog.memorySystem.obstacleHistory.shift();
                }
                
                // Tăng kỹ năng dự đoán khi vượt qua nhiều chướng ngại vật
                dog.skillLevels.prediction = Math.min(2.0, dog.skillLevels.prediction + 0.01);
            }
        }
    }
    
    // Xác định các khu vực nguy hiểm và an toàn dựa trên chướng ngại vật
    dog.advancedTactics.territorialAwareness.dangerZones = [];
    dog.advancedTactics.territorialAwareness.safeZones = [];
    dog.advancedTactics.territorialAwareness.optimalAttackZones = [];
    
    let lastObstacleEnd = 0;
    
    // Phân tích toàn bộ không gian trò chơi để xác định các vùng
    for (const obstacle of obstacles) {
        if (obstacle.x > dog.x) { // Chỉ quan tâm đến chướng ngại vật phía trước
            // Vùng nguy hiểm là khu vực của chướng ngại vật và khoảng bảo vệ xung quanh
            const dangerZone = {
                start: obstacle.x - 20,
                end: obstacle.x + obstacle.width + 20,
                type: obstacle.type
            };
            dog.advancedTactics.territorialAwareness.dangerZones.push(dangerZone);
            
            // Vùng an toàn là khoảng giữa các chướng ngại vật
            if (lastObstacleEnd > 0 && obstacle.x - lastObstacleEnd > 100) {
                const safeZone = {
                    start: lastObstacleEnd + 20,
                    end: obstacle.x - 20
                };
                dog.advancedTactics.territorialAwareness.safeZones.push(safeZone);
                
                // Vùng tấn công tối ưu là ngay trước chướng ngại vật
                // (để người chơi khó tránh né)
                const optimalAttackZone = {
                    start: obstacle.x - 80,
                    end: obstacle.x - 30
                };
                dog.advancedTactics.territorialAwareness.optimalAttackZones.push(optimalAttackZone);
            }
            
            lastObstacleEnd = obstacle.x + obstacle.width;
        }
    }
}

// Hàm nâng cao nhận biết mẫu và học hỏi từ người chơi
function enhancedPatternRecognition() {
    // Chỉ kích hoạt khi chó đủ thông minh
    if (dog.intelligence < 1.3 || !dog.advancedTactics.patternRecognition.enabled) {
        return;
    }
    
    // Phân tích mẫu nhảy của người chơi để tìm kiếm pranh vi lặp lại
    if (dog.playerJumpPattern.length >= 5) {
        // Tìm kiếm các mẫu trong 5 lần nhảy gần nhất
        const recentJumps = dog.playerJumpPattern.slice(-5);
        
        // Tính khoảng thời gian giữa các lần nhảy
        const jumpIntervals = [];
        for (let i = 1; i < recentJumps.length; i++) {
            jumpIntervals.push(recentJumps[i].time - recentJumps[i-1].time);
        }
        
        // Kiểm tra xem các khoảng thời gian có nhất quán không
        const avgInterval = jumpIntervals.reduce((a, b) => a + b, 0) / jumpIntervals.length;
        const intervalVariance = jumpIntervals.map(i => Math.abs(i - avgInterval)).reduce((a, b) => a + b, 0) / jumpIntervals.length;
        
        // Nếu phương sai thấp, có thể có một mẫu nhất quán
        if (intervalVariance < 200 && avgInterval < 2000) { // 200ms phương sai, 2s khoảng cách trung bình
            dog.memorySystem.playerTendencies.patternRecognized = true;
            dog.advancedTactics.patternRecognition.patternLength = avgInterval;
            
            // Lưu mẫu đã học được
            dog.advancedTactics.patternRecognition.lastPatterns.push(avgInterval);
            if (dog.advancedTactics.patternRecognition.lastPatterns.length > 3) {
                dog.advancedTactics.patternRecognition.lastPatterns.shift();
            }
            
            // Tăng kỹ năng dự đoán khi nhận diện được mẫu
            dog.skillLevels.prediction = Math.min(2.0, dog.skillLevels.prediction + 0.05);
            
            // Tăng trí thông minh khi phát hiện mẫu
            increaseDogIntelligence(0.02);
        } else {
            dog.memorySystem.playerTendencies.patternRecognized = false;
        }
    }
    
    // Đánh giá thói quen né tránh của người chơi
    if (dog.playerBehaviorAnalysis.jumpCount > 10) {
        // Xác định người chơi thích nhảy sớm, tối ưu hay muộn
        let earlyJumps = 0;
        let optimalJumps = 0;
        let lateJumps = 0;
        
        for (const jump of dog.playerJumpPattern) {
            if (jump.nearestObstacleDistance > 120) {
                earlyJumps++;
            } else if (jump.nearestObstacleDistance < 70) {
                lateJumps++;
            } else {
                optimalJumps++;
            }
        }
        
        const total = dog.playerJumpPattern.length;
        
        // Cập nhật tuỳ chọn nhảy
        if (earlyJumps / total > 0.5) {
            dog.memorySystem.playerTendencies.jumpTimingPreference = 'early';
        } else if (lateJumps / total > 0.5) {
            dog.memorySystem.playerTendencies.jumpTimingPreference = 'late';
        } else {
            dog.memorySystem.playerTendencies.jumpTimingPreference = 'optimal';
        }
        
        // Ước tính tốc độ phản ứng của người chơi dựa trên thời gian nhảy
        if (lateJumps / total > 0.3) {
            // Người chơi phản ứng chậm
            dog.memorySystem.playerTendencies.reactionSpeed = 0.7;
        } else if (earlyJumps / total > 0.7) {
            // Người chơi phản ứng rất nhanh/dự đoán
            dog.memorySystem.playerTendencies.reactionSpeed = 1.3;
        } else {
            // Tốc độ phản ứng bình thường
            dog.memorySystem.playerTendencies.reactionSpeed = 1.0;
        }
    }
}

// Hàm cập nhật các kỹ năng và thích ứng các tham số
function updateDogSkillsAndParameters() {
    // Cập nhật các kỹ năng dựa trên trải nghiệm
    
    // Kỹ năng nhảy dựa trên số lần nhảy thành công
    if (dog.memorySystem.obstacleHistory.length > 0) {
        dog.skillLevels.jumping = Math.min(2.0, 1.0 + (dog.memorySystem.obstacleHistory.length * 0.02));
    }
    
    // Kỹ năng tấn công dựa trên số lần tấn công thành công
    const attackSuccessRate = dog.tacticalDecision.successfulAttacks / Math.max(1, (dog.tacticalDecision.successfulAttacks + dog.tacticalDecision.failedAttacks));
    dog.skillLevels.attacking = Math.min(2.0, 1.0 + attackSuccessRate);
    
    // Kỹ năng học tập tăng dần theo thời gian
    dog.skillLevels.learning = Math.min(2.0, dog.skillLevels.learning + 0.001);
    
    // Cập nhật hệ số thời điểm nhảy dựa trên trí thông minh và kỹ năng nhảy
    dog.adaptiveParameters.jumpTiming = 1.0 + ((dog.intelligence - 1.0) * 0.1) + ((dog.skillLevels.jumping - 1.0) * 0.1);
    
    // Cập nhật khoảng cách tấn công tối ưu
    dog.adaptiveParameters.optimalAttackDistance = DOG_ATTACK_DISTANCE + 
                                                 ((dog.intelligence - 1.0) * 10) + 
                                                 ((dog.skillLevels.attacking - 1.0) * 5);
                                            
    // Áp dụng thuộc tính trong hệ thống kỹ năng vào các thuộc tính thực tế
    dog.jumpStrength = 1.0 + ((dog.skillLevels.jumping - 1.0) * 0.3);
    dog.obstacleAwareness = 800 + ((dog.skillLevels.prediction - 1.0) * 200);
}

// Hàm triển khai các chiến thuật nâng cao dựa trên phân tích môi trường
function implementAdvancedTactics(distanceToPlayer, playerNearObstacle) {
    // Chỉ sử dụng chiến thuật nâng cao khi chó đủ thông minh
    if (dog.intelligence < 1.5) return;
    
    // Nếu người chơi đang ở gần chướng ngại vật, xem xét sử dụng chiến thuật đánh lừa
    if (playerNearObstacle && dog.advancedTactics.fakeRetreat === false && Math.random() < 0.3) {
        // Giả vờ lùi lại để người chơi cảm thấy an toàn
        dog.advancedTactics.fakeRetreat = true;
        dog.behaviorState = 'backing';
        
        // Đặt hẹn giờ để đột ngột tấn công sau khi giả vờ lùi lại
        setTimeout(() => {
            if (dog.active && distanceToPlayer < dog.adaptiveParameters.optimalAttackDistance * 1.5) {
                dog.behaviorState = 'attack';
                dog.advancedTactics.fakeRetreat = false;
                dog.prepareAttack = true;
                dog.biteTimer = 20;
                increaseDogIntelligence(0.03);
            } else {
                dog.advancedTactics.fakeRetreat = false;
            }
        }, 800);
    }
    
    // Phá vỡ nhịp điệu chạy để tạo bất ngờ
    if (!dog.advancedTactics.rhythmDisruption && Math.random() < 0.2 && 
        dog.memorySystem.playerTendencies.patternRecognized && !dog.attacking) {
        
        dog.advancedTactics.rhythmDisruption = true;
        
        // Điều chỉnh tốc độ đột ngột
        const originalSpeed = dog.speed;
        
        if (Math.random() < 0.5) {
            // Đột ngột tăng tốc
            dog.speed *= 1.5;
            setTimeout(() => {
                dog.speed = originalSpeed;
                dog.advancedTactics.rhythmDisruption = false;
            }, 500);
        } else {
            // Đột ngột giảm tốc
            dog.speed *= 0.5;
            setTimeout(() => {
                dog.speed = originalSpeed;
                dog.advancedTactics.rhythmDisruption = false;
            }, 700);
        }
    }
    
    // Sử dụng khu vực tấn công tối ưu
    for (const zone of dog.advancedTactics.territorialAwareness.optimalAttackZones) {
        // Nếu người chơi đang ở trong khu vực tấn công tối ưu
        if (player.x > zone.start && player.x < zone.end) {
            // Tăng xác suất tấn công
            if (Math.random() < 0.4 * dog.adaptiveParameters.attackFrequency) {
                dog.behaviorState = 'attack';
                if (!dog.prepareAttack && dog.biteCooldown <= 0) {
                    dog.prepareAttack = true;
                    dog.biteTimer = 25;
                    
                    // Ghi nhận việc sử dụng chiến thuật nâng cao
                    increaseDogIntelligence(0.01);
                }
            }
            break;
        }
    }
}

// Hàm phân tích và dự đoán hành vi của người chơi
function predictPlayerBehavior() {
    // Dự đoán hành vi dựa trên mẫu đã nhận diện
    if (dog.memorySystem.playerTendencies.patternRecognized && 
        dog.advancedTactics.patternRecognition.patternLength > 0) {
        
        const currentTime = Date.now();
        const lastJumpTime = dog.lastPlayerJumpTime;
        const patternLength = dog.advancedTactics.patternRecognition.patternLength;
        
        // Dự đoán thời điểm người chơi sẽ nhảy tiếp theo
        const predictedNextJumpTime = lastJumpTime + patternLength;
        const timeUntilNextJump = predictedNextJumpTime - currentTime;
        
        // Nếu sắp đến thời điểm người chơi dự kiến sẽ nhảy
        if (timeUntilNextJump > 0 && timeUntilNextJump < 500) {
            // Chuẩn bị tấn công ngay khi người chơi nhảy
            if (!dog.prepareAttack && dog.biteCooldown <= 0 && 
                player.x - dog.x - dog.width < dog.adaptiveParameters.optimalAttackDistance * 1.2) {
                
                dog.prepareAttack = true;
                dog.biteTimer = Math.min(30, Math.max(15, Math.floor(timeUntilNextJump / 20)));
                
                // Tăng trí thông minh khi dự đoán thành công
                setTimeout(() => {
                    if (player.jumping) {
                        increaseDogIntelligence(0.05); // Thưởng lớn cho dự đoán chính xác
                    }
                }, timeUntilNextJump + 100);
            }
        }
    }
    
    // Dự đoán chiến thuật của người chơi dựa trên thói quen nhảy
    if (dog.memorySystem.playerTendencies.jumpTimingPreference === 'early') {
        // Người chơi thích nhảy sớm, chó nên đuổi sát hơn
        dog.adaptiveParameters.optimalAttackDistance *= 1.1;
    } else if (dog.memorySystem.playerTendencies.jumpTimingPreference === 'late') {
        // Người chơi thích nhảy muộn, chó nên tấn công khi họ đang tiếp cận chướng ngại vật
        for (const obstacle of obstacles) {
            if (obstacle.x > player.x && obstacle.x - player.x < 100) {
                // Người chơi đang tiếp cận chướng ngại vật
                if (!dog.prepareAttack && dog.biteCooldown <= 0 && 
                    player.x - dog.x - dog.width < dog.adaptiveParameters.optimalAttackDistance * 1.3) {
                    
                    dog.prepareAttack = true;
                    dog.biteTimer = 20;
                    break;
                }
            }
        }
    }
}