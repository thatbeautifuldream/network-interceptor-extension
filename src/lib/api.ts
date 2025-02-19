import axios from "axios";
import { Request } from "../types";

interface RequestConfig {
  method: string;
  url: string;
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
}

export const resendRequest = async (config: RequestConfig) => {
  const response = await axios({
    method: config.method.toLowerCase(),
    url: config.url,
    data: config.body,
    headers: config.headers,
  });
  return response.data;
};

export const getRequests = async (): Promise<Request[]> => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: "GET_REQUESTS" }, (response) => {
      resolve(response || []);
    });
  });
};

export const clearRequests = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: "CLEAR_REQUESTS" }, (response) => {
      resolve(response);
    });
  });
};

export const listenToRequests = (
  onNewRequest: (request: Request) => void,
  onRequestUpdated: (request: Request) => void
) => {
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "NEW_REQUEST") {
      onNewRequest(message.request);
    }
    if (message.type === "REQUEST_UPDATED") {
      onRequestUpdated(message.request);
    }
  });
};
