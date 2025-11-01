# 🎯 BOTTLE GAME - PROJE RAPORU

## ✅ TAMAMLANAN İŞLER

### 1. Vue.js Projesi Kuruldu

- ✅ Vue 3 (Composition API)
- ✅ Pinia State Management
- ✅ Vite Build Tool
- ✅ Development Server (http://localhost:5173)

### 2. Dosya Yapısı Oluşturuldu

\`\`\`
bottle-game/
├── src/
│ ├── App.vue ✅ Ana uygulama dosyası
│ ├── main.ts ✅ Giriş noktası
│ ├── stores/
│ │ └── game.js ✅ Oyun state management
│ ├── data/
│ │ └── gameConfig.js ✅ Oyun konfigürasyonu
│ ├── composables/ ⏳ Boş (gelecek sprint)
│ ├── components/ ⏳ Boş (gelecek sprint)
│ └── assets/
│ ├── models/ ⏳ Görsel bekliyor
│ ├── sounds/ ⏳ Ses dosyaları bekliyor
│ └── images/ ⏳ Görsel bekliyor
├── package.json ✅
└── README.md ✅
\`\`\`

### 3. Oyun Konfigürasyonu Tanımlandı

#### 🎮 Oyun Ayarları:

- Max can: 3
- Şişe puanı: 100
- Golden şişe: 500 puan
- Perfect catch bonus: +50
- Combo çarpanı: x2

#### 📊 6 Seviye:

1. **Level 1** (0 puan) - Formal kıyafet - Hız: 2.0
2. **Level 2** (700 puan) - Spor kıyafet - Hız: 2.8
3. **Level 3** (1500 puan) - Günlük kıyafet - Hız: 3.5
4. **Level 4** (2500 puan) - Şık kıyafet - Hız: 4.2
5. **Level 5** (4000 puan) - Parti kıyafeti - Hız: 5.0
6. **Level 6** (6000 puan) - Mayolu - Hız: 6.0

#### 👥 3 Model Karakteri:

1. **Emma** - Genç tasarımcı
2. **Sofia** - Süper model
3. **Ayşe** - Influencer

#### 🏆 6 Başarım:

- İlk Adım (10 şişe)
- Hız Tanrısı (3 dakika)
- Mükemmeliyetçi (1000 puan hatasız)
- Golden Hunter (10 golden şişe)
- Combo Master (10 ardışık)
- Şampiyon (oyunu bitir)

#### ⚡ Power-ups:

- Slow Motion (5 saniye)
- Wider Box (8 saniye)
- Shield (10 saniye)

### 4. State Management (Pinia Store)

game.js store'u şunları yönetiyor:

- ✅ Oyun durumu (menu, playing, paused, game-over)
- ✅ Skor takibi
- ✅ Can sistemi
- ✅ Seviye yönetimi
- ✅ Model seçimi
- ✅ İstatistikler (toplanan şişe, combo, vb.)
- ✅ Başarımlar kontrolü
- ✅ High score kayıt/yükleme (LocalStorage)
- ✅ Power-up yönetimi
- ✅ Ses/müzik ayarları

### 5. App.vue Hazırlandı

- ✅ State-based component switching
- ✅ Global CSS stilleri
- ✅ Responsive tasarım temeli
- ✅ Pilsner yeşili gradient arka plan

---

## 📋 SONRAKİ ADIMLAR

### Sprint 1: UI Bileşenleri

#### 1. MenuScreen.vue

- Oyun logosu
- "Başla" butonu
- High scores linki
- Achievements linki
- Ayarlar (ses/müzik)

#### 2. ModelSelector.vue

- 3 model kartı
- Her model için:
  - Avatar görsel
  - İsim
  - Açıklama
  - "Seç" butonu
- Animasyonlu geçişler

#### 3. GameBoard.vue

Temel layout:
\`\`\`
┌─────────────────┬────┐
│ GAME AREA │ M │
│ (75%) │ O │
│ │ D │
│ - ScoreBoard │ E │
│ - Bottles │ L │
│ - Box │ │
│ │ P │
│ │ A │
│ │ N │
│ │ E │
│ │ L │
└─────────────────┴────┘
\`\`\`

#### 4. Sub-Components:

- **ScoreBoard.vue**: Skor, can, seviye, combo
- **BottleItem.vue**: Düşen şişe komponenti
- **CollectionBox.vue**: Kasa (mouse/touch kontrolü)
- **ModelPanel.vue**: Model görseli + mesajlar

#### 5. GameOver.vue

- Final skor
- İstatistikler
- High score tablosu
- Yeni başarımlar
- "Tekrar Oyna" butonu
- "Ana Menü" butonu

### Sprint 2: Oyun Mekaniği

#### Composables:

1. **useBottleSpawner.js**

   - Zamanlayıcı
   - Rastgele pozisyon
   - Golden şişe spawn
   - Hız kontrolü

2. **useCollision.js**

   - Şişe-kasa çarpışma
   - Hit detection
   - Perfect catch kontrolü

3. **useGameLoop.js**
   - RAF (requestAnimationFrame)
   - Oyun döngüsü
   - Pozisyon güncellemeleri

### Sprint 3: Görseller & Sesler (1-2 gün)

#### İhtiyaç Listesi:

**Görseller:**

- [ ] 3 Model x 6 Kıyafet = 18 görsel
- [ ] Normal şişe görseli
- [ ] Golden şişe görseli
- [ ] Kasa görseli
- [ ] Logo
- [ ] Icons (kalp, yıldız, vs.)

**Sesler:**

- [ ] Yakalama sesi (catch.mp3)
- [ ] Kaçırma sesi (miss.mp3)
- [ ] Level atlama (levelup.mp3)
- [ ] Golden şişe (golden.mp3)
- [ ] Game over (gameover.mp3)
- [ ] Power-up (powerup.mp3)
- [ ] Arka plan müziği (background.mp3)

**İyi kodlamalar! 🚀**
