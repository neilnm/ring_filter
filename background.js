let values = {
    enableScroll: false,
    from: 0,
    to: 0
}
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ values });
});