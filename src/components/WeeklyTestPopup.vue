<script setup lang="ts">
const emit = defineEmits<{ start: []; dismiss: [] }>()
</script>

<template>
  <div class="wt-overlay" @click.self="emit('dismiss')">
    <div class="wt-card animate-pop">
      <div class="wt-sparkle">🗓️</div>
      <p class="wt-title">Sonntags-Wochentest!</p>
      <p class="wt-text">
        Teste, was du diese Woche gelernt hast. Schaffst du ihn ohne Fehler,
        gibt es <strong>+50 XP Bonus</strong>. 🌟
      </p>
      <button class="btn btn-primary wt-btn" @click="emit('start')">Test starten</button>
      <button class="btn-ghost wt-later" @click="emit('dismiss')">Vielleicht später</button>
    </div>
  </div>
</template>

<style scoped>
.wt-overlay {
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
.wt-card {
  background: var(--bg-card);
  border: 2px solid var(--accent-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-elevated);
  padding: 32px 28px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  max-width: 340px;
  width: 100%;
}
.wt-sparkle { font-size: 3rem; line-height: 1; }
.wt-title { font-size: 1.2rem; font-weight: 700; color: var(--text-primary); }
.wt-text { font-size: 0.95rem; color: var(--text-secondary); line-height: 1.5; }
.wt-btn { margin-top: 8px; width: 100%; padding: 14px; font-size: 1rem; font-weight: 700; }
.wt-later { color: var(--text-muted); font-size: 0.9rem; }
.animate-pop { animation: wt-pop 0.35s cubic-bezier(0.18, 0.89, 0.32, 1.28); }
@keyframes wt-pop {
  0% { transform: scale(0.7); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>
