const CACHE_NAME = "streamarena-v2";
const PRECACHE = ["/", "/manifest.json"];

// Patterns that should NEVER be intercepted by the SW
function shouldBypass(url) {
  return (
    url.includes(".ts") ||
    url.includes(".m3u8") ||
    url.includes(".mp4") ||
    url.includes(".webm") ||
    url.includes("stream") ||
    url.includes("live/") ||
    url.includes("index.m3u8") ||
    url.includes("tracks-v") ||
    url.includes("premiumtvs") ||
    url.includes("aynaott") ||
    url.includes("gpcdn") ||
    url.includes("bdixbd") ||
    url.includes("ncare.live") ||
    url.includes("amitomar") ||
    url.includes("output/") ||
    // Always bypass non-GET requests
    false
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
        )
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  // Bypass: non-GET requests
  if (event.request.method !== "GET") return;

  // Bypass: streaming / video / external media URLs
  if (shouldBypass(url)) return;

  // Bypass: cross-origin requests (only cache same-origin assets)
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.origin !== self.location.origin) return;
  } catch {
    return;
  }

  // Network-first for HTML navigations
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("/"))
    );
    return;
  }

  // Cache-first for static assets
  event.respondWith(
    caches.match(event.request).then(
      (cached) =>
        cached ||
        fetch(event.request).then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
    )
  );
});
