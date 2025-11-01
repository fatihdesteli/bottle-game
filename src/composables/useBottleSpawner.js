import { ref } from 'vue'
import { useGameStore } from '@/stores/game'
import { GAME_CONFIG } from '@/data/gameConfig.js'

/**
 * Bottle Spawner Composable
 * Manages bottle spawning logic
 */
export function useBottleSpawner() {
  const gameStore = useGameStore()
  const spawnTimer = ref(null)
  const nextBottleId = ref(0)

  /**
   * Calculate spawn interval based on current level
   */
  const getSpawnInterval = () => {
    const levelData = gameStore.currentLevelData
    if (!levelData) return 1500
    return levelData.spawnInterval
  }

  /**
   * Generate random X position for bottle (5% to 70% of game area width)
   */
  const getRandomX = () => {
    return Math.random() * 65 + 5
  }

  /**
   * Check if bottle should be golden
   */
  const isGoldenBottle = () => {
    return Math.random() < GAME_CONFIG.GOLDEN_BOTTLE_CHANCE
  }

  /**
   * Create a new bottle object
   */
  const createBottle = () => {
    const bottle = {
      id: nextBottleId.value++,
      x: getRandomX(),
      y: -100, // Start above the screen
      isGolden: isGoldenBottle(),
      velocity: 0 // Will be set by game loop
    }
    return bottle
  }

  /**
   * Start spawning bottles
   */
  const startSpawning = (onSpawn) => {
    stopSpawning() // Clear any existing timer

    const spawn = () => {
      if (gameStore.gameState === 'playing') {
        const bottle = createBottle()
        onSpawn(bottle)
      }

      // Schedule next spawn
      const interval = getSpawnInterval()
      spawnTimer.value = setTimeout(spawn, interval)
    }

    // Start first spawn after a small delay
    spawnTimer.value = setTimeout(spawn, 1000)
  }

  /**
   * Stop spawning bottles
   */
  const stopSpawning = () => {
    if (spawnTimer.value) {
      clearTimeout(spawnTimer.value)
      spawnTimer.value = null
    }
  }

  return {
    startSpawning,
    stopSpawning,
    createBottle
  }
}
