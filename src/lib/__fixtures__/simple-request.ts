import { cloneDeep } from "lodash";

const simpleBody = { test: 'test' };
const simpleURLHost = "www.example.com";
const simpleURLBase = `https://${simpleURLHost}/`;
const simpleURLParts: Array<string> = ["posts", "1", "new"];

const simpleRequest: chrome.devtools.network.Request = {
  getContent() {},
  cache: {},
  _resourceType: "xhr",
  request: {
    method: "POST",
    url: simpleURLBase + simpleURLParts.join("/"),
    httpVersion: "http/2.0",
    headers: [
      {
        name: "accept",
        value: "*/*",
      },
    ],
    queryString: [
      {
        name: "alt",
        value: "json",
      },
    ],
    cookies: [
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
    bodySize: 10,
    postData: {
      mimeType: "application/json",
      text: JSON.stringify(simpleBody),
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

export const createSimpleRequest = (url: string) => {
  const request = cloneDeep(simpleRequest);
  request.request.url = url;
  return request;
}
