// Inject early to intercept all dataLayer.push calls
(function () {
  'use strict';

  // Use a unique namespace to avoid conflicts
  window.__mappEvaluator = window.__mappEvaluator || {
    events: [],
    snapshots: []
  };

  // Intercept dataLayer.push
  function installInterceptor() {
    if (!window.dataLayer) {
      window.dataLayer = [];
    }

    const originalPush = window.dataLayer.push.bind(window.dataLayer);

    window.dataLayer.push = function (...args) {
      args.forEach(obj => {
        if (obj && typeof obj === 'object') {
          const entry = {
            timestamp: Date.now(),
            data: JSON.parse(JSON.stringify(obj))
          };
          window.__mappEvaluator.events.push(entry);
          // Notify extension
          window.dispatchEvent(new CustomEvent('__mappDLEvent', { detail: entry }));
        }
      });
      return originalPush(...args);
    };

    // Also capture existing entries
    if (window.dataLayer.length > 0) {
      window.dataLayer.forEach(obj => {
        if (obj && typeof obj === 'object') {
          const entry = {
            timestamp: Date.now(),
            data: JSON.parse(JSON.stringify(obj))
          };
          if (!window.__mappEvaluator.events.find(e => JSON.stringify(e.data) === JSON.stringify(entry.data))) {
            window.__mappEvaluator.events.push(entry);
          }
        }
      });
    }
  }

  installInterceptor();

  // Re-install if dataLayer gets redefined
  let _dl = window.dataLayer;
  Object.defineProperty(window, 'dataLayer', {
    get: () => _dl,
    set: (newVal) => {
      _dl = newVal;
      installInterceptor();
    },
    configurable: true
  });

  // Listen for requests from popup
  window.addEventListener('__mappDLRequest', () => {
    window.dispatchEvent(new CustomEvent('__mappDLResponse', {
      detail: {
        events: window.__mappEvaluator.events,
        dataLayerSnapshot: window.dataLayer ? JSON.parse(JSON.stringify(window.dataLayer)) : []
      }
    }));
  });

})();
