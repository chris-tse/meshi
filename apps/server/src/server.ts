const port = Number(process.env.PORT ?? "3100");
const tandoorBaseUrl = process.env.TANDOOR_BASE_URL ?? "http://localhost:8080";

function proxyToTandoor(request: Request) {
  const upstreamUrl = new URL(request.url);
  const tandoorUrl = new URL(tandoorBaseUrl);

  upstreamUrl.protocol = tandoorUrl.protocol;
  upstreamUrl.host = tandoorUrl.host;

  return fetch(upstreamUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    redirect: "manual",
  });
}

Bun.serve({
  port,
  routes: {
    "/healthz": Response.json({
      ok: true,
      tandoorBaseUrl,
    }),
    "/api/*": proxyToTandoor,
    "/media/*": proxyToTandoor,
  },
});

console.log(`Meshi server listening on http://localhost:${port}`);
console.log(`Proxying Tandoor API/media requests to ${tandoorBaseUrl}`);
