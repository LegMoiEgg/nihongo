<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useNotificationsStore } from '../stores/notifications'
import { useUserStore } from '../stores/user'
import { useLearningStore } from '../stores/learning'
import { loadFromCloud } from '../stores/sync'

const router = useRouter()
const authStore = useAuthStore()
const notifStore = useNotificationsStore()
const userStore = useUserStore()
const learningStore = useLearningStore()

const step = ref(1) // 1 = login, 2 = notifications
const email = ref('')
const password = ref('')
const name = ref('')
const mode = ref<'login' | 'register'>('register')
const submitting = ref(false)

async function handleAuth() {
  authStore.clearError()
  // Username is required for registration (catches whitespace-only input that
  // the HTML `required` attribute lets through).
  if (mode.value === 'register' && name.value.trim().length < 2) {
    authStore.error = 'Bitte gib einen Namen mit mindestens 2 Zeichen ein.'
    return
  }
  submitting.value = true
  try {
    if (mode.value === 'register') {
      await authStore.register(email.value, password.value, name.value)
      // A new registration always continues the onboarding steps.
      step.value = 2
    } else {
      await authStore.login(email.value, password.value)
      // Existing account → load their cloud data and skip onboarding.
      await continueForReturningUser()
    }
  } catch {
    // error shown from store
  } finally {
    submitting.value = false
  }
}

async function handleGoogle() {
  try {
    await authStore.loginWithGoogle()
    if (authStore.isLoggedIn) {
      // Google users may be new OR returning — decide based on cloud data.
      await continueForReturningUser()
    }
  } catch {
    // error shown from store
  }
}

/**
 * After logging into an existing account: load cloud progress. If the account
 * already has data, go straight to the home screen (skip notifications +
 * placement). Otherwise treat it as a new user and continue onboarding.
 */
async function continueForReturningUser() {
  const isReturning = await loadFromCloud()
  // Double-check the actual loaded state too — so a returning user is never
  // sent through onboarding even if the return flag is momentarily off.
  const hasProgress =
    userStore.totalXp > 0 ||
    userStore.placementLevel > 0 ||
    learningStore.cardProgress.length > 0

  if (isReturning || hasProgress) {
    localStorage.setItem('nihongo_onboarding_done', 'true')
    localStorage.setItem('nihongo_placement_done', 'true')
    router.replace('/')
  } else {
    step.value = 2
  }
}

function skipLogin() {
  step.value = 2
}

async function enableNotifications() {
  await notifStore.requestPermission()
  goToPlacement()
}

function skipNotifications() {
  goToPlacement()
}

function goToPlacement() {
  step.value = 3
}

function startPlacementTest() {
  localStorage.setItem('nihongo_onboarding_done', 'true')
  router.replace('/placement')
}

function skipPlacement() {
  localStorage.setItem('nihongo_onboarding_done', 'true')
  localStorage.setItem('nihongo_placement_done', 'true')
  router.replace('/')
}
</script>

<template>
  <div class="onboarding">
    <!-- Step 1: Login -->
    <div v-if="step === 1" class="onboarding-step animate-fade-in">
      <div class="ob-header">
        <span class="ob-logo jp-large">日</span>
        <h1>Willkommen bei NihonGo</h1>
        <p>Erstelle einen Account um deinen Fortschritt zu sichern und mit Freunden zu lernen.</p>
      </div>

      <div class="ob-form">
        <!-- Google button first -->
        <button class="btn google-btn" @click="handleGoogle">
          <svg class="google-icon" viewBox="0 0 24 24" width="18" height="18">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Mit Google anmelden
        </button>

        <div class="ob-divider"><span>oder</span></div>

        <form @submit.prevent="handleAuth">
          <div v-if="mode === 'register'" class="form-group">
            <input v-model="name" type="text" placeholder="Dein Name" maxlength="20" minlength="2" autocomplete="name" required />
          </div>
          <div class="form-group">
            <input v-model="email" type="email" placeholder="E-Mail" required autocomplete="email" />
          </div>
          <div class="form-group">
            <input v-model="password" type="password" placeholder="Passwort (min. 6 Zeichen)" required minlength="6" />
          </div>

          <p v-if="authStore.error" class="ob-error">{{ authStore.error }}</p>

          <button type="submit" class="btn btn-primary ob-submit" :disabled="submitting">
            {{ submitting ? '...' : mode === 'register' ? 'Account erstellen' : 'Anmelden' }}
          </button>
        </form>

        <button class="ob-toggle btn-ghost" @click="mode = mode === 'register' ? 'login' : 'register'; authStore.clearError()">
          {{ mode === 'register' ? 'Schon einen Account? Anmelden' : 'Noch kein Account? Registrieren' }}
        </button>
      </div>

      <button class="ob-skip" @click="skipLogin">
        Ohne Account fortfahren →
      </button>
    </div>

    <!-- Step 2: Notifications -->
    <div v-else-if="step === 2" class="onboarding-step animate-fade-in">
      <div class="ob-header">
        <span class="ob-icon">🔔</span>
        <h1>Erinnerungen</h1>
        <p>Möchtest du an deine tägliche Lektion erinnert werden?</p>
      </div>

      <div class="ob-notif-actions">
        <button class="btn btn-primary ob-notif-btn" @click="enableNotifications">
          Ja, erinnere mich
        </button>
        <button class="btn btn-ghost ob-notif-btn" @click="skipNotifications">
          Nein, vielleicht später
        </button>
      </div>

      <p class="ob-notif-hint">Du kannst das jederzeit im Profil ändern.</p>
    </div>

    <!-- Step 3: Placement Test -->
    <div v-else-if="step === 3" class="onboarding-step animate-fade-in">
      <div class="ob-header">
        <span class="ob-icon">🎯</span>
        <h1>Einstufungstest</h1>
        <p>Kannst du schon etwas Japanisch? Mach einen kurzen Test damit wir dein Level bestimmen können.</p>
      </div>

      <div class="ob-placement-actions">
        <button class="btn btn-primary ob-placement-btn" @click="startPlacementTest">
          Test starten
        </button>
        <button class="btn btn-ghost ob-placement-btn" @click="skipPlacement">
          Ich bin Anfänger, bei Level 1 starten
        </button>
      </div>

      <p class="ob-notif-hint">Der Test dauert ca. 5 Minuten und kann nur einmal gemacht werden.</p>
    </div>
  </div>
</template>

<style scoped>
.onboarding {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background: var(--bg-primary);
}

.onboarding-step {
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

/* Header */
.ob-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.ob-logo {
  font-size: 3.5rem;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.ob-icon {
  font-size: 3rem;
}

.ob-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
}

.ob-header p {
  color: var(--text-secondary);
  font-size: 0.9rem;
  max-width: 300px;
}

/* Form */
.ob-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.ob-form form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-group input {
  width: 100%;
  background: var(--bg-card);
  border: 2px solid var(--bg-accent);
  border-radius: var(--radius-md);
  padding: 12px 14px;
  font-size: 1rem;
  color: var(--text-primary);
  font-family: inherit;
  outline: none;
  transition: border-color var(--transition-fast);
  box-sizing: border-box;
}

.form-group input:focus {
  border-color: var(--accent-primary);
}

.form-group input::placeholder {
  color: var(--text-muted);
}

.ob-error {
  color: var(--accent-primary);
  font-size: 0.85rem;
  text-align: center;
  padding: 8px;
  background: rgba(233, 69, 96, 0.1);
  border-radius: var(--radius-sm);
}

.ob-submit {
  width: 100%;
  padding: 14px;
  font-size: 1rem;
}

.ob-submit:disabled {
  opacity: 0.5;
}

/* Google */
.google-btn {
  width: 100%;
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

/* Divider */
.ob-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.ob-divider::before,
.ob-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--bg-accent);
}

.ob-divider span {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.ob-toggle {
  font-size: 0.85rem;
}

/* Skip */
.ob-skip {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 0.85rem;
  cursor: pointer;
  padding: 8px;
  font-family: inherit;
  transition: color var(--transition-fast);
}

.ob-skip:hover {
  color: var(--text-secondary);
}

/* Notifications step */
.ob-notif-actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ob-notif-btn {
  width: 100%;
  padding: 14px;
  font-size: 1rem;
}

.ob-notif-hint {
  color: var(--text-muted);
  font-size: 0.8rem;
  text-align: center;
}

/* Placement step */
.ob-placement-actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ob-placement-btn {
  width: 100%;
  padding: 14px;
  font-size: 1rem;
}
</style>
