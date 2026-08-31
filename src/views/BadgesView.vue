<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBadgesStore, ALL_BADGES, type BadgeDefinition } from '../stores/badges'

const router = useRouter()
const badgesStore = useBadgesStore()
badgesStore.initialize()

const categoryLabels: Record<string, string> = {
  streak: '🔥 Streak',
  mastery: '🎌 Meisterung',
  xp: '⭐ XP-Meilensteine',
  sessions: '📝 Lektionen',
  special: '🏆 Spezial',
}

const categoryOrder = ['special', 'streak', 'mastery', 'xp', 'sessions']

const badgesByCategory = computed(() => {
  return categoryOrder.map(cat => ({
    key: cat,
    label: categoryLabels[cat] || cat,
    badges: ALL_BADGES.filter(b => b.category === cat),
  }))
})

function getEarnedDate(id: string): string | null {
  const eb = badgesStore.earnedBadges.find(b => b.id === id)
  if (!eb) return null
  const d = new Date(eb.earnedAt)
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function goBack() {
  router.push('/profile')
}
</script>

<template>
  <div class="badges-page">
    <header class="badges-page-header">
      <button class="btn-ghost back-btn" @click="goBack" aria-label="Zurück">‹</button>
      <h1>Erfolge</h1>
      <span class="badges-total">{{ badgesStore.earnedCount }}/{{ badgesStore.totalBadges }}</span>
    </header>

    <!-- Progress -->
    <div class="badges-progress card-flat">
      <div class="progress-bar" style="height: 8px;">
        <div
          class="progress-bar-fill"
          :style="{ width: (badgesStore.totalBadges > 0 ? (badgesStore.earnedCount / badgesStore.totalBadges) * 100 : 0) + '%', background: 'var(--accent-gold)' }"
        />
      </div>
      <span class="progress-label">{{ badgesStore.earnedCount }} von {{ badgesStore.totalBadges }} freigeschaltet</span>
    </div>

    <!-- Badges by Category -->
    <section v-for="cat in badgesByCategory" :key="cat.key" class="category-section">
      <h2 class="category-title">{{ cat.label }}</h2>
      <div class="category-grid">
        <div
          v-for="badge in cat.badges"
          :key="badge.id"
          class="badge-card"
          :class="{ earned: badgesStore.hasBadge(badge.id) }"
        >
          <span class="badge-card-icon">{{ badge.icon }}</span>
          <div class="badge-card-info">
            <span class="badge-card-name">{{ badge.name }}</span>
            <span class="badge-card-desc">{{ badge.description }}</span>
            <span v-if="getEarnedDate(badge.id)" class="badge-card-date">
              ✓ {{ getEarnedDate(badge.id) }}
            </span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.badges-page {
  max-width: 600px;
  margin: 0 auto;
  padding: var(--content-padding);
  padding-bottom: 32px;
}

.badges-page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0 16px;
}

.badges-page-header h1 {
  font-size: 1.3rem;
  font-weight: 700;
}

.badges-total {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.back-btn {
  font-size: 1.2rem;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  line-height: 1;
  border-radius: 50%;
}

/* Progress */
.badges-progress {
  margin-bottom: 20px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-label {
  font-size: 0.8rem;
  color: var(--text-muted);
  text-align: center;
}

/* Category */
.category-section {
  margin-bottom: 24px;
}

.category-title {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--bg-accent);
}

.category-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.badge-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  border: 1px solid var(--bg-accent);
  opacity: 0.4;
  filter: grayscale(1);
  transition: all var(--transition-fast);
}

.badge-card.earned {
  opacity: 1;
  filter: none;
  border-color: rgba(255, 215, 0, 0.3);
  background: rgba(255, 215, 0, 0.04);
}

.badge-card-icon {
  font-size: 2rem;
  flex-shrink: 0;
  width: 44px;
  text-align: center;
}

.badge-card-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.badge-card-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
}

.badge-card.earned .badge-card-name {
  color: var(--text-primary);
}

.badge-card:not(.earned) .badge-card-name {
  color: var(--text-muted);
}

.badge-card-desc {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.badge-card-date {
  font-size: 0.7rem;
  color: var(--accent-success);
  font-weight: 500;
  margin-top: 2px;
}
</style>
