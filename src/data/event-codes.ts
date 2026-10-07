/**
 * Event codes the user can redeem in the Shop for coins.
 *
 * Each code is redeemable ONCE per profile and only within its validity
 * window. Codes are matched case-insensitively. The list of already-redeemed
 * codes lives on the user profile (synced via Firestore), like milestones.
 *
 * NOTE: This is a client-side feature — the codes ship in the app bundle and
 * redemption is enforced on the client. That's a deliberate, accepted
 * trade-off (see the coin system in general). For tamper-proof codes a Cloud
 * Function would be required.
 */

export interface EventCode {
  /** Canonical code id (also what the user types; matched case-insensitively). */
  code: string
  reward: number
  /** Inclusive validity window as Berlin YYYY-MM-DD. from=null → always open. */
  from: string | null
  until: string | null
  /** Shown in the success toast. */
  label: string
}

export const EVENT_CODES: EventCode[] = [
  {
    code: 'NihonGo',
    reward: 100,
    from: null,            // from today / launch
    until: '2026-10-20',
    label: 'Willkommenscode',
  },
  {
    code: 'Halloween2026',
    reward: 50,
    from: '2026-10-29',
    until: '2026-11-02',
    label: 'Halloween-Event',
  },
]

export type RedeemResult =
  | { ok: true; reward: number; label: string; normalized: string }
  | { ok: false; reason: 'unknown' | 'expired' | 'not-yet' | 'already' }

/**
 * Validate a typed code against the catalog, the validity window and the set
 * of already-redeemed codes. `todayStr` is a Berlin YYYY-MM-DD. Does NOT mutate
 * anything — the caller awards coins + records the code on success.
 */
export function checkEventCode(
  input: string,
  todayStr: string,
  redeemed: string[],
): RedeemResult {
  const typed = input.trim().toLowerCase()
  const entry = EVENT_CODES.find(c => c.code.toLowerCase() === typed)
  if (!entry) return { ok: false, reason: 'unknown' }

  const normalized = entry.code.toLowerCase()
  if (redeemed.map(r => r.toLowerCase()).includes(normalized)) {
    return { ok: false, reason: 'already' }
  }
  if (entry.from && todayStr < entry.from) return { ok: false, reason: 'not-yet' }
  if (entry.until && todayStr > entry.until) return { ok: false, reason: 'expired' }

  return { ok: true, reward: entry.reward, label: entry.label, normalized }
}
