<template>
  <canvas ref="canvas" class="mouse-follower-canvas"></canvas>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { useEffects } from '~/composables/useEffects';

const { showMouseFollower } = useEffects();
const canvas = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;
let animationId: number;
let particles: any[] = [];
const MAX_PARTICLES = 50;

const resize = () => {
  if (canvas.value) {
    canvas.value.width = window.innerWidth;
    canvas.value.height = window.innerHeight;
  }
};

const createParticle = (x: number, y: number) => {
  if (particles.length >= MAX_PARTICLES) {
    particles.shift();
  }
  
  const targetOpacity = Math.random() * 0.3 + 0.6;
  particles.push({
    x: x + (Math.random() * 20 - 10),
    y: y + (Math.random() * 20 - 10),
    size: Math.random() * 5 + 5,
    speedY: Math.random() * 1 + 0.5,
    speedX: Math.random() * 1 - 0.5,
    angle: Math.random() * Math.PI * 2,
    rotation: (Math.random() - 0.5) * 0.03,
    flip: Math.random() * Math.PI,
    flipSpeed: Math.random() * 0.03 + 0.02,
    opacity: 0.1,
    maxOpacity: targetOpacity,
    isFadingIn: true
  });
};

const handleMouseMove = (e: MouseEvent) => {
  if (!showMouseFollower.value) return;
  if (Math.random() > 0.8) {
    createParticle(e.clientX, e.clientY);
  }
};

const drawParticle = (p: any) => {
  if (!ctx) return;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.scale(Math.cos(p.flip), 1);
  ctx.rotate(p.angle);

  // Vẽ cánh hoa sakura (giống index.vue ban đầu)
  ctx.fillStyle = `rgba(255, 209, 220, ${p.opacity})`;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(p.size, -p.size, p.size * 1.5, p.size / 2, 0, p.size * 1.5);
  ctx.fill();

  ctx.fillStyle = `rgba(255, 182, 193, ${p.opacity})`;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-p.size, -p.size, -p.size * 1.5, p.size / 2, 0, p.size * 1.5);
  ctx.fill();

  ctx.restore();
};

const animate = () => {
  if (!ctx || !canvas.value) return;
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    drawParticle(p);

    p.y += p.speedY;
    p.x += p.speedX;
    p.angle += p.rotation;
    p.flip += p.flipSpeed;

    if (p.isFadingIn) {
      p.opacity += 0.05;
      if (p.opacity >= p.maxOpacity) {
        p.opacity = p.maxOpacity;
        p.isFadingIn = false;
      }
    } else {
      p.opacity -= 0.005;
    }

    if (p.y > canvas.value.height || p.opacity <= 0) {
      particles.splice(i, 1);
      i--;
    }
  }
  animationId = requestAnimationFrame(animate);
};

onMounted(() => {
  if (canvas.value) {
    ctx = canvas.value.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    animate();
  }
});

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId);
  window.removeEventListener('resize', resize);
  window.removeEventListener('mousemove', handleMouseMove);
});

// Xóa hạt khi tắt hiệu ứng
watch(showMouseFollower, (val) => {
  if (!val) particles = [];
});
</script>

<style scoped>
.mouse-follower-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5000; /* Hạ xuống dưới Modals */
}
</style>
