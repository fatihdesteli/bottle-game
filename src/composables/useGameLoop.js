import { ref } from 'vue'
import { useGameStore } from '@/stores/game'

/**
 * Game Loop Composable
 * Manages the main game loop using requestAnimationFrame
 */
export function useGameLoop() {
  const gameStore = useGameStore()
  const animationFrameId = ref(null)
  const lastTime = ref(0)
  const gameAreaHeight = ref(0)

  /**
   * Calculate bottle speed based on current level
   */
  const getBottleSpeed = () => {
    const levelData = gameStore.currentLevelData
    if (!levelData) return 2

    let speed = levelData.bottleSpeed

    // Apply slow motion power-up
    if (gameStore.activePowerUps.slowMotion) {
      speed *= 0.5
    }

    return speed
  }

  /**
   * Update bottle positions
   */
  const updateBottles = (bottles, deltaTime) => {
    if (!gameAreaHeight.value) {
      // Get game area height from DOM
      const gameArea = document.querySelector('.game-canvas')
      if (gameArea) {
        gameAreaHeight.value = gameArea.clientHeight
      }
    }

    const speed = getBottleSpeed()
    const pixelsPerFrame = speed // pixels per frame at 60fps

    bottles.forEach(bottle => {
      // Update Y position
      bottle.y += pixelsPerFrame
    })

    // Remove bottles that fell off screen
    return bottles.filter(bottle => bottle.y < gameAreaHeight.value + 100)
  }

  /**
   * Main game loop
   */
  const gameLoop = (currentTime, bottles, onUpdate, onBottleMissed) => {
    if (gameStore.gameState !== 'playing') {
      return
    }

    // Calculate delta time (in case of frame drops)
    const deltaTime = currentTime - lastTime.value
    lastTime.value = currentTime

    // Count bottles before update
    const bottleCountBefore = bottles.value.length

    // Update bottle positions
    bottles.value = updateBottles(bottles.value, deltaTime)

    // Count bottles after update (check if any were removed)
    const bottleCountAfter = bottles.value.length
    const bottlesRemoved = bottleCountBefore - bottleCountAfter

    // If bottles were removed (fell off screen), trigger miss callback
    if (bottlesRemoved > 0 && onBottleMissed) {
      // Call onBottleMissed for each bottle that fell
      for (let i = 0; i < bottlesRemoved; i++) {
        onBottleMissed()
      }
    }

    // Trigger update callback
    if (onUpdate) {
      onUpdate(bottles.value)
    }

    // Schedule next frame
    animationFrameId.value = requestAnimationFrame((time) => {
      gameLoop(time, bottles, onUpdate, onBottleMissed)
    })
  }

  /**
   * Start the game loop
   */
  const startLoop = (bottles, onUpdate, onBottleMissed) => {
    stopLoop() // Stop any existing loop
    lastTime.value = performance.now()
    animationFrameId.value = requestAnimationFrame((time) => {
      gameLoop(time, bottles, onUpdate, onBottleMissed)
    })
  }

  /**
   * Stop the game loop
   */
  const stopLoop = () => {
    if (animationFrameId.value) {
      cancelAnimationFrame(animationFrameId.value)
      animationFrameId.value = null
    }
  }

  return {
    startLoop,
    stopLoop
  }
}
