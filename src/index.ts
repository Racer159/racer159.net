import { getAssetFromKV, Options } from '@cloudflare/kv-asset-handler';
import { getFlightInfo } from './apis';

const DEBUG = false;

addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  console.log(url.pathname);
  if (url.pathname.startsWith('/api')) {
    event.respondWith(getFlightInfo(event.request));
  } else {
    event.respondWith(handleRequest(event));
  }
});

async function handleRequest(event: FetchEvent) {
  const options: Partial<Options> = {};

  try {
    if (DEBUG) {
      // customize caching
      options.cacheControl = {
        bypassCache: true,
      };
    }

    if (new URL(event.request.url).pathname === '/') {
      options.mapRequestToAsset = req => new Request(`${new URL(req.url).origin}/index.htm`, req);
    }

    const page = await getAssetFromKV(event, options);

    // allow headers to be altered
    const response = new Response(page.body, page);

    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('Referrer-Policy', 'unsafe-url');
    response.headers.set('Feature-Policy', 'none');

    return response;

  } catch (e) {
    // if an error is thrown try to serve the asset at 404.htm
    if (!DEBUG) {
      try {
        const notFoundResponse = await getAssetFromKV(event, {
          mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/404.htm`, req),
        });

        return new Response(notFoundResponse.body, { ...notFoundResponse, status: 404 });
      } catch (e) {
        return handle500(e);
      }
    }

    return handle500(e);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handle500(e: any) {
  return new Response(e.message || e.toString(), { status: 500 });
}
