export interface Request {
  id: string;
  url: string;
  method: string;
  timestamp: number;
  status?: number;
  requestHeaders?: unknown;
  responseHeaders?: unknown;
  requestBody?: unknown;
}
