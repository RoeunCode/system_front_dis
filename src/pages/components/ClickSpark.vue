<template>
  <canvas
    ref="canvasRef"
    style="
      position: fixed;
      top: 0;
      left: 0;
      z-index: 999999;
      pointer-events: none;
    "
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const canvasRef = ref(null);
const sparks = ref([]);
let animationId = null;

const props = defineProps({
  sparkCount: { type: Number, default: 20 },
  duration: { type: Number, default: 600 },
  size: { type: Number, default: 3 },
  color: { type: String, default: "#ff4032" },
});

const draw = () => {
  const canvas = canvasRef.value;
  const ctx = canvas.getContext("2d");
  if (!canvas || !ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const now = performance.now();

  sparks.value = sparks.value.filter(
    (spark) => now - spark.startTime < props.duration
  );

  sparks.value.forEach((spark) => {
    const elapsed = now - spark.startTime;
    const progress = elapsed / props.duration;
    const distance = 15 * progress;
    const x = spark.x + distance * Math.cos(spark.angle);
    const y = spark.y + distance * Math.sin(spark.angle);

    ctx.beginPath();
    ctx.arc(x, y, props.size, 0, Math.PI * 2);
    ctx.fillStyle = props.color;
    ctx.fill();
  });

  animationId = requestAnimationFrame(draw);
};

const handleGlobalClick = (e) => {
  // Optional: Filter out clicks on certain elements (e.g., v-select menu content)
  const dropdown = document.querySelector(".v-overlay-container");
  if (dropdown?.contains(e.target)) return; // Ignore clicks inside dropdowns

  const canvas = canvasRef.value;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const now = performance.now();
  const newSparks = Array.from({ length: props.sparkCount }, (_, i) => ({
    x,
    y,
    angle: (2 * Math.PI * i) / props.sparkCount,
    startTime: now,
  }));

  sparks.value.push(...newSparks);
};

const resizeCanvas = () => {
  const canvas = canvasRef.value;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

onMounted(() => {
  window.addEventListener("click", handleGlobalClick, true); // capture phase
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  animationId = requestAnimationFrame(draw);
});

onUnmounted(() => {
  window.removeEventListener("click", handleGlobalClick, true);
  window.removeEventListener("resize", resizeCanvas);
  cancelAnimationFrame(animationId);
});
</script>
