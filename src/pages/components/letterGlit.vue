<template>
  <div :class="className" :style="containerStyle">
    <canvas ref="canvasRef" :style="canvasStyle" />
    <div :style="slotContainerStyle">
      <slot />
    </div>

    <div v-if="outerVignette" :style="outerVignetteStyle"></div>
    <div v-if="centerVignette" :style="centerVignetteStyle"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, defineProps } from "vue";

const slotContainerStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  zIndex: 2, // make sure it's above the canvas
  display: "flex",
  justifyContent: "center",
  alignItems: "start", // or 'center' if you want it vertically centered
  pointerEvents: "auto",
  paddingTop: "80px", // if you want spacing from top
};

// Props
const props = defineProps({
  glitchColors: {
    type: Array,
    default: () => ["#2b4539", "#61dca3", "#61b3dc"],
  },
  className: {
    type: String,
    default: "",
  },
  glitchSpeed: {
    type: Number,
    default: 50,
  },
  centerVignette: {
    type: Boolean,
    default: false,
  },
  outerVignette: {
    type: Boolean,
    default: true,
  },
  smooth: {
    type: Boolean,
    default: true,
  },
});

// Refs and variables
const canvasRef = ref(null);
let animationRef = null;
const context = ref(null);
const letters = ref([]);
const grid = ref({ columns: 0, rows: 0 });
const lastGlitchTime = ref(Date.now());

const fontSize = 16;
const charWidth = 10;
const charHeight = 20;

const lettersAndSymbols =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789".split("");

const getRandomChar = () =>
  lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];
const getRandomColor = () =>
  props.glitchColors[Math.floor(Math.random() * props.glitchColors.length)];

const hexToRgb = (hex) => {
  hex = hex.replace(
    /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
    (_, r, g, b) => r + r + g + g + b + b
  );
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const interpolateColor = (start, end, factor) =>
  `rgb(${Math.round(start.r + (end.r - start.r) * factor)},${Math.round(
    start.g + (end.g - start.g) * factor
  )},${Math.round(start.b + (end.b - start.b) * factor)})`;

const calculateGrid = (width, height) => ({
  columns: Math.ceil(width / charWidth),
  rows: Math.ceil(height / charHeight),
});

const initializeLetters = (columns, rows) => {
  grid.value = { columns, rows };
  letters.value = Array.from({ length: columns * rows }, () => ({
    char: getRandomChar(),
    color: getRandomColor(),
    targetColor: getRandomColor(),
    colorProgress: 1,
  }));
};

const drawLetters = () => {
  const canvas = canvasRef.value;
  if (!canvas || !context.value) return;
  const ctx = context.value;
  const rect = canvas.getBoundingClientRect();
  ctx.clearRect(0, 0, rect.width, rect.height);
  ctx.font = `${fontSize}px monospace`;
  ctx.textBaseline = "top";

  letters.value.forEach((letter, index) => {
    const x = (index % grid.value.columns) * charWidth;
    const y = Math.floor(index / grid.value.columns) * charHeight;
    ctx.fillStyle = letter.color;
    ctx.fillText(letter.char, x, y);
  });
};

const updateLetters = () => {
  const updateCount = Math.max(1, Math.floor(letters.value.length * 0.05));
  for (let i = 0; i < updateCount; i++) {
    const index = Math.floor(Math.random() * letters.value.length);
    if (!letters.value[index]) continue;
    letters.value[index].char = getRandomChar();
    letters.value[index].targetColor = getRandomColor();
    if (!props.smooth) {
      letters.value[index].color = letters.value[index].targetColor;
      letters.value[index].colorProgress = 1;
    } else {
      letters.value[index].colorProgress = 0;
    }
  }
};

const handleSmoothTransitions = () => {
  let needsRedraw = false;
  letters.value.forEach((letter) => {
    if (letter.colorProgress < 1) {
      letter.colorProgress += 0.05;
      if (letter.colorProgress > 1) letter.colorProgress = 1;
      const startRgb = hexToRgb(letter.color);
      const endRgb = hexToRgb(letter.targetColor);
      if (startRgb && endRgb) {
        letter.color = interpolateColor(startRgb, endRgb, letter.colorProgress);
        needsRedraw = true;
      }
    }
  });
  if (needsRedraw) drawLetters();
};

const animate = () => {
  const now = Date.now();
  if (now - lastGlitchTime.value >= props.glitchSpeed) {
    updateLetters();
    drawLetters();
    lastGlitchTime.value = now;
  }

  if (props.smooth) handleSmoothTransitions();
  animationRef = requestAnimationFrame(animate);
};

const resizeCanvas = () => {
  const canvas = canvasRef.value;
  const parent = canvas?.parentElement;
  if (!canvas || !parent) return;

  const dpr = window.devicePixelRatio || 1;
  const rect = parent.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;

  context.value.setTransform(dpr, 0, 0, dpr, 0, 0);

  const { columns, rows } = calculateGrid(rect.width, rect.height);
  initializeLetters(columns, rows);
  drawLetters();
};

// Lifecycle
onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  context.value = canvas.getContext("2d");
  resizeCanvas();
  animate();

  let resizeTimeout;
  const handleResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      cancelAnimationFrame(animationRef);
      resizeCanvas();
      animate();
    }, 100);
  };

  window.addEventListener("resize", handleResize);

  onBeforeUnmount(() => {
    cancelAnimationFrame(animationRef);
    window.removeEventListener("resize", handleResize);
  });
});

// Styles in JS
const containerStyle = {
  position: "relative",
  width: "100%",
  height: "100%",
  backgroundColor: "#000000",
  overflow: "hidden",
};

const canvasStyle = {
  display: "block",
  width: "100%",
  height: "100%",
};

const outerVignetteStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  background: "radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,0,0,1) 100%)",
};

const centerVignetteStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  background: "radial-gradient(circle, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)",
};
</script>
