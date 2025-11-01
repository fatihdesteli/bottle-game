<script setup>
import { computed } from 'vue'

const props = defineProps({
  bottle: {
    type: Object,
    required: true
  }
})

const bottleStyle = computed(() => ({
  left: `${props.bottle.x}%`,
  top: `${props.bottle.y}px`,
  transform: `translateX(-50%)`
}))
</script>

<template>
  <div class="bottle-item" :style="bottleStyle" :class="{ golden: bottle.isGolden }">
    <div class="bottle-container">
      <!-- Bottle Image -->
      <img
        src="/images/bottle.png"
        alt="Şişe"
        class="bottle-image"
        draggable="false"
      />

      <!-- Golden Shine Effect -->
      <div v-if="bottle.isGolden" class="golden-shine"></div>
    </div>
  </div>
</template>

<style scoped>
.bottle-item {
  position: absolute;
  width: 40px;
  height: 80px;
  z-index: 10;
  animation: bottleRotate 3s linear infinite;
}

@keyframes bottleRotate {
  0% { transform: translateX(-50%) rotate(0deg); }
  100% { transform: translateX(-50%) rotate(360deg); }
}

.bottle-container {
  width: 100%;
  height: 100%;
  position: relative;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

/* Bottle Image */
.bottle-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
  user-select: none;
}

/* Golden Bottle Variant */
.bottle-item.golden .bottle-image {
  filter: hue-rotate(45deg) saturate(1.5) brightness(1.2);
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.6);
}

/* Golden Shine Effect */
.golden-shine {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.5) 50%,
    transparent 70%
  );
  animation: shine 2s infinite;
  pointer-events: none;
}

@keyframes shine {
  0% {
    transform: translateX(-100%) rotate(-45deg);
  }
  100% {
    transform: translateX(200%) rotate(-45deg);
  }
}

/* Sparkle effect for golden bottles */
.bottle-item.golden::before,
.bottle-item.golden::after {
  content: '✨';
  position: absolute;
  font-size: 1rem;
  animation: sparkle 1.5s infinite;
}

.bottle-item.golden::before {
  top: -5px;
  left: -5px;
  animation-delay: 0s;
}

.bottle-item.golden::after {
  bottom: -5px;
  right: -5px;
  animation-delay: 0.75s;
}

@keyframes sparkle {
  0%, 100% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Hover effect for testing */
.bottle-item:hover {
  filter: brightness(1.2);
  cursor: pointer;
}
</style>
