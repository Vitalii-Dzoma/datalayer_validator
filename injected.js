// injected.js - runs in page context, has full access to window.dataLayer
(function () {
  function getDataLayerInfo() {
    const dl = window.dataLayer || [];
    const mappEvents = window.__mappEvaluator ? window.__mappEvaluator.events : [];
    return {
      dataLayer: JSON.parse(JSON.stringify(dl)),
      events: mappEvents,
      url: window.location.href,
      pageType: detectPageType()
    };
  }

  function detectPageType() {
    const url = window.location.href.toLowerCase();
    const path = window.location.pathname.toLowerCase();
    
    if (path.includes('/checkout') || path.includes('/order-confirm') || 
        path.includes('/thank-you') || path.includes('/order-complete')) return 'Order Confirmation Page';
    if (path.includes('/cart') || path.includes('/basket')) return 'Cart Page';
    if (path.includes('/search') || document.querySelector('[data-search-results]')) return 'Search Result Page';
    if (path.includes('/product') || path.includes('/p/') || 
        document.querySelector('[itemtype*="Product"]') ||
        document.querySelector('.product-detail, .pdp, #product-detail')) return 'Product Detail Page';
    if (path === '/' || path === '/index') return 'Home Page';
    return 'All Pages';
  }

  // Expose to content script
  window.__mappGetDL = getDataLayerInfo;
  
  // Dispatch result
  const result = getDataLayerInfo();
  window.dispatchEvent(new CustomEvent('__mappDLData', { detail: result }));
})();
