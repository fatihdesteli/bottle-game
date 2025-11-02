<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useGameStore } from '@/stores/game'
import { useSound } from '@/composables/useSound'
import { useBottleSpawner } from '@/composables/useBottleSpawner'
import { useGameLoop } from '@/composables/useGameLoop'
import { useCollision } from '@/composables/useCollision'
import ScoreBoard from './ScoreBoard.vue'
import CollectionBox from './CollectionBox.vue'
import ModelPanel from './ModelPanel.vue'
import BottleItem from './BottleItem.vue'

const gameStore = useGameStore()
const sound = useSound()
const spawner = useBottleSpawner()
const gameLoop = useGameLoop()
const collision = useCollision()

const showPauseMenu = ref(false)
const bottles = ref([])
const collectionBoxRef = ref(null)

// Watch for level changes to play sound
let previousLevel = gameStore.currentLevel
watch(() => gameStore.currentLevel, (newLevel) => {
  if (newLevel > previousLevel) {
    sound.playLevelUpSound()
    previousLevel = newLevel
  }
})

// Watch for game over
watch(() => gameStore.isGameOver, (isGameOver) => {
  if (isGameOver) {
    stopGame()
    gameStore.endGame()
  }
})

const togglePause = () => {
  if (gameStore.gameState === 'playing') {
    gameStore.pauseGame()
    showPauseMenu.value = true
    sound.pauseBackgroundMusic()
    gameLoop.stopLoop()
    spawner.stopSpawning()
  } else if (gameStore.gameState === 'paused') {
    gameStore.resumeGame()
    showPauseMenu.value = false
    sound.resumeBackgroundMusic()
    startGame()
  }
}

const quitGame = () => {
  if (confirm('Oyundan çıkmak istediğinize emin misiniz?')) {
    stopGame()
    sound.stopBackgroundMusic()
    gameStore.resetGame()
  }
}

const resumeGame = () => {
  gameStore.resumeGame()
  showPauseMenu.value = false
  sound.resumeBackgroundMusic()
  startGame()
}

// Handle bottle spawn
const handleBottleSpawn = (bottle) => {
  bottles.value.push(bottle)
}

// Handle bottle caught
const handleBottleCatch = (bottle, isPerfect) => {
  // Play appropriate sound
  if (bottle.isGolden) {
    sound.playGoldenSound()
  } else if (isPerfect) {
    sound.playCatchSound()
    // Could add a different sound for perfect catch
  } else {
    sound.playCatchSound()
  }
}

// Handle bottle missed (fell off screen)
const handleBottleMiss = () => {
  sound.playMissSound()
  gameStore.loseLife()
}

// Game loop update callback
const handleGameUpdate = () => {
  // Check collisions if collection box is available
  if (collectionBoxRef.value && collectionBoxRef.value.getPosition) {
    const boxPosition = collectionBoxRef.value.getPosition()
    bottles.value = collision.checkAllCollisions(
      bottles.value,
      boxPosition,
      handleBottleCatch
    )
  }
}

// Start the game
const startGame = () => {
  bottles.value = []

  // Start spawning bottles
  spawner.startSpawning(handleBottleSpawn)

  // Start game loop
  gameLoop.startLoop(bottles, handleGameUpdate, handleBottleMiss)
}

// Stop the game
const stopGame = () => {
  spawner.stopSpawning()
  gameLoop.stopLoop()
}

// Initialize game when component mounts
onMounted(() => {
  startGame()
})

// Cleanup when component unmounts
onUnmounted(() => {
  stopGame()
  sound.stopBackgroundMusic()
})
</script>

<template>
  <div class="game-board">
    <!-- Game Area (75%) -->
    <div class="game-area">
      <!-- Score Board -->
      <ScoreBoard />

      <!-- Game Canvas -->
      <div class="game-canvas">
        <!-- Bottles will be rendered here -->
        <BottleItem
          v-for="bottle in bottles"
          :key="bottle.id"
          :bottle="bottle"
        />

        <!-- Collection Box -->
        <CollectionBox ref="collectionBoxRef" />
      </div>

      <!-- Pause Button -->
      <button class="pause-btn" @click="togglePause">
        {{ gameStore.gameState === 'paused' ? '▶' : '⏸' }}
      </button>
    </div>

    <!-- Model Panel (25%) -->
    <ModelPanel />

    <!-- Pause Menu -->
    <div v-if="showPauseMenu" class="pause-overlay" @click="resumeGame">
      <div class="pause-menu" @click.stop>
        <h2>⏸ Oyun Duraklatıldı</h2>

        <div class="pause-buttons">
          <button class="btn-resume" @click="resumeGame">
            <span>▶</span>
            Devam Et
          </button>

          <button class="btn-settings" @click="gameStore.toggleSound">
            <span>{{ gameStore.soundEnabled ? '🔊' : '🔇' }}</span>
            Ses: {{ gameStore.soundEnabled ? 'Açık' : 'Kapalı' }}
          </button>

          <button class="btn-settings" @click="gameStore.toggleMusic">
            <span>{{ gameStore.musicEnabled ? '🎵' : '🎵' }}</span>
            Müzik: {{ gameStore.musicEnabled ? 'Açık' : 'Kapalı' }}
          </button>

          <button class="btn-quit" @click="quitGame">
            <span>🚪</span>
            Ana Menüye Dön
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-board {
  width: 100%;
  height: 100vh;
  display: flex;
  overflow: hidden;
  background: transparent;
}

/* Game Area (75%) */
.game-area {
  flex: 0 0 75%;
  display: flex;
  flex-direction: column;
  position: relative;
  background: linear-gradient(180deg, rgba(0, 86, 59, 0.3) 0%, rgba(0, 86, 59, 0.1) 100%);
}

/* Game Canvas */
.game-canvas {
  flex: 1;
  position: relative;
  overflow: hidden;
}

/* Pause Button */
.pause-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  z-index: 100;
}

.pause-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.pause-btn:active {
  transform: scale(0.95);
}

/* Test Button (temporary) */
.test-btn {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.8rem 1.5rem;
  background: rgba(255, 215, 0, 0.8);
  border: 2px solid #FFD700;
  border-radius: 10px;
  color: #2C3E50;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 50;
}

.test-btn:hover {
  background: rgba(255, 215, 0, 1);
  transform: translateX(-50%) scale(1.05);
}

/* Pause Overlay */
.pause-overlay {
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
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.pause-menu {
  background: linear-gradient(135deg, #00563B 0%, #1a7a58 100%);
  border-radius: 20px;
  padding: 2.5rem 2rem;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.1);
  animation: slideDown 0.3s ease;
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

.pause-menu h2 {
  color: white;
  font-size: 2rem;
  text-align: center;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.pause-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.pause-buttons button {
  padding: 1.2rem 1.5rem;
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  transition: all 0.3s ease;
}

.pause-buttons button span {
  font-size: 1.3rem;
}

.btn-resume {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: #2C3E50;
}

.btn-resume:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 215, 0, 0.4);
}

.btn-settings {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

.btn-settings:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.btn-quit {
  background: rgba(220, 38, 38, 0.3);
  color: white;
  border-color: rgba(220, 38, 38, 0.4);
}

.btn-quit:hover {
  background: rgba(220, 38, 38, 0.5);
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .game-area {
    flex: 0 0 100%;
  }

  .pause-btn {
    width: 42px;
    height: 42px;
    font-size: 1.1rem;
    top: 0.7rem;
    right: 0.7rem;
  }
}

@media (max-width: 480px) {
  .game-board {
    height: 100vh;
    height: 100dvh;
  }

  .pause-btn {
    width: 36px;
    height: 36px;
    font-size: 0.95rem;
    top: 0.3rem;
    right: 0.3rem;
  }

  .pause-menu {
    padding: 1.3rem 1rem;
  }

  .pause-menu h2 {
    font-size: 1.4rem;
  }

  .pause-buttons button {
    padding: 0.85rem 1rem;
    font-size: 0.9rem;
  }
}

/* Landscape mode */
@media (max-height: 600px) {
  .pause-menu {
    max-height: 90vh;
    overflow-y: auto;
  }
}
</style>
