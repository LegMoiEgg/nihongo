import { ref } from 'vue'

/**
 * Composable for sentence block management (Duolingo-style).
 *
 * Interaction model — deliberately simple and touch-reliable:
 *   - Tap a word in the POOL  → it moves to the end of the answer.
 *   - Tap a word in the ANSWER → it moves back to the pool.
 * No drag, no swap mode, no double-tap. To fix word order you tap a word back
 * and re-tap the words in the order you want. This is far more reliable on
 * touch than the previous tap-to-swap + double-tap-to-remove scheme.
 */
export function useSentenceBlocks() {
  // Each slot carries a stable uid so Vue keys are correct even with duplicate
  // words (e.g. two は), and so taps always hit the right block.
  const selectedBlocks = ref<string[]>([])
  const availableBlocks = ref<string[]>([])
  const isLocked = ref(false) // lock after checking answer
  // Kept for backwards-compat with templates that referenced it (always null).
  const swapIndex = ref<number | null>(null)

  function initBlocks(correct: string[], distractors: string[]) {
    const all = [...correct, ...(distractors || [])]
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[all[i], all[j]] = [all[j], all[i]]
    }
    availableBlocks.value = all
    selectedBlocks.value = []
    isLocked.value = false
  }

  /** Tap a pool word → append it to the answer. */
  function selectBlock(index: number) {
    if (isLocked.value) return
    const block = availableBlocks.value[index]
    if (block === undefined) return
    selectedBlocks.value.push(block)
    availableBlocks.value.splice(index, 1)
  }

  /** Tap an answer word → send it back to the pool. (Replaces the old
   *  tap-to-swap behaviour; now a single tap just removes the word.) */
  function tapPlacedBlock(index: number) {
    removePlacedBlock(index)
  }

  /** Remove a placed block back to the available pool. */
  function removePlacedBlock(index: number) {
    if (isLocked.value) return
    const block = selectedBlocks.value[index]
    if (block === undefined) return
    availableBlocks.value.push(block)
    selectedBlocks.value.splice(index, 1)
  }

  function lock() {
    isLocked.value = true
  }

  function showCorrectAnswer(correctOrder: string[], distractors?: string[]) {
    selectedBlocks.value = [...correctOrder]
    availableBlocks.value = [...(distractors || [])]
  }

  return {
    selectedBlocks,
    availableBlocks,
    swapIndex,
    isLocked,
    initBlocks,
    selectBlock,
    tapPlacedBlock,
    removePlacedBlock,
    lock,
    showCorrectAnswer,
  }
}
