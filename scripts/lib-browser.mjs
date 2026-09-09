import { chromium } from "playwright";

/**
 * The image is preinstalled with Chromium 1194; the npm playwright package may
 * pin a different build. Launch the browser that actually exists rather than
 * downloading a second copy.
 */
export const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

export function launch(opts = {}) {
  return chromium.launch({ executablePath: CHROME, ...opts });
}
