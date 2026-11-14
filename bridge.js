(() => {
  const send = enabled => window.postMessage({source:'youtube-max-settings', enabled}, location.origin);
  chrome.storage.local.get({enabled:true}).then(({enabled}) => send(enabled));
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.enabled) send(changes.enabled.newValue !== false);
  });
  window.addEventListener('message', event => {
    if (event.source === window && event.origin === location.origin && event.data?.source === 'youtube-max-ready') {
      chrome.storage.local.get({enabled:true}).then(({enabled}) => send(enabled));
    }
  });
})();
