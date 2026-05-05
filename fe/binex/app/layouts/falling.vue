<template>
  <div class="falling-layout">
    <!-- Hiệu ứng nền -->
    <canvas ref="canvas" class="falling-canvas"></canvas>
    
    <!-- Nội dung của trang -->
    <div class="relative z-10">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";

const canvas = ref(null);
let ctx;
let animationId;
let items = []; // Danh sách các vật thể đang rơi (lá, hoa, tuyết)
const MAX_ITEMS = 30; // Giới hạn số lượng vật thể tối đa để đảm bảo hiệu năng
const TYPES = ["sakura", "green", "dry", "maple", "snow"]; // Các loại vật thể hỗ trợ

// Hàm điều chỉnh kích thước canvas khi cửa sổ trình duyệt thay đổi
const resize = () => {
  if (canvas.value) {
    canvas.value.width = window.innerWidth;
    canvas.value.height = window.innerHeight;
  }
};

// Hàm thêm một vật thể mới vào danh sách
const addItem = (x, y, type = null) => {
  if (items.length >= MAX_ITEMS) {
    items.shift(); // Xóa vật thể cũ nhất nếu vượt quá giới hạn
  }

  const selectedType = type || TYPES[Math.floor(Math.random() * TYPES.length)];
  const isSnow = selectedType === "snow";
  
  // Thiết lập độ đậm nhạt mục tiêu (Tuyết mờ hơn lá)
  const targetOpacity = isSnow ? Math.random() * 0.5 + 0.4 : Math.random() * 0.4 + 0.5;
  
  items.push({
    x,
    y,
    type: selectedType,
    size: isSnow ? Math.random() * 3 + 2 : Math.random() * 8 + 6, // Kích thước ngẫu nhiên
    speedY: isSnow ? Math.random() * 0.5 + 0.3 : Math.random() * 1.2 + 0.6, // Tốc độ rơi theo trục Y
    speedX: isSnow ? Math.random() * 0.4 - 0.2 : Math.random() * 1.5 - 0.75, // Tốc độ dạt theo trục X
    angle: Math.random() * Math.PI * 2, // Góc xoay ban đầu
    rotation: isSnow ? 0 : (Math.random() - 0.5) * 0.03, // Tốc độ xoay (Tuyết không xoay)
    flip: Math.random() * Math.PI, // Góc lật 3D
    flipSpeed: isSnow ? 0 : Math.random() * 0.04 + 0.02, // Tốc độ lật 3D
    drift: Math.random() * 5, // Độ lượn sóng ngẫu nhiên
    opacity: 0, // Bắt đầu từ độ mờ = 0 để hiện dần (Fade-in)
    maxOpacity: targetOpacity,
    isFadingIn: true
  });
};

// Hàm vẽ từng vật thể lên canvas
const drawItem = (p) => {
  if (!ctx) return;
  ctx.save();
  ctx.translate(p.x, p.y);
  
  // Áp dụng hiệu ứng xoay và lật 3D
  const scaleX = Math.cos(p.flip);
  ctx.scale(scaleX, 1);
  ctx.rotate(p.angle);

  // Tạo bóng đổ để tạo độ nổi (3D)
  ctx.shadowBlur = 10;
  ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
  ctx.shadowOffsetX = 4;
  ctx.shadowOffsetY = 4;

  let colorLeft, colorRight, colorVein;

  // Xác định màu sắc dựa trên loại vật thể
  switch (p.type) {
    case "sakura":
      colorLeft = `rgba(255, 209, 220, ${p.opacity})`;
      colorRight = `rgba(255, 182, 193, ${p.opacity})`;
      colorVein = `rgba(255, 150, 170, ${p.opacity * 0.5})`;
      break;
    case "green":
      colorLeft = `rgba(120, 200, 120, ${p.opacity})`;
      colorRight = `rgba(34, 139, 34, ${p.opacity})`;
      colorVein = `rgba(20, 80, 20, ${p.opacity * 0.3})`;
      break;
    case "dry":
      colorLeft = `rgba(200, 160, 120, ${p.opacity})`;
      colorRight = `rgba(139, 69, 19, ${p.opacity})`;
      colorVein = `rgba(80, 40, 20, ${p.opacity * 0.3})`;
      break;
    case "maple":
      colorLeft = `rgba(255, 130, 90, ${p.opacity})`;
      colorRight = `rgba(178, 34, 34, ${p.opacity})`;
      colorVein = `rgba(100, 20, 20, ${p.opacity * 0.4})`;
      break;
    case "snow":
      colorLeft = `rgba(255, 255, 255, ${p.opacity})`;
      break;
  }

  // Logic vẽ hình dáng cụ thể
  if (p.type === "snow") {
    // Bông tuyết: Hình tròn mờ ảo tỏa sáng (glow)
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${p.opacity})`);
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, p.size, 0, Math.PI * 2);
    ctx.fill();
  } else if (p.type === "maple") {
    // Lá phong: Hình răng cưa nhiều khía
    ctx.fillStyle = colorLeft;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    for(let i=0; i<7; i++) {
        const rad = (i * Math.PI * 2) / 7;
        const dist = i % 2 === 0 ? p.size : p.size * 0.5;
        ctx.lineTo(Math.cos(rad) * dist, Math.sin(rad) * dist);
    }
    ctx.closePath();
    ctx.fill();
  } else {
    // Các loại lá và hoa khác: Hình elip mềm mại ghép từ 2 nửa
    ctx.fillStyle = colorLeft;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(p.size, -p.size, p.size * 1.5, p.size / 2, 0, p.size * 1.5);
    ctx.fill();

    ctx.fillStyle = colorRight;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-p.size, -p.size, -p.size * 1.5, p.size / 2, 0, p.size * 1.5);
    ctx.fill();
  }

  // Vẽ gân lá (không áp dụng cho tuyết)
  if (p.type !== "snow") {
    ctx.strokeStyle = colorVein;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, p.size * 1.2);
    ctx.stroke();
  }

  ctx.restore();
};

// Hàm điều khiển toàn bộ quá trình chuyển động
const animate = () => {
  if (!ctx || !canvas.value) return;
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

  // Thỉnh thoảng tự động tạo vật thể rơi từ trên xuống
  if (Math.random() > 0.99) {
    addItem(Math.random() * canvas.value.width, -20);
  }

  for (let i = 0; i < items.length; i++) {
    let p = items[i];
    drawItem(p);

    // Cập nhật tọa độ và góc xoay
    p.y += p.speedY;
    p.x += p.speedX + Math.sin(p.y * 0.005 + p.drift) * 1.5;
    p.angle += p.rotation;
    p.flip += p.flipSpeed;

    // Xử lý hiệu ứng hiện dần (Fade-in)
    if (p.isFadingIn) {
      p.opacity += 0.01;
      if (p.opacity >= p.maxOpacity) {
        p.opacity = p.maxOpacity;
        p.isFadingIn = false;
      }
    } else {
      // Xử lý mờ dần theo thời gian (Fade-out)
      p.opacity -= 0.0002;
    }

    // Xóa vật thể nếu rơi khỏi màn hình hoặc đã hoàn toàn mờ
    if (p.y > canvas.value.height + 20 || p.opacity <= 0) {
      items.splice(i, 1);
      i--;
    }
  }

  animationId = requestAnimationFrame(animate);
};

onMounted(() => {
  ctx = canvas.value.getContext("2d");
  resize();
  window.addEventListener("resize", resize);
  animate();
});

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId);
  window.removeEventListener("resize", resize);
});
</script>

<style scoped>
.falling-layout {
  min-height: 100vh;
  width: 100%;
}
.falling-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
</style>
