import { ref } from 'vue'
import { useGameStore } from '@/stores/game'
import { SOUNDS } from '@/data/gameConfig.js'

// Sound instances cache
const soundCache = new Map()
let backgroundMusic = null

/**
 * Sound Manager Composable
 * Manages game sound effects and background music
 */
export function useSound() {
  const gameStore = useGameStore()
  const isInitialized = ref(false)

  /**
   * Load and cache a sound file
   */
  const loadSound = (key, path) => {
    if (soundCache.has(key)) {
      return soundCache.get(key)
    }

    const audio = new Audio(path)
    audio.preload = 'auto'
    soundCache.set(key, audio)
    return audio
  }

  /**
   * Initialize all sounds
   */
  const initSounds = () => {
    if (isInitialized.value) {
      console.log('Sounds already initialized')
      return
    }

    console.log('Initializing sounds...')

    try {
      // Preload all sound effects
      Object.entries(SOUNDS).forEach(([key, path]) => {
        if (key !== 'background') {
          console.log(`Loading sound: ${key} from ${path}`)
          loadSound(key, path)
        }
      })

      // Initialize background music separately
      console.log(`Loading background music from ${SOUNDS.background}`)
      backgroundMusic = new Audio(SOUNDS.background)
      backgroundMusic.loop = true
      backgroundMusic.volume = 0.3 // Lower volume for background music

      isInitialized.value = true
      console.log('Sounds initialized successfully')
    } catch (error) {
      console.error('Error initializing sounds:', error)
    }
  }

  /**
   * Play a sound effect
   */
  const playSound = (soundKey) => {
    if (!gameStore.soundEnabled) {
      console.log('Sound disabled in settings')
      return
    }

    try {
      const sound = soundCache.get(soundKey)
      if (sound) {
        // Clone the audio node to allow overlapping sounds
        const soundClone = sound.cloneNode()
        soundClone.volume = 0.5
        console.log(`Playing sound: ${soundKey}`)
        soundClone.play().catch(err => {
          console.warn(`Failed to play sound: ${soundKey}`, err)
        })
      } else {
        console.warn(`Sound not found in cache: ${soundKey}`)
      }
    } catch (error) {
      console.error(`Error playing sound: ${soundKey}`, error)
    }
  }

  /**
   * Play background music
   */
  const playBackgroundMusic = () => {
    if (!gameStore.musicEnabled) {
      console.log('Music disabled in settings')
      return
    }

    if (!backgroundMusic) {
      console.warn('Background music not initialized')
      return
    }

    try {
      backgroundMusic.currentTime = 0
      console.log('Playing background music')
      backgroundMusic.play().catch(err => {
        console.warn('Failed to play background music:', err)
      })
    } catch (error) {
      console.error('Error playing background music:', error)
    }
  }

  /**
   * Stop background music
   */
  const stopBackgroundMusic = () => {
    if (backgroundMusic) {
      backgroundMusic.pause()
      backgroundMusic.currentTime = 0
    }
  }

  /**
   * Pause background music
   */
  const pauseBackgroundMusic = () => {
    if (backgroundMusic) {
      backgroundMusic.pause()
    }
  }

  /**
   * Resume background music
   */
  const resumeBackgroundMusic = () => {
    if (gameStore.musicEnabled && backgroundMusic) {
      backgroundMusic.play().catch(err => {
        console.warn('Failed to resume background music:', err)
      })
    }
  }

  /**
   * Set background music volume
   */
  const setMusicVolume = (volume) => {
    if (backgroundMusic) {
      backgroundMusic.volume = Math.max(0, Math.min(1, volume))
    }
  }

  /**
   * Play catch sound
   */
  const playCatchSound = () => playSound('catch')

  /**
   * Play miss sound
   */
  const playMissSound = () => playSound('miss')

  /**
   * Play level up sound
   */
  const playLevelUpSound = () => playSound('levelUp')

  /**
   * Play golden bottle sound
   */
  const playGoldenSound = () => playSound('golden')

  /**
   * Play game over sound
   */
  const playGameOverSound = () => playSound('gameOver')

  /**
   * Play power-up sound
   */
  const playPowerUpSound = () => playSound('powerUp')

  return {
    // State
    isInitialized,

    // Methods
    initSounds,
    playSound,
    playBackgroundMusic,
    stopBackgroundMusic,
    pauseBackgroundMusic,
    resumeBackgroundMusic,
    setMusicVolume,

    // Shorthand methods
    playCatchSound,
    playMissSound,
    playLevelUpSound,
    playGoldenSound,
    playGameOverSound,
    playPowerUpSound
  }
}
