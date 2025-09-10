let intervalId: ReturnType<typeof setInterval> | null = null;

/**
 * startTicker
 *  - mode = 'real': 1 echte Sekunde = 1 simulierte Sekunde
 *  - mode = 'sandbox': Zeit wird beschleunigt je nach scale
 *    scale 'normal'  => 1m/60s (Faktor 1)
 *    scale 'fast'    => 1m/30s (Faktor 2)
 *    scale 'top'     => 1m/5s  (Faktor 12)
 */
export function startTicker(
  mode: 'real' | 'sandbox',
  scale: 'normal' | 'fast' | 'top',
  onTick: (ms: number) => void
) {
  if (intervalId) clearInterval(intervalId);
  let simFactor = 1;
  if (mode === 'sandbox') {
    simFactor = scale === 'normal' ? (60 / 60) : scale === 'fast' ? (60 / 30) : (60 / 5);
  }
  intervalId = setInterval(() => {
    onTick(1000 * simFactor);
  }, 1000);
}

export function stopTicker() {
  if (intervalId) clearInterval(intervalId);
  intervalId = null;
}
