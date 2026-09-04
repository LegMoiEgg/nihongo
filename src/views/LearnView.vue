<script setup lang="ts">
import { useLearningStore } from '../stores/learning'
import { useUserStore } from '../stores/user'
import { hiraganaData } from '../data/hiragana'
import { katakanaData } from '../data/katakana'
import { kanjiData } from '../data/kanji'
import { vocabularyData } from '../data/vocabulary'
import { particleData } from '../data/particles'
import { computed } from 'vue'

const learningStore = useLearningStore()
const userStore = useUserStore()
learningStore.initialize()

const level = computed(() => userStore.currentLevel.level)
const kanjiUnlocked = computed(() => level.value >= 15)
const grammarUnlocked = computed(() => level.value >= 5)

const categories = computed(() => [
  {
    id: 'hiragana',
    title: 'Hiragana',
    subtitle: 'Die Grundschrift',
    icon: 'あ',
    iconClass: 'jp-large',
    total: hiraganaData.length,
    mastered: learningStore.progressByCategory.hiragana?.mastered || 0,
    due: learningStore.dueByCategory.hiragana,
    color: '#e94560',
    route: '/learn/hiragana/overview',
    locked: false,
    lockLabel: '',
  },
  {
    id: 'katakana',
    title: 'Katakana',
    subtitle: 'Für Fremdwörter',
    icon: 'ア',
    iconClass: 'jp-large',
    total: katakanaData.length,
    mastered: learningStore.progressByCategory.katakana?.mastered || 0,
    due: learningStore.dueByCategory.katakana,
    color: '#533483',
    route: '/learn/katakana/overview',
    locked: false,
    lockLabel: '',
  },
  {
    id: 'kanji',
    title: 'Kanji',
    subtitle: kanjiUnlocked.value ? 'Chinesische Zeichen' : 'Ab Level 15 verfügbar',
    icon: '漢',
    iconClass: 'jp-large',
    total: kanjiData.length,
    mastered: learningStore.progressByCategory.kanji?.mastered || 0,
    due: learningStore.dueByCategory.kanji,
    color: '#0f3460',
    route: '/learn/kanji/overview',
    locked: !kanjiUnlocked.value,
    lockLabel: `🔒 Level 15`,
  },
  {
    id: 'vocabulary',
    title: 'Vokabeln',
    subtitle: 'JLPT N5 Wortschatz',
    icon: '📝',
    iconClass: '',
    total: vocabularyData.length,
    mastered: learningStore.progressByCategory.vocabulary?.mastered || 0,
    due: learningStore.dueByCategory.vocabulary,
    color: '#00c853',
    route: '/learn/vocabulary/overview',
    locked: false,
    lockLabel: '',
  },
  {
    id: 'grammar',
    title: 'Grammatik',
    subtitle: grammarUnlocked.value ? 'Partikel: は を に で の …' : 'Ab Level 5 verfügbar',
    icon: 'は',
    iconClass: 'jp-large',
    total: particleData.length,
    mastered: learningStore.progressByCategory.grammar?.mastered || 0,
    due: learningStore.dueByCategory.grammar,
    color: '#ff9800',
    route: '/learn/grammar',
    locked: !grammarUnlocked.value,
    lockLabel: `🔒 Level 5`,
  },
])
</script>

<template>
  <div class="learn-page">
    <header class="page-header">
      <h1>Lernen</h1>
      <p>Wähle eine Kategorie zum Üben</p>
    </header>

    <div class="category-list">
      <component
        v-for="cat in categories"
        :key="cat.id"
        :is="cat.locked ? 'div' : 'router-link'"
        :to="cat.locked ? undefined : cat.route"
        class="category-card card"
        :class="{ locked: cat.locked }"
      >
        <div class="cat-left">
          <span class="cat-icon" :class="cat.iconClass">{{ cat.icon }}</span>
        </div>
        <div class="cat-info">
          <h2>{{ cat.title }}</h2>
          <p class="cat-subtitle">{{ cat.subtitle }}</p>
          <div v-if="!cat.locked" class="cat-stats">
            <span class="cat-mastered">{{ cat.mastered }} / {{ cat.total }} gemeistert</span>
            <span v-if="cat.due > 0" class="badge badge-xp">{{ cat.due }} fällig</span>
          </div>
          <div v-else class="cat-lock-badge">
            <span class="lock-label">{{ cat.lockLabel }}</span>
          </div>
          <div v-if="!cat.locked" class="progress-bar" style="height: 6px; margin-top: 8px;">
            <div
              class="progress-bar-fill"
              :style="{
                width: (cat.total > 0 ? (cat.mastered / cat.total) * 100 : 0) + '%',
                background: cat.color
              }"
            />
          </div>
        </div>
        <span v-if="!cat.locked" class="cat-arrow">→</span>
      </component>
    </div>

    <!-- Info Section -->
    <section class="info-section card-flat">
      <h3>💡 Wie funktioniert das Lernen?</h3>
      <ul>
        <li><strong>Übersicht:</strong> Sieh alle Silben und deinen Fortschritt auf einen Blick</li>
        <li><strong>Multiple Choice:</strong> Wähle die richtige Lesung aus 4 Optionen</li>
        <li><strong>Lese-Kombis:</strong> Lies zufällige Silbenkombinationen (ab 10 gelernten Silben)</li>
        <li><strong>Meisterung:</strong> 5× hintereinander richtig = gemeistert ✓</li>
        <li><strong>XP:</strong> Du bekommst XP für jede richtige Antwort</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.learn-page {
  padding: var(--content-padding);
  max-width: 600px;
  margin: 0 auto;
}

.page-header {
  padding: 20px 0;
}

.page-header h1 {
  font-size: 1.6rem;
  font-weight: 700;
}

.page-header p {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-top: 4px;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.category-card {
  display: flex;
  align-items: center;
  gap: 16px;
  text-decoration: none;
  color: var(--text-primary);
  padding: 16px;
}

.category-card.locked {
  opacity: 0.45;
  cursor: default;
  pointer-events: none;
}

.category-card.locked:hover {
  transform: none;
  box-shadow: var(--shadow-card);
}

.cat-lock-badge {
  margin-top: 6px;
}

.lock-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
}

.cat-left {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-accent);
  border-radius: var(--radius-md);
}

.cat-icon {
  font-size: 1.8rem;
}

.cat-info {
  flex: 1;
  min-width: 0;
}

.cat-info h2 {
  font-size: 1.05rem;
  font-weight: 600;
}

.cat-subtitle {
  color: var(--text-secondary);
  font-size: 0.8rem;
  margin-top: 2px;
}

.cat-stats {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
}

.cat-mastered {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.cat-arrow {
  font-size: 1.2rem;
  color: var(--text-muted);
  flex-shrink: 0;
}

.info-section {
  padding: 16px;
}

.info-section h3 {
  font-size: 0.95rem;
  margin-bottom: 10px;
}

.info-section ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-section li {
  font-size: 0.85rem;
  color: var(--text-secondary);
  padding-left: 8px;
}

.info-section li::before {
  content: '•';
  margin-right: 8px;
  color: var(--accent-primary);
}
</style>
