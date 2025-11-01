<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'
import MenuScreen from '@/components/MenuScreen.vue'
import ModelSelector from '@/components/ModelSelector.vue'
import GameBoard from '@/components/GameBoard.vue'
import GameOver from '@/components/GameOver.vue'

const gameStore = useGameStore()

const currentComponent = computed(() => {
  switch (gameStore.gameState) {
    case 'menu':
      return MenuScreen
    case 'model-selection':
      return ModelSelector
    case 'playing':
    case 'paused':
      return GameBoard
    case 'game-over':
      return GameOver
    default:
      return MenuScreen
  }
})
</script>

<template>
  <div id="app" class="app-container">
    <component :is="currentComponent" />
  </div>
</template>

<style>
/* Global Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

body {
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: linear-gradient(135deg, #00563B 0%, #1a7a58 50%, #2d8f6f 100%);
  color: #2C3E50;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}


/* Button Base Styles */
button {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: #2C3E50;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.6);
}

button:active {
  transform: translateY(0);
}

/* Responsive */
@media (max-width: 768px) {
  .menu h1 {
    font-size: 2rem;
  }
  
  button {
    padding: 0.8rem 1.6rem;
    font-size: 1rem;
  }
}
</style>
