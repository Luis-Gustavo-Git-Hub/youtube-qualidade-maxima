(() => {
  'use strict';
  const ranks = {
    tiny: 144, small: 240, medium: 360, large: 480,
    hd720: 720, hd1080: 1080, hd1440: 1440, hd2160: 2160,
    hd2880: 2880, hd4320: 4320, highres: 10000
  };
  let enabled = false;
  let lastPlayer, lastVideo, lastTarget, lastAttempt = 0;
  window.addEventListener('message', event => {
    if (event.source !== window || event.origin !== location.origin ||
        event.data?.source !== 'youtube-max-settings' || typeof event.data.enabled !== 'boolean') return;
    const wasEnabled = enabled;
    enabled = event.data.enabled;
    lastTarget = undefined;
    if (!enabled && wasEnabled) {
      // Release the resolution range so manual selection and adaptive playback work again.
      try { lastPlayer?.setPlaybackQualityRange?.('auto', 'auto'); } catch {}
    }
    if (enabled) enforce();
  });
  window.postMessage({source:'youtube-max-ready'}, location.origin);

  function enforce() {
    if (!enabled) return;
    const player = document.querySelector('#movie_player, #shorts-player, .html5-video-player');
    if (!player || player.classList.contains('ad-showing') ||
        typeof player.getAvailableQualityLevels !== 'function') return;
    try {
      let details;
      try { details = player.getAvailableQualityData?.(); } catch {}
      const choices = Array.isArray(details) ? details.filter(q => q && q.isPlayable === true).map(q => ({
        quality: q.quality,
        formatId: q.formatId,
        height: Number.parseInt(q.qualityLabel, 10) || ranks[q.quality] || 0,
        premium: Boolean(q.paygatedQualityDetails) || /premium|enhanced|bitrate/i.test(q.qualityLabel || ''),
        bitrate: Number(q.bitrate) || 0
      })).filter(q => q.height > 0 && typeof q.quality === 'string') : [];
      // Only playable formats are eligible; a Premium promotion is not a playable stream.
      if (!choices.length) {
        const levels = player.getAvailableQualityLevels();
        if (!Array.isArray(levels)) return;
        for (const quality of levels) {
          if (ranks[quality]) choices.push({quality, height:ranks[quality], premium:false, bitrate:0});
        }
      }
      choices.sort((a,b) => b.height - a.height || Number(b.premium) - Number(a.premium) || b.bitrate - a.bitrate);
      const selected = choices[0];
      if (!selected) return;
      const target = selected.quality;
      const targetKey = target + ':' + JSON.stringify(selected.formatId ?? null);
      const video = player.getVideoData?.()?.video_id || location.href;
      const changed = player !== lastPlayer || video !== lastVideo || targetKey !== lastTarget;
      const now = Date.now();
      // Reapply after navigation, newly available resolutions, or an automatic downgrade.
      if (!changed && (now - lastAttempt < 10000)) return;
      lastAttempt = now;
      lastPlayer = player;
      lastVideo = video;
      lastTarget = targetKey;
      if (typeof player.setPlaybackQualityRange === 'function') {
        player.setPlaybackQualityRange(target, target, selected.formatId);
      } else if (typeof player.setPlaybackQuality === 'function') {
        player.setPlaybackQuality(target);
      }
    } catch {
      // The player may be replaced while a video or advertisement loads.
    }
  }

  document.addEventListener('yt-navigate-finish', enforce);
  document.addEventListener('yt-player-updated', enforce);
  document.addEventListener('loadedmetadata', enforce, true);
  document.addEventListener('playing', enforce, true);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) enforce();
  });
  setInterval(enforce, 2500);
  enforce();
})();
