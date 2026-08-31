let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  // Resume if suspended (browser requires user gesture first)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) {
  const ctx = getAudioContext()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = type
  osc.frequency.value = frequency
  gain.gain.value = volume

  // Fade out to avoid click
  gain.gain.setValueAtTime(volume, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)

  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + duration)
}

/** Happy ascending chime — correct answer */
export function playCorrectSound() {
  const ctx = getAudioContext()
  const now = ctx.currentTime

  // Two-note ascending chime: C5 → E5
  const notes = [523, 659]
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq
    gain.gain.value = 0.25
    gain.gain.setValueAtTime(0.25, now + i * 0.12)
    gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.12 + 0.25)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now + i * 0.12)
    osc.stop(now + i * 0.12 + 0.3)
  })
}

/** Descending buzz — wrong answer */
export function playWrongSound() {
  const ctx = getAudioContext()
  const now = ctx.currentTime

  // Two-note descending: E4 → C4
  const notes = [330, 262]
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.value = freq
    gain.gain.value = 0.2
    gain.gain.setValueAtTime(0.2, now + i * 0.15)
    gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.2)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now + i * 0.15)
    osc.stop(now + i * 0.15 + 0.25)
  })
}
