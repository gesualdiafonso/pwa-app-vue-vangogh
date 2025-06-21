import { precacheAndRoute } from 'workbox-precaching'

precacheAndRoute(self.__WB_MANIFEST)

const CACHE_NAME = 'vangogh-cache-v2'
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/src/assets/main.css',
  '/src/main.js',
  '/manifest.json',
  '/images/iconos/VanGoghApp192x192.png',
  '/images/iconos/VanGoghApp512x512.png',
]

// 1️ Instala o SW e salva os assets no cache
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando el service worker...')
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Cacheando arquivos essenciais...')
      return cache.addAll(ASSETS_TO_CACHE)
    }),
  )
  self.skipWaiting()
})

// 2️ Ativa o SW e limpa caches antigos
self.addEventListener('activate', (event) => {
  console.log('[SW] Activando y limpiando caches antigos...')
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              console.log('[SW] Haciendo el delite de cache antigo:', cache)
              return caches.delete(cache)
            }
          }),
        )
      })
      .then(() => self.clients.claim()),
  )
})

// 3️ Intercepta fetchs: responde com cache se possível, senão vai pra rede
self.addEventListener('fetch', (event) => {
  // Só intercepta requisições GET no mesmo domínio
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) return

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse // Cache first
      }

      return fetch(event.request) // fallback da rede
        .then((networkResponse) => {
          // Atualiza o cache em segundo plano
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone())
            return networkResponse
          })
        })
        .catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html')
          }
        })
    }),
  )
})
// 4️ Escuta eventos de push
self.addEventListener('push', (event) => {
  console.log('[SW] Notificaciones push recebidas.')

  const promiseChain = (async () => {
    let data = {
      title: 'Nueva notificación',
      body: 'Você tem uma nova atualização.',
    }

    if (event.data) {
      try {
        const json = event.data.json()
        data.title = json.title || data.title
        data.body = json.body || data.body
      } catch {
        const text = await event.data.text()
        data.body = text
      }
    }

    const options = {
      body: data.body,
      icon: '/images/iconos/VanGoghApp192x192.png',
      badge: '/images/iconos/VanGoghApp192x192.png',
      vibrate: [100, 50, 100],
    }

    return self.registration.showNotification(data.title, options)
  })()

  event.waitUntil(promiseChain)
})
