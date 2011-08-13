function rot13_onclick(info, tab) {
  chrome.tabs.executeScript(tab.id, {"file": "content.js"});
}

var item = chrome.contextMenus.create({
  "title": "ROT13 Selection",
  "contexts": ["selection"],
  "onclick": rot13_onclick
});
