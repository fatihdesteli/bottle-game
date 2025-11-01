import { useGameStore } from '@/stores/game'
import { GAME_CONFIG } from '@/data/gameConfig.js'

/**
 * Collision Detection Composable
 * Handles collision detection between bottles and collection box
 */
export function useCollision() {
  const gameStore = useGameStore()

  /**
   * Check if a bottle collides with the collection box
   * Returns: { hit: boolean, isPerfect: boolean }
   */
  const checkCollision = (bottle, boxPosition) => {
    // Get box dimensions (percentage based)
    const baseBoxWidth = GAME_CONFIG.BOX_WIDTH
    const boxWidth = gameStore.activePowerUps.widerBox
      ? baseBoxWidth * 1.5
      : baseBoxWidth

    // Get game area width from DOM
    const gameArea = document.querySelector('.game-canvas')
    if (!gameArea) {
      return { hit: false, isPerfect: false }
    }

    const gameAreaWidth = gameArea.clientWidth
    const gameAreaHeight = gameArea.clientHeight

    // Convert percentages to pixels
    const boxWidthPx = boxWidth
    const boxHeightPx = GAME_CONFIG.BOX_HEIGHT
    const bottleWidthPx = GAME_CONFIG.BOTTLE_WIDTH
    const bottleHeightPx = GAME_CONFIG.BOTTLE_HEIGHT

    // Box position (percentage to pixels)
    const boxLeft = (boxPosition / 100) * gameAreaWidth - boxWidthPx / 2
    const boxRight = boxLeft + boxWidthPx
    const boxTop = gameAreaHeight - 140 // 40px from bottom + 100px box height
    const boxBottom = gameAreaHeight - 40

    // Bottle position (percentage to pixels for X, pixels for Y)
    const bottleLeft = (bottle.x / 100) * gameAreaWidth - bottleWidthPx / 2
    const bottleRight = bottleLeft + bottleWidthPx
    const bottleTop = bottle.y
    const bottleBottom = bottle.y + bottleHeightPx

    // Check if bottle is in the collision zone (vertically)
    const isInCollisionZone = bottleBottom >= boxTop && bottleTop <= boxBottom

    if (!isInCollisionZone) {
      return { hit: false, isPerfect: false }
    }

    // Check horizontal collision
    const isHorizontalCollision = bottleRight >= boxLeft && bottleLeft <= boxRight

    if (!isHorizontalCollision) {
      return { hit: false, isPerfect: false }
    }

    // Calculate if it's a perfect catch (center of box)
    const boxCenterX = (boxLeft + boxRight) / 2
    const bottleCenterX = (bottleLeft + bottleRight) / 2
    const distanceFromCenter = Math.abs(boxCenterX - bottleCenterX)
    const isPerfect = distanceFromCenter < boxWidthPx / 4 // Within 25% of box center

    return { hit: true, isPerfect }
  }

  /**
   * Handle collision result
   */
  const handleCollision = (bottle, isPerfect, onCatch) => {
    // Calculate points
    let points = bottle.isGolden
      ? GAME_CONFIG.GOLDEN_BOTTLE_POINTS
      : GAME_CONFIG.POINTS_PER_BOTTLE

    // Add to score
    gameStore.addScore(points, bottle.isGolden, isPerfect)

    // Trigger callback
    if (onCatch) {
      onCatch(bottle, isPerfect)
    }
  }

  /**
   * Check all bottles for collisions
   */
  const checkAllCollisions = (bottles, boxPosition, onCatch) => {
    const remainingBottles = []

    bottles.forEach(bottle => {
      const collision = checkCollision(bottle, boxPosition)

      if (collision.hit) {
        // Handle the collision
        handleCollision(bottle, collision.isPerfect, onCatch)
      } else {
        // Keep bottle if no collision
        remainingBottles.push(bottle)
      }
    })

    return remainingBottles
  }

  return {
    checkCollision,
    checkAllCollisions,
    handleCollision
  }
}
