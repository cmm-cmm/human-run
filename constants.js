// Game constants
const GAME_WIDTH = 800;
const GAME_HEIGHT = 300;
const GROUND_HEIGHT = 20;
const GROUND_Y = GAME_HEIGHT - GROUND_HEIGHT;

// Player constants
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 70;
const PLAYER_START_X = 50;
const PLAYER_CENTER_X = GAME_WIDTH * 0.4;
const PLAYER_REPOSITION_SPEED = 0.3;
const PLAYER_Y = GROUND_Y - PLAYER_HEIGHT;
const JUMP_FORCE = -15;
const GRAVITY = 0.8;

// Dog constants
const DOG_WIDTH = 45;
const DOG_HEIGHT = 35;
const DOG_START_X = -100;
const DOG_Y = GROUND_Y - DOG_HEIGHT;
const DOG_BASE_SPEED = 4.5;
const DOG_CHASE_DISTANCE = 200;
const DOG_JUMP_FORCE = -12;
const DOG_JUMP_DETECT_DISTANCE = 150;
const DOG_OBSTACLE_MARGIN = 30;
const DOG_BEHAVIOR_CHANGE_DELAY = 100;
const DOG_MIN_CHASE_DISTANCE = 120;
const DOG_ATTACK_DISTANCE = 50;
const DOG_POUNCE_FORCE = -10;
const DOG_RAGE_START_SCORE = 180; // Giảm xuống để chó có thể cuồng nộ sớm hơn
const DOG_RAGE_ATTACK_CHANCE_INCREASE = 0.1;
const DOG_RAGE_SPEED_FACTOR = 0.02;
const DOG_RAGE_ATTACK_INTERVAL_REDUCTION = 0.8;

// Gray Bird constants
const GRAY_BIRD_WIDTH = 40;
const GRAY_BIRD_HEIGHT = 30;
const GRAY_BIRD_MIN_SCORE = 100;
const GRAY_BIRD_CHANCE = 0.25;
const GRAY_BIRD_CHASE_SPEED = 6;
const GRAY_BIRD_REVERSE_DELAY = 300;

// Speed progression constants
const INITIAL_GAME_SPEED = 5;
const MAX_GAME_SPEED = 14;
const SPEED_INCREASE_INTERVAL = 200;
const BASE_SPEED_INCREMENT = 0.05;
const PROGRESSIVE_SPEED_FACTOR = 0.001;

// Native constants
const NATIVE_WIDTH = 40;
const NATIVE_HEIGHT = 70;
const NATIVE_MIN_SCORE = 200;
const NATIVE_CHANCE = 0.15;
const SPEAR_WIDTH = 60;
const SPEAR_HEIGHT = 10;
const SPEAR_SPEED = 8;

// Boomerang constants
const BOOMERANG_WIDTH = 40;
const BOOMERANG_HEIGHT = 40;
const BOOMERANG_SPEED = 6.5; // Tăng từ 4 lên 6.5 để bumerang bay nhanh hơn
const BOOMERANG_RETURN_SPEED = 7; // Tăng từ 5 lên 7 để quay về nhanh hơn
const BOOMERANG_THROW_CHANCE = 0.4; // Xác suất ném bumerang thay vì phóng lao
const BOOMERANG_ROTATION_SPEED = 0.2; // Tăng từ 0.15 lên 0.2 để tạo hiệu ứng xoay nhanh hơn
const BOOMERANG_FLIGHT_FRAMES = 45; // Giảm từ 60 xuống 45 để bumerang quay lại sớm hơn
const BOOMERANG_CURVE_FACTOR = 0.6; // Tăng từ 0.5 lên 0.6 để tạo đường cong rõ hơn
// Thêm hằng số cho hitbox bumerang
const BOOMERANG_HITBOX_WIDTH = 24; // Giảm 40% so với kích thước thật
const BOOMERANG_HITBOX_HEIGHT = 24; // Giảm 40% so với kích thước thật

// Mine constants
const MINE_WIDTH = 30;
const MINE_HEIGHT = 20;
const MINE_MIN_SCORE = 50;
const MINE_CHANCE = 0.15;
const EXPLOSION_DURATION = 4;

// Weather constants
const RAIN_COOLDOWN = 600;
const DARK_CLOUD_DURATION = 60;

// Earthquake constants
const EARTHQUAKE_MIN_SCORE = 100;
const EARTHQUAKE_COOLDOWN = 900;
const EARTHQUAKE_BASE_DURATION = 180;
const EARTHQUAKE_CHANCE = 0.0005;

// Speed effect constants
const SPEED_EFFECT_MIN_SCORE = 200;
const SPEED_EFFECT_CHANCE = 0.001;
const SPEED_EFFECT_DURATION = 180;
const SPEED_EFFECT_COOLDOWN = 600;

// Animation frame constants
const PLAYER_FRAMES = 3;

// Teepee and Rock constants
const TEEPEE_WIDTH = 150;
const TEEPEE_HEIGHT = 120;
const TEEPEE_MIN_SCORE = 150;
const TEEPEE_CHANCE = 0.12;
const ROCK_WIDTH = 45;
const ROCK_HEIGHT = 45;
const ROCK_HITBOX_WIDTH = 30;
const ROCK_HITBOX_HEIGHT = 30;
const ROCK_THROW_DELAY = 500;
const ROCK_THROW_SPEED = 12;
const ROCK_GRAVITY = 0.12;
const ROCK_GROUND_STAY_TIME = 500;

// Duck fatigue constants
const DUCK_MAX_DURATION = 70; // Giảm từ 120 xuống 70 frames (thời gian tối đa có thể ngồi)
const DUCK_FATIGUE_THRESHOLD = 40; // Giảm từ 90 xuống 40 frames (ngưỡng bắt đầu cảnh báo mỏi)
const DUCK_RECOVERY_RATE = 1; // Giảm từ 2 xuống 1 (tốc độ hồi phục khi đứng lên chậm hơn)
const DUCK_FORCED_STAND_DURATION = 60; // Tăng từ 45 lên 60 frames (thời gian buộc phải đứng sau khi quá mỏi)