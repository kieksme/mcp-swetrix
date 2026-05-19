import { http, HttpResponse } from "msw";

export const BASE = "https://api.swetrix.com";

const project = { id: "proj1", name: "My Project", active: true, public: false, origins: [], botsProtectionLevel: "basic", created: "2024-01-01T00:00:00.000Z" };
const funnel = { id: "fun1", pid: "proj1", name: "Sign-up", steps: ["/", "/signup"] };
const annotation = { id: "ann1", pid: "proj1", date: "2024-06-01", text: "Launch" };
const view = { id: "view1", pid: "proj1", name: "US Mobile", type: "traffic", filters: [] };
const org = { id: "org1", name: "Acme Corp" };

export const handlers = [
  // Projects
  http.get(`${BASE}/v1/project`, () => HttpResponse.json([project])),
  http.get(`${BASE}/v1/project/:id`, () => HttpResponse.json(project)),
  http.post(`${BASE}/v1/project`, () => HttpResponse.json(project, { status: 201 })),
  http.put(`${BASE}/v1/project/:id`, () => HttpResponse.json({ ...project, name: "Updated" })),
  http.delete(`${BASE}/v1/project/:id`, () => new HttpResponse(null, { status: 204 })),
  http.post(`${BASE}/v1/project/:id/pin`, () => new HttpResponse(null, { status: 201 })),
  http.delete(`${BASE}/v1/project/:id/pin`, () => new HttpResponse(null, { status: 204 })),
  http.patch(`${BASE}/v1/project/:id/organisation`, () => new HttpResponse(null, { status: 200 })),

  // Funnels
  http.get(`${BASE}/v1/project/funnels/:pid`, () => HttpResponse.json([funnel])),
  http.post(`${BASE}/v1/project/funnel`, () => HttpResponse.json(funnel, { status: 201 })),
  http.patch(`${BASE}/v1/project/funnel`, () => HttpResponse.json(funnel)),
  http.delete(`${BASE}/v1/project/funnel/:id/:pid`, () => new HttpResponse(null, { status: 204 })),

  // Annotations
  http.get(`${BASE}/v1/project/annotations/:pid`, () => HttpResponse.json([annotation])),
  http.post(`${BASE}/v1/project/annotation`, () => HttpResponse.json(annotation, { status: 201 })),
  http.patch(`${BASE}/v1/project/annotation`, () => HttpResponse.json(annotation)),
  http.delete(`${BASE}/v1/project/annotation/:id/:pid`, () => new HttpResponse(null, { status: 204 })),

  // Views
  http.get(`${BASE}/v1/project/:pid/views`, () => HttpResponse.json([view])),
  http.get(`${BASE}/v1/project/:pid/views/:viewId`, () => HttpResponse.json(view)),
  http.post(`${BASE}/v1/project/:pid/views`, () => HttpResponse.json(view, { status: 201 })),
  http.patch(`${BASE}/v1/project/:pid/views/:viewId`, () => HttpResponse.json(view)),
  http.delete(`${BASE}/v1/project/:pid/views/:viewId`, () => new HttpResponse(null, { status: 204 })),

  // Organisations
  http.get(`${BASE}/v1/organisation`, () => HttpResponse.json([org])),
  http.get(`${BASE}/v1/organisation/:orgId`, () => HttpResponse.json(org)),
  http.post(`${BASE}/v1/organisation`, () => HttpResponse.json({ ...org, id: "org2" }, { status: 201 })),
  http.patch(`${BASE}/v1/organisation/:orgId`, () => HttpResponse.json(org)),
  http.delete(`${BASE}/v1/organisation/:orgId`, () => new HttpResponse(null, { status: 204 })),
  http.post(`${BASE}/v1/organisation/:orgId/invite`, () => new HttpResponse(null, { status: 201 })),
  http.patch(`${BASE}/v1/organisation/member/:memberId`, () => new HttpResponse(null, { status: 200 })),
  http.delete(`${BASE}/v1/organisation/member/:memberId`, () => new HttpResponse(null, { status: 204 })),
];

export const errorHandlers = {
  notFound: (method: "get" | "post" | "put" | "delete" | "patch", path: string) =>
    http[method](`${BASE}${path}`, () => HttpResponse.json({ message: "Not found" }, { status: 404 })),
  unauthorized: (method: "get" | "post" | "put" | "delete" | "patch", path: string) =>
    http[method](`${BASE}${path}`, () => HttpResponse.json({ message: "Unauthorized" }, { status: 401 })),
};
