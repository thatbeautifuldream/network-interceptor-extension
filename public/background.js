// Set up the side panel to open when the action button is clicked
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

let requests = [];

// Listen for web requests
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    const request = {
      id: String(Date.now()),
      url: details.url,
      method: details.method,
      timestamp: Date.now(),
      requestHeaders: details.requestHeaders,
      requestBody: details.requestBody,
    };
    
    requests.push(request);
    // Notify any listening tabs
    chrome.runtime.sendMessage({ type: 'NEW_REQUEST', request });
  },
  { urls: ["<all_urls>"] },
  ["requestBody"]
);

// Listen for request completion
chrome.webRequest.onCompleted.addListener(
  (details) => {
    const request = requests.find(r => r.url === details.url);
    if (request) {
      request.status = details.statusCode;
      request.responseHeaders = details.responseHeaders;
      // Notify any listening tabs
      chrome.runtime.sendMessage({ type: 'REQUEST_UPDATED', request });
    }
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);

// Handle messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_REQUESTS') {
    sendResponse(requests);
  }
  if (message.type === 'CLEAR_REQUESTS') {
    requests = [];
    sendResponse(true);
  }
}); 