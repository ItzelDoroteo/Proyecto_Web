module.exports = {
    globDirectory: "build/",
    globPatterns: [
      "**/*.{html,js,css,png,jpg,svg}"
    ],
    swDest: "build/service-worker.js",
    runtimeCaching: [
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'images-cache',
          expiration: {
            maxEntries: 50, 
          },
        },
      },
      {
        urlPattern: /\.(?:js|css)$/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'static-resources',
        },
      },
    ],
  };
  