<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const mode = ref<'login' | 'register'>('login')
const email = ref('')
const password = ref('')
const name = ref('')
const submitting = ref(false)

async function handleSubmit() {
  submitting.value = true
  authStore.clearError()

  try {
    if (mode.value === 'register') {
      await authStore.register(email.value, password.value, name.value)
    } else {
      await authStore.login(email.value, password.value)
    }
    router.push('/profile')
  } catch {
    // error is set in auth store
  } finally {
    submitting.value = false
  }
}

function toggleMode() {
  mode.value = mode.value === 'login' ? 'register' : 'login'
  authStore.clearError()
}

function goBack() {
  router.push('/profile')
}
</script>

<template>
  <div class="auth-page">
    <header class="auth-header">
      <button class="btn-ghost back-btn" @click="goBack" aria-label="Zurück">‹</button>
      <h1>{{ mode === 'login' ? 'Anmelden' : 'Registrieren' }}</h1>
      <span />
    </header>

    <div class="auth-content">
      <div class="auth-icon">{{ mode === 'login' ? '🔑' : '✨' }}</div>
      <p class="auth-desc">
        {{ mode === 'login'
          ? 'Melde dich an um deinen Fortschritt zu synchronisieren.'
          : 'Erstelle einen Account um deinen Fortschritt zu sichern.'
        }}
      </p>

      <form class="auth-form" @submit.prevent="handleSubmit">
        <div v-if="mode === 'register'" class="form-group">
          <label for="name">Name</label>
          <input
            id="name"
            v-model="name"
            type="text"
            placeholder="Dein Name"
            maxlength="20"
            autocomplete="name"
          />
        </div>

        <div class="form-group">
          <label for="email">E-Mail</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="deine@email.de"
            required
            autocomplete="email"
          />
        </div>

        <div class="form-group">
          <label for="password">Passwort</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Mindestens 6 Zeichen"
            required
            minlength="6"
            autocomplete="current-password"
          />
        </div>

        <p v-if="authStore.error" class="auth-error">{{ authStore.error }}</p>

        <button
          type="submit"
          class="btn btn-primary auth-submit"
          :disabled="submitting"
        >
          {{ submitting ? '...' : mode === 'login' ? 'Anmelden' : 'Account erstellen' }}
        </button>
      </form>

      <button class="toggle-mode btn-ghost" @click="toggleMode">
        {{ mode === 'login'
          ? 'Noch kein Account? Jetzt registrieren'
          : 'Schon einen Account? Anmelden'
        }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  max-width: 600px;
  margin: 0 auto;
  min-height: calc(100vh - var(--nav-height));
  display: flex;
  flex-direction: column;
}

.auth-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
}

.auth-header h1 {
  font-size: 1.2rem;
  font-weight: 700;
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

.auth-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px;
  gap: 16px;
}

.auth-icon {
  font-size: 3rem;
}

.auth-desc {
  color: var(--text-secondary);
  text-align: center;
  max-width: 280px;
  font-size: 0.9rem;
}

.auth-form {
  width: 100%;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 8px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-group label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.form-group input {
  background: var(--bg-card);
  border: 2px solid var(--bg-accent);
  border-radius: var(--radius-md);
  padding: 12px 14px;
  font-size: 1rem;
  color: var(--text-primary);
  font-family: inherit;
  outline: none;
  transition: border-color var(--transition-fast);
}

.form-group input:focus {
  border-color: var(--accent-primary);
}

.form-group input::placeholder {
  color: var(--text-muted);
}

.auth-error {
  color: var(--accent-primary);
  font-size: 0.85rem;
  text-align: center;
  padding: 8px;
  background: rgba(233, 69, 96, 0.1);
  border-radius: var(--radius-sm);
}

.auth-submit {
  width: 100%;
  padding: 14px;
  font-size: 1rem;
  margin-top: 4px;
}

.auth-submit:disabled {
  opacity: 0.5;
}

.toggle-mode {
  margin-top: 8px;
  font-size: 0.85rem;
}
</style>
