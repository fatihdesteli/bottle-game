// Oyun Konfigürasyonu
export const GAME_CONFIG = {
  // Oyun alanı boyutları (mobil dikey ekran)
  GAME_WIDTH: 75, // % cinsinden
  MODEL_WIDTH: 25, // % cinsinden
  
  // Oyun mekaniği
  MAX_LIVES: 3,
  POINTS_PER_BOTTLE: 100,
  GOLDEN_BOTTLE_POINTS: 500,
  PERFECT_CATCH_BONUS: 50,
  COMBO_MULTIPLIER: 2,
  COMBO_THRESHOLD: 5,
  
  // Güçlendirmeler
  POWER_UPS: {
    SLOW_MOTION: { duration: 5000, spawnChance: 0.05 },
    WIDER_BOX: { duration: 8000, spawnChance: 0.04 },
    SHIELD: { duration: 10000, spawnChance: 0.03 }
  },
  
  // Şişe özellikleri
  BOTTLE_WIDTH: 31, // Reduced by 10% from 34 (originally 40)
  BOTTLE_HEIGHT: 61, // Reduced by 10% from 68 (originally 80)
  GOLDEN_BOTTLE_CHANCE: 0.1, // %10
  
  // Kasa özellikleri
  BOX_WIDTH: 150,
  BOX_HEIGHT: 100,
  BOX_SPEED: 15 // px per frame
}

// Seviye tanımları
export const LEVELS = [
  {
    level: 1,
    scoreRequired: 0,
    bottleSpeed: 2,
    spawnInterval: 1500,
    message: "Merhaba! Hadi başlayalım 😊",
    outfit: "formal",
    compliment: "İyi başlangıç!"
  },
  {
    level: 2,
    scoreRequired: 3750, // +50% from 2500
    bottleSpeed: 3.5,
    spawnInterval: 1200,
    message: "İyi gidiyorsun! Devam et! 💪",
    outfit: "sport",
    compliment: "Harikasın!"
  },
  {
    level: 3,
    scoreRequired: 9000, // +50% from 6000
    bottleSpeed: 5,
    spawnInterval: 1000,
    message: "Vay be! Sen gerçekten hızlısın! 🔥",
    outfit: "casual",
    compliment: "Süpersin!"
  },
  {
    level: 4,
    scoreRequired: 18000, // +50% from 12000
    bottleSpeed: 7,
    spawnInterval: 800,
    message: "Bu kadarını beklemiyordum! 😍",
    outfit: "elegant",
    compliment: "Muhteşemsin!"
  },
  {
    level: 5,
    scoreRequired: 30000, // +50% from 20000
    bottleSpeed: 9.5,
    spawnInterval: 650,
    message: "İnanılmazsın! Bitir beni! 🌟",
    outfit: "party",
    compliment: "Efsanesin!"
  },
  {
    level: 6,
    scoreRequired: 45000, // +50% from 30000
    bottleSpeed: 12,
    spawnInterval: 500,
    message: "EFSANE! Sen bir şampiyonsun! 👑💎",
    outfit: "swimwear",
    compliment: "LEJANTsın!"
  }
]

// Model tanımları
export const MODELS = [
  {
    id: 'model1',
    name: 'Emma',
    description: 'Moda dünyasına yeni başlayan genç tasarımcı',
    avatar: '/models/model1/avatar.jpg',
    outfits: {
      formal: '/models/model1/formal.jpg',
      sport: '/models/model1/sport.jpg',
      casual: '/models/model1/casual.jpg',
      elegant: '/models/model1/elegant.jpg',
      party: '/models/model1/party.jpg',
      swimwear: '/models/model1/swimwear.jpg'
    }
  },
  {
    id: 'model2',
    name: 'Sofia',
    description: 'Dünyaca ünlü süper model',
    avatar: '/models/model2/avatar.jpg',
    outfits: {
      formal: '/models/model2/formal.jpg',
      sport: '/models/model2/sport.jpg',
      casual: '/models/model2/casual.jpg',
      elegant: '/models/model2/elegant.jpg',
      party: '/models/model2/party.jpg',
      swimwear: '/models/model2/swimwear.jpg'
    }
  },
  {
    id: 'model3',
    name: 'Ayşe',
    description: 'Sosyal medya fenomeni influencer',
    avatar: '/models/model3/avatar.jpg',
    outfits: {
      formal: '/models/model3/formal.jpg',
      sport: '/models/model3/sport.jpg',
      casual: '/models/model3/casual.jpg',
      elegant: '/models/model3/elegant.jpg',
      party: '/models/model3/party.jpg',
      swimwear: '/models/model3/swimwear.jpg'
    }
  }
]

// Başarımlar
export const ACHIEVEMENTS = [
  {
    id: 1,
    name: 'İlk Adım',
    description: 'İlk 10 şişeyi topla',
    icon: '🎯',
    requirement: { type: 'bottles_collected', value: 10 }
  },
  {
    id: 2,
    name: 'Hız Tanrısı',
    description: 'Level 5\'e 3 dakikada ulaş',
    icon: '⚡',
    requirement: { type: 'speed_run', value: 180 }
  },
  {
    id: 3,
    name: 'Mükemmeliyetçi',
    description: 'Hiç şişe kaçırmadan 1000 puan',
    icon: '💎',
    requirement: { type: 'perfect_score', value: 1000 }
  },
  {
    id: 4,
    name: 'Golden Hunter',
    description: '10 golden şişe yakala',
    icon: '⭐',
    requirement: { type: 'golden_bottles', value: 10 }
  },
  {
    id: 5,
    name: 'Combo Master',
    description: '10 ardışık yakalama',
    icon: '🔥',
    requirement: { type: 'combo', value: 10 }
  },
  {
    id: 6,
    name: 'Şampiyon',
    description: 'Oyunu bitir',
    icon: '👑',
    requirement: { type: 'complete_game', value: 1 }
  }
]

// Ses efektleri yolları
export const SOUNDS = {
  catch: '/sounds/catch.mp3',
  miss: '/sounds/miss.mp3',
  levelUp: '/sounds/levelup.mp3',
  golden: '/sounds/golden.mp3',
  gameOver: '/sounds/gameover.mp3',
  powerUp: '/sounds/powerup.mp3',
  background: '/sounds/background.mp3'
}
