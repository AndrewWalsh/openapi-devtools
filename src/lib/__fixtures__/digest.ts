const bearer: chrome.devtools.network.Request = {
  getContent() {},
  cache: {},
  _resourceType: "xhr",
  connection: "194622",
  pageref: "page_3",
  request: {
    method: "GET",
    url: "https://api.example.co/api/board/644efa113e96ce003e4082be/jobs/644efa113e96ce003e4082c9",
    httpVersion: "http/2.0",
    headers: [
      {
        name: ":authority",
        value: "api.example.com",
      },
      {
        name: ":method",
        value: "GET",
      },
      {
        name: ":path",
        value:
          "/api/board/644efa113e96ce003e4082be/jobs/644efa113e96ce003e4082c9",
      },
      {
        name: ":scheme",
        value: "https",
      },
      {
        name: "accept",
        value: "application/json, text/plain, */*",
      },
      {
        name: "accept-encoding",
        value: "gzip, deflate, br",
      },
      {
        name: "accept-language",
        value: "en-GB,en-US;q=0.9,en;q=0.8",
      },
      {
        name: "authorization",
        value:
          "Digest username=\"Mufasa\", realm=\"testrealm@host.com\", nonce=\"dcd98b7102dd2f0e8b11d0f600bfb0c093\", uri=\"/dir/index.html\",",
      },
      {
        name: "cache-control",
        value: "no-cache",
      },
      {
        name: "origin",
        value: "https://example.com",
      },
      {
        name: "pragma",
        value: "no-cache",
      },
      {
        name: "referer",
        value: "https://example.com/",
      },
      {
        name: "sec-ch-ua",
        value:
          '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
      },
      {
        name: "sec-ch-ua-mobile",
        value: "?0",
      },
      {
        name: "sec-ch-ua-platform",
        value: '"macOS"',
      },
      {
        name: "sec-fetch-dest",
        value: "empty",
      },
      {
        name: "sec-fetch-mode",
        value: "cors",
      },
      {
        name: "sec-fetch-site",
        value: "same-site",
      },
      {
        name: "user-agent",
        value:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
      },
    ],
    queryString: [],
    cookies: [],
    headersSize: -1,
    bodySize: 0,
  },
  response: {
    status: 200,
    statusText: "OK",
    httpVersion: "http/2.0",
    headers: [
      {
        name: "access-control-allow-credentials",
        value: "true",
      },
      {
        name: "access-control-allow-origin",
        value: "https://example.com",
      },
      {
        name: "cf-cache-status",
        value: "DYNAMIC",
      },
      {
        name: "cf-ray",
        value: "81d960dbbcd539fb-YYZ",
      },
      {
        name: "content-encoding",
        value: "br",
      },
      {
        name: "content-type",
        value: "application/json; charset=utf-8",
      },
      {
        name: "date",
        value: "Sun, 29 Oct 2023 06:31:55 GMT",
      },
      {
        name: "etag",
        value: 'W/"RWY0ZNBvNXEP0LB2sU80EQ=="',
      },
      {
        name: "nel",
        value:
          '{"report_to":"heroku-nel","max_age":3600,"success_fraction":0.005,"failure_fraction":0.05,"response_headers":["Via"]}',
      },
      {
        name: "report-to",
        value:
          '{"group":"heroku-nel","max_age":3600,"endpoints":[{"url":"https://nel.heroku.com/reports?ts=1698561115&sid=929419e7-33ea-4e2f-85f0-7d8b7cd5cbd6&s=L3cRSWh4mrStaCTqmkJOwhEZcdhCjn2tyQStcNUdWRE%3D"}]}',
      },
      {
        name: "reporting-endpoints",
        value:
          "heroku-nel=https://nel.heroku.com/reports?ts=1698561115&sid=929419e7-33ea-4e2f-85f0-7d8b7cd5cbd6&s=L3cRSWh4mrStaCTqmkJOwhEZcdhCjn2tyQStcNUdWRE%3D",
      },
      {
        name: "server",
        value: "cloudflare",
      },
      {
        name: "strict-transport-security",
        value: "max-age=2592000; includeSubDomains",
      },
      {
        name: "vary",
        value: "Origin, Accept-Encoding",
      },
      {
        name: "via",
        value: "1.1 vegur",
      },
      {
        name: "x-content-type-options",
        value: "nosniff",
      },
      {
        name: "x-powered-by",
        value: "Express",
      },
      {
        name: "x-ratelimit-limit",
        value: "3000",
      },
      {
        name: "x-ratelimit-remaining",
        value: "2999",
      },
      {
        name: "x-ratelimit-reset",
        value: "1698561155",
      },
    ],
    cookies: [],
    content: {
      size: 18097,
      mimeType: "application/json",
    },
    redirectURL: "",
    headersSize: -1,
    bodySize: -1,
    _transferSize: 5955,
  },
  serverIPAddress: "104.26.14.205",
  startedDateTime: "2023-10-29T06:31:54.137Z",
  time: 790.8520000055432,
  timings: {
    blocked: 462.0410000013709,
    dns: -1,
    ssl: -1,
    connect: -1,
    send: 0.14100000000000001,
    wait: 327.99000000679865,
    receive: 0.6799999973736703,
  },
};

export default bearer;
