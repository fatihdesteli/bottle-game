import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { GAME_CONFIG, LEVELS, MODELS, ACHIEVEMENTS } from '@/data/gameConfig.js'

export const useGameStore = defineStore('game', () => {
  // State
  const gameState = ref('menu') // 'menu', 'model-selection', 'playing', 'paused', 'game-over'
  const score = ref(0)
  const lives = ref(GAME_CONFIG.MAX_LIVES)
  const currentLevel = ref(0)
  const selectedModel = ref(null)
  const bottlesCollected = ref(0)
  const goldenBottlesCollected = ref(0)
  const combo = ref(0)
  const maxCombo = ref(0)
  const perfectCatches = ref(0)
  const gameStartTime = ref(null)
  const unlockedAchievements = ref([])
  const highScores = ref([])
  const soundEnabled = ref(true)
  const musicEnabled = ref(true)
  
  // Power-ups aktif durumları
  const activePowerUps = ref({
    slowMotion: false,
    widerBox: false,
    shield: false
  })

  // Computed
  const currentLevelData = computed(() => LEVELS[currentLevel.value])
  
  const currentModelData = computed(() => {
    if (!selectedModel.value) return null
    return MODELS.find(m => m.id === selectedModel.value)
  })

  const currentOutfit = computed(() => {
    if (!currentModelData.value || !currentLevelData.value) return null
    return currentModelData.value.outfits[currentLevelData.value.outfit]
  })

  const isGameOver = computed(() => lives.value <= 0)
  
  const canLevelUp = computed(() => {
    if (currentLevel.value >= LEVELS.length - 1) return false
    const nextLevel = LEVELS[currentLevel.value + 1]
    return score.value >= nextLevel.scoreRequired
  })

  const progress = computed(() => {
    if (currentLevel.value >= LEVELS.length - 1) return 100
    const current = currentLevelData.value
    const next = LEVELS[currentLevel.value + 1]
    const scoreInLevel = score.value - current.scoreRequired
    const scoreNeeded = next.scoreRequired - current.scoreRequired
    return Math.min(100, (scoreInLevel / scoreNeeded) * 100)
  })

  const gameTime = computed(() => {
    if (!gameStartTime.value) return 0
    return Math.floor((Date.now() - gameStartTime.value) / 1000)
  })

  // Actions
  function startGame(modelId) {
    selectedModel.value = modelId
    gameState.value = 'playing'
    score.value = 0
    lives.value = GAME_CONFIG.MAX_LIVES
    currentLevel.value = 0
    bottlesCollected.value = 0
    goldenBottlesCollected.value = 0
    combo.value = 0
    maxCombo.value = 0
    perfectCatches.value = 0
    gameStartTime.value = Date.now()
    activePowerUps.value = {
      slowMotion: false,
      widerBox: false,
      shield: false
    }
  }

  function addScore(points, isGolden = false, isPerfect = false) {
    let totalPoints = points
    
    // Combo bonus
    if (combo.value >= GAME_CONFIG.COMBO_THRESHOLD) {
      totalPoints *= GAME_CONFIG.COMBO_MULTIPLIER
    }
    
    // Perfect catch bonus
    if (isPerfect) {
      totalPoints += GAME_CONFIG.PERFECT_CATCH_BONUS
      perfectCatches.value++
    }
    
    score.value += totalPoints
    bottlesCollected.value++
    combo.value++
    
    if (combo.value > maxCombo.value) {
      maxCombo.value = combo.value
    }
    
    if (isGolden) {
      goldenBottlesCollected.value++
    }
    
    // Level kontrolü
    if (canLevelUp.value) {
      levelUp()
    }
    
    // Başarım kontrolü
    checkAchievements()
  }

  function loseLife() {
    // Shield varsa, can kaybetme
    if (activePowerUps.value.shield) {
      activePowerUps.value.shield = false
      return
    }
    
    lives.value--
    combo.value = 0
    
    if (isGameOver.value) {
      endGame()
    }
  }

  function levelUp() {
    if (currentLevel.value < LEVELS.length - 1) {
      currentLevel.value++
    }
  }

  function activatePowerUp(type, duration) {
    activePowerUps.value[type] = true
    
    setTimeout(() => {
      activePowerUps.value[type] = false
    }, duration)
  }

  function pauseGame() {
    gameState.value = 'paused'
  }

  function resumeGame() {
    gameState.value = 'playing'
  }

  function endGame() {
    gameState.value = 'game-over'
    
    // High score kaydet
    const finalScore = {
      score: score.value,
      level: currentLevel.value + 1,
      time: gameTime.value,
      date: new Date().toISOString(),
      model: selectedModel.value
    }
    
    // LocalStorage'a kaydet
    saveHighScore(finalScore)
  }

  function saveHighScore(scoreData) {
    const scores = loadHighScores()
    scores.push(scoreData)
    scores.sort((a, b) => b.score - a.score)
    const top10 = scores.slice(0, 10)
    
    localStorage.setItem('bottleGameHighScores', JSON.stringify(top10))
    highScores.value = top10
  }

  function loadHighScores() {
    const saved = localStorage.getItem('bottleGameHighScores')
    if (saved) {
      highScores.value = JSON.parse(saved)
      return highScores.value
    }
    return []
  }

  function checkAchievements() {
    ACHIEVEMENTS.forEach(achievement => {
      // Zaten açılmışsa kontrol etme
      if (unlockedAchievements.value.includes(achievement.id)) return
      
      let unlocked = false
      
      switch (achievement.requirement.type) {
        case 'bottles_collected':
          unlocked = bottlesCollected.value >= achievement.requirement.value
          break
        case 'speed_run':
          unlocked = currentLevel.value >= 4 && gameTime.value <= achievement.requirement.value
          break
        case 'perfect_score':
          unlocked = score.value >= achievement.requirement.value && lives.value === GAME_CONFIG.MAX_LIVES
          break
        case 'golden_bottles':
          unlocked = goldenBottlesCollected.value >= achievement.requirement.value
          break
        case 'combo':
          unlocked = combo.value >= achievement.requirement.value
          break
        case 'complete_game':
          unlocked = currentLevel.value === LEVELS.length - 1
          break
      }
      
      if (unlocked) {
        unlockAchievement(achievement.id)
      }
    })
  }

  function unlockAchievement(achievementId) {
    if (!unlockedAchievements.value.includes(achievementId)) {
      unlockedAchievements.value.push(achievementId)
      // LocalStorage'a kaydet
      localStorage.setItem('bottleGameAchievements', JSON.stringify(unlockedAchievements.value))
    }
  }

  function loadAchievements() {
    const saved = localStorage.getItem('bottleGameAchievements')
    if (saved) {
      unlockedAchievements.value = JSON.parse(saved)
    }
  }

  function resetGame() {
    gameState.value = 'menu'
    selectedModel.value = null
    score.value = 0
    lives.value = GAME_CONFIG.MAX_LIVES
    currentLevel.value = 0
    bottlesCollected.value = 0
    goldenBottlesCollected.value = 0
    combo.value = 0
    maxCombo.value = 0
    perfectCatches.value = 0
    gameStartTime.value = null
    activePowerUps.value = {
      slowMotion: false,
      widerBox: false,
      shield: false
    }
  }

  function toggleSound() {
    soundEnabled.value = !soundEnabled.value
    localStorage.setItem('bottleGameSound', soundEnabled.value)
  }

  function toggleMusic() {
    musicEnabled.value = !musicEnabled.value
    localStorage.setItem('bottleGameMusic', musicEnabled.value)
  }

  // İlk yükleme
  loadHighScores()
  loadAchievements()
  
  const savedSound = localStorage.getItem('bottleGameSound')
  if (savedSound !== null) soundEnabled.value = savedSound === 'true'
  
  const savedMusic = localStorage.getItem('bottleGameMusic')
  if (savedMusic !== null) musicEnabled.value = savedMusic === 'true'

  return {
    // State
    gameState,
    score,
    lives,
    currentLevel,
    selectedModel,
    bottlesCollected,
    goldenBottlesCollected,
    combo,
    maxCombo,
    perfectCatches,
    gameStartTime,
    unlockedAchievements,
    highScores,
    soundEnabled,
    musicEnabled,
    activePowerUps,
    
    // Computed
    currentLevelData,
    currentModelData,
    currentOutfit,
    isGameOver,
    canLevelUp,
    progress,
    gameTime,
    
    // Actions
    startGame,
    addScore,
    loseLife,
    levelUp,
    activatePowerUp,
    pauseGame,
    resumeGame,
    endGame,
    resetGame,
    toggleSound,
    toggleMusic,
    checkAchievements
  }
})
