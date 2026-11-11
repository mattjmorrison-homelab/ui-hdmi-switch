export async function reloadApp(): Promise<void> {
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((registration) => registration.unregister()));

  const keys = await caches.keys();
  await Promise.all(keys.map((key) => caches.delete(key)));

  window.location.reload();
}
