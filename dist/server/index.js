export default {
  async fetch(request, env) {
    let response = await env.ASSETS.fetch(request);

    if (response.status === 404) {
      const path = new URL(request.url).pathname;
      const candidates = path === "/"
        ? ["/client/index.html", "/index.html"]
        : [
            `/client${path}`,
            path.endsWith("/") ? `/client${path}index.html` : null,
            path.endsWith("/") ? `${path}index.html` : null,
          ].filter(Boolean);

      for (const candidate of candidates) {
        response = await env.ASSETS.fetch(new Request(new URL(candidate, request.url), request));
        if (response.status !== 404) break;
      }
    }
    return response;
  },
};
