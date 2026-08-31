import { ref } from 'vue'

/**
 * Composable for sentence block management with reordering.
 * Blocks can be added from available pool, removed back to pool,
 * and reordered by tapping two blocks to swap them.
 */
export function useSentenceBlocks() {
  const selectedBlocks = ref<string[]>([])
  const availableBlocks = ref<string[]>([])
  const swapIndex = ref<number | null>(null) // index of first block selected for swap
  const isLocked = ref(false) // lock after checking answer

  function initBlocks(correct: string[], distractors: string[]) {
    const all = [...correct, ...(distractors || [])]
    // Shuffle
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]]
    }
    availableBlocks.value = all
    selectedBlocks.value = []
    swapIndex.value = null
    isLocked.value = false
  }

  /** Add a block from available pool to answer area */
  function selectBlock(index: number) {
    if (isLocked.value) return
    swapIndex.value = null // cancel any pending swap
    const block = availableBlocks.value[index]
    selectedBlocks.value.push(block)
    availableBlocks.value.splice(index, 1)
  }

  /** Tap a placed block: if another is already selected → swap, otherwise select for swap or remove */
  function tapPlacedBlock(index: number) {
    if (isLocked.value) return

    if (swapIndex.value !== null && swapIndex.value !== index) {
      // Swap the two blocks
      const temp = selectedBlocks.value[swapIndex.value]
      selectedBlocks.value[swapIndex.value] = selectedBlocks.value[index]
      selectedBlocks.value[index] = temp
      swapIndex.value = null
    } else if (swapIndex.value === index) {
      // Tapped same block again → deselect
      swapIndex.value = null
    } else {
      // First tap → select for swap
      swapIndex.value = index
    }
  }

  /** Remove a placed block back to available pool */
  function removePlacedBlock(index: number) {
    if (isLocked.value) return
    swapIndex.value = null
    const block = selectedBlocks.value[index]
    availableBlocks.value.push(block)
    selectedBlocks.value.splice(index, 1)
  }

  function lock() {
    isLocked.value = true
    swapIndex.value = null
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
