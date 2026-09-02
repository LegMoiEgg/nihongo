/**
 * App-wide feature flags.
 *
 * DEV_TOOLS: when true, the hidden developer tools (set level, push-token
 * refresh, test notification) are shown in the Profile. Set this to `false`
 * for production releases so normal users can't access them.
 *
 * To use the dev tools during testing: set to `true`, then build & deploy.
 */
export const DEV_TOOLS = false
