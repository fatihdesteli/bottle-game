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

  // Golden bottle tracking: one per level
  let currentLevelForGolden = 0
  let bottleCountInLevel = 0
  let goldenBottleSpawned = false
  let goldenBottleTarget = Math.floor(Math.random() * 10) + 15 // Random between 15-25 bottles

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
   * Only one golden bottle per level
   */
  const isGoldenBottle = () => {
    // Check if level changed, reset counters
    if (gameStore.currentLevel !== currentLevelForGolden) {
      currentLevelForGolden = gameStore.currentLevel
      bottleCountInLevel = 0
      goldenBottleSpawned = false
      goldenBottleTarget = Math.floor(Math.random() * 10) + 15 // Random between 15-25 bottles
    }

    bottleCountInLevel++

    // Spawn one golden bottle per level after reaching target count
    if (!goldenBottleSpawned && bottleCountInLevel >= goldenBottleTarget) {
      goldenBottleSpawned = true
      return true
    }

    return false
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
          }, i * 500) // 500ms (0.5s) delay between each bottle
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
