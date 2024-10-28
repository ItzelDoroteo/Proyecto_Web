// serviceWorkerRegistration.js

// Este archivo se encarga de registrar el Service Worker para la PWA
const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    // [::1] es la dirección IPv6 localhost
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 son considerados localhost para IPv4
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])){3}$/
    )
  );
  
  export function register(config) {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      // El constructor de URL está disponible en todos los navegadores que soportan SW.
      const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
      if (publicUrl.origin !== window.location.origin) {
        // Nuestro Service Worker no funcionará si PUBLIC_URL está en un origen diferente.
        return;
      }
  
      window.addEventListener('load', () => {
        const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
  
        if (isLocalhost) {
          // Esto es para comprobar si el Service Worker está funcionando en localhost.
          checkValidServiceWorker(swUrl, config);
  
          // Agrega un recordatorio para que los desarrolladores vean los SW en localhost.
          navigator.serviceWorker.ready.then(() => {
            console.log(
              'Esta aplicación está siendo servida por un Service Worker en modo caché.'
            );
          });
        } else {
          // Registra el Service Worker en producción.
          registerValidSW(swUrl, config);
        }
      });
    }
  }
  
  function registerValidSW(swUrl, config) {
    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker == null) {
            return;
          }
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // Nuevo contenido está disponible y se ha cacheado.
                if (config && config.onUpdate) {
                  config.onUpdate(registration);
                }
              } else {
                // El contenido ha sido cacheado para el uso offline.
                if (config && config.onSuccess) {
                  config.onSuccess(registration);
                }
              }
            }
          };
        };
      })
      .catch((error) => {
        console.error('Error al registrar el Service Worker:', error);
      });
  }
  
  function checkValidServiceWorker(swUrl, config) {
    // Comprobamos si el Service Worker realmente existe.
    fetch(swUrl, {
      headers: { 'Service-Worker': 'script' },
    })
      .then((response) => {
        // Asegúrate de que el Service Worker realmente existe, y que estamos cargando la página.
        const contentType = response.headers.get('content-type');
        if (
          response.status === 404 ||
          (contentType != null && contentType.indexOf('javascript') === -1)
        ) {
          // No se encontró el Service Worker. Borrar y recargar.
          navigator.serviceWorker.ready.then((registration) => {
            registration.unregister().then(() => {
              window.location.reload();
            });
          });
        } else {
          // El Service Worker está encontrado. Continuar con el registro.
          registerValidSW(swUrl, config);
        }
      })
      .catch(() => {
        console.log(
          'No se encontró una conexión a Internet. La aplicación está funcionando en modo offline.'
        );
      });
  }
  
  export function unregister() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.unregister();
      });
    }
  }
  