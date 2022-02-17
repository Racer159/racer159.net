declare const FLIGHTAWARE_API_KEY: string;

export async function getFlightInfo(request: Request): Promise<Response> {
  const headers = {
    'content-type': 'application/json;charset=UTF-8',
  };

  if (request.method === 'GET') {
    const flightAwareKey = FLIGHTAWARE_API_KEY;
    const flightHeaders = {
      'Authorization': `Basic ${ flightAwareKey }`,
    };
    const flightCf = {
      cacheEverything: true,
      cacheTtlByStatus: { "200-299": 3600, "400-499": 1, "500-599": 0 },
    };

    return await fetch(
      'https://flightxml.flightaware.com/json/FlightXML3/AirportBoards?airport_code=KLAX', {
        headers: flightHeaders,
        cf: flightCf
      });
  } else {
    const err = { message: `Invalid Method: ${ request.method }` };

    return new Response(JSON.stringify(err), { status: 400, headers });
  }
}
