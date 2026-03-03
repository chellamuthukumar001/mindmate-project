import { useState, useEffect, useCallback } from 'react';

// ─── usePWAInstall ─────────────────────────────────────────────
// Tracks the beforeinstallprompt event to allow a custom install UI
export function usePWAInstall() {
    const [installPromptEvent, setInstallPromptEvent] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if already running as installed PWA
        const isStandalone =
            window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true ||
            document.referrer.includes('android-app://');
        setIsInstalled(isStandalone);

        const handler = (e) => {
            e.preventDefault();
            setInstallPromptEvent(e);
            setIsInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        window.addEventListener('appinstalled', () => {
            setIsInstalled(true);
            setIsInstallable(false);
            setInstallPromptEvent(null);
        });

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const promptInstall = useCallback(async () => {
        if (!installPromptEvent) return false;
        installPromptEvent.prompt();
        const { outcome } = await installPromptEvent.userChoice;
        if (outcome === 'accepted') {
            setIsInstalled(true);
            setIsInstallable(false);
            setInstallPromptEvent(null);
        }
        return outcome === 'accepted';
    }, [installPromptEvent]);

    return { isInstallable, isInstalled, promptInstall };
}

// ─── usePushNotifications ──────────────────────────────────────
// Manages push notification permissions and subscriptions
export function usePushNotifications() {
    const [permission, setPermission] = useState(
        typeof Notification !== 'undefined' ? Notification.permission : 'default'
    );
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        setIsSupported(
            typeof Notification !== 'undefined' &&
            'serviceWorker' in navigator &&
            'PushManager' in window
        );
        if (typeof Notification !== 'undefined') {
            setPermission(Notification.permission);
        }
    }, []);

    const requestPermission = useCallback(async () => {
        if (!isSupported) return 'unsupported';
        try {
            const result = await Notification.requestPermission();
            setPermission(result);
            if (result === 'granted') {
                // Schedule local wellness reminders after permission granted
                scheduleWellnessReminders();
            }
            return result;
        } catch (err) {
            console.error('[PWA] Notification permission error:', err);
            return 'denied';
        }
    }, [isSupported]);

    const sendLocalNotification = useCallback(async (title, options = {}) => {
        if (permission !== 'granted') return false;
        try {
            const reg = await navigator.serviceWorker.ready;
            await reg.showNotification(title, {
                icon: '/pwa-192x192.png',
                badge: '/pwa-64x64.png',
                vibrate: [100, 50, 100],
                ...options,
            });
            return true;
        } catch (err) {
            // Fallback to regular Notification API
            new Notification(title, options);
            return true;
        }
    }, [permission]);

    return { permission, isSupported, requestPermission, sendLocalNotification };
}

// ─── useOnlineStatus ───────────────────────────────────────────
export function useOnlineStatus() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const onOnline = () => setIsOnline(true);
        const onOffline = () => setIsOnline(false);
        window.addEventListener('online', onOnline);
        window.addEventListener('offline', onOffline);
        return () => {
            window.removeEventListener('online', onOnline);
            window.removeEventListener('offline', onOffline);
        };
    }, []);

    return isOnline;
}

// ─── Wellness Reminder Scheduler ───────────────────────────────
function scheduleWellnessReminders() {
    // Use localStorage to track last reminder time
    const REMINDER_KEY = 'mindmate_last_reminder';
    const lastReminder = localStorage.getItem(REMINDER_KEY);
    const now = Date.now();

    // Don't remind more than once every 4 hours
    if (lastReminder && now - parseInt(lastReminder) < 4 * 60 * 60 * 1000) return;

    const reminders = [
        { title: 'MindMate 🧠', body: "How are you feeling? Take a moment to log your mood today.", url: '/app/mood' },
        { title: 'MindMate 🌬️', body: "Feeling stressed? Try a 3-minute breathing exercise.", url: '/app/breathing' },
        { title: 'MindMate ✨', body: "Your AI companion is ready to chat. Talk to MindMate anytime.", url: '/app/chat' },
        { title: 'MindMate 🎯', body: "Ready for a focused work session? Start Focus Mode now.", url: '/app/focus' },
    ];

    // Schedule first reminder after 2 hours if permission was just granted
    setTimeout(async () => {
        if (Notification.permission !== 'granted') return;
        const reminder = reminders[Math.floor(Math.random() * reminders.length)];
        try {
            const reg = await navigator.serviceWorker.ready;
            reg.showNotification(reminder.title, {
                body: reminder.body,
                icon: '/pwa-192x192.png',
                badge: '/pwa-64x64.png',
                tag: 'wellness-reminder',
                data: { url: reminder.url },
                actions: [
                    { action: 'open', title: '✨ Open' },
                    { action: 'dismiss', title: 'Later' },
                ],
            });
            localStorage.setItem(REMINDER_KEY, Date.now().toString());
        } catch (e) {
            console.log('[PWA] Reminder notification skipped:', e.message);
        }
    }, 2 * 60 * 60 * 1000); // 2 hours
}
