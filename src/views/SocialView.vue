<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useSocialStore } from '../stores/social'
import { useUserStore } from '../stores/user'
import { flushSave } from '../stores/sync'

const authStore = useAuthStore()
const socialStore = useSocialStore()
const userStore = useUserStore()

const showCreateModal = ref(false)
const newGroupName = ref('')
const nudgeToast = ref('')
const newGroupPassword = ref('')
const creating = ref(false)

// Join flow
const joining = ref(false)
const showPasswordModal = ref(false)
const passwordInput = ref('')
const pendingJoinGroupId = ref('')

/** Is the current user already a member of the group being viewed? */
const isMemberOfCurrent = computed(() => {
  const g = socialStore.currentGroup
  if (!g || !authStore.uid) return false
  return g.memberUids.includes(authStore.uid)
})

/** All groups the user is NOT already a member of (for the directory). */
const otherGroups = computed(() => {
  const myIds = new Set(socialStore.myGroups.map(g => g.id))
  return socialStore.allGroups.filter(g => !myIds.has(g.id))
})

const OPEN_GROUP_KEY = 'nihongo_open_group'

// Restore the group the user last had open, so a page refresh keeps them
// inside the group instead of bouncing back to the group overview.
async function restoreOpenGroup() {
  const savedId = localStorage.getItem(OPEN_GROUP_KEY)
  if (savedId) {
    await socialStore.loadGroupDetails(savedId)
  }
}

async function loadEverything() {
  socialStore.loadNudgedToday()
  await socialStore.loadMyGroups()
  await socialStore.loadAllGroups()
  await restoreOpenGroup()
}

onMounted(() => {
  if (authStore.isLoggedIn) loadEverything()
})

// Also reload when auth state changes (e.g. after page refresh)
watch(() => authStore.isLoggedIn, (loggedIn) => {
  if (loggedIn) loadEverything()
})

async function createGroup() {
  if (!newGroupName.value.trim()) return
  creating.value = true
  const id = await socialStore.createGroup(
    newGroupName.value.trim(),
    newGroupPassword.value.trim() || undefined
  )
  creating.value = false
  newGroupName.value = ''
  newGroupPassword.value = ''
  showCreateModal.value = false
  await socialStore.loadAllGroups()
  if (id) await openGroup(id)
}

// Password the user already entered to view a protected group this session,
// so joining afterwards doesn't ask for it again.
const unlockedPassword = ref('')

/**
 * Join the currently-viewed group. If it's protected, the user has already
 * entered the password to view it, so we reuse it.
 */
async function joinCurrentGroup() {
  const g = socialStore.currentGroup
  if (!g) return
  socialStore.clearError()

  // Protected group but no password remembered (e.g. after a page refresh)
  // → ask for it again before joining.
  if (g.password && !unlockedPassword.value) {
    pendingJoinGroupId.value = g.id
    passwordInput.value = ''
    showPasswordModal.value = true
    return
  }

  await doJoin(g.id, g.password ? unlockedPassword.value : undefined)
}

/**
 * Submit the password modal: verify the password, then OPEN the group's
 * details so the user can view the members before deciding to join.
 */
async function submitPasswordJoin() {
  const pw = passwordInput.value.trim()
  joining.value = true
  const ok = await socialStore.verifyGroupPassword(pendingJoinGroupId.value, pw)
  joining.value = false
  if (ok) {
    unlockedPassword.value = pw
    showPasswordModal.value = false
    passwordInput.value = ''
    await openGroup(pendingJoinGroupId.value)
  }
  // On failure, socialStore.error is shown in the modal
}

async function doJoin(groupId: string, password?: string) {
  joining.value = true
  const ok = await socialStore.joinGroup(groupId, password)
  joining.value = false
  if (ok) {
    localStorage.setItem(OPEN_GROUP_KEY, groupId)
    await flushSave()
    await socialStore.loadGroupDetails(groupId)
    await socialStore.loadAllGroups()
  }
  // On failure, socialStore.error is shown in the detail view
}

/**
 * Open a group from the list. Protected groups the user is NOT a member of
 * require the password BEFORE the members/leaderboard can be viewed.
 */
async function openGroupFromList(group: { id: string; password?: string; memberUids: string[] }) {
  const isMember = authStore.uid ? group.memberUids.includes(authStore.uid) : false

  if (group.password && !isMember) {
    // Protected & not a member → ask for the password first.
    socialStore.clearError()
    pendingJoinGroupId.value = group.id
    passwordInput.value = ''
    showPasswordModal.value = true
    return
  }

  await openGroup(group.id)
}

async function openGroup(groupId: string) {
  // Remember which group is open so a refresh keeps the user inside it.
  localStorage.setItem(OPEN_GROUP_KEY, groupId)
  // Push our own latest XP/streak to Firestore first so the leaderboard
  // shows fresh data for the current user (not a stale synced value).
  await flushSave()
  await socialStore.loadGroupDetails(groupId)
}

function closeGroup() {
  localStorage.removeItem(OPEN_GROUP_KEY)
  socialStore.currentGroup = null
}

async function leaveCurrentGroup() {
  const g = socialStore.currentGroup
  if (!g) return
  localStorage.removeItem(OPEN_GROUP_KEY)
  await socialStore.leaveGroup(g.id)
}

async function refreshGroup() {
  const g = socialStore.currentGroup
  if (!g) return
  await flushSave()
  await socialStore.loadGroupDetails(g.id)
}

interface NudgeMember {
  uid: string
  displayName: string
  goalReachedToday: boolean
  canBeNudged: boolean
}

/** Whether a reminder can be sent to this member right now. */
function canNudge(member: NudgeMember): boolean {
  return (
    member.canBeNudged &&
    !member.goalReachedToday &&
    !socialStore.hasNudged(member.uid)
  )
}

/** Tooltip explaining the bell state. */
function nudgeTitle(member: NudgeMember): string {
  if (member.goalReachedToday) return 'Tagesziel bereits erreicht'
  if (!member.canBeNudged) return 'Keine Benachrichtigungen aktiv'
  if (socialStore.hasNudged(member.uid)) return 'Heute schon erinnert'
  return 'Erinnern'
}

async function nudgeMember(member: NudgeMember) {
  if (!canNudge(member)) return
  const g = socialStore.currentGroup
  if (!g) return
  const myName = userStore.displayName || authStore.displayName || 'Ein Freund'
  const ok = await socialStore.nudge(member.uid, myName, g.name)
  if (ok) {
    nudgeToast.value = `${member.displayName} wurde erinnert! 🔔`
    setTimeout(() => { nudgeToast.value = '' }, 2500)
  }
}
</script>

<template>
  <div class="social-page">
    <!-- Not logged in -->
    <div v-if="authStore.loading" class="social-loading">
      <p>Laden...</p>
    </div>
    <div v-else-if="!authStore.isLoggedIn" class="social-login-prompt">
      <div class="prompt-icon">👥</div>
      <h1>Social</h1>
      <p>Melde dich an um Gruppen beizutreten und dich mit Freunden zu messen.</p>
      <router-link to="/auth" class="btn btn-primary">Anmelden</router-link>
    </div>

    <!-- Group Detail View -->
    <div v-else-if="socialStore.currentGroup" class="group-detail">
      <header class="social-header">
        <button class="btn-ghost back-btn" @click="closeGroup" aria-label="Zurück">‹</button>
        <h1>{{ socialStore.currentGroup.name }}</h1>
        <span class="member-count">{{ socialStore.currentGroup.memberUids.length }} 👥</span>
      </header>

      <!-- Group ID for sharing (members only) -->
      <div v-if="isMemberOfCurrent" class="group-id-card card-flat">
        <span class="group-id-label">Gruppen-ID zum Teilen:</span>
        <code class="group-id-value">{{ socialStore.currentGroup.id }}</code>
        <span v-if="socialStore.currentGroup.password" class="group-protected">🔒 Passwortgeschützt</span>
      </div>

      <!-- Preview banner for non-members -->
      <div v-else class="group-preview-banner card-flat">
        <span>{{ socialStore.currentGroup.password ? '🔒 Passwortgeschützte Gruppe' : '🌐 Öffentliche Gruppe' }}</span>
        <span class="preview-hint">Schau dir die Mitglieder an und tritt bei.</span>
      </div>

      <!-- Leaderboard -->
      <section class="leaderboard">
        <div class="leaderboard-head">
          <h2>🏆 Rangliste</h2>
          <button
            class="btn-ghost refresh-btn"
            :class="{ spinning: socialStore.loading }"
            :disabled="socialStore.loading"
            aria-label="Aktualisieren"
            title="Aktualisieren"
            @click="refreshGroup"
          >
            🔄
          </button>
        </div>
        <div class="leaderboard-list">
          <div
            v-for="(member, index) in socialStore.currentGroup.members"
            :key="member.uid"
            class="leaderboard-row"
            :class="{
              'is-me': member.uid === authStore.uid,
              'top-1': index === 0,
              'top-2': index === 1,
              'top-3': index === 2,
            }"
          >
            <span class="rank">
              <template v-if="index === 0">🥇</template>
              <template v-else-if="index === 1">🥈</template>
              <template v-else-if="index === 2">🥉</template>
              <template v-else>{{ index + 1 }}</template>
            </span>
            <img
              v-if="member.avatarDataUrl"
              :src="member.avatarDataUrl"
              alt=""
              class="member-avatar"
            />
            <div v-else class="member-avatar-placeholder">
              <svg viewBox="0 0 24 24" fill="none" class="member-avatar-icon">
                <circle cx="12" cy="8" r="4" fill="currentColor"/>
                <path d="M4 20c0-3.3 2.7-6 6-6h4c3.3 0 6 2.7 6 6" fill="currentColor"/>
              </svg>
            </div>
            <div class="member-info">
              <span class="member-name">{{ member.displayName }}</span>
              <span class="member-meta">
                Lv. {{ member.level }} · 🔥 {{ member.currentStreak }}
              </span>
            </div>
            <span class="member-xp">{{ member.totalXp }} XP</span>

            <!-- Nudge bell: always shown for OTHER members.
                 Active (🔔) only when a reminder makes sense; otherwise
                 disabled (🔕) = goal reached / notifications off / already nudged. -->
            <button
              v-if="member.uid !== authStore.uid"
              class="nudge-btn"
              :class="{ nudged: !canNudge(member) }"
              :disabled="!canNudge(member)"
              :title="nudgeTitle(member)"
              @click="nudgeMember(member)"
            >
              {{ canNudge(member) ? '🔔' : '🔕' }}
            </button>
          </div>
        </div>
      </section>

      <!-- Nudge confirmation toast -->
      <transition name="fade">
        <div v-if="nudgeToast" class="nudge-toast">{{ nudgeToast }}</div>
      </transition>

      <!-- Leave group (members only) -->
      <button v-if="isMemberOfCurrent" class="btn btn-ghost leave-btn" @click="leaveCurrentGroup">
        Gruppe verlassen
      </button>

      <!-- Spacer so content isn't hidden behind the sticky join bar -->
      <div v-if="!isMemberOfCurrent" class="bottom-spacer" />

      <!-- Sticky join bar for non-members -->
      <div v-if="!isMemberOfCurrent" class="sticky-join-bar">
        <button class="btn btn-primary sticky-join-btn" :disabled="joining" @click="joinCurrentGroup">
          {{ joining ? '...' : socialStore.currentGroup.password ? '🔒 Beitreten' : 'Beitreten' }}
        </button>
      </div>
    </div>

    <!-- Groups List -->
    <div v-else class="social-main">
      <header class="social-header">
        <h1>👥 Social</h1>
      </header>

      <!-- Action button -->
      <div class="social-actions">
        <button class="btn btn-primary" @click="showCreateModal = true">+ Gruppe erstellen</button>
      </div>

      <!-- Loading -->
      <div v-if="socialStore.loading" class="social-loading">
        <p>Laden...</p>
      </div>

      <!-- Error -->
      <p v-if="socialStore.error" class="social-error">{{ socialStore.error }}</p>

      <!-- My groups -->
      <section v-if="socialStore.myGroups.length > 0" class="my-groups">
        <h2>Meine Gruppen</h2>
        <div class="groups-list">
          <div
            v-for="group in socialStore.myGroups"
            :key="group.id"
            class="group-card card"
            @click="openGroup(group.id)"
          >
            <div class="group-card-info">
              <span class="group-card-name">
                <span v-if="group.password" class="group-lock">🔒</span>{{ group.name }}
              </span>
            </div>
            <span class="group-card-count">{{ group.memberUids.length }} 👥</span>
          </div>
        </div>
      </section>

      <!-- All groups directory -->
      <section v-if="otherGroups.length > 0" class="all-groups">
        <h2>Alle Gruppen</h2>
        <div class="groups-list">
          <div
            v-for="group in otherGroups"
            :key="group.id"
            class="group-card card"
            @click="openGroupFromList(group)"
          >
            <div class="group-card-info">
              <span class="group-card-name">
                <span v-if="group.password" class="group-lock">🔒</span>{{ group.name }}
              </span>
            </div>
            <span class="group-card-count">{{ group.memberUids.length }} 👥</span>
          </div>
        </div>
      </section>

      <div v-else-if="!socialStore.loading && socialStore.myGroups.length === 0" class="no-groups">
        <p>Es gibt noch keine Gruppen.</p>
        <p class="no-groups-hint">Erstelle die erste Gruppe!</p>
      </div>
    </div>

    <!-- Create Group Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
      <div class="modal card">
        <h2>Neue Gruppe</h2>
        <form @submit.prevent="createGroup">
          <div class="form-group">
            <label>Gruppenname</label>
            <input v-model="newGroupName" placeholder="z.B. Japanisch Lerngruppe" maxlength="40" required />
          </div>
          <div class="form-group">
            <label>Passwort (optional)</label>
            <input v-model="newGroupPassword" type="password" placeholder="Leer = offen für alle" maxlength="30" />
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-ghost" @click="showCreateModal = false">Abbrechen</button>
            <button type="submit" class="btn btn-primary" :disabled="creating">
              {{ creating ? '...' : 'Erstellen' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Join Group Modal -->
    <div v-if="showPasswordModal" class="modal-overlay" @click.self="showPasswordModal = false; socialStore.clearError()">
      <div class="modal card">
        <h2>🔒 Passwort erforderlich</h2>
        <form @submit.prevent="submitPasswordJoin">
          <div class="form-group">
            <label>Gruppenpasswort</label>
            <input v-model="passwordInput" type="password" placeholder="Passwort eingeben" autofocus />
          </div>
          <p v-if="socialStore.error" class="modal-error">{{ socialStore.error }}</p>
          <div class="modal-actions">
            <button type="button" class="btn btn-ghost" @click="showPasswordModal = false; socialStore.clearError()">Abbrechen</button>
            <button type="submit" class="btn btn-primary" :disabled="joining">
              {{ joining ? '...' : 'Beitreten' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.social-page {
  max-width: 600px;
  margin: 0 auto;
  padding: var(--content-padding);
  padding-bottom: 16px;
}

/* Login Prompt */
.social-login-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100dvh - var(--nav-height) - 32px);
  gap: 16px;
  text-align: center;
}

.prompt-icon {
  font-size: 3rem;
}

.social-login-prompt h1 {
  font-size: 1.5rem;
  font-weight: 700;
}

.social-login-prompt p {
  color: var(--text-secondary);
  max-width: 280px;
}

.social-login-prompt .btn {
  text-decoration: none;
  margin-top: 8px;
}

/* Header */
.social-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
}

.social-header h1 {
  font-size: 1.4rem;
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

.member-count {
  color: var(--text-muted);
  font-size: 0.85rem;
}

/* Actions */
.social-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.social-actions .btn {
  flex: 1;
  padding: 12px;
  font-size: 0.9rem;
}

.social-loading {
  text-align: center;
  color: var(--text-muted);
  padding: 24px;
}

.social-error {
  color: var(--accent-primary);
  font-size: 0.85rem;
  text-align: center;
  padding: 8px;
  background: rgba(233, 69, 96, 0.1);
  border-radius: var(--radius-sm);
  margin-bottom: 16px;
}

/* Groups list */
.my-groups h2 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 12px;
}

.groups-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.group-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  cursor: pointer;
}

.group-card-info {
  min-width: 0;
  flex: 1;
}

.group-card-name {
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.group-lock {
  font-size: 0.85rem;
}

/* Member count on the right — number + 👥 symbol, like the group header */
.group-card-count {
  flex-shrink: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
  white-space: nowrap;
}

.all-groups {
  margin-top: 8px;
}

.no-groups {
  text-align: center;
  padding: 32px 0;
  color: var(--text-secondary);
}

.no-groups-hint {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 4px;
}

/* Group Detail */
.group-id-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 20px;
  padding: 14px;
}

.group-preview-banner {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 20px;
  padding: 14px;
  font-weight: 600;
}

.preview-hint {
  font-size: 0.8rem;
  font-weight: 400;
  color: var(--text-muted);
}

/* Sticky join bar (mirrors the Kana "Lernen starten" button) */
.sticky-join-bar {
  position: fixed;
  bottom: var(--nav-height);
  left: 0;
  right: 0;
  padding: 12px 16px;
  background: linear-gradient(to top, var(--bg-primary) 60%, transparent);
  z-index: 50;
  display: flex;
  justify-content: center;
}

.sticky-join-btn {
  width: 100%;
  max-width: 568px;
  padding: 16px;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: var(--radius-md);
  box-shadow: 0 -2px 20px rgba(233, 69, 96, 0.3);
}

.bottom-spacer {
  height: 80px;
}

.group-id-label {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.group-id-value {
  font-size: 0.8rem;
  font-family: monospace;
  background: var(--bg-accent);
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  word-break: break-all;
  user-select: all;
}

.group-protected {
  font-size: 0.75rem;
  color: var(--accent-warning);
  font-weight: 500;
}

/* Leaderboard */
.leaderboard {
  margin-bottom: 24px;
}

.leaderboard h2 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 12px;
}

.leaderboard-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.refresh-btn {
  font-size: 1.1rem;
  line-height: 1;
  padding: 8px;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-bottom: 12px;
}

.refresh-btn.spinning {
  animation: refresh-spin 0.8s linear infinite;
}

@keyframes refresh-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.leaderboard-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  border: 2px solid transparent;
  transition: all var(--transition-fast);
}

.leaderboard-row.is-me {
  border-color: var(--accent-primary);
  background: rgba(233, 69, 96, 0.06);
}

.leaderboard-row.top-1 {
  border-color: var(--accent-gold);
  background: rgba(255, 215, 0, 0.06);
}

.rank {
  width: 32px;
  text-align: center;
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--text-muted);
  flex-shrink: 0;
}

.member-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--bg-accent);
  flex-shrink: 0;
}

.member-avatar-placeholder {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--bg-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.member-avatar-icon {
  width: 20px;
  height: 20px;
  color: var(--text-muted);
}

.member-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.member-name {
  font-weight: 600;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.member-meta {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.member-xp {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--accent-primary);
  flex-shrink: 0;
}

/* Nudge (reminder) bell button */
.nudge-btn {
  flex-shrink: 0;
  background: var(--bg-accent);
  border: none;
  border-radius: 50%;
  width: 34px;
  height: 34px;
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  transition: transform var(--transition-fast), background var(--transition-fast);
}

.nudge-btn:hover:not(:disabled) {
  background: var(--accent-primary);
  transform: scale(1.1);
}

.nudge-btn:disabled {
  opacity: 0.4;
  cursor: default;
}

/* Nudge confirmation toast */
.nudge-toast {
  position: fixed;
  bottom: calc(var(--nav-height) + 20px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--accent-success);
  color: #fff;
  padding: 12px 20px;
  border-radius: var(--radius-xl);
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: var(--shadow-elevated);
  z-index: 60;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.leave-btn {
  width: 100%;
  color: var(--accent-primary);
  font-size: 0.85rem;
}

/* Modals */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 16px;
}

.modal {
  width: 100%;
  max-width: 360px;
  padding: 24px;
}

.modal h2 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
}

.form-group label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.form-group input {
  background: var(--bg-primary);
  border: 2px solid var(--bg-accent);
  border-radius: var(--radius-md);
  padding: 12px 14px;
  font-size: 1rem;
  color: var(--text-primary);
  font-family: inherit;
  outline: none;
}

.form-group input:focus {
  border-color: var(--accent-primary);
}

.modal-error {
  color: var(--accent-primary);
  font-size: 0.85rem;
  margin-bottom: 8px;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
