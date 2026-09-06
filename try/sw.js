// Service worker for copperline.dev/try: makes the emulator installable and
// able to start with no network at all. Everything the page needs is
// same-origin by design (no CDNs - the fonts, the wasm and the AROS ROMs
// are all served from this site), so one precache pass on install covers a
// cold offline start.
//
// Strategy: network first, cache fallback, for every same-origin GET. The
// page glue (try.js) and the wasm bundle (pkg/) must always change
// together, and network-first means an online visitor gets the newest
// consistent pair while an offline one gets the last consistent pair that
// was cached. Nothing is served stale while the network is up, so there is
// no version dance beyond bumping CACHE when the precache list changes
// shape.

const CACHE = 'copperline-try-v5';

const PRECACHE = [
  './',
  './site.js',
  './try.js',
  './netplay.js',
  './netplay-room.js',
  './netplay-media.js',
  './netplay-swap.js',
  './netplay-diagnostics.js',
  './netplay-qr.js',
  './netplay-qr.LICENSE',
  './render-stride.js',
  './serial-telnet.js',
  './audio-worklet.js',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './pkg/copperline_web.js',
  './pkg/copperline_web_bg.wasm',
  './aros/aros-amiga-m68k-rom.bin',
  './aros/aros-amiga-m68k-ext.bin',
  './aros/LICENSE',
  '../style.css',
  '../assets/nav.js',
  '../assets/copperline-icon.png',
  '../assets/fonts/ibm-plex-sans-var.woff2',
  '../assets/fonts/chakra-petch-700.woff2',
  '../assets/fonts/ibm-plex-mono-400.woff2',
  '../favicon.ico',
  '../favicon-32.png',
  '../apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      // Add each entry on its own rather than addAll: one missing asset
      // (a renamed font, a 404) must not void the whole offline set.
      await Promise.allSettled(PRECACHE.map((url) => cache.add(url)));
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      for (const name of await caches.keys()) {
        if (name !== CACHE) await caches.delete(name);
      }
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  // Only same-origin GETs: POSTs are not cacheable, and cross-origin
  // traffic (a ?df0= disk on another host, the WebSocket upgrade) belongs
  // to the network alone.
  if (request.method !== 'GET' || new URL(request.url).origin !== location.origin) return;
  event.respondWith(
    (async () => {
      try {
        const response = await fetch(request);
        // Cache the good same-origin responses as they fly past, so the
        // offline copy tracks whatever the visitor last used online.
        if (response.ok && response.type === 'basic') {
          const cache = await caches.open(CACHE);
          cache.put(request, response.clone());
        }
        return response;
      } catch (networkError) {
        // Offline (or the host is down): serve the cached copy. A
        // navigation with query parameters (?df0=...) still matches the
        // cached page itself.
        const cached = await caches.match(request, {
          ignoreSearch: request.mode === 'navigate',
        });
        if (cached) return cached;
        if (request.mode === 'navigate') {
          const page = await caches.match('./');
          if (page) return page;
        }
        throw networkError;
      }
    })(),
  );
});
