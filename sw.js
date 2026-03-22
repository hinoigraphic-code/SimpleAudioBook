const CACHE_NAME = 'audiobook-cache-v1';
const urlsToCache = [
  './index.html',
  './manifest.json'
];

// インストール時にキャッシュを保存
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// ネットワークリクエスト時のキャッシュ利用
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // キャッシュがあればそれを返し、なければネットワークから取得
        return response || fetch(event.request);
      })
  );
});
