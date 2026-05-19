import { http, HttpResponse } from "msw";

export const BASE = "https://api.swetrix.com";

const trafficResponse = { params: { cc: [{ name: "DE", count: 100 }] }, chart: { x: ["2024-01-01"], visits: [42] }, appliedFilters: [] };
const perfResponse = { params: {}, chart: { x: [], ttfb: [], dns: [] }, appliedFilters: [] };
const birdseyeResponse = { current: { all: 500, unique: 300 }, previous: { all: 400, unique: 250 }, change: { all: 25 } };
const sessions = [{ psid: "s1", cc: "DE", os: "macOS", br: "Chrome", pageviews: 3, sessionStart: "2024-01-01T10:00:00Z", isLive: false }];
const session = { pages: [{ type: "pageview", value: "/home", created: "2024-01-01T10:00:00Z" }] };
const liveVisitors = [{ dv: "desktop", br: "Chrome", os: "macOS", cc: "DE", psid: "s1" }];
const funnel = [{ page: "/", count: 1000, dropoff: 0, dropoffPercentage: 0 }, { page: "/signup", count: 600, dropoff: 400, dropoffPercentage: 40 }];
const meta = { key: ["plan"], value: ["pro"], count: [50] };
const errors = [{ id: "e1", name: "TypeError", count: 12 }];
const profiles = [{ id: "p1", type: "identified" }];
const filters = ["Chrome", "Firefox", "Safari"];
const goalStats = { conversions: 120, rate: 12.5 };
const flagStats = { trueCount: 80, falseCount: 20 };

export const handlers = [
  http.get(`${BASE}/v1/log`, () => HttpResponse.json(trafficResponse)),
  http.get(`${BASE}/v1/log/chart`, () => HttpResponse.json(trafficResponse)),
  http.get(`${BASE}/v1/log/sessions`, () => HttpResponse.json(sessions)),
  http.get(`${BASE}/v1/log/session`, () => HttpResponse.json(session)),
  http.get(`${BASE}/v1/log/live-visitors`, () => HttpResponse.json(liveVisitors)),
  http.get(`${BASE}/v1/log/birdseye`, () => HttpResponse.json(birdseyeResponse)),

  http.get(`${BASE}/v1/log/performance`, () => HttpResponse.json(perfResponse)),
  http.get(`${BASE}/v1/log/performance/chart`, () => HttpResponse.json(perfResponse)),
  http.get(`${BASE}/v1/log/performance/birdseye`, () => HttpResponse.json(birdseyeResponse)),

  http.get(`${BASE}/v1/log/funnel`, () => HttpResponse.json(funnel)),
  http.get(`${BASE}/v1/log/funnel-sessions`, () => HttpResponse.json(sessions)),
  http.get(`${BASE}/v1/log/user-flow`, () => HttpResponse.json({ nodes: [], edges: [] })),

  http.get(`${BASE}/v1/log/meta`, () => HttpResponse.json(meta)),
  http.get(`${BASE}/v1/log/property`, () => HttpResponse.json(meta)),
  http.get(`${BASE}/v1/log/custom-events`, () => HttpResponse.json([])),

  http.get(`${BASE}/v1/log/errors`, () => HttpResponse.json(errors)),
  http.get(`${BASE}/v1/log/get-error`, () => HttpResponse.json(errors[0])),
  http.get(`${BASE}/v1/log/error-overview`, () => HttpResponse.json({ chart: [] })),
  http.get(`${BASE}/v1/log/error-sessions`, () => HttpResponse.json(sessions)),
  http.get(`${BASE}/v1/log/errors-filters`, () => HttpResponse.json(filters)),

  http.get(`${BASE}/v1/log/profiles`, () => HttpResponse.json(profiles)),
  http.get(`${BASE}/v1/log/profile`, () => HttpResponse.json(profiles[0])),
  http.get(`${BASE}/v1/log/profile/sessions`, () => HttpResponse.json(sessions)),

  http.get(`${BASE}/v1/log/filters`, () => HttpResponse.json(filters)),
  http.get(`${BASE}/v1/log/filters/versions`, () => HttpResponse.json(["120", "121", "122"])),
  http.get(`${BASE}/v1/log/hb`, () => HttpResponse.json([])),
  http.get(`${BASE}/v1/log/keywords`, () => HttpResponse.json([])),

  http.get(`${BASE}/goal/:goalId/stats`, () => HttpResponse.json(goalStats)),
  http.get(`${BASE}/goal/:goalId/chart`, () => HttpResponse.json({ chart: [] })),
  http.get(`${BASE}/v1/feature-flag/:flagId/stats`, () => HttpResponse.json(flagStats)),
  http.get(`${BASE}/v1/feature-flag/:flagId/profiles`, () => HttpResponse.json(profiles)),
  http.get(`${BASE}/v1/log/captcha`, () => HttpResponse.json({ count: 50 })),
];

export const errorHandlers = {
  unauthorized: (path: string) =>
    http.get(`${BASE}${path}`, () => HttpResponse.json({ message: "Unauthorized" }, { status: 401 })),
  notFound: (path: string) =>
    http.get(`${BASE}${path}`, () => HttpResponse.json({ message: "Not found" }, { status: 404 })),
};
