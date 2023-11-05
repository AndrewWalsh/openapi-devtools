const post: chrome.devtools.network.Request = {
  getContent() {},
  cache: {},
  _resourceType: "xhr",
  request: {
    method: "POST",
    url: "https://www.example.com/v1/track",
    httpVersion: "http/2.0",
    headers: [
      {
        name: ":method",
        value: "POST",
      },
      {
        name: ":path",
        value: "/v1/track",
      },
      {
        name: ":scheme",
        value: "https",
      },
      {
        name: "accept",
        value: "*/*",
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
        name: "anonymousid",
        value: "aa",
      },
      {
        name: "content-length",
        value: "6798",
      },
      {
        name: "content-type",
        value: "application/json",
      },
    ],
    queryString: [
      {
        name: "alt",
        value: "json",
      },
      {
        name: "key",
        value: "abc",
      },
    ],
    cookies: [
      {
        name: "VISITOR_INFO1_LIVE",
        value: "abc",
        path: "/",
        domain: ".example.com",
        expires: "2024-04-12T07:45:16.478Z",
        httpOnly: true,
        secure: true,
      },
      {
        name: "YSC",
        value: "abc",
        path: "/",
        domain: ".example.com",
        expires: "1969-12-31T23:59:59.000Z",
        httpOnly: true,
        secure: true,
      },
    ],
    headersSize: -1,
    bodySize: 6798,
    postData: {
      mimeType: "application/json",
      text: '{ "test": "integer" }'
    },
  },
  response: {
    status: 200,
    statusText: "OK",
    httpVersion: "http/2.0",
    headers: [
      {
        name: "access-control-expose-headers",
        value: "",
      },
      {
        name: "content-length",
        value: "2",
      },
      {
        name: "content-type",
        value: "text/plain; charset=utf-8",
      },
      {
        name: "date",
        value: "Sun, 15 Oct 2023 07:42:54 GMT",
      },
      {
        name: "server",
        value: "openresty/1.21.4.2",
      },
      {
        name: "vary",
        value: "Origin",
      },
    ],
    cookies: [],
    content: {
      size: 28,
      mimeType: "application/json",
    },
    redirectURL: "",
    headersSize: -1,
    bodySize: -1,
    _transferSize: 166,
  },
  serverIPAddress: "44.219.182.139",
  startedDateTime: "2023-10-15T07:42:54.694Z",
  time: 318.07399999186396,
  timings: {
    blocked: 1.4950000001639128,
    dns: 0.010000000000000009,
    ssl: 105.26800000000001,
    connect: 203.84,
    send: 0.21299999999999386,
    wait: 112.1749999562949,
    receive: 0.341000035405159,
  },
};

export const postHost = 'www.example.com';

export default post;
