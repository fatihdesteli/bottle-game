<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()

const progressPercentage = computed(() => {
  return Math.min(100, gameStore.progress)
})
</script>

<template>
  <div class="score-board">
    <!-- Top Row: Lives and Score -->
    <div class="top-row">
      <!-- Lives -->
      <div class="lives">
        <span
          v-for="i in 3"
          :key="i"
          class="heart"
          :class="{ empty: i > gameStore.lives }"
        >
          {{ i <= gameStore.lives ? '❤️' : '🖤' }}
        </span>
      </div>

      <!-- Score -->
      <div class="score">
        <div class="score-label">Skor</div>
        <div class="score-value">{{ gameStore.score.toLocaleString('tr-TR') }}</div>
      </div>
    </div>

    <!-- Level Progress Bar -->
    <div class="level-section">
      <div class="level-info">
        <span class="level-label">Seviye {{ gameStore.currentLevel + 1 }}</span>
        <span class="level-name">{{ gameStore.currentLevelData?.outfit }}</span>
      </div>

      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: `${progressPercentage}%` }"
        >
          <span v-if="progressPercentage > 20" class="progress-text">
            {{ Math.round(progressPercentage) }}%
          </span>
        </div>
      </div>

      <div class="next-level-info" v-if="gameStore.currentLevel < 5">
        <span>{{ gameStore.currentLevelData?.message }}</span>
      </div>
      <div class="max-level-info" v-else>
        <span>🏆 SON SEVİYE! 🏆</span>
      </div>
    </div>

    <!-- Combo Counter -->
    <div v-if="gameStore.combo > 0" class="combo-counter" :class="{ mega: gameStore.combo >= 5 }">
      <span class="combo-icon">🔥</span>
      <span class="combo-text">{{ gameStore.combo }}x COMBO!</span>
    </div>

    <!-- Active Power-ups -->
    <div v-if="Object.values(gameStore.activePowerUps).some(p => p)" class="active-powerups">
      <div v-if="gameStore.activePowerUps.slowMotion" class="powerup-badge slow">
        ⏱ Slow Motion
      </div>
      <div v-if="gameStore.activePowerUps.widerBox" class="powerup-badge wider">
        📦 Geniş Kasa
      </div>
      <div v-if="gameStore.activePowerUps.shield" class="powerup-badge shield">
        🛡️ Kalkan
      </div>
    </div>
  </div>
</template>

<style scoped>
.score-board {
  padding: 0.8rem;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 100%);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

/* Top Row */
.top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Lives */
.lives {
  display: flex;
  gap: 0.3rem;
  font-size: 1.8rem;
}

.heart {
  transition: all 0.3s ease;
  display: inline-block;
  animation: heartbeat 1s infinite;
}

.heart.empty {
  opacity: 0.3;
  animation: none;
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* Score */
.score {
  text-align: right;
}

.score-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.score-value {
  color: #FFD700;
  font-size: 2rem;
  font-weight: 800;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  line-height: 1;
}

/* Level Section */
.level-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.level-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  font-size: 0.9rem;
  font-weight: 700;
}

.level-label {
  background: rgba(255, 215, 0, 0.2);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 215, 0, 0.3);
  color: #FFD700;
}

.level-name {
  text-transform: capitalize;
  opacity: 0.8;
}

/* Progress Bar */
.progress-bar {
  height: 30px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.2);
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #FFD700 0%, #FFA500 100%);
  border-radius: 13px;
  transition: width 0.5s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  position: relative;
  overflow: hidden;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.progress-text {
  color: #2C3E50;
  font-weight: 800;
  font-size: 0.9rem;
  z-index: 1;
}

/* Next Level Info */
.next-level-info,
.max-level-info {
  text-align: center;
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  opacity: 0.9;
}

.max-level-info {
  color: #FFD700;
  font-size: 1rem;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.9; }
  50% { opacity: 1; transform: scale(1.02); }
}

/* Combo Counter */
.combo-counter {
  background: linear-gradient(135deg, rgba(255, 68, 0, 0.8) 0%, rgba(255, 140, 0, 0.8) 100%);
  padding: 0.25rem 0.6rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  border: 2px solid rgba(255, 215, 0, 0.5);
  animation: comboPopIn 0.3s ease;
}

@keyframes comboPopIn {
  0% {
    transform: scale(0);
  }
  60% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1);
  }
}

.combo-counter.mega {
  animation: comboShake 0.5s infinite;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
}

@keyframes comboShake {
  0%, 100% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(-2deg) scale(1.05); }
  75% { transform: rotate(2deg) scale(1.05); }
}

.combo-icon {
  font-size: 1rem;
  animation: spin 0.5s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.combo-text {
  color: white;
  font-weight: 800;
  font-size: 0.8rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

/* Active Power-ups */
.active-powerups {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.powerup-badge {
  padding: 0.4rem 0.8rem;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  animation: powerupPulse 1s infinite;
}

@keyframes powerupPulse {
  0%, 100% { opacity: 0.9; }
  50% { opacity: 1; }
}

.powerup-badge.slow {
  background: rgba(100, 149, 237, 0.7);
  border: 2px solid rgba(100, 149, 237, 0.9);
}

.powerup-badge.wider {
  background: rgba(50, 205, 50, 0.7);
  border: 2px solid rgba(50, 205, 50, 0.9);
}

.powerup-badge.shield {
  background: rgba(138, 43, 226, 0.7);
  border: 2px solid rgba(138, 43, 226, 0.9);
}

/* Responsive */
@media (max-width: 480px) {
  .score-board {
    padding: 0.3rem 0.4rem;
    gap: 0.25rem;
  }

  .lives {
    font-size: 1.1rem;
    gap: 0.1rem;
  }

  .score-label {
    font-size: 0.6rem;
  }

  .score-value {
    font-size: 1.2rem;
  }

  .progress-bar {
    height: 16px;
  }

  .level-info {
    font-size: 0.7rem;
  }

  .level-label {
    padding: 0.15rem 0.5rem;
  }

  .next-level-info,
  .max-level-info {
    font-size: 0.65rem;
  }

  .combo-counter {
    padding: 0.15rem 0.4rem;
  }

  .combo-icon {
    font-size: 0.8rem;
  }

  .combo-text {
    font-size: 0.6rem;
  }

  .powerup-badge {
    padding: 0.2rem 0.4rem;
    font-size: 0.65rem;
  }
}
</style>
