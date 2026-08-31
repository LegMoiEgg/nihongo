<script setup lang="ts">
import { useLearningStore } from '../stores/learning'
import { hiraganaData } from '../data/hiragana'
import { katakanaData } from '../data/katakana'
import { kanjiData } from '../data/kanji'
import { vocabularyData } from '../data/vocabulary'
import { computed } from 'vue'

const learningStore = useLearningStore()
learningStore.initialize()

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
    route: '/learn/hiragana'
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
    route: '/learn/katakana'
  },
  {
    id: 'kanji',
    title: 'Kanji',
    subtitle: 'Chinesische Zeichen',
    icon: '漢',
    iconClass: 'jp-large',
    total: kanjiData.length,
    mastered: learningStore.progressByCategory.kanji?.mastered || 0,
    due: learningStore.dueByCategory.kanji,
    color: '#0f3460',
    route: '/learn/kanji'
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
    route: '/learn/vocabulary'
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
      <router-link
        v-for="cat in categories"
        :key="cat.id"
        :to="cat.route"
        class="category-card card"
      >
        <div class="cat-left">
          <span class="cat-icon" :class="cat.iconClass">{{ cat.icon }}</span>
        </div>
        <div class="cat-info">
          <h2>{{ cat.title }}</h2>
          <p class="cat-subtitle">{{ cat.subtitle }}</p>
          <div class="cat-stats">
            <span class="cat-mastered">{{ cat.mastered }} / {{ cat.total }} gemeistert</span>
            <span v-if="cat.due > 0" class="badge badge-xp">{{ cat.due }} fällig</span>
          </div>
          <div class="progress-bar" style="height: 6px; margin-top: 8px;">
            <div
              class="progress-bar-fill"
              :style="{
                width: (cat.total > 0 ? (cat.mastered / cat.total) * 100 : 0) + '%',
                background: cat.color
              }"
            />
          </div>
        </div>
        <span class="cat-arrow">→</span>
      </router-link>
    </div>

    <!-- Info Section -->
    <section class="info-section card-flat">
      <h3>💡 Wie funktioniert das Lernen?</h3>
      <ul>
        <li><strong>Karteikarten:</strong> Sieh dir das Zeichen an und rate die Lesung</li>
        <li><strong>Spaced Repetition:</strong> Schwierige Karten erscheinen häufiger</li>
        <li><strong>Fortschritt:</strong> Nach 8 richtigen Antworten gilt ein Zeichen als gemeistert</li>
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
