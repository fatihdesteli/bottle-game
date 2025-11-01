<script setup>
import { computed, ref, watch } from 'vue'
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()
const showMessage = ref(true)
const currentMessage = ref('')

// Watch for level changes to show messages
watch(() => gameStore.currentLevel, (newLevel, oldLevel) => {
  if (newLevel !== oldLevel && gameStore.currentLevelData) {
    currentMessage.value = gameStore.currentLevelData.message
    showMessage.value = true

    // Auto-hide message after 3 seconds
    setTimeout(() => {
      showMessage.value = false
    }, 3000)
  }
}, { immediate: true })

const modelInfo = computed(() => {
  if (!gameStore.currentModelData) return null
  return gameStore.currentModelData
})

const outfitName = computed(() => {
  if (!gameStore.currentLevelData) return ''
  const outfit = gameStore.currentLevelData.outfit
  const names = {
    formal: 'Formal',
    sport: 'Spor',
    casual: 'Günlük',
    elegant: 'Şık',
    party: 'Parti',
    swimwear: 'Mayolu'
  }
  return names[outfit] || outfit
})
</script>

<template>
  <div class="model-panel">
    <div class="panel-content">
      <!-- Model Info Header -->
      <div class="model-header">
        <h3>{{ modelInfo?.name || 'Model' }}</h3>
        <p class="outfit-name">{{ outfitName }}</p>
      </div>

      <!-- Model Avatar/Image -->
      <div class="model-display">
        <div class="model-avatar">
          <!-- Placeholder for model image -->
          <div class="avatar-circle">
            <span class="avatar-initial">{{ modelInfo?.name?.[0] || 'M' }}</span>
          </div>

          <!-- Level Badge -->
          <div class="level-badge">
            <span class="level-number">{{ gameStore.currentLevel + 1 }}</span>
            <span class="level-stars">
              {{ '⭐'.repeat(Math.min(gameStore.currentLevel + 1, 6)) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Message Bubble -->
      <transition name="message">
        <div v-if="showMessage && currentMessage" class="message-bubble">
          <div class="bubble-content">
            {{ currentMessage }}
          </div>
          <div class="bubble-tail"></div>
        </div>
      </transition>

      <!-- Stats Mini Display -->
      <div class="stats-mini">
        <div class="stat-item">
          <div class="stat-icon">🍾</div>
          <div class="stat-info">
            <div class="stat-value">{{ gameStore.bottlesCollected }}</div>
            <div class="stat-label">Toplanan</div>
          </div>
        </div>

        <div class="stat-item">
          <div class="stat-icon">⭐</div>
          <div class="stat-info">
            <div class="stat-value">{{ gameStore.goldenBottlesCollected }}</div>
            <div class="stat-label">Altın</div>
          </div>
        </div>

        <div class="stat-item">
          <div class="stat-icon">🔥</div>
          <div class="stat-info">
            <div class="stat-value">{{ gameStore.maxCombo }}</div>
            <div class="stat-label">Max Combo</div>
          </div>
        </div>
      </div>

      <!-- Compliment Text -->
      <div class="compliment-text">
        {{ gameStore.currentLevelData?.compliment || 'Başarılar!' }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.model-panel {
  flex: 0 0 25%;
  background: linear-gradient(135deg, rgba(0, 86, 59, 0.4) 0%, rgba(26, 122, 88, 0.3) 100%);
  border-left: 3px solid rgba(255, 215, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  backdrop-filter: blur(5px);
}

.panel-content {
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
}

/* Model Header */
.model-header {
  text-align: center;
  color: white;
}

.model-header h3 {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 0.3rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.outfit-name {
  font-size: 1rem;
  opacity: 0.9;
  font-weight: 600;
  color: #FFD700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Model Display */
.model-display {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  position: relative;
}

.model-avatar {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.avatar-circle {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: modelPulse 3s infinite;
}

@keyframes modelPulse {
  0%, 100% {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
  50% {
    box-shadow: 0 10px 40px rgba(255, 215, 0, 0.5);
  }
}

.avatar-initial {
  font-size: 4rem;
  font-weight: 800;
  color: #2C3E50;
}

/* Level Badge */
.level-badge {
  background: rgba(0, 0, 0, 0.5);
  padding: 0.8rem 1.2rem;
  border-radius: 20px;
  border: 2px solid rgba(255, 215, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  backdrop-filter: blur(10px);
}

.level-number {
  color: #FFD700;
  font-size: 1.5rem;
  font-weight: 800;
}

.level-stars {
  font-size: 0.9rem;
  line-height: 1;
}

/* Message Bubble */
.message-bubble {
  background: white;
  color: #2C3E50;
  padding: 1rem 1.2rem;
  border-radius: 15px;
  position: relative;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  margin: 0 0.5rem;
}

.bubble-content {
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.4;
  text-align: center;
}

.bubble-tail {
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid white;
}

/* Message Transition */
.message-enter-active,
.message-leave-active {
  transition: all 0.3s ease;
}

.message-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.message-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Stats Mini */
.stats-mini {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  background: rgba(0, 0, 0, 0.2);
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.stat-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
}

.stat-icon {
  font-size: 1.8rem;
  min-width: 35px;
  text-align: center;
}

.stat-info {
  flex: 1;
}

.stat-value {
  color: #FFD700;
  font-size: 1.3rem;
  font-weight: 800;
  line-height: 1;
}

.stat-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-top: 0.2rem;
}

/* Compliment Text */
.compliment-text {
  text-align: center;
  color: #FFD700;
  font-size: 1.2rem;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  padding: 0.8rem;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 10px;
  border: 2px solid rgba(255, 215, 0, 0.3);
  animation: complimentPulse 2s infinite;
}

@keyframes complimentPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .model-panel {
    flex: 0 0 30%;
  }

  .avatar-circle {
    width: 120px;
    height: 120px;
  }

  .avatar-initial {
    font-size: 3rem;
  }

  .model-header h3 {
    font-size: 1.2rem;
  }

  .stat-icon {
    font-size: 1.5rem;
  }

  .stat-value {
    font-size: 1.1rem;
  }

  .compliment-text {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .model-panel {
    display: none;
  }
}

/* Scrollbar */
.model-panel::-webkit-scrollbar {
  width: 6px;
}

.model-panel::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

.model-panel::-webkit-scrollbar-thumb {
  background: rgba(255, 215, 0, 0.3);
  border-radius: 3px;
}

.model-panel::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 215, 0, 0.5);
}
</style>
