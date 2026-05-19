import { http, HttpResponse } from "msw";

export const SWETRIX_API_BASE = "https://api.swetrix.com";

export const handlers = [
  http.post(`${SWETRIX_API_BASE}/log`, () => HttpResponse.json({}, { status: 201 })),
  http.post(`${SWETRIX_API_BASE}/log/custom`, () => HttpResponse.json({}, { status: 201 })),
  http.post(`${SWETRIX_API_BASE}/log/hb`, () => HttpResponse.json({}, { status: 201 })),
  http.post(`${SWETRIX_API_BASE}/log/error`, () => HttpResponse.json({}, { status: 201 })),
  http.post(`${SWETRIX_API_BASE}/log/revenue`, () =>
    HttpResponse.json({ success: true, transactionId: "order_42" }, { status: 201 })
  ),
];

export const errorHandlers = {
  logBadRequest: http.post(`${SWETRIX_API_BASE}/log`, () =>
    HttpResponse.json({ message: "Bad Request" }, { status: 400 })
  ),
  logQuotaExceeded: http.post(`${SWETRIX_API_BASE}/log`, () =>
    HttpResponse.json({ message: "Quota exceeded" }, { status: 402 })
  ),
  revenueForbidden: http.post(`${SWETRIX_API_BASE}/log/revenue`, () =>
    HttpResponse.json({ message: "Forbidden" }, { status: 403 })
  ),
};
