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
          url: '/_next/static/MLtYBRuC2_nwI5CeNn8wd/_buildManifest.js',
          revision: 'f7f08e2f0b5bebeb83956742713de543',
        },
        {
          url: '/_next/static/MLtYBRuC2_nwI5CeNn8wd/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        { url: '/_next/static/chunks/0c428ae2-69f2da6d3df26f9c.js', revision: '69f2da6d3df26f9c' },
        { url: '/_next/static/chunks/17007de1-5b2385f7f94ed880.js', revision: '5b2385f7f94ed880' },
        { url: '/_next/static/chunks/1a48c3c1-3a98ddd996b0098f.js', revision: '3a98ddd996b0098f' },
        { url: '/_next/static/chunks/1bfc9850-dd718c07421f5692.js', revision: 'dd718c07421f5692' },
        { url: '/_next/static/chunks/203.a92547a29ded5f08.js', revision: 'a92547a29ded5f08' },
        { url: '/_next/static/chunks/252f366e-7a54b5dd190a594c.js', revision: '7a54b5dd190a594c' },
        { url: '/_next/static/chunks/30-d9c89d312aa4f954.js', revision: 'd9c89d312aa4f954' },
        { url: '/_next/static/chunks/321-0c49b53975859f50.js', revision: '0c49b53975859f50' },
        { url: '/_next/static/chunks/468-8870d3d50a00d228.js', revision: '8870d3d50a00d228' },
        { url: '/_next/static/chunks/78e521c3-2f7b1ef02942a5ca.js', revision: '2f7b1ef02942a5ca' },
        { url: '/_next/static/chunks/7f0c75c1-29bcc9b0fd50afa1.js', revision: '29bcc9b0fd50afa1' },
        { url: '/_next/static/chunks/894.8b3e79a97f1244f1.js', revision: '8b3e79a97f1244f1' },
        { url: '/_next/static/chunks/95b64a6e-d6c8c084e505a0b4.js', revision: 'd6c8c084e505a0b4' },
        { url: '/_next/static/chunks/9b380ffa-c8ad583ec0717772.js', revision: 'c8ad583ec0717772' },
        { url: '/_next/static/chunks/d7eeaac4-b474bfe71ca35ef0.js', revision: 'b474bfe71ca35ef0' },
        { url: '/_next/static/chunks/de71a805-7369f6453e18132a.js', revision: '7369f6453e18132a' },
        { url: '/_next/static/chunks/framework-3b5a00d5d7e8d93b.js', revision: '3b5a00d5d7e8d93b' },
        { url: '/_next/static/chunks/main-55c7edb2ef69e12e.js', revision: '55c7edb2ef69e12e' },
        {
          url: '/_next/static/chunks/pages/_app-35e273a479560a51.js',
          revision: '35e273a479560a51',
        },
        {
          url: '/_next/static/chunks/pages/_error-4b61be14865575c5.js',
          revision: '4b61be14865575c5',
        },
        {
          url: '/_next/static/chunks/pages/index-7994bb6dee02e56d.js',
          revision: '7994bb6dee02e56d',
        },
        {
          url: '/_next/static/chunks/pages/signin-1f4795ab8ec6848c.js',
          revision: '1f4795ab8ec6848c',
        },
        {
          url: '/_next/static/chunks/pages/signup-8b0859e2c9cf2ebc.js',
          revision: '8b0859e2c9cf2ebc',
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
