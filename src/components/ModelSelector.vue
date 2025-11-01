<script setup>
import { ref } from 'vue'
import { useGameStore } from '@/stores/game'
import { MODELS } from '@/data/gameConfig.js'

const gameStore = useGameStore()
const selectedModelId = ref(null)

const selectModel = (modelId) => {
  selectedModelId.value = modelId
}

const startGame = () => {
  if (selectedModelId.value) {
    gameStore.startGame(selectedModelId.value)
  }
}

const goBack = () => {
  gameStore.gameState = 'menu'
}
</script>

<template>
  <div class="model-selector">
    <div class="selector-container">
      <!-- Header -->
      <div class="header">
        <button class="back-btn" @click="goBack">
          ← Geri
        </button>
        <h1>Karakterini Seç</h1>
        <p class="subtitle">Hangi modelle oynamak istersin?</p>
      </div>

      <!-- Model Cards -->
      <div class="models-grid">
        <div
          v-for="model in MODELS"
          :key="model.id"
          class="model-card"
          :class="{ selected: selectedModelId === model.id }"
          @click="selectModel(model.id)"
        >
          <!-- Avatar Placeholder -->
          <div class="model-avatar">
            <div class="avatar-placeholder">
              <span class="avatar-initial">{{ model.name[0] }}</span>
            </div>

            <!-- Selected Badge -->
            <div v-if="selectedModelId === model.id" class="selected-badge">
              ✓
            </div>
          </div>

          <!-- Model Info -->
          <div class="model-info">
            <h2>{{ model.name }}</h2>
            <p>{{ model.description }}</p>
          </div>

          <!-- Select Button -->
          <button
            class="select-btn"
            :class="{ active: selectedModelId === model.id }"
          >
            {{ selectedModelId === model.id ? 'Seçildi' : 'Seç' }}
          </button>
        </div>
      </div>

      <!-- Start Button -->
      <div class="action-buttons">
        <button
          class="btn-start"
          :disabled="!selectedModelId"
          @click="startGame"
        >
          <span class="btn-icon">🎮</span>
          Oyuna Başla
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.model-selector {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  overflow-y: auto;
}

.selector-container {
  max-width: 600px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* Header */
.header {
  text-align: center;
  color: white;
  position: relative;
}

.back-btn {
  position: absolute;
  left: 0;
  top: 0;
  padding: 0.8rem 1.5rem;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateX(-5px);
}

.header h1 {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
  font-size: 1rem;
  opacity: 0.9;
}

/* Models Grid */
.models-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.model-card {
  background: rgba(255, 255, 255, 0.1);
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: slideIn 0.5s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.model-card:nth-child(2) {
  animation-delay: 0.1s;
}

.model-card:nth-child(3) {
  animation-delay: 0.2s;
}

.model-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.model-card.selected {
  border-color: #FFD700;
  background: rgba(255, 215, 0, 0.15);
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
}

/* Model Avatar */
.model-avatar {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
}

.avatar-placeholder {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  border: 4px solid rgba(255, 255, 255, 0.3);
}

.avatar-initial {
  font-size: 3rem;
  font-weight: 800;
  color: #2C3E50;
}

.selected-badge {
  position: absolute;
  top: 0;
  right: calc(50% - 70px);
  background: #FFD700;
  color: #00563B;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  border: 3px solid white;
  animation: popIn 0.3s ease;
}

@keyframes popIn {
  0% {
    transform: scale(0);
  }
  60% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

/* Model Info */
.model-info {
  text-align: center;
  color: white;
}

.model-info h2 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.model-info p {
  font-size: 1rem;
  opacity: 0.9;
  line-height: 1.4;
}

/* Select Button */
.select-btn {
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

.select-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.select-btn.active {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: #2C3E50;
  border-color: #FFD700;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  justify-content: center;
}

.btn-start {
  padding: 1.3rem 3rem;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  border: none;
  border-radius: 15px;
  color: #2C3E50;
  font-size: 1.3rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  transition: all 0.3s ease;
  box-shadow: 0 5px 20px rgba(255, 215, 0, 0.4);
}

.btn-start:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(255, 215, 0, 0.6);
}

.btn-start:active:not(:disabled) {
  transform: translateY(-1px);
}

.btn-start:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.5);
}

.btn-icon {
  font-size: 1.5rem;
}

/* Responsive */
@media (max-width: 480px) {
  .model-selector {
    padding: 0.8rem 0.5rem;
  }

  .selector-container {
    gap: 1rem;
  }

  .header h1 {
    font-size: 1.4rem;
    margin: 2.2rem 0 0.3rem 0;
  }

  .subtitle {
    font-size: 0.85rem;
  }

  .back-btn {
    padding: 0.55rem 0.9rem;
    font-size: 0.8rem;
  }

  .models-grid {
    gap: 0.7rem;
  }

  .model-card {
    padding: 0.9rem;
  }

  .avatar-placeholder {
    width: 75px;
    height: 75px;
  }

  .avatar-initial {
    font-size: 1.8rem;
  }

  .model-info h2 {
    font-size: 1.3rem;
  }

  .model-info p {
    font-size: 0.85rem;
  }

  .btn-start {
    padding: 1rem 1.8rem;
    font-size: 1rem;
  }
}

/* Landscape mobile fix */
@media (max-height: 600px) {
  .model-selector {
    padding: 1rem;
  }

  .selector-container {
    gap: 1rem;
  }

  .avatar-placeholder {
    width: 80px;
    height: 80px;
  }

  .avatar-initial {
    font-size: 2rem;
  }
}
</style>
