/**
 * Shared scavenger-hunt logic used by the Dashboard box and the kana overviews.
 *
 * The hunt is "active" only within its date window AND while the user hasn't
 * finished it. Tapping the correct target for the current station advances the
 * step; finishing the last station grants the reward and raises a popup signal.
 */
import { computed, ref } from 'vue'
import { useUserStore } from '../stores/user'
import {
  SCAVENGER_STATIONS,
  SCAVENGER_TOTAL,
  SCAVENGER_FALLBACK_COINS,
  isScavengerActive,
  type ScavengerStation,
} from '../data/scavenger-hunt'

function berlinToday(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Berlin' })
}

/** Reward popup signal (shown by the Dashboard once the hunt is completed). */
export const scavengerReward = ref<
  | { kind: 'frame'; frameName: string }
  | { kind: 'coins'; amount: number }
  | null
>(null)

export function useScavenger() {
  const userStore = useUserStore()

  const finished = computed(() => userStore.scavengerStep >= SCAVENGER_TOTAL)

  /** Within date window (regardless of finished — so we can show "done"). */
  const inWindow = computed(() => isScavengerActive(berlinToday()))

  /** The hunt box should be visible: inside the window, OR already finished
   *  during the window (so the "completed" state can show until it closes). */
  const visible = computed(() => inWindow.value)

  /** The station the user is currently on, or null if finished/out of range. */
  const currentStation = computed<ScavengerStation | null>(() => {
    if (finished.value) return null
    return SCAVENGER_STATIONS[userStore.scavengerStep] ?? null
  })

  const step = computed(() => userStore.scavengerStep)
  const total = SCAVENGER_TOTAL

  /**
   * Call when a potential target is tapped. `kind` + `id` identify what was
   * tapped. If it matches the current station, advance (and reward on finish).
   * Returns true if it was the correct target (so the UI can react).
   */
  function tapTarget(kind: 'kana' | 'flame', id?: string): boolean {
    if (!inWindow.value || finished.value) return false
    const station = currentStation.value
    if (!station) return false
    if (station.targetKind !== kind) return false
    if (kind === 'kana' && station.targetId !== id) return false

    const willFinish = userStore.scavengerStep + 1 >= SCAVENGER_TOTAL
    userStore.advanceScavenger()

    if (willFinish) {
      const reward = userStore.grantRandomFrame(SCAVENGER_FALLBACK_COINS)
      scavengerReward.value = reward
    }
    return true
  }

  return { visible, inWindow, finished, currentStation, step, total, tapTarget }
}
