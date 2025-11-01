<script setup>
import { ref, onMounted } from 'vue'
import { useGameStore } from '@/stores/game'
import { useSound } from '@/composables/useSound'

const gameStore = useGameStore()
const sound = useSound()
const showHighScores = ref(false)
const showAchievements = ref(false)

// Initialize sounds on mount
onMounted(() => {
  sound.initSounds()
})

const startGame = () => {
  // Play a test sound and start background music when user clicks
  sound.playCatchSound()
  sound.playBackgroundMusic()
  gameStore.gameState = 'model-selection'
}

const toggleHighScores = () => {
  showHighScores.value = !showHighScores.value
  if (showHighScores.value) showAchievements.value = false
}

const toggleAchievements = () => {
  showAchievements.value = !showAchievements.value
  if (showAchievements.value) showHighScores.value = false
}
</script>

<template>
  <div class="menu-screen">
    <div class="menu-container">
      <!-- Logo/Title -->
      <div class="game-title">
        <div class="bottle-icon">🍾</div>
        <h1>Şişe Toplama<br>Oyunu</h1>
        <p class="subtitle">Hızını göster, şişeleri topla!</p>
      </div>

      <!-- Main Menu Buttons -->
      <div class="menu-buttons">
        <button class="btn-primary pulse" @click="startGame">
          <span class="btn-icon">🎮</span>
          Oyuna Başla
        </button>

        <button class="btn-secondary" @click="toggleHighScores">
          <span class="btn-icon">🏆</span>
          En Yüksek Skorlar
        </button>

        <button class="btn-secondary" @click="toggleAchievements">
          <span class="btn-icon">⭐</span>
          Başarımlar
        </button>
      </div>

      <!-- Settings -->
      <div class="settings">
        <button
          class="setting-btn"
          @click="gameStore.toggleSound"
          :class="{ active: gameStore.soundEnabled }"
        >
          <span>{{ gameStore.soundEnabled ? '🔊' : '🔇' }}</span>
          Ses
        </button>

        <button
          class="setting-btn"
          @click="gameStore.toggleMusic"
          :class="{ active: gameStore.musicEnabled }"
        >
          <span>{{ gameStore.musicEnabled ? '🎵' : '🎵' }}</span>
          Müzik
        </button>
      </div>
    </div>

    <!-- High Scores Modal -->
    <div v-if="showHighScores" class="modal" @click="showHighScores = false">
      <div class="modal-content" @click.stop>
        <h2>🏆 En Yüksek Skorlar</h2>
        <div v-if="gameStore.highScores.length === 0" class="empty-state">
          <p>Henüz kayıtlı skor yok!</p>
          <p>İlk oyunu oyna ve listede yerini al!</p>
        </div>
        <div v-else class="high-scores-list">
          <div
            v-for="(score, index) in gameStore.highScores"
            :key="index"
            class="score-item"
          >
            <span class="rank">{{ index + 1 }}.</span>
            <span class="score">{{ score.score }}</span>
            <span class="level">Lvl {{ score.level }}</span>
            <span class="date">{{ new Date(score.date).toLocaleDateString('tr-TR') }}</span>
          </div>
        </div>
        <button class="btn-close" @click="showHighScores = false">Kapat</button>
      </div>
    </div>

    <!-- Achievements Modal -->
    <div v-if="showAchievements" class="modal" @click="showAchievements = false">
      <div class="modal-content" @click.stop>
        <h2>⭐ Başarımlar</h2>
        <div class="achievements-grid">
          <div
            v-for="achievement in $options.ACHIEVEMENTS"
            :key="achievement.id"
            class="achievement-card"
            :class="{ unlocked: gameStore.unlockedAchievements.includes(achievement.id) }"
          >
            <div class="achievement-icon">{{ achievement.icon }}</div>
            <div class="achievement-info">
              <h3>{{ achievement.name }}</h3>
              <p>{{ achievement.description }}</p>
            </div>
            <div v-if="gameStore.unlockedAchievements.includes(achievement.id)" class="unlocked-badge">
              ✓
            </div>
          </div>
        </div>
        <button class="btn-close" @click="showAchievements = false">Kapat</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ACHIEVEMENTS } from '@/data/gameConfig.js'

export default {
  ACHIEVEMENTS
}
</script>

<style scoped>
.menu-screen {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  position: relative;
  overflow: hidden;
}

.menu-container {
  max-width: 500px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation: slideUp 0.8s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Title Section */
.game-title {
  text-align: center;
  color: white;
}

.bottle-icon {
  font-size: 5rem;
  animation: bounce 2s infinite;
  display: inline-block;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.game-title h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 1rem 0 0.5rem;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
}

.subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  font-weight: 500;
}

/* Menu Buttons */
.menu-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-primary,
.btn-secondary {
  width: 100%;
  padding: 1.2rem 2rem;
  font-size: 1.2rem;
  font-weight: 700;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-primary {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: #2C3E50;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.5);
}

.btn-primary:active {
  transform: translateY(-1px);
}

.pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
  50% {
    box-shadow: 0 6px 25px rgba(255, 215, 0, 0.6);
  }
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.3);
}

.btn-icon {
  font-size: 1.5rem;
}

/* Settings */
.settings {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.setting-btn {
  flex: 1;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.setting-btn span {
  font-size: 1.5rem;
}

.setting-btn.active {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 215, 0, 0.5);
}

.setting-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
  padding: 1rem;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: linear-gradient(135deg, #00563B 0%, #1a7a58 100%);
  border-radius: 20px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  animation: slideDown 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-content h2 {
  color: white;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

/* High Scores List */
.empty-state {
  text-align: center;
  color: white;
  padding: 2rem;
  opacity: 0.8;
}

.empty-state p {
  margin: 0.5rem 0;
  font-size: 1.1rem;
}

.high-scores-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
}

.score-item {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;
  font-weight: 600;
}

.score-item .rank {
  font-size: 1.2rem;
  min-width: 30px;
  color: #FFD700;
}

.score-item .score {
  flex: 1;
  font-size: 1.3rem;
  color: #FFD700;
}

.score-item .level {
  font-size: 0.9rem;
  opacity: 0.8;
}

.score-item .date {
  font-size: 0.8rem;
  opacity: 0.6;
}

/* Achievements Grid */
.achievements-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.achievement-card {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  transition: all 0.3s ease;
  opacity: 0.5;
}

.achievement-card.unlocked {
  opacity: 1;
  background: rgba(255, 215, 0, 0.1);
  border-color: rgba(255, 215, 0, 0.3);
}

.achievement-icon {
  font-size: 2.5rem;
  min-width: 50px;
  text-align: center;
}

.achievement-info {
  flex: 1;
  color: white;
}

.achievement-info h3 {
  font-size: 1.1rem;
  margin: 0 0 0.3rem;
}

.achievement-info p {
  font-size: 0.9rem;
  opacity: 0.8;
  margin: 0;
}

.unlocked-badge {
  background: #FFD700;
  color: #00563B;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
}

/* Close Button */
.btn-close {
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.02);
}

/* Responsive */
@media (max-width: 480px) {
  .menu-screen {
    padding: 0;
    height: 100vh;
    height: 100dvh;
  }

  .menu-container {
    gap: 0.8rem;
    padding: 0.5rem 0.3rem;
  }

  .game-title {
    margin-bottom: -0.5rem;
  }

  .game-title h1 {
    font-size: 1.6rem;
    margin: 0.3rem 0;
  }

  .bottle-icon {
    font-size: 2.8rem;
  }

  .subtitle {
    font-size: 0.8rem;
  }

  .menu-buttons {
    gap: 0.6rem;
  }

  .btn-primary,
  .btn-secondary {
    padding: 0.8rem 1.1rem;
    font-size: 0.9rem;
  }

  .settings {
    gap: 0.6rem;
  }

  .setting-btn {
    padding: 0.65rem 0.85rem;
    font-size: 0.8rem;
  }

  .modal-content {
    padding: 0.8rem;
  }

  .modal-content h2 {
    font-size: 1.3rem;
    margin-bottom: 0.6rem;
  }
}

/* Scrollbar Styling */
.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}
</style>
