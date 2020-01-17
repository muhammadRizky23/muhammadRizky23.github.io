importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');
 
if (workbox)
  console.log(`Workbox berhasil dimuat`);
else
  console.log(`Workbox gagal dimuat`);


workbox.precaching.precacheAndRoute([
    { url: '/css/materialize.min.css', revision: '1' },
    { url: '/css/style_custom.css', revision: '1' },
    { url: '/js/api.js', revision: '1' },
    { url: '/js/db.js', revision: '1' },
    { url: '/js/script.js', revision: '1' },
    { url: '/js/idb.js', revision: '1' },
    { url: '/js/materialize.min.js', revision: '1' },
    { url: '/js/nav.js', revision: '1' },
    { url: '/js/materialize.min.js', revision: '1' },
    { url: '/js/script.js', revision: '1' },
    { url: '/pages/league.html', revision: '1' },
    { url: '/pages/match.html', revision: '1' },
    { url: '/pages/favorite.html', revision: '1' },
    { url: '/detailteam.html', revision: '1' },
    { url: '/icon.png', revision: '1' },
    { url: '/index.html', revision: '1' },
    { url: '/manifest.json', revision: '1' },
    { url: '/nav.html', revision: '1' },
    { url: '/images/arrow_back.png', revision: '1' },
    { url: '/images/favorite.png', revision: '1' },
    { url: '/images/unfavorite.png', revision: '1' },
], {
  ignoreUrlParametersMatching: [/.*/]
});


workbox.routing.registerRoute(
    new RegExp('https://api.football-data.org/v2/'),
    workbox.strategies.staleWhileRevalidate()
);

workbox.routing.registerRoute( // untuk get terlebih dulu ke cache
    /\.(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.cacheFirst({ //disimpan terlebih dahulu di dalam cache sebelum ditampilkan menggunakan strategi cache first
        cacheName: 'images',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari batas akhir cache dapat digunakan
            }),
        ],
    }),
);


workbox.routing.registerRoute(
    new RegExp('/js/'),workbox.strategies.cacheFirst({
      cacheName: 'script'
  })
);


workbox.routing.registerRoute(
  new RegExp('/css/'),
  workbox.strategies.cacheFirst({
      cacheName: 'styles'
  })
);

workbox.routing.registerRoute(
  new RegExp('/pages/'),
  workbox.strategies.staleWhileRevalidate({
        cacheName: 'pages'
    })
);

self.addEventListener('push', function(event) {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Berhasil push notification!';
  }
  var options = {
    body: body,
    icon: 'icon.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});