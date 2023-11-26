import type { Entry } from 'har-format';

// Has header x-api-key
// Has cookie foo
const apikey: Entry = {
  _priority: "High",
  _resourceType: "fetch",
  cache: {},
  connection: "14048",
  request: {
    method: "GET",
    url: "https://httpbin.org/basic-auth/d/d",
    httpVersion: "http/2.0",
    headers: [
      {
        name: "x-api-key",
        value: "123",
      },
      {
        name: "cookie",
        value: "foo=bar;sessionid=123",
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
        value: "*",
      },
      {
        name: "content-length",
        value: "44",
      },
      {
        name: "content-type",
        value: "application/json",
      },
      {
        name: "date",
        value: "Mon, 30 Oct 2023 07:51:43 GMT",
      },
      {
        name: "server",
        value: "gunicorn/19.9.0",
      },
    ],
    cookies: [],
    content: {
      size: 44,
      mimeType: "application/json",
    },
    redirectURL: "",
    headersSize: -1,
    bodySize: -1,
    _transferSize: 184,
  },
  serverIPAddress: "54.83.187.171",
  startedDateTime: "2023-10-30T07:51:43.115Z",
  time: 428.73000000250715,
  timings: {
    blocked: 123.52900002598763,
    dns: 0.012999999999991019,
    ssl: 104.29100000000003,
    connect: 204.75600000000003,
    send: 0.6009999999999991,
    wait: 98.76400000092758,
    receive: 1.066999975591898,
  },
};

export default apikey;
