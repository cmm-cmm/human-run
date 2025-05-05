// Kiểm tra va chạm giữa hai đối tượng hình chữ nhật (AABB)
function checkCollision(rect1, rect2) {
    // Kiểm tra null/undefined
    if (!rect1 || !rect2) return false;
    
    // Nếu đang trong trạng thái bất tử (có hiệu ứng bất tử)
    if (player && player.invincible) {
        return false;
    }

    // Tối ưu: Kiểm tra nhanh nếu đối tượng cách nhau xa quá thì bỏ qua
    const centerDistanceX = Math.abs((rect1.x + rect1.width/2) - (rect2.x + rect2.width/2));
    const combinedHalfWidths = (rect1.width + rect2.width) / 2;
    
    if (centerDistanceX > combinedHalfWidths) {
        return false; // Quá xa theo chiều ngang, không cần kiểm tra thêm
    }
    
    // Điều chỉnh vùng va chạm để phù hợp hơn với kích thước thực tế
    let margin1X = 6; // Tăng margin theo chiều ngang cho người chơi (từ 4 lên 6)
    let margin1Y = 10; // Tăng margin theo chiều dọc cho người chơi (từ 8 lên 10)
    let margin2X = 4; // Tăng margin mặc định theo chiều ngang cho vật cản (từ 3 lên 4)
    let margin2Y = 5; // Tăng margin mặc định theo chiều dọc cho vật cản (từ 4 lên 5)
    
    // Điều chỉnh vùng va chạm dựa trên loại chướng ngại vật
    if (rect2.type === 'cactus') {
        margin2X = 2; // Xương rồng có vùng va chạm nhỏ hơn ở chiều ngang (điều chỉnh từ 0 lên 2)
    } else if (rect2.type === 'bird') {
        margin2X = 8; // Chim có vùng va chạm lớn hơn do cánh di chuyển (điều chỉnh từ 6 lên 8)
        margin2Y = 8; // Tăng margin theo chiều dọc (từ 6 lên 8)
    } else if (rect2.type === 'graybird' && rect2.reversed) {
        margin2X = 6; // Chim xám khi đang lao về có vùng va chạm chính xác hơn (từ 3 lên 6)
        margin2Y = 6; // Tăng margin theo chiều dọc (từ 3 lên 6)
    } else if (rect2.type === 'graybird') {
        margin2X = 8; // Chim xám bình thường có vùng va chạm tương tự chim thường (từ 6 lên 8)
        margin2Y = 8; // Tăng margin theo chiều dọc (từ 6 lên 8)
    } else if (rect2.type === 'spikepit') {
        margin2Y = 15; // Gai nhọn chủ yếu nguy hiểm ở phần trên (từ 12 lên 15)
        margin2X = 5;  // Tăng margin theo chiều ngang (từ 3 lên 5)
    } else if (rect2.type === 'groundspike') {
        margin2Y = 10; // Gai nhọn từ mặt đất (từ 8 lên 10)
        margin2X = 4;  // Tăng margin theo chiều ngang (từ 2 lên 4)
    } else if (rect2.type === 'mine') {
        margin2X = 2; // Giảm margin để mìn có vùng va chạm lớn hơn (từ 5 xuống 2)
        margin2Y = 2; // Giảm margin để mìn có vùng va chạm lớn hơn (từ 5 xuống 2)
    }
    
    // Điều chỉnh vùng va chạm khi người chơi đang nhảy hoặc ngồi
    if (rect1.jumping) {
        margin1Y = 8; // Nhảy có vùng va chạm nhỏ hơn (từ 6 lên 8)
    } else if (rect1.ducking) {
        margin1X = 5; // Ngồi có vùng va chạm hẹp hơn (từ 3 lên 5)
    }
    
    // Xử lý đặc biệt cho mìn - cần vùng va chạm chính xác
    if (rect2.type === 'mine') {
        // Kiểm tra va chạm với vùng va chạm điều chỉnh cho mìn
        return rect1.x + margin1X < rect2.x + rect2.width - margin2X &&
               rect1.x + rect1.width - margin1X > rect2.x + margin2X &&
               rect1.y + margin1Y < rect2.y + rect2.height - margin2Y &&
               rect1.y + rect1.height - margin1Y > rect2.y + margin2Y;
    }
    
    // Kiểm tra va chạm với vùng va chạm đã điều chỉnh cho các vật khác
    return rect1.x + margin1X < rect2.x + rect2.width - margin2X &&
           rect1.x + rect1.width - margin1X > rect2.x + margin2X &&
           rect1.y + margin1Y < rect2.y + rect2.height - margin2Y &&
           rect1.y + rect1.height - margin1Y > rect2.y + margin2Y;
}

// Kiểm tra va chạm giữa người chơi và lao
function checkCollisionWithSpear(player, spear) {
    // Tạo hộp va chạm nhỏ hơn một chút so với kích thước thực của các đối tượng
    // để cung cấp cảm giác va chạm chính xác hơn
    const playerMargin = 12; // Tăng từ 10 lên 12
    const spearMargin = 4; // Tăng từ 3 lên 4
    
    // Kiểm tra va chạm với vùng va chạm đã điều chỉnh
    return player.x + playerMargin < spear.x + spear.width - spearMargin &&
           player.x + player.width - playerMargin > spear.x + spearMargin &&
           player.y + playerMargin < spear.y + spear.height - spearMargin &&
           player.y + player.height - playerMargin > spear.y + spearMargin;
}

// Kiểm tra va chạm giữa chó và người chơi
function checkDogCollision(dog, player) {
    // Nếu chó không đang tấn công hoặc người chơi đang bất tử, không có va chạm
    if (!dog.attacking || player.invincible) {
        return false;
    }
    
    // Điều chỉnh vùng va chạm cho chó đang tấn công
    const dogMarginX = 4; // Tăng từ 2 lên 4 - chó cần vùng va chạm chính xác hơn
    const dogMarginY = 6; // Tăng từ 5 lên 6
    
    // Điều chỉnh vùng va chạm cho người chơi
    let playerMarginX = 8; // Tăng từ 6 lên 8
    let playerMarginY = 12; // Tăng từ 10 lên 12
    
    // Điều chỉnh vùng va chạm khi người chơi đang nhảy hoặc ngồi
    if (player.jumping) {
        playerMarginY = 10; // Tăng từ 8 lên 10
    } else if (player.ducking) {
        playerMarginX = 7; // Tăng từ 5 lên 7
    }
    
    // Kiểm tra va chạm với vùng va chạm đã điều chỉnh
    return dog.x + dogMarginX < player.x + player.width - playerMarginX &&
           dog.x + dog.width - dogMarginX > player.x + playerMarginX &&
           dog.y + dogMarginY < player.y + player.height - playerMarginY &&
           dog.y + dog.height - dogMarginY > player.y + playerMarginY;
}

// Tạo hiệu ứng nổ tại tọa độ cho trước
function createExplosion(x, y) {
    // Điều chỉnh vị trí y để hiệu ứng nổ nổi lên trên mặt đất hơn
    const adjustedY = y - 25;
    
    // Tạo hiệu ứng nổ với từng sprite
    for (let i = 0; i < explosionSprites.length; i++) {
        setTimeout(() => {
            // Vẽ hiệu ứng nổ với hiệu ứng mờ dần
            ctx.save();
            ctx.globalAlpha = 1 - (i / explosionSprites.length);
            ctx.drawImage(
                explosionSprites[i], 
                x - 60, // Căn giữa hiệu ứng nổ (tăng từ 40 lên 60)
                adjustedY - 60, // Tăng từ 40 lên 60
                120, // Kích thước lớn hơn để tạo hiệu ứng mạnh mẽ (tăng từ 80 lên 120)
                120  // Tăng từ 80 lên 120
            );
            ctx.restore();
        }, i * 100);
    }
}

// ----------------- PHẦN NÂNG CAO TỐI ƯU HIỆU SUẤT -----------------

// Bộ đệm hình ảnh đã được vẽ trước (Pre-rendered cache)
const preRenderedCache = {};

// Kích thước ngưỡng để quyết định có sử dụng pre-rendering hay không
const PRE_RENDER_THRESHOLD = {
    width: 100,
    height: 100
};

// Số lượng tối đa các đối tượng trong cache để tránh rò rỉ bộ nhớ
const MAX_CACHE_SIZE = 30;

// Danh sách các khóa cache được sử dụng gần đây (Đảm bảo đẩy các mục ít sử dụng ra)
const cacheUsageList = [];

/**
 * Tạo bản vẽ trước (pre-render) của một vật thể tĩnh
 * @param {function} renderFunction - Hàm vẽ đối tượng
 * @param {number} width - Chiều rộng đối tượng
 * @param {number} height - Chiều cao đối tượng 
 * @param {string} cacheKey - Khóa duy nhất để lưu trong cache
 * @param {Object} options - Các tùy chọn bổ sung (xoay, độ trong suốt...)
 * @returns {HTMLCanvasElement} Canvas đã được vẽ trước
 */
function preRender(renderFunction, width, height, cacheKey, options = {}) {
    // Kiểm tra xem đã có trong cache chưa
    if (preRenderedCache[cacheKey]) {
        // Đánh dấu mục này vừa được sử dụng
        markCacheUsed(cacheKey);
        return preRenderedCache[cacheKey];
    }
    
    // Tạo canvas mới để vẽ
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    
    // Áp dụng các biến đổi (nếu có)
    if (options.rotation) {
        context.save();
        context.translate(width / 2, height / 2);
        context.rotate(options.rotation);
        context.translate(-width / 2, -height / 2);
    }
    
    if (options.alpha !== undefined) {
        context.globalAlpha = options.alpha;
    }
    
    // Thực hiện hàm vẽ đã được truyền vào
    renderFunction(context, 0, 0, width, height);
    
    // Khôi phục context nếu đã áp dụng biến đổi
    if (options.rotation) {
        context.restore();
    }
    
    // Quản lý kích thước cache để tránh rò rỉ bộ nhớ
    if (Object.keys(preRenderedCache).length >= MAX_CACHE_SIZE) {
        // Xóa mục cũ nhất (ít được sử dụng nhất)
        const oldestKey = cacheUsageList.shift();
        if (oldestKey && preRenderedCache[oldestKey]) {
            delete preRenderedCache[oldestKey];
        }
    }
    
    // Lưu vào cache và danh sách sử dụng
    preRenderedCache[cacheKey] = canvas;
    cacheUsageList.push(cacheKey);
    
    return canvas;
}

/**
 * Đánh dấu một mục cache vừa được sử dụng (Di chuyển nó lên đầu danh sách LRU)
 * @param {string} cacheKey - Khóa cache
 */
function markCacheUsed(cacheKey) {
    // Xóa kh�a khỏi danh sách hiện tại (nếu có)
    const index = cacheUsageList.indexOf(cacheKey);
    if (index > -1) {
        cacheUsageList.splice(index, 1);
    }
    
    // Đưa khóa lên cuối danh sách (được sử dụng gần đây nhất)
    cacheUsageList.push(cacheKey);
}

/**
 * Xóa cache của một đối tượng cụ thể hoặc tất cả cache
 * @param {string} cacheKey - Khóa cache hoặc undefined để xóa tất cả
 */
function clearPreRenderedCache(cacheKey) {
    if (cacheKey) {
        // Xóa một mục cụ thể
        delete preRenderedCache[cacheKey];
        
        // Xóa khỏi danh sách sử dụng
        const index = cacheUsageList.indexOf(cacheKey);
        if (index > -1) {
            cacheUsageList.splice(index, 1);
        }
    } else {
        // Xóa tất cả cache
        for (const key in preRenderedCache) {
            delete preRenderedCache[key];
        }
        cacheUsageList.length = 0;
    }
}

// Lưu các tính toán vào bộ nhớ đệm
const memoizedCalculations = {};

/**
 * Tính toán giá trị và lưu vào bộ nhớ đệm cho các công thức phức tạp
 * @param {string} key - Khóa duy nhất cho phép tính
 * @param {function} calculationFn - Hàm thực hiện tính toán
 * @returns {any} Kết quả được tính toán hoặc lấy từ bộ nhớ đệm
 */
function memoize(key, calculationFn) {
    if (memoizedCalculations[key] === undefined) {
        memoizedCalculations[key] = calculationFn();
    }
    return memoizedCalculations[key];
}

/**
 * Xóa một hoặc tất cả các giá trị được lưu trong bộ nhớ đệm
 * @param {string} key - Khóa cần xóa hoặc undefined để xóa tất cả
 */
function clearMemoizedCalculation(key) {
    if (key) {
        delete memoizedCalculations[key];
    } else {
        for (const k in memoizedCalculations) {
            delete memoizedCalculations[k];
        }
    }
}

// Hệ thống phân vùng không gian cho kiểm tra va chạm (Spatial Partitioning)
const GRID_SIZE = 200; // Kích thước mỗi ô lưới

// Lớp QuadTree để tối ưu hóa kiểm tra va chạm
class QuadTree {
    constructor(boundary, capacity = 4, level = 0, maxLevel = 5) {
        this.boundary = boundary; // Ranh giới của nút hiện tại
        this.capacity = capacity; // Số đối tượng tối đa trước khi chia
        this.objects = []; // Danh sách đối tượng trong nút này
        this.divided = false; // Đã chia chưa
        this.level = level; // Cấp độ hiện tại của cây
        this.maxLevel = maxLevel; // Cấp độ tối đa cho phép
        
        // Các nút con (sẽ được khởi tạo khi chia)
        this.northwest = null;
        this.northeast = null;
        this.southwest = null;
        this.southeast = null;
    }
    
    // Chia nút hiện tại thành 4 nút con
    subdivide() {
        const x = this.boundary.x;
        const y = this.boundary.y;
        const w = this.boundary.width / 2;
        const h = this.boundary.height / 2;
        
        // Tạo ranh giới cho các nút con
        const nw = { x: x, y: y, width: w, height: h };
        const ne = { x: x + w, y: y, width: w, height: h };
        const sw = { x: x, y: y + h, width: w, height: h };
        const se = { x: x + w, y: y + h, width: w, height: h };
        
        // Tạo các nút con với cấp độ tăng lên
        this.northwest = new QuadTree(nw, this.capacity, this.level + 1, this.maxLevel);
        this.northeast = new QuadTree(ne, this.capacity, this.level + 1, this.maxLevel);
        this.southwest = new QuadTree(sw, this.capacity, this.level + 1, this.maxLevel);
        this.southeast = new QuadTree(se, this.capacity, this.level + 1, this.maxLevel);
        
        this.divided = true;
        
        // Phân phối lại các đối tượng hiện có vào các nút con
        for (let i = 0; i < this.objects.length; i++) {
            this.insert(this.objects[i]);
        }
        
        // Xóa đối tượng khỏi nút cha
        this.objects = [];
    }
    
    // Kiểm tra xem một đối tượng có nằm trong ranh giới không
    contains(object) {
        return (
            object.x >= this.boundary.x &&
            object.x + object.width <= this.boundary.x + this.boundary.width &&
            object.y >= this.boundary.y &&
            object.y + object.height <= this.boundary.y + this.boundary.height
        );
    }
    
    // Thêm một đối tượng vào cây
    insert(object) {
        // Nếu đối tượng không thuộc về ranh giới này
        if (!this.contains(object)) {
            return false;
        }
        
        // Nếu có dư khả năng và chưa chia, thêm đối tượng vào nút hiện tại
        if (this.objects.length < this.capacity && !this.divided) {
            this.objects.push(object);
            return true;
        }
        
        // Nếu chưa chia và chưa đạt cấp độ tối đa, chia nút
        if (!this.divided && this.level < this.maxLevel) {
            this.subdivide();
        }
        
        // Nếu đã chia, thử thêm vào một trong các nút con
        if (this.divided) {
            if (this.northwest.insert(object)) return true;
            if (this.northeast.insert(object)) return true;
            if (this.southwest.insert(object)) return true;
            if (this.southeast.insert(object)) return true;
        }
        
        // Nếu không thể thêm vào nút con (đã đạt cấp độ tối đa), thêm vào nút hiện tại
        if (this.level >= this.maxLevel) {
            this.objects.push(object);
            return true;
        }
        
        return false;
    }
    
    // Tìm các đối tượng có thể va chạm với đối tượng đã cho
    query(object, found = []) {
        // Nếu ranh giới không giao với đối tượng, bỏ qua
        if (!this.intersects(object)) {
            return found;
        }
        
        // Kiểm tra các đối tượng trong nút hiện tại
        for (let i = 0; i < this.objects.length; i++) {
            if (object !== this.objects[i]) { // Không kiểm tra với chính nó
                found.push(this.objects[i]);
            }
        }
        
        // Nếu đã chia, kiểm tra các nút con
        if (this.divided) {
            this.northwest.query(object, found);
            this.northeast.query(object, found);
            this.southwest.query(object, found);
            this.southeast.query(object, found);
        }
        
        return found;
    }
    
    // Kiểm tra xem ranh giới có giao với đối tượng không
    intersects(object) {
        return !(
            object.x > this.boundary.x + this.boundary.width ||
            object.x + object.width < this.boundary.x ||
            object.y > this.boundary.y + this.boundary.height ||
            object.y + object.height < this.boundary.y
        );
    }
    
    // Xóa tất cả đối tượng
    clear() {
        this.objects = [];
        
        if (this.divided) {
            this.northwest.clear();
            this.northeast.clear();
            this.southwest.clear();
            this.southeast.clear();
            
            this.northwest = null;
            this.northeast = null;
            this.southwest = null;
            this.southeast = null;
            
            this.divided = false;
        }
    }
}

// Khởi tạo QuadTree toàn cục - sẽ được cập nhật trong mỗi frame
let spatialTree = new QuadTree({
    x: 0,
    y: 0,
    width: GAME_WIDTH,
    height: GAME_HEIGHT
});

/**
 * Cập nhật cây không gian với danh sách đối tượng mới
 * @param {Array} objects - Danh sách đối tượng cần kiểm tra va chạm
 */
function updateSpatialTree(objects) {
    // Xóa cây hiện tại
    spatialTree.clear();
    
    // Thêm tất cả đối tượng vào cây
    for (let i = 0; i < objects.length; i++) {
        spatialTree.insert(objects[i]);
    }
}

/**
 * Tìm các đối tượng tiềm năng có thể va chạm với đối tượng đã cho
 * @param {Object} object - Đối tượng cần kiểm tra
 * @returns {Array} Danh sách đối tượng có thể va chạm
 */
function findPotentialColliders(object) {
    return spatialTree.query(object);
}

/**
 * Lên lịch công việc khi CPU rảnh
 * @param {function} callback - Hàm cần thực hiện
 */
function scheduleIdleTask(callback) {
    if (window.requestIdleCallback) {
        // Sử dụng requestIdleCallback nếu được hỗ trợ
        window.requestIdleCallback(callback, { timeout: 1000 });
    } else {
        // Fallback nếu không được hỗ trợ
        setTimeout(callback, 1);
    }
}

/**
 * Vẽ hiệu ứng đổ bóng đơn giản
 * @param {CanvasRenderingContext2D} ctx - Context 2D
 * @param {number} x - Vị trí x
 * @param {number} y - Vị trí y
 * @param {number} width - Chiều rộng
 * @param {number} height - Chiều cao
 * @param {number} blur - Độ mờ
 */
function drawShadow(ctx, x, y, width, height, blur = 5) {
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = blur;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(x, y, width, height);
    ctx.restore();
}

/**
 * Đo hiệu suất của một hàm
 * @param {function} fn - Hàm cần đo
 * @param {string} label - Nhãn để ghi nhận
 * @returns {any} Kết quả của hàm
 */
function measurePerformance(fn, label) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    console.log(`[Performance] ${label}: ${(end - start).toFixed(2)}ms`);
    return result;
}