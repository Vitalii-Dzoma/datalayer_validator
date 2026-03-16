// Background service worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('DataLayer Evaluator installed');
});

chrome.action.onClicked.addListener((tab) => {
  chrome.action.openPopup();
});
