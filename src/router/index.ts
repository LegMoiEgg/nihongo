import { createRouter, createWebHistory } from 'vue-router'
import { authSettled } from '../stores/sync'

declare module 'vue-router' {
  interface RouteMeta {
    skipOnboardingCheck?: boolean
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { title: 'Dashboard', icon: 'home' }
    },
    {
      path: '/daily',
      name: 'daily',
      component: () => import('../views/DailyLessonView.vue'),
      meta: { title: 'Tägliche Lektion' }
    },
    {
      path: '/learn',
      name: 'learn',
      component: () => import('../views/LearnView.vue'),
      meta: { title: 'Lernen', icon: 'book' }
    },
    {
      path: '/learn/hiragana',
      name: 'learn-hiragana',
      component: () => import('../views/LearnSessionView.vue'),
      props: { category: 'hiragana' }
    },
    {
      path: '/learn/hiragana/overview',
      name: 'overview-hiragana',
      component: () => import('../views/KanaOverviewView.vue'),
      props: { category: 'hiragana' }
    },
    {
      path: '/learn/hiragana/combos',
      name: 'combos-hiragana',
      component: () => import('../views/KanaCombosView.vue'),
      props: { category: 'hiragana' }
    },
    {
      path: '/learn/katakana',
      name: 'learn-katakana',
      component: () => import('../views/LearnSessionView.vue'),
      props: { category: 'katakana' }
    },
    {
      path: '/learn/katakana/overview',
      name: 'overview-katakana',
      component: () => import('../views/KanaOverviewView.vue'),
      props: { category: 'katakana' }
    },
    {
      path: '/learn/katakana/combos',
      name: 'combos-katakana',
      component: () => import('../views/KanaCombosView.vue'),
      props: { category: 'katakana' }
    },
    {
      path: '/learn/kanji',
      name: 'learn-kanji',
      component: () => import('../views/LearnSessionView.vue'),
      props: { category: 'kanji' }
    },
    {
      path: '/learn/kanji/overview',
      name: 'overview-kanji',
      component: () => import('../views/KanjiOverviewView.vue'),
    },
    {
      path: '/learn/vocabulary',
      name: 'learn-vocabulary',
      component: () => import('../views/LearnSessionView.vue'),
      props: { category: 'vocabulary' }
    },
    {
      path: '/learn/vocabulary/overview',
      name: 'overview-vocabulary',
      component: () => import('../views/VocabOverviewView.vue'),
    },
    {
      path: '/social',
      name: 'social',
      component: () => import('../views/SocialView.vue'),
      meta: { title: 'Social', icon: 'social' }
    },
    {
      path: '/sentences',
      name: 'sentences',
      component: () => import('../views/SentenceBuilderView.vue'),
      meta: { title: 'Sätze' }
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('../views/VocabTestView.vue'),
      meta: { title: 'Test', icon: 'test' }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { title: 'Profil', icon: 'profile' }
    },
    {
      path: '/profile/:uid',
      name: 'public-profile',
      component: () => import('../views/PublicProfileView.vue'),
      props: true,
      meta: { title: 'Profil' }
    },
    {
      path: '/badges',
      name: 'badges',
      component: () => import('../views/BadgesView.vue'),
      meta: { title: 'Erfolge' }
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/AuthView.vue'),
      meta: { title: 'Anmelden' }
    },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: () => import('../views/OnboardingView.vue'),
      meta: { title: 'Willkommen', skipOnboardingCheck: true }
    },
    {
      path: '/placement',
      name: 'placement',
      component: () => import('../views/PlacementTestView.vue'),
      meta: { title: 'Einstufungstest', skipOnboardingCheck: true }
    }
  ]
})

// Redirect to onboarding on first launch
// Skip if user already has progress (e.g. logged in on another device)
router.beforeEach(async (to) => {
  if (to.meta.skipOnboardingCheck || to.name === 'onboarding') return

  // Wait for auth restore + initial cloud load to finish before deciding.
  // Otherwise, right after a logout-reload, localStorage is empty and we'd
  // wrongly send a returning user to onboarding before their data loads.
  // Guard against hanging forever if the network stalls.
  await Promise.race([
    authSettled,
    new Promise<void>((resolve) => setTimeout(resolve, 8000)),
  ])

  const onboardingDone = localStorage.getItem('nihongo_onboarding_done') === 'true'
  if (onboardingDone) return

  // Check if user already has data from cloud sync (returning user on new device)
  const hasXp = parseInt(localStorage.getItem('nihongo_xp') || '0') > 0
  const hasPlacement = parseInt(localStorage.getItem('nihongo_placement_level') || '0') > 0
  const hasProgress = localStorage.getItem('nihongo_card_progress') !== null

  if (hasXp || hasPlacement || hasProgress) {
    // Returning user — mark onboarding as done and let them through
    localStorage.setItem('nihongo_onboarding_done', 'true')
    localStorage.setItem('nihongo_placement_done', 'true')
    return
  }

  return { name: 'onboarding' }
})

export default router
