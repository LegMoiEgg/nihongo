<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useSocialStore } from '../stores/social'

const authStore = useAuthStore()
const socialStore = useSocialStore()

const showCreateModal = ref(false)
const showJoinModal = ref(false)
const newGroupName = ref('')
const joinGroupId = ref('')
const creating = ref(false)
const joining = ref(false)

onMounted(() => {
  if (authStore.isLoggedIn) {
    socialStore.loadMyGroups()
  }
})

async function createGroup() {
  if (!newGroupName.value.trim()) return
  creating.value = true
  await socialStore.createGroup(newGroupName.value.trim())
  creating.value = false
  newGroupName.value = ''
  showCreateModal.value = false
}

async function joinGroup() {
  if (!joinGroupId.value.trim()) return
  joining.value = true
  await socialStore.joinGroup(joinGroupId.value.trim())
  joining.value = false
  joinGroupId.value = ''
  showJoinModal.value = false
}

async function openGroup(groupId: string) {
  await socialStore.loadGroupDetails(groupId)
}

function closeGroup() {
  socialStore.currentGroup = null
}
</script>

<template>
  <div class="social-page">
    <!-- Not logged in -->
    <div v-if="!authStore.isLoggedIn" class="social-login-prompt">
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

      <!-- Group ID for sharing -->
      <div class="group-id-card card-flat">
        <span class="group-id-label">Gruppen-ID zum Teilen:</span>
        <code class="group-id-value">{{ socialStore.currentGroup.id }}</code>
      </div>

      <!-- Leaderboard -->
      <section class="leaderboard">
        <h2>🏆 Rangliste</h2>
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
            <div class="member-info">
              <span class="member-name">{{ member.displayName }}</span>
              <span class="member-meta">Lv. {{ member.level }} · 🔥 {{ member.currentStreak }}</span>
            </div>
            <span class="member-xp">{{ member.totalXp }} XP</span>
          </div>
        </div>
      </section>

      <!-- Leave group -->
      <button class="btn btn-ghost leave-btn" @click="socialStore.leaveGroup(socialStore.currentGroup!.id)">
        Gruppe verlassen
      </button>
    </div>

    <!-- Groups List -->
    <div v-else class="social-main">
      <header class="social-header">
        <h1>👥 Social</h1>
      </header>

      <!-- Action buttons -->
      <div class="social-actions">
        <button class="btn btn-primary" @click="showCreateModal = true">+ Gruppe erstellen</button>
        <button class="btn btn-secondary" @click="showJoinModal = true">Gruppe beitreten</button>
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
              <span class="group-card-name">{{ group.name }}</span>
              <span class="group-card-members">{{ group.memberUids.length }} Mitglieder</span>
            </div>
            <span class="group-card-arrow">→</span>
          </div>
        </div>
      </section>

      <div v-else-if="!socialStore.loading" class="no-groups">
        <p>Du bist noch keiner Gruppe beigetreten.</p>
        <p class="no-groups-hint">Erstelle eine Gruppe oder tritt einer bei!</p>
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
    <div v-if="showJoinModal" class="modal-overlay" @click.self="showJoinModal = false">
      <div class="modal card">
        <h2>Gruppe beitreten</h2>
        <form @submit.prevent="joinGroup">
          <div class="form-group">
            <label>Gruppen-ID</label>
            <input v-model="joinGroupId" placeholder="Gruppen-ID einfügen" required />
          </div>
          <p v-if="socialStore.error" class="modal-error">{{ socialStore.error }}</p>
          <div class="modal-actions">
            <button type="button" class="btn btn-ghost" @click="showJoinModal = false; socialStore.clearError()">Abbrechen</button>
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
  padding-bottom: 32px;
  min-height: calc(100vh - var(--nav-height));
}

/* Login Prompt */
.social-login-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - var(--nav-height) - 32px);
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
  cursor: pointer;
}

.group-card-name {
  font-weight: 600;
  font-size: 0.95rem;
}

.group-card-members {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.group-card-arrow {
  color: var(--text-muted);
  font-size: 1.2rem;
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

/* Leaderboard */
.leaderboard {
  margin-bottom: 24px;
}

.leaderboard h2 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 12px;
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
