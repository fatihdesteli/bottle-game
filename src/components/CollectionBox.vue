<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()

const boxPosition = ref(50) // Center position (percentage)
const isDragging = ref(false)
const gameCanvas = ref(null)
const animationFrameId = ref(null)
const pendingPosition = ref(null)

// Expose boxPosition to parent component
defineExpose({
  boxPosition,
  getPosition: () => boxPosition.value
})

// Calculate box width based on power-up
const boxWidth = computed(() => {
  const baseWidth = 150
  return gameStore.activePowerUps.widerBox ? baseWidth * 1.5 : baseWidth
})

const boxStyle = computed(() => ({
  left: `${boxPosition.value}%`,
  transform: 'translateX(-50%)',
  width: `${boxWidth.value}px`
}))

// Update position with requestAnimationFrame for smooth movement
const applyPosition = () => {
  if (pendingPosition.value !== null) {
    boxPosition.value = pendingPosition.value
    pendingPosition.value = null
  }
  animationFrameId.value = null
}

const updatePosition = (clientX) => {
  if (!gameCanvas.value) return

  const rect = gameCanvas.value.getBoundingClientRect()
  const relativeX = clientX - rect.left
  const percentage = (relativeX / rect.width) * 100

  // Clamp between 0 and 100
  const newPosition = Math.max(0, Math.min(100, percentage))

  // Use RAF for smooth updates
  pendingPosition.value = newPosition
  if (!animationFrameId.value) {
    animationFrameId.value = requestAnimationFrame(applyPosition)
  }
}

// Mouse/Touch handlers
const startDrag = (event) => {
  isDragging.value = true
  const clientX = event.type === 'touchstart'
    ? event.touches[0].clientX
    : event.clientX
  updatePosition(clientX)
  event.preventDefault()
}

const onDrag = (event) => {
  if (!isDragging.value) return

  const clientX = event.type.includes('touch')
    ? event.touches[0].clientX
    : event.clientX

  updatePosition(clientX)
  event.preventDefault()
}

const stopDrag = () => {
  isDragging.value = false
}

// Keyboard controls
const handleKeyDown = (event) => {
  const speed = 3 // percentage per keypress

  if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
    boxPosition.value = Math.max(0, boxPosition.value - speed)
    event.preventDefault()
  } else if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
    boxPosition.value = Math.min(100, boxPosition.value + speed)
    event.preventDefault()
  }
}

onMounted(() => {
  // Find game canvas element
  const canvas = document.querySelector('.game-canvas')
  if (canvas) {
    gameCanvas.value = canvas
  }

  // Add event listeners
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('mousemove', onDrag, { passive: false })
  window.addEventListener('mouseup', stopDrag)
  window.addEventListener('touchmove', onDrag, { passive: false })
  window.addEventListener('touchend', stopDrag)
})

onUnmounted(() => {
  // Cancel any pending animation frame
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value)
  }

  // Remove event listeners
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('touchmove', onDrag)
  window.removeEventListener('touchend', stopDrag)
})
</script>

<template>
  <div
    class="collection-box"
    :style="boxStyle"
    :class="{
      wider: gameStore.activePowerUps.widerBox,
      protected: gameStore.activePowerUps.shield
    }"
    @mousedown="startDrag"
    @touchstart="startDrag"
  >
    <!-- Shield Effect -->
    <div v-if="gameStore.activePowerUps.shield" class="shield-effect">
      🛡️
    </div>

    <!-- Box Container -->
    <div class="box-container">
      <!-- Box Image -->
      <img
        src="/images/collection-box.png"
        alt="Toplama Kutusu"
        class="box-image"
        draggable="false"
      />

      <!-- Power-up Glow Effect -->
      <div v-if="gameStore.activePowerUps.widerBox" class="powerup-glow"></div>

      <!-- Width Indicator (for wider power-up) -->
      <div v-if="gameStore.activePowerUps.widerBox" class="width-indicators">
        <div class="indicator left">←</div>
        <div class="indicator right">→</div>
      </div>
    </div>

    <!-- Touch/Drag Indicator -->
    <div class="drag-hint">
      {{ isDragging ? '⬅️ Sürükle ➡️' : '👆 Tut & Sürükle' }}
    </div>
  </div>
</template>

<style scoped>
.collection-box {
  position: absolute;
  bottom: 40px;
  height: 100px;
  z-index: 50;
  cursor: grab;
  user-select: none;
  transition: width 0.3s ease;
  will-change: left;
  /* Use GPU acceleration for smooth movement */
  transform: translateZ(0);
}

.collection-box:active {
  cursor: grabbing;
}

.box-container {
  width: 100%;
  height: 100%;
  position: relative;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3));
}

/* Box Image */
.box-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
  user-select: none;
}

/* Power-up Glow Effect */
.powerup-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(50, 205, 50, 0.3) 0%, transparent 70%);
  animation: pulseGlow 1.5s infinite;
  pointer-events: none;
  border-radius: 8px;
}

@keyframes pulseGlow {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}

/* Wider Box Variant */
.collection-box.wider .box-image {
  filter: brightness(1.1) saturate(1.3);
}

/* Protected Box Variant */
.collection-box.protected .box-image {
  filter: brightness(1.1) hue-rotate(260deg);
}

/* Width Indicators */
.width-indicators {
  position: absolute;
  top: 50%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
  pointer-events: none;
}

.indicator {
  font-size: 1.5rem;
  color: #32CD32;
  text-shadow: 0 0 5px rgba(50, 205, 50, 0.8);
  animation: bounce 1s infinite;
}

.indicator.left {
  animation-delay: 0s;
}

.indicator.right {
  animation-delay: 0.5s;
}

@keyframes bounce {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-5px); }
}

.indicator.right {
  animation-name: bounceRight;
}

@keyframes bounceRight {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(5px); }
}

/* Shield Effect */
.shield-effect {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2.5rem;
  z-index: 100;
  animation: shieldFloat 2s infinite;
  filter: drop-shadow(0 0 10px rgba(138, 43, 226, 0.8));
}

@keyframes shieldFloat {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-10px); }
}

/* Drag Hint */
.drag-hint {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 0.85rem;
  font-weight: 700;
  white-space: nowrap;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  opacity: 0.7;
  pointer-events: none;
}

/* Responsive */
@media (max-width: 480px) {
  .collection-box {
    bottom: 30px;
    height: 80px;
  }

  .drag-hint {
    font-size: 0.75rem;
    bottom: -25px;
  }

  .shield-effect {
    font-size: 2rem;
    top: -25px;
  }
}

/* Keyboard hint for desktop */
@media (min-width: 769px) {
  .drag-hint::after {
    content: ' (← →)';
    opacity: 0.5;
  }
}
</style>
