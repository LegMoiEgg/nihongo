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
      path: '/learn/katakana',
      name: 'learn-katakana',
      component: () => import('../views/LearnSessionView.vue'),
      props: { category: 'katakana' }
    },
    {
      path: '/learn/kanji',
      name: 'learn-kanji',
      component: () => import('../views/LearnSessionView.vue'),
      props: { category: 'kanji' }
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
      path: '/progress',
      name: 'progress',
      component: () => import('../views/ProgressView.vue'),
      meta: { title: 'Fortschritt', icon: 'chart' }
    }
  ]
})

export default router
