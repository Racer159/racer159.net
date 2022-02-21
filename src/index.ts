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

    const url = new URL(event.request.url);

    if (url.pathname === '/') {
      options.mapRequestToAsset = req => new Request(`${url.origin}/home.htm`, req);
    }

    const pageResponse = await getAssetFromKV(event, options);

    // allow headers to be altered
    const response = await handlePage(url, event, pageResponse);

    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('Referrer-Policy', 'unsafe-url');
    response.headers.set('Feature-Policy', 'none');

    return response;

  } catch (e) {
    // if an error is thrown try to serve the asset at 404.htm
    if (!DEBUG) {
      try {
        const url = new URL(event.request.url);

        let notFoundResponse = await getAssetFromKV(event, {
          mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/404.htm`, req),
        });

        notFoundResponse = await handlePage(new URL(url.origin + '/404.htm'), event, notFoundResponse);

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

/**
 * Inject page content based on URL to make page dynamic on 200
 */
 async function handlePage(url: URL, event: FetchEvent, page: Response) {
  if (page.status === 200 && (url.pathname === '/' || (url.pathname.endsWith('.htm')  && !url.pathname.startsWith('/net/')))) {
    // retrieve the index page
    const index = await getAssetFromKV(event, {
      mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/index.htm`, req),
    });

    // replace index {{page}} with real page
    let indexBody = await index.text();
    const pageBody = await page.text();
    indexBody = indexBody.replace('{{page}}', pageBody);

    const resp = new Response(indexBody, page);
    resp.headers.set('Content-Type', 'text/html; charset=UTF-8');

    return resp;
  } else {
    // return the default response
    return new Response(page.body, page);
  }
}
