var CACHE_VERSION = 'v6';
var STATIC_CACHE = 'luxury-static-' + CACHE_VERSION;
var API_CACHE = 'luxury-api-' + CACHE_VERSION;
var NAV_CACHE = 'luxury-nav-' + CACHE_VERSION;
var SYNC_CACHE = 'luxury-sync-' + CACHE_VERSION;
var OFFLINE_URL = '/offline';

var STATIC_PATTERNS = [
  /\.(?:css|js|woff2?|ttf|eot)$/,
  /\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico)$/,
  /\/icons\//,
];

var API_PATTERNS = [/\/api\//];

var NAV_PATTERNS = [
  /^\/($|(?:[a-z]{2,4}(?:-[A-Z]{2})?)\/(?:$|products\/|collections\/|search|cart|account))/,
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(function (cache) { return cache.add(OFFLINE_URL); })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (k) { return k !== STATIC_CACHE && k !== API_CACHE && k !== NAV_CACHE && k !== SYNC_CACHE; })
          .map(function (k) { return caches.delete(k); })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

function isStaticRequest(url) {
  // ponytail: never cache-first Next chunks — stale layout.js → ChunkLoadError in dev/HMR
  if (url.pathname.startsWith('/_next/')) return false;
  return STATIC_PATTERNS.some(function (p) { return p.test(url.pathname); });
}

function isApiRequest(url) {
  return API_PATTERNS.some(function (p) { return p.test(url.pathname); });
}

function isNavRequest(url) {
  return url.pathname !== OFFLINE_URL && NAV_PATTERNS.some(function (p) { return p.test(url.pathname); });
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
    var fallback = await caches.match(OFFLINE_URL);
    if (fallback) return fallback;
    return new Response('Offline', { status: 503 });
  }
}

async function networkFirst(request, cacheName) {
  try {
    var response = await fetch(request);
    if (response.ok) {
      var cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (e) {
    var cached = await caches.match(request);
    if (cached) return cached;
    var fallback = await caches.match(OFFLINE_URL);
    if (fallback) return fallback;
    return new Response('Offline', { status: 503 });
  }
}

self.addEventListener('fetch', function (event) {
  var request = event.request;
  var url = new URL(request.url);

  if (url.origin !== self.location.origin) return;
  if (request.method !== 'GET') return;

  if (isApiRequest(url)) {
    event.respondWith(networkFirst(request, API_CACHE));
  } else if (isStaticRequest(url)) {
    event.respondWith(cacheFirst(request));
  } else if (isNavRequest(url)) {
    event.respondWith(networkFirst(request, NAV_CACHE));
  } else {
    event.respondWith(networkFirst(request, NAV_CACHE));
  }
});

self.addEventListener('message', function (event) {
  if (!event.data) return;
  switch (event.data.type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
    case 'CACHE_URLS':
      if (Array.isArray(event.data.urls)) {
        var selfOrigin = self.location.origin;
        var sameOriginUrls = event.data.urls.filter(function (u) {
          try { return new URL(u, selfOrigin).origin === selfOrigin; } catch { return false; }
        });
        if (sameOriginUrls.length === 0) break;
        event.waitUntil(
          caches.open(NAV_CACHE).then(function (cache) {
            return Promise.allSettled(
              sameOriginUrls.map(function (url) { return cache.add(url).catch(function () {}); })
            );
          })
        );
      }
      break;
  }
});

self.addEventListener('sync', function (event) {
  if (event.tag === 'sync-actions') {
    event.waitUntil(processSyncQueue());
  }
});

self.addEventListener('periodicsync', function (event) {
  if (event.tag === 'refresh-cache') {
    event.waitUntil(refreshCache());
  }
});

async function processSyncQueue() {
  var cache = await caches.open(SYNC_CACHE);
  var requests = await cache.keys();
  var results = await Promise.allSettled(
    requests.map(async function (request) {
      try {
        var clonedReq = request.clone();
        var bodyText = null;
        try {
          var body = await clonedReq.json();
          bodyText = JSON.stringify(body);
        } catch (e) {
          bodyText = await clonedReq.text().catch(function () { return null; });
        }

        var headers = new Headers(request.headers);
        headers.delete('authorization');
        headers.delete('x-shopify-access-token');

        var response = await fetch(request.url, {
          method: request.method,
          headers: headers,
          body: bodyText,
        });
        if (response.ok) {
          await cache.delete(request);
        }
      } catch (e) {}
    })
  );
  return results;
}

async function refreshCache() {
  var cache = await caches.open(NAV_CACHE);
  var requests = await cache.keys();
  var batch = requests.slice(0, 20);
  await Promise.allSettled(
    batch.map(async function (request) {
      try {
        var response = await fetch(request);
        if (response.ok) {
          await cache.put(request, response);
        }
      } catch (e) {}
    })
  );
}
