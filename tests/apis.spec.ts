import { getFlightInfo } from '../src/apis';
import makeServiceWorkerEnv from 'service-worker-mock';

declare const global: never;

describe('apis', () => {
  beforeEach(() => {
    Object.assign(global, makeServiceWorkerEnv());
    jest.resetModules();
  });

  test('apis GET', async () => {
    const response = new Response(JSON.stringify({ AirportBoardsResult: {} }));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const fetch = jest.fn((url: string, opts: Request) => response);
    const FLIGHTAWARE_API_KEY = 'KEY';
    Object.assign(global, { fetch, FLIGHTAWARE_API_KEY });

    const opts = {
      headers: {
        'Authorization': 'Basic KEY',
      },
      cf: {
        cacheEverything: true,
        cacheTtlByStatus: { "200-299": 3600, "400-499": 1, "500-599": 0 },
      }
    };

    const result = await getFlightInfo(new Request('/', { method: 'GET' }));
    expect(result.status).toEqual(200);
    const json = await result.json();
    expect(json).toEqual({ AirportBoardsResult: {} });

    expect(fetch.mock.calls.length).toBe(1);
    expect(fetch.mock.calls[0].length).toBe(2);
    expect(fetch.mock.calls[0][0]).toBe('https://flightxml.flightaware.com/json/FlightXML3/AirportBoards?airport_code=KLAX');
    expect(fetch.mock.calls[0][1]).toEqual(opts);
  });

  test('apis POST', async () => {
    const result = await getFlightInfo(new Request('/', { method: 'POST' }));
    expect(result.status).toEqual(400);
    const json = await result.json();
    expect(json).toEqual({ message: 'Invalid Method: POST' });
    expect(result.headers.get('content-type')).toBe('application/json;charset=UTF-8');
  });
});
