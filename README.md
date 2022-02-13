# racer159.net

A Cloudflare Worker driving serverless web 1.0 content (you heard that right), easter eggs and fun to the `planet-earth` region, for my personal [net](https://www.imdb.com/title/tt0113957/), racer159.net.

## Note: You must use [wrangler](https://developers.cloudflare.com/workers/cli-wrangler/install-update) 1.17 or newer for development of this worker.

## Getting Started

This worker uses the [Wrangler](https://github.com/cloudflare/wrangler) CLI for development. If you are not already familiar with the tool, it is recommended that you install the tool and configure it to work with your [Cloudflare account](https://dash.cloudflare.com). Documentation can be found [here](https://developers.cloudflare.com/workers/tooling/wrangler/).

### Testing

Run `npm test` to execute the unit tests via [Jest](https://jestjs.io/).

### Linting

Run `npm run lint` to execute linting via [TS-ESLint](https://typescript-eslint.io/).

### Previewing and Publishing

For information on how to preview and publish your worker, please see the [Wrangler docs](https://developers.cloudflare.com/workers/tooling/wrangler/commands/#publish).

## Cloudflare Caveats

The `service-worker-mock` used by the tests is not a perfect representation of the Cloudflare Workers runtime. It is a general approximation. It's recommend that you test end to end with `wrangler dev` in addition to a [staging environment](https://developers.cloudflare.com/workers/tooling/wrangler/configuration/environments/) to test things before deploying.
