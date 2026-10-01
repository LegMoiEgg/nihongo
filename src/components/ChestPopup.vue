<script setup lang="ts">
const props = defineProps<{ amount: number; streakBonus: number }>()
const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <div class="chest-overlay" @click.self="emit('close')">
    <div class="chest-card animate-pop">
      <div class="chest-icon">🎁</div>
      <p class="chest-title">Tagesziel geschafft!</p>
      <div class="chest-coins">
        <span class="coin-emoji">🪙</span>
        <span class="coin-amount">+{{ props.amount }}</span>
      </div>
      <p class="chest-sub">
        10 Münzen aus der Kiste<template v-if="props.streakBonus > 0"> · +{{ props.streakBonus }} Streak-Bonus 🔥</template>
      </p>
      <button class="btn btn-primary chest-btn" @click="emit('close')">
        Einsammeln
      </button>
    </div>
  </div>
</template>

<style scoped>
.chest-overlay {
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

.chest-card {
  background: var(--bg-card);
  border: 2px solid var(--accent-gold);
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

.chest-icon {
  font-size: 3.4rem;
  line-height: 1;
  animation: chest-wiggle 0.6s ease 0.2s 2;
}

.chest-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
}

.chest-coins {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 4px 0;
}

.coin-emoji {
  font-size: 2rem;
}

.coin-amount {
  font-size: 2.4rem;
  font-weight: 800;
  color: var(--accent-gold);
}

.chest-sub {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.chest-btn {
  margin-top: 12px;
  width: 100%;
  padding: 14px;
  font-size: 1rem;
  font-weight: 700;
}

.animate-pop {
  animation: chest-pop 0.35s cubic-bezier(0.18, 0.89, 0.32, 1.28);
}

@keyframes chest-pop {
  0% { transform: scale(0.7); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes chest-wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-10deg); }
  75% { transform: rotate(10deg); }
}
</style>
