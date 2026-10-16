/** Shared timing and a short-lived canvas handoff across the two static routes. */
export function runMotion(duration: number, frame: (t: number) => void) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    frame(1);
    return Promise.resolve();
  }
  return new Promise<void>((resolve) => {
    const start = performance.now();
    function tick(now: number) {
      const t = Math.min(1, (now - start) / duration);
      frame(t * t * (3 - 2 * t));
      if (t < 1) requestAnimationFrame(tick);
      else resolve();
    }
    requestAnimationFrame(tick);
  });
}

export function navigateScene(url: string, canvas: HTMLCanvasElement) {
  try {
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const rect = canvas.getBoundingClientRect();
      sessionStorage.setItem(
        'desk-journey-frame',
        JSON.stringify({
          image: canvas.toDataURL('image/webp', 0.85),
          rect: {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
          },
          created: Date.now(),
        }),
      );
    }
  } catch {
    /* Navigation remains available when storage is restricted. */
  }
  location.assign(url);
}

export function revealJourney() {
  window.dispatchEvent(new Event('desk-journey-ready'));
}
