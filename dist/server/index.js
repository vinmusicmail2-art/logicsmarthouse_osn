const textHtml = "text/html; charset=utf-8";

function resolvePath(url) {
  let path = decodeURIComponent(new URL(url).pathname);
  if (path === "/") return "/index.html";
  if (path.endsWith("/")) return `${path}index.html`;
  return path;
}

async function fetchAsset(request, env, path) {
  const assetUrl = new URL(path, request.url);
  return env.ASSETS.fetch(new Request(assetUrl, request));
}

export default {
  async fetch(request, env) {
    const path = resolvePath(request.url);
    let response = await fetchAsset(request, env, path);

    if (response.status === 404 && !path.includes(".")) {
      response = await fetchAsset(request, env, "/index.html");
    }

    const headers = new Headers(response.headers);
    if (!headers.has("content-type") && (path === "/index.html" || path === "/" || path.endsWith(".html"))) {
      headers.set("content-type", textHtml);
    }

    return new Response(response.body, {
      status: response.status,
      headers,
    });
  },
};
