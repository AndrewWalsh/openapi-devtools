import type { Entry } from "har-format";

const postXWWWFormUrlEncoded: Entry = {
  _priority: "VeryHigh",
  _resourceType: "document",
  cache: {},
  connection: "17359",
  pageref: "page_10",
  request: {
    method: "POST",
    url: "https://httpbin.org/post",
    httpVersion: "http/2.0",
    headers: [],
    queryString: [],
    cookies: [],
    headersSize: -1,
    bodySize: 94,
    postData: {
      mimeType: "application/x-www-form-urlencoded",
      text: "custname=asdf&custtel=sadf&custemail=&size=medium&topping=cheese&delivery=11%3A00&comments=sdg",
    },
  },
  response: {
    status: 200,
    statusText: "",
    httpVersion: "http/2.0",
    headers: [],
    cookies: [],
    content: {
      size: 1411,
      mimeType: "application/json",
    },
    redirectURL: "",
    headersSize: -1,
    bodySize: -1,
    _transferSize: 1566,
  },
  serverIPAddress: "75.101.210.237",
  startedDateTime: "2023-11-26T03:21:54.665Z",
  time: 1121.7940000324434,
  timings: {
    blocked: 197.47300002474338,
    dns: 0.007999999999981355,
    ssl: 348.39799999999997,
    connect: 615.2149999999999,
    send: 0.31799999999998363,
    wait: 307.29200002782795,
    receive: 1.4879999798722565,
  },
};

export default postXWWWFormUrlEncoded;
