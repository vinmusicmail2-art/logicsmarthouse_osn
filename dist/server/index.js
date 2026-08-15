export default {
  async fetch(request, env) {
    let response = await env.ASSETS.fetch(request);

    if (response.status === 404) {
      const path = new URL(request.url).pathname;
      if (path === "/") {
        response = await env.ASSETS.fetch(new Request(new URL("/index.html", request.url), request));
      }
    }
    return response;
  },
};
