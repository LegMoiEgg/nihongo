<script setup lang="ts">
defineProps<{ level: number; label: string }>()
const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <div class="levelup-overlay" @click.self="emit('close')">
    <div class="levelup-card animate-pop">
      <div class="levelup-sparkle">🎉</div>
      <p class="levelup-title">Level aufgestiegen!</p>
      <div class="levelup-badge">Lv. {{ level }}</div>
      <p class="levelup-label">{{ label }}</p>
      <button class="btn btn-primary levelup-btn" @click="emit('close')">
        Weiter so!
      </button>
    </div>
  </div>
</template>

<style scoped>
.levelup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 24px;
  backdrop-filter: blur(2px);
}

.levelup-card {
  background: var(--bg-card);
  border: 2px solid var(--accent-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-elevated);
  padding: 32px 28px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  max-width: 320px;
  width: 100%;
}

.levelup-sparkle {
  font-size: 3rem;
  line-height: 1;
}

.levelup-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
}

.levelup-badge {
  font-size: 2.2rem;
  font-weight: 800;
  color: #fff;
  background: var(--gradient-xp);
  padding: 8px 28px;
  border-radius: 999px;
  margin: 4px 0;
}

.levelup-label {
  font-size: 1rem;
  color: var(--text-secondary);
}

.levelup-btn {
  margin-top: 12px;
  width: 100%;
  padding: 14px;
  font-size: 1rem;
  font-weight: 700;
}

.animate-pop {
  animation: levelup-pop 0.35s cubic-bezier(0.18, 0.89, 0.32, 1.28);
}

@keyframes levelup-pop {
  0% { transform: scale(0.7); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>
