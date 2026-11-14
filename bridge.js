(() => {
  const sync = () => chrome.storage.local.get({enabled:true, quality:'max'}).then(settings => {
    window.postMessage({source:'youtube-max-settings', enabled:settings.enabled !== false, quality:settings.quality}, location.origin);
  });
  sync();
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && (changes.enabled || changes.quality)) sync();
  });
  window.addEventListener('message', event => {
    if (event.source === window && event.origin === location.origin && event.data?.source === 'youtube-max-ready') sync();
  });
})();
