// MindMate Custom Service Worker - Push Notifications & Offline Support
const CACHE_NAME = 'mindmate-v2';
const OFFLINE_URL = '/offline.html';

// Assets to pre-cache for offline support
const PRECACHE_ASSETS = [
    '/',
    '/app',
    '/app/chat',
    '/app/mood',
    '/app/breathing',
    '/app/focus',
    OFFLINE_URL,
];

// ─── Install Event ─────────────────────────────────────────────
self.addEventListener('install', (event) => {
    console.log('[SW] Installing MindMate Service Worker...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(PRECACHE_ASSETS).catch(() => {
                // Fail silently if some assets can't be cached
            });
        })
    );
    self.skipWaiting();
});

// ─── Activate Event ────────────────────────────────────────────
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating MindMate Service Worker...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// ─── Fetch Event (Network First, Cache Fallback) ───────────────
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests and external URLs
    if (event.request.method !== 'GET') return;
    if (!event.request.url.startsWith(self.location.origin)) return;
    // Skip API calls
    if (event.request.url.includes('/api/') ||
        event.request.url.includes('/chat') ||
        event.request.url.includes('/symptoms') ||
        event.request.url.includes('/health')) return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Cache successful responses
                if (response && response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                // Serve from cache when offline
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) return cachedResponse;
                    // Fallback to offline page for navigation requests
                    if (event.request.mode === 'navigate') {
                        return caches.match(OFFLINE_URL);
                    }
                });
            })
    );
});

// ─── Push Notification Handler ─────────────────────────────────
self.addEventListener('push', (event) => {
    console.log('[SW] Push received:', event);

    let data = {
        title: 'MindMate',
        body: 'Time for your daily mental wellness check-in! 🧠',
        icon: '/pwa-192x192.png',
        badge: '/pwa-64x64.png',
        tag: 'mindmate-notification',
        data: { url: '/app' },
    };

    if (event.data) {
        try {
            const payload = event.data.json();
            data = { ...data, ...payload };
        } catch (e) {
            data.body = event.data.text();
        }
    }

    const options = {
        body: data.body,
        icon: data.icon || '/pwa-192x192.png',
        badge: '/pwa-64x64.png',
        image: data.image,
        tag: data.tag || 'mindmate-notification',
        renotify: true,
        requireInteraction: false,
        vibrate: [100, 50, 100],
        data: data.data || { url: '/app' },
        actions: [
            { action: 'open', title: '✨ Open MindMate', icon: '/pwa-192x192.png' },
            { action: 'dismiss', title: 'Dismiss' },
        ],
        timestamp: Date.now(),
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// ─── Notification Click Handler ────────────────────────────────
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification clicked:', event.action);
    event.notification.close();

    if (event.action === 'dismiss') return;

    const urlToOpen = event.notification.data?.url || '/app';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // Try to focus existing MindMate window
            for (const client of clientList) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    client.navigate(urlToOpen);
                    return client.focus();
                }
            }
            // Open new window if none found
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});

// ─── Background Sync ───────────────────────────────────────────
self.addEventListener('sync', (event) => {
    if (event.tag === 'mood-sync') {
        event.waitUntil(syncMoodData());
    }
});

async function syncMoodData() {
    // Sync any queued mood data when back online
    const cache = await caches.open(CACHE_NAME);
    console.log('[SW] Background sync: mood data synced');
}

// ─── Periodic Background Sync (Wellness Reminders) ─────────────
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'wellness-reminder') {
        event.waitUntil(showWellnessReminder());
    }
});

async function showWellnessReminder() {
    const reminders = [
        { body: "🧘 Time for a breathing exercise. Take 3 minutes to reset.", url: '/app/breathing' },
        { body: "💬 How are you feeling today? Log your mood to track your wellness journey.", url: '/app/mood' },
        { body: "🧠 Ready for a focus session? Stay on top of your mental health.", url: '/app/focus' },
        { body: "✨ Your AI companion is here. Chat with MindMate for support.", url: '/app/chat' },
    ];
    const reminder = reminders[Math.floor(Math.random() * reminders.length)];

    return self.registration.showNotification('MindMate Wellness Reminder', {
        body: reminder.body,
        icon: '/pwa-192x192.png',
        badge: '/pwa-64x64.png',
        tag: 'wellness-reminder',
        vibrate: [200, 100, 200],
        data: { url: reminder.url },
        actions: [
            { action: 'open', title: '✨ Open' },
            { action: 'dismiss', title: 'Later' },
        ],
    });
}

// ─── Message Handler (from app) ────────────────────────────────
self.addEventListener('message', (event) => {
    if (event.data?.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    if (event.data?.type === 'SHOW_NOTIFICATION') {
        const { title, options } = event.data;
        self.registration.showNotification(title, options);
    }
});
