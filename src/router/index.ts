import { createRouter, createWebHistory } from 'vue-router'

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
      path: '/sentences',
      name: 'sentences',
      component: () => import('../views/SentenceBuilderView.vue'),
      meta: { title: 'Sätze', icon: 'puzzle' }
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
      path: '/badges',
      name: 'badges',
      component: () => import('../views/BadgesView.vue'),
      meta: { title: 'Erfolge' }
    }
  ]
})

export default router
