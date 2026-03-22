// ★アプリを更新したい時は、ここの v2 を v3, v4... と数字を上げていきます
const CACHE_NAME = 'audiobook-cache-v3';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// ① インストール処理
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // すぐに新しいバージョンを待機状態から有効にする
});

// ② 古いキャッシュの削除処理（新機能）
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // 現在のバージョン(CACHE_NAME)以外の古い記憶を全て削除する
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // 開いているページにすぐに新しい裏方プログラムを適用する
});

// ③ 通信のルール（新機能：Network First戦略）
self.addEventListener('fetch', event => {
  event.respondWith(
    // まずはインターネット（GitHub）に最新版がないか確認しにいく
    fetch(event.request).catch(() => {
      // オフラインなどで通信に失敗した場合だけ、スマホ内の記憶（キャッシュ）を返す
      return caches.match(event.request);
    })
  );
});
