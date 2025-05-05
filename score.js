// Hệ thống tính điểm cơ bản

// Cập nhật điểm số
function updateScore(deltaTime) {
    // Tính toán hệ số dựa trên thời gian
    const timeCoefficient = deltaTime / (1000 / 60);
    
    // Điểm cơ bản tăng theo tốc độ
    score += 1 * timeCoefficient;
    
    // Cập nhật hiển thị điểm
    document.getElementById('score').textContent = `Score: ${Math.floor(score / 10)}`;
}

// Cập nhật và lưu điểm cao
function updateHighScore() {
    // Kiểm tra nếu điểm hiện tại cao hơn điểm cao nhất
    if (Math.floor(score / 10) > highScore) {
        highScore = Math.floor(score / 10);
        document.getElementById('high-score').textContent = `High Score: ${highScore}`;
        localStorage.setItem('humanRunHighScore', highScore);
    }
}