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

async function handleGoogleLogin() {
  try {
    await authStore.loginWithGoogle()
    if (authStore.isLoggedIn) router.push('/profile')
  } catch {
    // error handled in store
  }
}

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

      <div class="auth-divider">
        <span>oder</span>
      </div>

      <button class="btn google-btn" @click="handleGoogleLogin">
        <svg class="google-icon" viewBox="0 0 24 24" width="18" height="18">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Mit Google anmelden
      </button>

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

.auth-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 340px;
  margin: 4px 0;
}

.auth-divider::before,
.auth-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--bg-accent);
}

.auth-divider span {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.google-btn {
  width: 100%;
  max-width: 340px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px;
  background: var(--bg-card);
  border: 2px solid var(--bg-accent);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  font-family: inherit;
}

.google-btn:hover {
  border-color: rgba(255, 255, 255, 0.15);
  background: var(--bg-card-hover);
}

.google-icon {
  flex-shrink: 0;
}
</style>
