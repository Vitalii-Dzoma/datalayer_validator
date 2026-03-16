// popup.js — DataLayer Evaluator for Mapp Intelligence Retail GTM

// ────────────────────────────────────────────────────────
// EVALUATION SCHEMA (derived from Excel + GA4 docs)
// ────────────────────────────────────────────────────────

const CHECKS = [
  // ── ALL PAGES ──
  {
    id: 'page_url',
    group: 'All Pages',
    groupIcon: '🌐',
    name: 'Page URL',
    description: 'URL without parameters or distinct page name',
    path: null,
    pathAlternatives: ['page_path', 'page_url', 'pagePath'],
    fallbackId: 'page_url_location',
    fallbackLabel: 'window.location.hostname + window.location.pathname',
    importance: 'mandatory',
    neededFor: 'Basic page view tracking',
    gtmVar: 'not required',
    gtmEvent: 'not required'
  },
  {
    id: 'page_cat1',
    group: 'All Pages',
    groupIcon: '🌐',
    name: 'Page Category Level 1',
    description: '1st level categorization of page',
    path: null,
    pathAlternatives: ['pageCategory', 'page_category', 'category1', 'content_group1'],
    fallbackId: 'page_cat1_url',
    fallbackLabel: "window.location.pathname.split('/')[1] || 'Home'",
    importance: 'medium',
    neededFor: 'Page categorization',
    example: '"Catalog"'
  },
  {
    id: 'page_cat2',
    group: 'All Pages',
    groupIcon: '🌐',
    name: 'Page Category Level 2',
    description: '2nd level categorization of page',
    path: null,
    pathAlternatives: ['pageSubCategory', 'page_subcategory', 'category2', 'content_group2'],
    fallbackId: 'page_cat2_url',
    fallbackLabel: "window.location.pathname.split('/')[2]",
    importance: 'medium',
    neededFor: 'Page categorization',
    example: '"Product overview"'
  },
  {
    id: 'page_cat3',
    group: 'All Pages',
    groupIcon: '🌐',
    name: 'Page Category Level 3',
    description: '3rd level categorization of page',
    path: null,
    pathAlternatives: ['pageSubCategory2', 'page_subcategory2', 'category3', 'content_group3'],
    fallbackId: 'page_cat3_url',
    fallbackLabel: "window.location.pathname.split('/')[3]",
    importance: 'medium',
    neededFor: 'Page categorization',
    example: '"Sneakers"'
  },

  // ── PRODUCT DETAIL PAGE ──
  {
    id: 'pdp_product_id',
    group: 'Product Detail Page',
    groupIcon: '🏷️',
    name: 'Product ID',
    description: 'Product Id or distinct product name',
    path: 'ecommerce.detail.products[0].id',
    pathAlternatives: ['ecommerce.items[0].item_id', 'ecommerce.detail.products.0.id'],
    ga4Path: 'ecommerce.items[0].item_id',
    event: 'view_item',
    importance: 'mandatory',
    neededFor: 'Product tracking',
    gtmVar: 'ecommerce.detail.products.id',
    example: '"1234n"'
  },
  {
    id: 'pdp_product_name',
    group: 'Product Detail Page',
    groupIcon: '🏷️',
    name: 'Product Name',
    description: 'Spoken product name',
    path: 'ecommerce.detail.products[0].name',
    pathAlternatives: ['ecommerce.items[0].item_name'],
    ga4Path: 'ecommerce.items[0].item_name',
    event: 'view_item',
    importance: 'medium',
    neededFor: 'Product tracking',
    gtmVar: 'ecommerce.detail.products.name',
    example: '"blue sneaker"'
  },
  {
    id: 'pdp_price',
    group: 'Product Detail Page',
    groupIcon: '🏷️',
    name: 'Product Price',
    description: 'Price of product',
    path: 'ecommerce.detail.products[0].price',
    pathAlternatives: ['ecommerce.items[0].price'],
    ga4Path: 'ecommerce.items[0].price',
    event: 'view_item',
    importance: 'mandatory',
    neededFor: 'Product tracking',
    gtmVar: 'ecommerce.detail.products.price',
    example: '"34.95"'
  },
  {
    id: 'pdp_currency',
    group: 'Product Detail Page',
    groupIcon: '🏷️',
    name: 'Currency Code',
    description: 'ISO currency code',
    path: 'ecommerce.currencyCode',
    pathAlternatives: ['ecommerce.currency', 'currency'],
    ga4Path: 'ecommerce.currency',
    event: 'view_item',
    importance: 'mandatory',
    neededFor: 'Product tracking',
    gtmVar: 'ecommerce.currencyCode',
    example: '"EUR"'
  },
  {
    id: 'pdp_brand',
    group: 'Product Detail Page',
    groupIcon: '🏷️',
    name: 'Product Brand / Cat 1',
    description: '1st level categorization / brand',
    path: 'ecommerce.detail.products[0].brand',
    pathAlternatives: ['ecommerce.items[0].item_brand', 'ecommerce.items[0].item_category'],
    ga4Path: 'ecommerce.items[0].item_brand',
    event: 'view_item',
    importance: 'medium',
    neededFor: 'Product categorization',
    gtmVar: 'ecommerce.detail.products.brand',
    example: '"Women"'
  },
  {
    id: 'pdp_category',
    group: 'Product Detail Page',
    groupIcon: '🏷️',
    name: 'Product Category Level 2',
    description: '2nd level categorization of product',
    path: 'ecommerce.detail.products[0].category',
    pathAlternatives: ['ecommerce.items[0].item_category2', 'ecommerce.items[0].item_category'],
    ga4Path: 'ecommerce.items[0].item_category',
    event: 'view_item',
    importance: 'medium',
    neededFor: 'Product categorization',
    gtmVar: 'ecommerce.detail.products.category',
    example: '"Shoes"'
  },
  {
    id: 'pdp_product_category_name',
    group: 'Product Detail Page',
    groupIcon: '🏷️',
    name: 'Product Category Name',
    description: 'Product category name derived from item_name',
    path: 'ecommerce.detail.products[0].name',
    pathAlternatives: ['ecommerce.items[0].item_name'],
    ga4Path: 'ecommerce.items[0].item_name',
    event: 'view_item',
    importance: 'medium',
    neededFor: 'Product categorization',
    gtmVar: 'ecommerce.items[0].item_name',
    example: '"blue sneaker"'
  },

  // ── ADD TO CART ──
  {
    id: 'atc_product_id',
    group: 'Add-to-Cart Event',
    groupIcon: '🛒',
    name: 'Product ID',
    description: 'Product Id in add-to-cart event',
    path: 'ecommerce.add.products[0].id',
    pathAlternatives: ['ecommerce.items[0].item_id'],
    ga4Path: 'ecommerce.items[0].item_id',
    event: 'add_to_cart',
    importance: 'mandatory',
    neededFor: 'Product tracking',
    gtmVar: 'ecommerce.add.products.id',
    example: '"1234n"'
  },
  {
    id: 'atc_product_name',
    group: 'Add-to-Cart Event',
    groupIcon: '🛒',
    name: 'Product Name',
    description: 'Spoken product name in add-to-cart',
    path: 'ecommerce.add.products[0].name',
    pathAlternatives: ['ecommerce.items[0].item_name'],
    event: 'add_to_cart',
    importance: 'medium',
    gtmVar: 'ecommerce.add.products.name',
    example: '"blue sneaker"'
  },
  {
    id: 'atc_price',
    group: 'Add-to-Cart Event',
    groupIcon: '🛒',
    name: 'Product Price',
    description: 'Price of product in add-to-cart',
    path: 'ecommerce.add.products[0].price',
    pathAlternatives: ['ecommerce.items[0].price'],
    event: 'add_to_cart',
    importance: 'mandatory',
    gtmVar: 'ecommerce.add.products.price'
  },
  {
    id: 'atc_quantity',
    group: 'Add-to-Cart Event',
    groupIcon: '🛒',
    name: 'Quantity',
    description: 'Quantity per product',
    path: 'ecommerce.add.products[0].quantity',
    pathAlternatives: ['ecommerce.items[0].quantity'],
    event: 'add_to_cart',
    importance: 'mandatory',
    gtmVar: 'ecommerce.add.products.quantity',
    example: '"2"'
  },
  {
    id: 'atc_currency',
    group: 'Add-to-Cart Event',
    groupIcon: '🛒',
    name: 'Currency Code',
    description: 'ISO currency code in add-to-cart',
    path: 'ecommerce.currencyCode',
    pathAlternatives: ['ecommerce.currency'],
    event: 'add_to_cart',
    importance: 'mandatory',
    gtmVar: 'ecommerce.currencyCode'
  },

  // ── ORDER CONFIRMATION ──
  {
    id: 'order_revenue',
    group: 'Order Confirmation Page',
    groupIcon: '✅',
    name: 'Order Revenue',
    description: 'Total order value',
    path: 'ecommerce.purchase.actionField.revenue',
    pathAlternatives: ['ecommerce.value', 'ecommerce.purchase.value'],
    ga4Path: 'ecommerce.value',
    event: 'purchase',
    importance: 'mandatory',
    neededFor: 'Order tracking',
    gtmVar: 'ecommerce.purchase.actionField.revenue',
    example: '"123.45"'
  },
  {
    id: 'order_id',
    group: 'Order Confirmation Page',
    groupIcon: '✅',
    name: 'Order / Transaction ID',
    description: 'Identification number for order',
    path: 'ecommerce.purchase.actionField.id',
    pathAlternatives: ['ecommerce.transaction_id', 'transactionId'],
    ga4Path: 'ecommerce.transaction_id',
    event: 'purchase',
    importance: 'low',
    neededFor: 'Order tracking',
    gtmVar: 'ecommerce.purchase.actionField.id',
    example: '"M-12345"'
  },
  {
    id: 'order_coupon',
    group: 'Order Confirmation Page',
    groupIcon: '✅',
    name: 'Coupon / Voucher Value',
    description: 'Value of used voucher',
    path: 'ecommerce.purchase.actionField.coupon',
    pathAlternatives: ['ecommerce.coupon'],
    event: 'purchase',
    importance: 'medium',
    neededFor: 'Voucher share KPI',
    example: '"10.00"'
  },
  {
    id: 'order_product_id',
    group: 'Order Confirmation Page',
    groupIcon: '✅',
    name: 'Purchased Product IDs',
    description: 'Product Id for each purchased item',
    path: 'ecommerce.purchase.products[0].id',
    pathAlternatives: ['ecommerce.items[0].item_id'],
    ga4Path: 'ecommerce.items[0].item_id',
    event: 'purchase',
    importance: 'mandatory',
    gtmVar: 'ecommerce.purchase.products.id'
  },
  {
    id: 'order_product_price',
    group: 'Order Confirmation Page',
    groupIcon: '✅',
    name: 'Purchased Product Price',
    description: 'Price per purchased product',
    path: 'ecommerce.purchase.products[0].price',
    pathAlternatives: ['ecommerce.items[0].price'],
    event: 'purchase',
    importance: 'mandatory',
    gtmVar: 'ecommerce.purchase.products.price'
  },
  {
    id: 'order_quantity',
    group: 'Order Confirmation Page',
    groupIcon: '✅',
    name: 'Purchased Product Quantity',
    description: 'Quantity per purchased product',
    path: 'ecommerce.purchase.products[0].quantity',
    pathAlternatives: ['ecommerce.items[0].quantity'],
    event: 'purchase',
    importance: 'mandatory',
    gtmVar: 'ecommerce.purchase.products.quantity'
  },
  {
    id: 'order_currency',
    group: 'Order Confirmation Page',
    groupIcon: '✅',
    name: 'Currency Code',
    description: 'ISO currency code in purchase event',
    path: 'ecommerce.currencyCode',
    pathAlternatives: ['ecommerce.currency'],
    event: 'purchase',
    importance: 'mandatory',
    gtmVar: 'ecommerce.currencyCode'
  },

  // ── SEARCH RESULTS ──
  {
    id: 'search_term',
    group: 'Search Result Page',
    groupIcon: '🔍',
    name: 'Search Term',
    description: 'Full internal search phrase',
    path: null,
    pathAlternatives: ['searchTerm', 'search_term', 'internalSearch', 'search_keyword'],
    fallbackId: 'search_term_url',
    fallbackLabel: 'URL param: ?q= / ?query= / ?s= / ?search= / ?keyword= / ?term= / ?searchTerm=',
    importance: 'high',
    neededFor: 'Internal search dashboard',
    example: '"blue shoes"'
  },
  {
    id: 'search_results_count',
    group: 'Search Result Page',
    groupIcon: '🔍',
    name: 'Search Results Count',
    description: 'Number of search results',
    path: null,
    pathAlternatives: ['searchResultsCount', 'results_count', 'search_results'],
    importance: 'high',
    neededFor: 'Internal search dashboard',
    example: '"15"'
  },

  // ── USER / LOGIN ──
  {
    id: 'user_id',
    group: 'Registration / Login',
    groupIcon: '👤',
    name: 'Customer ID / Hashed Email',
    description: 'Customer Id or hashed email address',
    path: null,
    pathAlternatives: ['userId', 'user_id', 'customerId', 'hashedEmail', 'hashed_email'],
    importance: 'high',
    neededFor: 'Cross-device tracking',
    example: 'SHA256 hash'
  },

  // ── LANDING PAGE ──
  {
    id: 'email_optin',
    group: 'Landing Page',
    groupIcon: '📧',
    name: 'Email Opt-in Flag',
    description: 'Email opt-in flag for user',
    path: null,
    pathAlternatives: ['emailOptIn', 'email_opt_in', 'newsletter'],
    importance: 'medium',
    neededFor: 'User segmentation',
    example: '"yes"/"no"'
  }
];

// GA4 ecommerce events to check
const GA4_EVENTS = {
  'view_item': {
    label: 'View Item (PDP)',
    requiredParams: ['currency', 'value', 'items'],
    itemParams: ['item_id', 'item_name', 'price', 'item_brand', 'item_category']
  },
  'add_to_cart': {
    label: 'Add to Cart',
    requiredParams: ['currency', 'value', 'items'],
    itemParams: ['item_id', 'item_name', 'price', 'quantity']
  },
  'begin_checkout': {
    label: 'Begin Checkout',
    requiredParams: ['currency', 'value', 'items'],
    itemParams: ['item_id', 'item_name', 'price', 'quantity']
  },
  'purchase': {
    label: 'Purchase',
    requiredParams: ['transaction_id', 'value', 'currency', 'items'],
    itemParams: ['item_id', 'item_name', 'price', 'quantity']
  },
  'view_item_list': {
    label: 'View Item List',
    requiredParams: ['item_list_id', 'item_list_name', 'items'],
    itemParams: ['item_id', 'item_name', 'item_list_position']
  },
  'select_item': {
    label: 'Select Item',
    requiredParams: ['items'],
    itemParams: ['item_id', 'item_name']
  },
  'remove_from_cart': {
    label: 'Remove from Cart',
    requiredParams: ['currency', 'value', 'items'],
    itemParams: ['item_id', 'item_name', 'price', 'quantity']
  }
};

// ────────────────────────────────────────────────────────
// UTILITIES
// ────────────────────────────────────────────────────────

function getNestedValue(obj, path) {
  if (!obj || !path) return undefined;
  const parts = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  let cur = obj;
  for (const p of parts) {
    if (cur === null || cur === undefined) return undefined;
    cur = cur[p];
  }
  return cur;
}

function findValueInDL(dataLayer, paths) {
  for (const path of paths) {
    for (const entry of dataLayer) {
      const val = getNestedValue(entry, path);
      if (val !== undefined && val !== null && val !== '') return { value: val, path };
    }
  }
  return null;
}

function colorizeJSON(obj, indent = 0) {
  if (obj === null) return '<span class="json-null">null</span>';
  if (typeof obj === 'boolean') return `<span class="json-bool">${obj}</span>`;
  if (typeof obj === 'number') return `<span class="json-number">${obj}</span>`;
  if (typeof obj === 'string') return `<span class="json-string">"${escapeHtml(obj)}"</span>`;
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]';
    const items = obj.map(v => '  '.repeat(indent + 1) + colorizeJSON(v, indent + 1));
    return `[\n${items.join(',\n')}\n${'  '.repeat(indent)}]`;
  }
  if (typeof obj === 'object') {
    const entries = Object.entries(obj);
    if (entries.length === 0) return '{}';
    const lines = entries.map(([k, v]) =>
      `${'  '.repeat(indent + 1)}<span class="json-key">"${escapeHtml(k)}"</span>: ${colorizeJSON(v, indent + 1)}`
    );
    return `{\n${lines.join(',\n')}\n${'  '.repeat(indent)}}`;
  }
  return String(obj);
}

function escapeHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function truncate(val, max = 40) {
  const s = String(val);
  return s.length > max ? s.slice(0, max) + '…' : s;
}

function classifyEvent(obj) {
  if (!obj) return 'other';
  const event = obj.event || '';
  const ecEvents = ['view_item', 'add_to_cart', 'remove_from_cart', 'begin_checkout',
    'purchase', 'view_item_list', 'select_item', 'view_promotion', 'select_promotion'];
  if (ecEvents.includes(event) || obj.ecommerce) return 'ecommerce';
  if (event === 'gtm.js' || event === 'gtm.load' || event === 'pageview' || event === 'page_view') return 'pageview';
  if (event && event !== '') return 'custom';
  return 'other';
}

// ────────────────────────────────────────────────────────
// EVALUATE
// ────────────────────────────────────────────────────────

function evaluateDataLayer(dataLayer, pageContext) {
  const results = [];
  const ctx = pageContext || { hostname: '', pathname: '/', search: '' };

  // Compute URL-derived fallback values once
  const urlFallbacks = {
    page_url_location: ctx.hostname + ctx.pathname,
    page_cat1_url: (function() {
      const seg = ctx.pathname.split('/')[1];
      return (seg === '' || seg === undefined) ? 'Home' : seg;
    })(),
    page_cat2_url: (function() {
      return ctx.pathname.split('/')[2] || undefined;
    })(),
    page_cat3_url: (function() {
      return ctx.pathname.split('/')[3] || undefined;
    })(),
    search_term_url: (function() {
      if (!ctx.search) return undefined;
      const params = new URLSearchParams(ctx.search);
      // Check common search query parameter names in priority order
      const candidates = ['q', 'query', 's', 'search', 'keyword', 'term', 'searchTerm', 'searchquery', 'search_query', 'text', 'w'];
      for (const key of candidates) {
        const val = params.get(key);
        if (val && val.trim() !== '') {
          return { value: decodeURIComponent(val.trim()), param: key };
        }
      }
      // Last resort: any param whose name contains 'search' or 'query'
      for (const [key, val] of params.entries()) {
        if ((key.toLowerCase().includes('search') || key.toLowerCase().includes('query')) && val.trim() !== '') {
          return { value: decodeURIComponent(val.trim()), param: key };
        }
      }
      return undefined;
    })()
  };

  for (const check of CHECKS) {
    const allPaths = [
      ...(check.path ? [check.path] : []),
      ...(check.pathAlternatives || [])
    ];

    const found = findValueInDL(dataLayer, allPaths);
    const result = { ...check, status: 'missing', foundValue: null, foundPath: null, fallbackValue: null, usedFallback: false };

    if (found) {
      result.status = 'pass';
      result.foundValue = found.value;
      result.foundPath = found.path;
    } else if (check.fallbackId && urlFallbacks[check.fallbackId] !== undefined && urlFallbacks[check.fallbackId] !== '') {
      // Not in dataLayer but can be derived from URL
      const fb = urlFallbacks[check.fallbackId];
      result.status = 'fallback';
      result.usedFallback = true;
      if (fb && typeof fb === 'object' && 'value' in fb) {
        result.fallbackValue = fb.value;
        result.fallbackParam = fb.param; // e.g. "q"
      } else {
        result.fallbackValue = fb;
      }
    } else if (check.importance === 'low' || check.importance === 'medium') {
      result.status = 'missing-optional';
    } else {
      result.status = 'missing';
    }

    results.push(result);
  }

  return results;
}

function calculateScore(results) {
  const mandatory = results.filter(r => r.importance === 'mandatory');
  const high = results.filter(r => r.importance === 'high');
  const medium = results.filter(r => r.importance === 'medium');

  const mandatoryPass = mandatory.filter(r => r.status === 'pass').length;
  const highPass = high.filter(r => r.status === 'pass').length;
  const mediumPass = medium.filter(r => r.status === 'pass').length;

  // Fallbacks count as half credit
  const mandatoryFallback = mandatory.filter(r => r.status === 'fallback').length;
  const highFallback = high.filter(r => r.status === 'fallback').length;
  const mediumFallback = medium.filter(r => r.status === 'fallback').length;

  const total = mandatory.length * 3 + high.length * 2 + medium.length * 1;
  const earned = (mandatoryPass * 3 + highPass * 2 + mediumPass * 1)
               + (mandatoryFallback * 1.5 + highFallback * 1 + mediumFallback * 0.5);

  return {
    score: total > 0 ? Math.round((earned / total) * 100) : 0,
    pass: results.filter(r => r.status === 'pass').length,
    fail: results.filter(r => r.status === 'missing').length,
    fallback: results.filter(r => r.status === 'fallback').length,
    optional: results.filter(r => r.status === 'missing-optional').length,
    mandatoryPass,
    mandatoryTotal: mandatory.length
  };
}

function evaluateGA4Events(dataLayer) {
  const found = {};

  dataLayer.forEach(entry => {
    const event = entry.event;
    if (GA4_EVENTS[event]) {
      found[event] = found[event] || [];
      found[event].push(entry);
    }
  });

  return found;
}

// ────────────────────────────────────────────────────────
// RENDER
// ────────────────────────────────────────────────────────

let currentTab = 'checks';
let lastResults = null;
let lastDL = null;
let lastEvents = [];
let lastUrl = '';
let filterImportance = 'all';

function renderScore(score) {
  const bar = document.getElementById('scoreBar');
  bar.style.display = 'flex';

  const circle = document.getElementById('scoreCircle');
  const deg = Math.round(score.score * 3.6);
  let color = score.score >= 80 ? '#00d4aa' : score.score >= 60 ? '#f59e0b' : '#ef4444';
  circle.style.background = `conic-gradient(${color} ${deg}deg, #1a2235 ${deg}deg)`;

  document.getElementById('scoreNum').textContent = score.score + '%';
  document.getElementById('scoreNum').style.color = color;

  const label = score.score >= 80 ? '🟢 Good Coverage' : score.score >= 60 ? '🟡 Needs Improvement' : '🔴 Poor Coverage';
  document.getElementById('scoreLabel').textContent = label;
  document.getElementById('scoreDetail').textContent =
    `${score.mandatoryPass}/${score.mandatoryTotal} mandatory fields present`;

  document.getElementById('scorePills').innerHTML = `
    <span class="pill pass">✓ ${score.pass}</span>
    ${score.fallback > 0 ? `<span class="pill warn">⚡ ${score.fallback} fallback</span>` : ''}
    <span class="pill fail">✗ ${score.fail}</span>
    ${score.optional > 0 ? `<span class="pill warn">~ ${score.optional}</span>` : ''}
  `;
}

function renderChecksTab(results) {
  const groups = {};
  for (const r of results) {
    if (!groups[r.group]) groups[r.group] = { icon: r.groupIcon, items: [] };
    groups[r.group].items.push(r);
  }

  let html = `
    <div class="page-context">
      <span class="dot"></span>
      <span class="label">Current Page Type:</span>
      <span class="value" id="detectedPageType">All Pages</span>
    </div>
    <div class="filter-bar">
      <button class="filter-btn ${filterImportance === 'all' ? 'active' : ''}" data-filter="all">All</button>
      <button class="filter-btn ${filterImportance === 'mandatory' ? 'active' : ''}" data-filter="mandatory">Mandatory</button>
      <button class="filter-btn ${filterImportance === 'high' ? 'active' : ''}" data-filter="high">High</button>
      <button class="filter-btn ${filterImportance === 'medium' ? 'active' : ''}" data-filter="medium">Medium</button>
      <button class="filter-btn fail-only" data-filter="fail">Missing Only</button>
    </div>
  `;

  for (const [groupName, group] of Object.entries(groups)) {
    const items = filterImportance === 'all'
      ? group.items
      : filterImportance === 'fail'
        ? group.items.filter(i => i.status !== 'pass')
        : group.items.filter(i => i.importance === filterImportance);

    if (items.length === 0) continue;

    const passCount = items.filter(i => i.status === 'pass').length;
    const fbCount = items.filter(i => i.status === 'fallback').length;
    const hasIssues = items.some(i => i.status !== 'pass' && i.status !== 'fallback');
    const allOk = passCount === items.length;
    const isCollapsed = (passCount + fbCount === items.length && fbCount === 0) ? 'collapsed' : '';

    html += `
      <div class="check-group ${isCollapsed}" data-group="${escapeHtml(groupName)}">
        <div class="check-group-header">
          <div class="check-group-title">
            <span class="group-icon">${group.icon}</span>
            <span>${escapeHtml(groupName)}</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <span class="group-score">${passCount}/${items.length}${fbCount > 0 ? ` <span style="color:#f59e0b;font-size:9px">+${fbCount}⚡</span>` : ''} <span style="color:${allOk?'#22c55e':passCount>items.length/2?'#f59e0b':'#ef4444'}">${Math.round(passCount/items.length*100)}%</span></span>
            <span class="group-chevron">▼</span>
          </div>
        </div>
        <div class="check-list">
    `;

    for (const item of items) {
      const statusIcon = item.status === 'pass' ? '✓' : item.status === 'fallback' ? '⚡' : item.status === 'missing-optional' ? '~' : '✗';
      const statusClass = item.status === 'pass' ? 'pass' : item.status === 'fallback' ? 'warn' : item.status === 'missing-optional' ? 'warn' : 'fail';
      const impClass = `imp-${item.importance}`;

      let foundHtml;
      if (item.status === 'pass' && item.foundValue !== null) {
        foundHtml = `<span class="check-found value">${escapeHtml(truncate(String(item.foundValue), 45))}</span>`;
      } else if (item.status === 'fallback') {
        const isUrlParam = !!item.fallbackParam;
        const sourceLabel = isUrlParam
          ? `URL param <span class="fallback-param-tag">?${escapeHtml(item.fallbackParam)}=</span>`
          : `URL path`;
        const gtmHint = isUrlParam
          ? `new URLSearchParams(location.search).get('${escapeHtml(item.fallbackParam)}')`
          : (item.fallbackLabel || '');
        foundHtml = `
          <div class="fallback-card">
            <div class="fallback-header">
              <span class="fallback-badge">⚡ URL fallback</span>
              <span class="fallback-source">Not in dataLayer — derivable from ${sourceLabel}</span>
            </div>
            <div class="fallback-row">
              <span class="fallback-row-label">Value</span>
              <span class="fallback-value" title="${escapeHtml(String(item.fallbackValue))}">${escapeHtml(truncate(String(item.fallbackValue), 38))}</span>
            </div>
            <div class="fallback-row">
              <span class="fallback-row-label">GTM</span>
              <span class="fallback-gtm" title="${escapeHtml(gtmHint)}">${escapeHtml(gtmHint)}</span>
            </div>
          </div>
        `;
      } else if (item.importance === 'mandatory' || item.importance === 'high') {
        foundHtml = `<span class="check-found missing">not found in dataLayer</span>`;
      } else {
        foundHtml = `<span class="check-found wrong-type">not present</span>`;
      }

      const pathHtml = item.foundPath
        ? `<div class="check-path">${escapeHtml(item.foundPath)}</div>`
        : item.path
          ? `<div class="check-path" style="opacity:0.5">${escapeHtml(item.path)}</div>`
          : '';

      html += `
        <div class="check-item">
          <div class="check-status ${statusClass}">${statusIcon}</div>
          <div class="check-body">
            <div class="check-name">${escapeHtml(item.name)}</div>
            ${pathHtml}
            ${foundHtml}
          </div>
          <span class="importance-badge ${impClass}">${item.importance}</span>
        </div>
      `;
    }

    html += `</div></div>`;
  }

  return html;
}

function renderEventsTab(events) {
  if (!events || events.length === 0) {
    return `<div class="empty-state"><div class="empty-icon">📭</div><div class="empty-title">No events captured</div><div class="empty-sub">dataLayer events will appear here as they fire. Try interacting with the page and rescanning.</div></div>`;
  }

  let html = `<div class="section-title">Captured Events <span style="color:var(--muted);margin-left:4px">(${events.length} total)</span></div>`;

  for (let i = events.length - 1; i >= 0; i--) {
    const ev = events[i];
    const obj = ev.data || ev;
    const type = classifyEvent(obj);
    const eventName = obj.event || '(no event name)';
    const ts = ev.timestamp ? new Date(ev.timestamp).toLocaleTimeString() : '';

    html += `
      <div class="event-entry" data-idx="${i}">
        <div class="event-header">
          <div class="event-name-wrap">
            <span class="event-type-tag ${type}">${type}</span>
            <span class="event-name">${escapeHtml(eventName)}</span>
          </div>
          <span class="event-ts">${ts}</span>
        </div>
        <div class="event-body">
          <div class="json-tree">${colorizeJSON(obj)}</div>
        </div>
      </div>
    `;
  }

  return html;
}

function renderGA4Tab(dataLayer) {
  const found = evaluateGA4Events(dataLayer);
  let html = `<div class="section-title">GA4 Ecommerce Events</div>`;

  for (const [eventName, spec] of Object.entries(GA4_EVENTS)) {
    const instances = found[eventName] || [];
    const detected = instances.length > 0;

    html += `
      <div class="ga4-event-card">
        <div class="ga4-event-card-header">
          <span class="ga4-event-name">${eventName}</span>
          <span class="ga4-status" style="color:${detected ? 'var(--success)' : 'var(--muted)'}">
            ${detected ? '✓ detected' : '○ not found'}
            ${instances.length > 1 ? ` (${instances.length}×)` : ''}
          </span>
        </div>
        <div class="ga4-params">
    `;

    if (detected) {
      const entry = instances[instances.length - 1]; // latest
      for (const param of spec.requiredParams) {
        let val = getNestedValue(entry, `ecommerce.${param}`) ?? getNestedValue(entry, param);
        const present = val !== undefined && val !== null;
        if (Array.isArray(val)) val = `[${val.length} items]`;

        html += `
          <div class="ga4-param-row">
            <span class="ga4-param-name">${param}</span>
            <span class="ga4-param-value" style="color:${present ? 'var(--text)' : 'var(--danger)'}">${present ? escapeHtml(truncate(String(val), 35)) : '—'}</span>
            <span class="ga4-param-status" style="color:${present ? 'var(--success)' : 'var(--danger)'}">${present ? '✓' : '✗ missing'}</span>
          </div>
        `;
      }

      // Check first item if items array exists
      const items = getNestedValue(entry, 'ecommerce.items');
      if (items && items.length > 0) {
        const item = items[0];
        for (const p of spec.itemParams) {
          const v = item[p];
          const present = v !== undefined && v !== null;
          html += `
            <div class="ga4-param-row">
              <span class="ga4-param-name" style="padding-left:8px;color:#4a6785">items[0].${p}</span>
              <span class="ga4-param-value" style="color:${present ? '#94a3b8' : 'var(--danger)'}">${present ? escapeHtml(truncate(String(v), 35)) : '—'}</span>
              <span class="ga4-param-status" style="color:${present ? 'var(--muted)' : 'var(--danger)'}">${present ? '·' : '✗'}</span>
            </div>
          `;
        }
      }
    } else {
      html += `<div style="font-size:10px;color:var(--muted);padding:4px 0">Expected params: ${spec.requiredParams.join(', ')}</div>`;
    }

    html += `</div></div>`;
  }

  return html;
}

function renderRawTab(dataLayer) {
  if (!dataLayer || dataLayer.length === 0) {
    return `<div class="empty-state"><div class="empty-icon">📭</div><div class="empty-title">Empty dataLayer</div><div class="empty-sub">No entries found in window.dataLayer</div></div>`;
  }

  let html = `<div class="section-title">window.dataLayer <span style="color:var(--muted);margin-left:4px">(${dataLayer.length} entries)</span></div>`;

  for (let i = dataLayer.length - 1; i >= 0; i--) {
    const obj = dataLayer[i];
    const type = classifyEvent(obj);
    const name = obj.event || `entry[${i}]`;

    html += `
      <div class="event-entry" data-raw="${i}">
        <div class="event-header">
          <div class="event-name-wrap">
            <span class="event-type-tag ${type}">${type}</span>
            <span class="event-name">${escapeHtml(name)}</span>
            <span style="font-size:9px;color:var(--muted);margin-left:4px">[${i}]</span>
          </div>
        </div>
        <div class="event-body">
          <div class="json-tree">${colorizeJSON(obj)}</div>
        </div>
      </div>
    `;
  }

  return html;
}

function renderTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));

  const content = document.getElementById('mainContent');

  if (tab === 'checks' && lastResults) {
    content.innerHTML = renderChecksTab(lastResults);
    attachCheckHandlers();
  } else if (tab === 'events') {
    content.innerHTML = renderEventsTab(lastEvents);
    attachEventHandlers();
  } else if (tab === 'ga4' && lastDL) {
    content.innerHTML = renderGA4Tab(lastDL);
  } else if (tab === 'raw' && lastDL) {
    content.innerHTML = renderRawTab(lastDL);
    attachEventHandlers();
  } else {
    content.innerHTML = `<div class="empty-state"><div class="empty-icon">⊙</div><div class="empty-title">Scan the page first</div></div>`;
  }
}

function attachCheckHandlers() {
  document.querySelectorAll('.check-group-header').forEach(h => {
    h.addEventListener('click', () => {
      h.closest('.check-group').classList.toggle('collapsed');
    });
  });

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      filterImportance = btn.dataset.filter;
      renderTab('checks');
    });
  });
}

function attachEventHandlers() {
  document.querySelectorAll('.event-header').forEach(h => {
    h.addEventListener('click', () => {
      h.closest('.event-entry').classList.toggle('expanded');
    });
  });
}

function updateTabBadges(results, events, dataLayer) {
  const pass = results.filter(r => r.status !== 'pass').length;
  document.getElementById('badgeChecks').textContent = pass > 0 ? `${pass} issues` : '✓';
  document.getElementById('badgeChecks').style.color = pass > 0 ? 'var(--danger)' : 'var(--success)';

  document.getElementById('badgeEvents').textContent = events.length;
  document.getElementById('badgeGA4').textContent = Object.keys(evaluateGA4Events(dataLayer)).filter(k => evaluateGA4Events(dataLayer)[k]).length;
  document.getElementById('badgeRaw').textContent = dataLayer.length;
}

// ────────────────────────────────────────────────────────
// SCAN
// ────────────────────────────────────────────────────────

async function scanPage() {
  const btn = document.getElementById('btnScan');
  btn.textContent = '⟳ Scanning…';
  btn.classList.add('loading');
  btn.disabled = true;

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    lastUrl = tab.url || '';
    document.getElementById('footerUrl').textContent = lastUrl;

    // Inject script to extract dataLayer — must run in MAIN world to access window.dataLayer
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      world: 'MAIN',
      func: () => {
        const dl = window.dataLayer ? JSON.parse(JSON.stringify(window.dataLayer)) : [];
        const events = window.__mappEvaluator ? JSON.parse(JSON.stringify(window.__mappEvaluator.events)) : [];

        // Auto-detect page type
        function detectPageType() {
          const path = location.pathname.toLowerCase();
          if (path.includes('/checkout') || path.includes('/order-confirm') || path.includes('/thank-you') || path.includes('/confirmation')) return 'Order Confirmation Page';
          if (path.includes('/cart') || path.includes('/basket')) return 'Cart Page';
          if (path.includes('/search') || document.querySelector('[data-search-results]') || new URLSearchParams(location.search).has('q') || new URLSearchParams(location.search).has('search')) return 'Search Result Page';
          if (path.includes('/product') || path.includes('/p/') || document.querySelector('[itemtype*="Product"]')) return 'Product Detail Page';
          if (path === '/' || path === '/index.html') return 'Home Page';
          return 'All Pages';
        }

        return { dl, events, pageType: detectPageType(), pageContext: { hostname: location.hostname, pathname: location.pathname, search: location.search } };
      }
    });

    const { dl, events, pageType, pageContext } = results[0].result;
    lastDL = dl;
    lastEvents = events;

    // Evaluate
    const checkResults = evaluateDataLayer(dl, pageContext);
    lastResults = checkResults;

    const score = calculateScore(checkResults);
    renderScore(score);

    document.getElementById('tabsBar').style.display = 'flex';
    updateTabBadges(checkResults, events, dl);
    renderTab(currentTab);

    // Set page type
    const ptEl = document.getElementById('detectedPageType');
    if (ptEl) ptEl.textContent = pageType;

  } catch (err) {
    document.getElementById('mainContent').innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⚠️</div>
        <div class="empty-title">Scan failed</div>
        <div class="empty-sub">${escapeHtml(err.message)}<br><br>Make sure you're on a regular webpage (not chrome:// or about:// pages).</div>
      </div>
    `;
  } finally {
    btn.textContent = '▶ Scan Page';
    btn.classList.remove('loading');
    btn.disabled = false;
  }
}

// ────────────────────────────────────────────────────────
// EXPORT
// ────────────────────────────────────────────────────────

function exportReport() {
  if (!lastResults) return;
  const report = {
    url: lastUrl,
    timestamp: new Date().toISOString(),
    score: calculateScore(lastResults),
    checks: lastResults.map(r => ({
      id: r.id,
      group: r.group,
      name: r.name,
      importance: r.importance,
      status: r.status,
      foundValue: r.foundValue,
      foundPath: r.foundPath
    })),
    dataLayerEntries: lastDL ? lastDL.length : 0,
    capturedEvents: lastEvents.length
  };

  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `datalayer-report-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// ────────────────────────────────────────────────────────
// INIT
// ────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnScan').addEventListener('click', scanPage);
  document.getElementById('btnRefresh').addEventListener('click', scanPage);
  document.getElementById('btnExport').addEventListener('click', exportReport);

  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => renderTab(tab.dataset.tab));
  });

  // Auto-scan on open
  scanPage();
});
