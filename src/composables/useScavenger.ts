/**
 * Shared scavenger-hunt logic (multi-event). Used by the Dashboard box, the
 * kana overviews, and any view that hosts a "spot" target (Profil/Shop/Social).
 *
 * The currently relevant hunt is whichever event is active for today's date.
 * Tapping the correct target for the current station advances that event's
 * progress; finishing the last station grants the event's reward and raises a
 * popup signal.
 */
import { computed, ref } from 'vue'
import { useUserStore } from '../stores/user'
import {
  activeScavengerEvent,
  type ScavengerStation,
  type ScavengerTargetKind,
} from '../data/scavenger-hunt'

function berlinToday(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Berlin' })
}

/** Reward popup signal (shown by the Dashboard once a hunt is completed). */
export const scavengerReward = ref<
  | { kind: 'frame'; frameName: string }
  | { kind: 'accent'; accentName: string }
  | { kind: 'coins'; amount: number }
  | null
>(null)

export function useScavenger() {
  const userStore = useUserStore()

  /** The event active for today, or null (outside all windows). */
  const event = computed(() => activeScavengerEvent(berlinToday()))

  /** Current step within the active event (0-based). */
  const step = computed(() =>
    event.value ? userStore.scavengerProgress[event.value.id] ?? 0 : 0,
  )

  const total = computed(() => event.value?.stations.length ?? 0)

  const finished = computed(() => !!event.value && step.value >= total.value)

  /** The hunt box is visible whenever an event window is open. */
  const visible = computed(() => !!event.value)

  /** The station the user is currently on, or null if finished/none. */
  const currentStation = computed<ScavengerStation | null>(() => {
    if (!event.value || finished.value) return null
    return event.value.stations[step.value] ?? null
  })

  /**
   * Call when a potential target is tapped. Returns true if it was the correct
   * target for the current station (so the UI can react, e.g. navigate home).
   */
  function tapTarget(kind: ScavengerTargetKind, id?: string): boolean {
    const ev = event.value
    if (!ev || finished.value) return false
    const station = currentStation.value
    if (!station || station.targetKind !== kind) return false
    if ((kind === 'kana' || kind === 'spot') && station.targetId !== id) return false

    const willFinish = step.value + 1 >= ev.stations.length
    userStore.advanceScavenger(ev.id)

    if (willFinish) {
      scavengerReward.value =
        ev.reward === 'randomAccent'
          ? userStore.grantRandomAccent(ev.fallbackCoins)
          : userStore.grantRandomFrame(ev.fallbackCoins)
    }
    return true
  }

  return { event, visible, finished, currentStation, step, total, tapTarget }
}
