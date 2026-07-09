export function requestIdleTask(callback, timeout = 1600) {
  if (typeof window === 'undefined') return;

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback, { timeout });
    return;
  }

  window.setTimeout(callback, 1);
}

export function preloadImage(src) {
  if (typeof window === 'undefined' || !src) return;

  const image = new Image();
  image.decoding = 'async';
  image.src = src;
}
