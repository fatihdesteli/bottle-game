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
   * Generate random X position ensuring minimum distance from other positions
   */
  const getRandomXWithSpacing = (existingPositions = [], minDistance = 15) => {
    let attempts = 0
    let x = getRandomX()

    // Try to find a position with adequate spacing
    while (attempts < 10) {
      const hasGoodSpacing = existingPositions.every(pos => Math.abs(pos - x) >= minDistance)
      if (hasGoodSpacing) {
        return x
      }
      x = getRandomX()
      attempts++
    }

    // If we can't find a good position after 10 attempts, just return the last one
    return x
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
  const createBottle = (xPosition = null) => {
    const bottle = {
      id: nextBottleId.value++,
      x: xPosition !== null ? xPosition : getRandomX(),
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
        // Level 5+ (index 4+): spawn 3 bottles
        // Level 1-4: spawn 2 bottles
        const shouldSpawnTriple = gameStore.currentLevel >= 4
        const bottleCount = shouldSpawnTriple ? 3 : 2

        // Track X positions for spacing
        const positions = []

        // Spawn bottles with proper spacing
        for (let i = 0; i < bottleCount; i++) {
          setTimeout(() => {
            if (gameStore.gameState === 'playing') {
              const xPos = getRandomXWithSpacing(positions, 15)
              positions.push(xPos)
              const bottle = createBottle(xPos)
              onSpawn(bottle)
            }
          }, i * 250) // 250ms delay between each bottle
        }
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
