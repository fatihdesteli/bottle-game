<script setup>
import { computed, ref, onMounted } from 'vue'
import { useGameStore } from '@/stores/game'
import { useSound } from '@/composables/useSound'
import { ACHIEVEMENTS } from '@/data/gameConfig.js'

const gameStore = useGameStore()
const sound = useSound()
const showStats = ref(true)

// Play game over sound when component mounts
onMounted(() => {
  sound.playGameOverSound()
})

const playAgain = () => {
  gameStore.resetGame()
  gameStore.gameState = 'model-selection'
}

const backToMenu = () => {
  gameStore.resetGame()
}

const isHighScore = computed(() => {
  if (gameStore.highScores.length === 0) return true
  return gameStore.highScores[0].score <= gameStore.score
})

const rank = computed(() => {
  const sorted = [...gameStore.highScores, { score: gameStore.score }]
    .sort((a, b) => b.score - a.score)
  return sorted.findIndex(s => s.score === gameStore.score) + 1
})

const newAchievements = computed(() => {
  // This would normally be tracked during the game
  // For now, just show all unlocked achievements
  return ACHIEVEMENTS.filter(a =>
    gameStore.unlockedAchievements.includes(a.id)
  ).slice(-3) // Show last 3
})

const stats = computed(() => [
  { icon: '🍾', label: 'Toplanan Şişe', value: gameStore.bottlesCollected },
  { icon: '⭐', label: 'Altın Şişe', value: gameStore.goldenBottlesCollected },
  { icon: '🔥', label: 'En Yüksek Combo', value: gameStore.maxCombo },
  { icon: '💎', label: 'Perfect Catch', value: gameStore.perfectCatches },
  { icon: '⏱', label: 'Süre', value: `${Math.floor(gameStore.gameTime / 60)}:${String(gameStore.gameTime % 60).padStart(2, '0')}` },
  { icon: '📊', label: 'Seviye', value: gameStore.currentLevel + 1 }
])
</script>

<template>
  <div class="game-over">
    <div class="game-over-container">
      <!-- Confetti Effect (if high score) -->
      <div v-if="isHighScore" class="confetti">
        <div class="confetti-piece" v-for="i in 50" :key="i"></div>
      </div>

      <!-- Header -->
      <div class="header">
        <h1 class="game-over-title">{{ isHighScore ? '🎉 YENİ REKOR! 🎉' : 'Oyun Bitti!' }}</h1>
        <div class="model-info">
          <span class="model-name">{{ gameStore.currentModelData?.name }}</span>
          <span class="separator">•</span>
          <span class="rank-badge">
            {{ rank }}. Sıra
          </span>
        </div>
      </div>

      <!-- Final Score -->
      <div class="final-score">
        <div class="score-label">Final Skor</div>
        <div class="score-value">{{ gameStore.score.toLocaleString('tr-TR') }}</div>
      </div>

      <!-- Stats Tabs -->
      <div class="tabs">
        <button
          class="tab"
          :class="{ active: showStats }"
          @click="showStats = true"
        >
          📊 İstatistikler
        </button>
        <button
          class="tab"
          :class="{ active: !showStats }"
          @click="showStats = false"
        >
          🏆 Sıralama
        </button>
      </div>

      <!-- Content Area -->
      <div class="content-area">
        <!-- Statistics View -->
        <div v-if="showStats" class="stats-view">
          <div class="stats-grid">
            <div
              v-for="stat in stats"
              :key="stat.label"
              class="stat-card"
            >
              <div class="stat-icon">{{ stat.icon }}</div>
              <div class="stat-details">
                <div class="stat-value">{{ stat.value }}</div>
                <div class="stat-label">{{ stat.label }}</div>
              </div>
            </div>
          </div>

          <!-- New Achievements -->
          <div v-if="newAchievements.length > 0" class="new-achievements">
            <h3>🎖 Yeni Başarımlar</h3>
            <div class="achievements-list">
              <div
                v-for="achievement in newAchievements"
                :key="achievement.id"
                class="achievement-item"
              >
                <span class="achievement-icon">{{ achievement.icon }}</span>
                <div class="achievement-text">
                  <div class="achievement-name">{{ achievement.name }}</div>
                  <div class="achievement-desc">{{ achievement.description }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Leaderboard View -->
        <div v-else class="leaderboard-view">
          <div class="leaderboard-list">
            <div
              v-for="(score, index) in gameStore.highScores.slice(0, 10)"
              :key="index"
              class="leaderboard-item"
              :class="{ highlight: score.score === gameStore.score && index < 10 }"
            >
              <div class="rank">
                <span v-if="index < 3" class="medal">
                  {{ index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉' }}
                </span>
                <span v-else class="rank-number">{{ index + 1 }}</span>
              </div>
              <div class="player-info">
                <div class="player-score">{{ score.score.toLocaleString('tr-TR') }}</div>
                <div class="player-details">
                  Lvl {{ score.level }} • {{ new Date(score.date).toLocaleDateString('tr-TR') }}
                </div>
              </div>
            </div>

            <div v-if="gameStore.highScores.length === 0" class="empty-leaderboard">
              <p>İlk rekoru sen koy!</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button class="btn-play-again" @click="playAgain">
          <span class="btn-icon">🔄</span>
          Tekrar Oyna
        </button>
        <button class="btn-menu" @click="backToMenu">
          <span class="btn-icon">🏠</span>
          Ana Menü
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-over {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  overflow-y: auto;
  position: relative;
}

.game-over-container {
  max-width: 600px;
  width: 100%;
  background: linear-gradient(135deg, rgba(0, 86, 59, 0.95) 0%, rgba(26, 122, 88, 0.95) 100%);
  border-radius: 25px;
  padding: 2rem;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.5);
  border: 3px solid rgba(255, 215, 0, 0.3);
  animation: slideIn 0.6s ease;
  position: relative;
  overflow: hidden;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Confetti */
.confetti {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
}

.confetti-piece {
  position: absolute;
  width: 10px;
  height: 10px;
  background: #FFD700;
  top: -10px;
  opacity: 0;
  animation: confettiFall 3s linear infinite;
}

.confetti-piece:nth-child(odd) {
  background: #FFA500;
}

.confetti-piece:nth-child(3n) {
  background: #FF6347;
}

@keyframes confettiFall {
  0% {
    opacity: 1;
    top: -10px;
    transform: translateX(0) rotate(0deg);
  }
  100% {
    opacity: 0;
    top: 100%;
    transform: translateX(100px) rotate(360deg);
  }
}

.confetti-piece:nth-child(1) { left: 10%; animation-delay: 0s; }
.confetti-piece:nth-child(2) { left: 20%; animation-delay: 0.2s; }
.confetti-piece:nth-child(3) { left: 30%; animation-delay: 0.4s; }
.confetti-piece:nth-child(4) { left: 40%; animation-delay: 0.6s; }
.confetti-piece:nth-child(5) { left: 50%; animation-delay: 0.8s; }
.confetti-piece:nth-child(6) { left: 60%; animation-delay: 1s; }
.confetti-piece:nth-child(7) { left: 70%; animation-delay: 1.2s; }
.confetti-piece:nth-child(8) { left: 80%; animation-delay: 1.4s; }
.confetti-piece:nth-child(9) { left: 90%; animation-delay: 1.6s; }

/* Header */
.header {
  text-align: center;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 2;
}

.game-over-title {
  font-size: 2.5rem;
  font-weight: 900;
  color: white;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5);
  margin-bottom: 0.5rem;
  animation: titleBounce 0.8s ease;
}

@keyframes titleBounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.model-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  font-weight: 600;
}

.separator {
  opacity: 0.5;
}

.rank-badge {
  background: rgba(255, 215, 0, 0.2);
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  border: 1px solid rgba(255, 215, 0, 0.4);
  color: #FFD700;
}

/* Final Score */
.final-score {
  background: rgba(0, 0, 0, 0.3);
  padding: 1.5rem;
  border-radius: 20px;
  text-align: center;
  margin-bottom: 1.5rem;
  border: 2px solid rgba(255, 215, 0, 0.3);
  position: relative;
  z-index: 2;
}

.score-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.score-value {
  color: #FFD700;
  font-size: 3.5rem;
  font-weight: 900;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5);
  line-height: 1;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  position: relative;
  z-index: 2;
}

.tab {
  flex: 1;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab:hover {
  background: rgba(255, 255, 255, 0.15);
}

.tab.active {
  background: rgba(255, 215, 0, 0.2);
  border-color: rgba(255, 215, 0, 0.5);
  color: #FFD700;
}

/* Content Area */
.content-area {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  min-height: 300px;
  max-height: 400px;
  overflow-y: auto;
  position: relative;
  z-index: 2;
}

/* Stats View */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  transition: all 0.3s ease;
}

.stat-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 2rem;
}

.stat-details {
  flex: 1;
}

.stat-value {
  color: #FFD700;
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1;
}

.stat-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 0.2rem;
}

/* New Achievements */
.new-achievements {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid rgba(255, 215, 0, 0.2);
}

.new-achievements h3 {
  color: #FFD700;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  text-align: center;
}

.achievements-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.achievement-item {
  background: rgba(255, 215, 0, 0.1);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 10px;
  padding: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  animation: achievementPop 0.5s ease;
}

@keyframes achievementPop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  60% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.achievement-icon {
  font-size: 2rem;
}

.achievement-text {
  flex: 1;
  color: white;
}

.achievement-name {
  font-size: 1rem;
  font-weight: 700;
}

.achievement-desc {
  font-size: 0.85rem;
  opacity: 0.8;
  margin-top: 0.2rem;
}

/* Leaderboard View */
.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.leaderboard-item {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.leaderboard-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(5px);
}

.leaderboard-item.highlight {
  background: rgba(255, 215, 0, 0.2);
  border-color: rgba(255, 215, 0, 0.5);
}

.rank {
  min-width: 40px;
  text-align: center;
}

.medal {
  font-size: 2rem;
}

.rank-number {
  color: #FFD700;
  font-size: 1.5rem;
  font-weight: 800;
}

.player-info {
  flex: 1;
}

.player-score {
  color: #FFD700;
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1;
}

.player-details {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
  margin-top: 0.3rem;
}

.empty-leaderboard {
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  padding: 3rem 1rem;
  font-size: 1.2rem;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 1rem;
  position: relative;
  z-index: 2;
}

.btn-play-again,
.btn-menu {
  flex: 1;
  padding: 1.2rem;
  border: none;
  border-radius: 15px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-play-again {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: #2C3E50;
  box-shadow: 0 5px 20px rgba(255, 215, 0, 0.4);
}

.btn-play-again:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(255, 215, 0, 0.6);
}

.btn-menu {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.btn-menu:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.btn-icon {
  font-size: 1.3rem;
}

/* Scrollbar */
.content-area::-webkit-scrollbar {
  width: 8px;
}

.content-area::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.content-area::-webkit-scrollbar-thumb {
  background: rgba(255, 215, 0, 0.3);
  border-radius: 10px;
}

/* Responsive */
@media (max-width: 480px) {
  .game-over-container {
    padding: 1.5rem;
  }

  .game-over-title {
    font-size: 2rem;
  }

  .score-value {
    font-size: 2.5rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
