var CACHE_VERSION = 'v8';
var STATIC_CACHE = 'luxury-static-' + CACHE_VERSION;
var OFFLINE_URL = '/offline';

// Only cache public static assets — never HTML, /api, or /_next (breaks load + HMR).
var STATIC_PATTERNS = [
  /\.(?:woff2?|ttf|eot)$/,
  /\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico)$/,
  /\/icons\//,
  /\/video-banner-hero\.mp4$/,
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(function (cache) {
      return cache.add(OFFLINE_URL);
    }),
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (k) {
              return k !== STATIC_CACHE;
            })
            .map(function (k) {
              return caches.delete(k);
            }),
        );
      })
      .then(function () {
        return self.clients.claim();
      }),
  );
});

function isStaticRequest(url) {
  if (url.pathname.startsWith('/_next/')) return false;
  if (url.pathname.includes('/api/')) return false;
  return STATIC_PATTERNS.some(function (p) {
    return p.test(url.pathname);
  });
}

async function cacheFirst(request) {
  var cached = await caches.match(request);
  if (cached) return cached;
  try {
    var response = await fetch(request);
    if (response.ok) {
      var cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (e) {
    return new Response('Offline', { status: 503 });
  }
}

self.addEventListener('fetch', function (event) {
  var request = event.request;
  var url = new URL(request.url);

  if (url.origin !== self.location.origin) return;
  if (request.method !== 'GET') return;
  if (!isStaticRequest(url)) return;

  event.respondWith(cacheFirst(request));
});

self.addEventListener('message', function (event) {
  if (!event.data) return;
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
