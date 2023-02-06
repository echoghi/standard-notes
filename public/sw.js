if (!self.define) {
  let e,
    s = {};
  const n = (n, c) => (
    (n = new URL(n + '.js', c).href),
    s[n] ||
      new Promise(s => {
        if ('document' in self) {
          const e = document.createElement('script');
          (e.src = n), (e.onload = s), document.head.appendChild(e);
        } else (e = n), importScripts(n), s();
      }).then(() => {
        let e = s[n];
        if (!e) throw new Error(`Module ${n} didn’t register its module`);
        return e;
      })
  );
  self.define = (c, a) => {
    const i = e || ('document' in self ? document.currentScript.src : '') || location.href;
    if (s[i]) return;
    let t = {};
    const r = e => n(e, i),
      o = { module: { uri: i }, exports: t, require: r };
    s[i] = Promise.all(c.map(e => o[e] || r(e))).then(e => (a(...e), t));
  };
}
define(['./workbox-588899ac'], function (e) {
  'use strict';
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: '/_next/static/a_3lojW2BYh8kPpS4aR-6/_buildManifest.js',
          revision: '320da4fd8ea3c666ebc37e044e0728e7',
        },
        {
          url: '/_next/static/a_3lojW2BYh8kPpS4aR-6/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        { url: '/_next/static/chunks/0c428ae2-897a32e8692eac4a.js', revision: '897a32e8692eac4a' },
        { url: '/_next/static/chunks/17007de1-8d822d2daa814310.js', revision: '8d822d2daa814310' },
        { url: '/_next/static/chunks/1a48c3c1-4e30a84c4c381813.js', revision: '4e30a84c4c381813' },
        { url: '/_next/static/chunks/1bfc9850-e2b635d1f148f8d7.js', revision: 'e2b635d1f148f8d7' },
        { url: '/_next/static/chunks/203.a92547a29ded5f08.js', revision: 'a92547a29ded5f08' },
        { url: '/_next/static/chunks/252f366e-0bc475854485b5b0.js', revision: '0bc475854485b5b0' },
        { url: '/_next/static/chunks/392-0f3cbf846e457b54.js', revision: '0f3cbf846e457b54' },
        { url: '/_next/static/chunks/78e521c3-168e066615a9003e.js', revision: '168e066615a9003e' },
        { url: '/_next/static/chunks/7f0c75c1-1d63f5432e3aaee6.js', revision: '1d63f5432e3aaee6' },
        { url: '/_next/static/chunks/894.8b3e79a97f1244f1.js', revision: '8b3e79a97f1244f1' },
        { url: '/_next/static/chunks/95b64a6e-2bfb3d88cc0721a6.js', revision: '2bfb3d88cc0721a6' },
        { url: '/_next/static/chunks/977-955facc4fde7de46.js', revision: '955facc4fde7de46' },
        { url: '/_next/static/chunks/9b380ffa-64401b5ced35b091.js', revision: '64401b5ced35b091' },
        { url: '/_next/static/chunks/d7eeaac4-38cc6d3c9be1455b.js', revision: '38cc6d3c9be1455b' },
        { url: '/_next/static/chunks/de71a805-460d406cf0988dd4.js', revision: '460d406cf0988dd4' },
        { url: '/_next/static/chunks/framework-3b5a00d5d7e8d93b.js', revision: '3b5a00d5d7e8d93b' },
        { url: '/_next/static/chunks/main-55c7edb2ef69e12e.js', revision: '55c7edb2ef69e12e' },
        {
          url: '/_next/static/chunks/pages/_app-1553ad4d5b25eefa.js',
          revision: '1553ad4d5b25eefa',
        },
        {
          url: '/_next/static/chunks/pages/_error-4b61be14865575c5.js',
          revision: '4b61be14865575c5',
        },
        {
          url: '/_next/static/chunks/pages/index-0c8d4786125ce9c8.js',
          revision: '0c8d4786125ce9c8',
        },
        {
          url: '/_next/static/chunks/pages/signin-601fc11fc9a4fe38.js',
          revision: '601fc11fc9a4fe38',
        },
        {
          url: '/_next/static/chunks/pages/signup-b6f84f0b628b5ae6.js',
          revision: 'b6f84f0b628b5ae6',
        },
        {
          url: '/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js',
          revision: '837c0df77fd5009c9e46d446188ecfd0',
        },
        { url: '/_next/static/chunks/webpack-adc8ae21bb142924.js', revision: 'adc8ae21bb142924' },
        { url: '/_next/static/css/663422b7d5d06e33.css', revision: '663422b7d5d06e33' },
        { url: '/android-chrome-192x192.png', revision: '104670fb758b148c207a567d116a43e8' },
        { url: '/android-chrome-512x512.png', revision: '14098dcd54cecbdbe327946d9ea57b61' },
        { url: '/apple-touch-icon.png', revision: 'a2ccebeec51839c9712d09a8d2371769' },
        { url: '/favicon-16x16.png', revision: '0630d95a05f08b48a7c4a2de5cb13225' },
        { url: '/favicon-32x32.png', revision: '8208cba98bac382f28739416c6eed505' },
        { url: '/favicon.ico', revision: 'c2bf213c1d635070e6ccc1b5559092f2' },
        { url: '/icon-192x192.png', revision: 'a886aa2f35fa7da436aeb52a5f09f94b' },
        { url: '/icon-256x256.png', revision: 'd2eb997714d67e648705a82cfa9e2f80' },
        { url: '/icon-384x384.png', revision: '18d1cd4b261db2e9cc382c59b4bcc982' },
        { url: '/icon-512x512.png', revision: '66889284bb9e7f700ae83121d9013090' },
        { url: '/icon.png', revision: '1cf0330da429c2f9d807781b9a62f427' },
        { url: '/manifest.json', revision: '2989fa331ffb264233ea0a94caf6c3a7' },
        { url: '/vercel.svg', revision: '4b4f1876502eb6721764637fe5c41702' },
      ],
      { ignoreURLParametersMatching: [] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      '/',
      new e.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: async ({ request: e, response: s, event: n, state: c }) =>
              s && 'opaqueredirect' === s.type
                ? new Response(s.body, { status: 200, statusText: 'OK', headers: s.headers })
                : s,
          },
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-font-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-image-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-image',
        plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: 'static-audio-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: 'static-video-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-js-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-style-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-data',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: 'static-data-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        const s = e.pathname;
        return !s.startsWith('/api/auth/') && !!s.startsWith('/api/');
      },
      new e.NetworkFirst({
        cacheName: 'apis',
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith('/api/');
      },
      new e.NetworkFirst({
        cacheName: 'others',
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: 'cross-origin',
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 })],
      }),
      'GET',
    );
});
