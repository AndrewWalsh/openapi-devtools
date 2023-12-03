import { useState, useCallback, useEffect } from "react";
import { OpenAPIObject } from "openapi3-ts/oas31";
import { RedocStandalone } from "redoc";
import RequestStore, {
  endpointsToOAI31,
  Endpoint,
  EndpointsByHost,
  JSONType,
  Status,
} from "@andrew_walsh/openapi-spec-generator";
import requestStore from "./helpers/request-store";
import { isValidRequest, parseJSON, safelyGetURLHost } from "../utils/helpers";
import Context from "./context";
import Control from "./Control";
import Start from "./Start";
import classes from "./main.module.css";
import { sortEndpoints } from "./helpers/endpoints-by-host";
import { isEmpty } from "lodash";
import decodeUriComponent from "decode-uri-component";

function Main() {
  const [spec, setSpec] = useState<OpenAPIObject | null>(null);
  const [endpoints, setEndpoints] = useState<Array<Endpoint>>([]);
  const [endpointsByHost, setEndpointsByHost] = useState<EndpointsByHost>([]);
  const [allHosts, setAllHosts] = useState<Set<string>>(new Set());
  const [disabledHosts, setDisabledHosts] = useState<Set<string>>(new Set());
  const initialStatus = isEmpty(requestStore.get())
    ? Status.INIT
    : Status.RECORDING;
  const [status, setStatus] = useState(initialStatus);

  const requestFinishedHandler = useCallback(
    (harRequest: chrome.devtools.network.Request) => {
      async function getCurrentTab() {
        if (!(await isValidRequest(harRequest))) return;
        try {
          harRequest.getContent((content) => {
            try {
              harRequest.request.url = decodeUriComponent(
                harRequest.request.url
              );
              const responseBody: JSONType = parseJSON(content);
              requestStore.insert(harRequest, responseBody);
              setSpecEndpoints();
              const host = safelyGetURLHost(harRequest.request.url);
              if (host && !allHosts.has(host)) {
                setAllHosts((prev) => new Set(prev).add(host));
              }
            } catch {
              return;
            }
          });
        } catch {
          return;
        }
      }

      getCurrentTab();
    },
    []
  );

  useEffect(() => {
    return () => {
      chrome.devtools.network.onRequestFinished.removeListener(
        requestFinishedHandler
      );
    };
  }, []);

  const setSpecEndpoints = useCallback(async () => {
    const nextEndpoints = requestStore.endpoints();
    setSpec(endpointsToOAI31(nextEndpoints, requestStore.options()).getSpec());
    setEndpoints(sortEndpoints(nextEndpoints));
    // setEndpointsByHost(getEndpointsByHost(nextEndpoints));
  }, []);

  useEffect(() => {
    requestStore.setDisabledHosts(disabledHosts);
    setSpecEndpoints();
  }, [disabledHosts]);

  useEffect(() => {
    switch (status) {
      case Status.INIT:
        chrome.devtools.network.onRequestFinished.removeListener(
          requestFinishedHandler
        );
        requestStore.clear();
        setSpec(null);
        setAllHosts(new Set());
        setDisabledHosts(new Set());
        break;
      case Status.STOPPED:
        chrome.devtools.network.onRequestFinished.removeListener(
          requestFinishedHandler
        );
        break;
      case Status.RECORDING:
        chrome.devtools.network.onRequestFinished.removeListener(
          requestFinishedHandler
        );
        chrome.devtools.network.onRequestFinished.addListener(
          requestFinishedHandler
        );
        break;
    }
  }, [status]);

  const parameterise = useCallback<typeof RequestStore.prototype.parameterise>(
    (index, path, host) => {
      requestStore.parameterise(index, path, host);
      setSpecEndpoints();
    },
    []
  );

  const start = useCallback(() => {
    setStatus(Status.RECORDING);
  }, []);

  const stop = useCallback(() => {
    setStatus(Status.STOPPED);
  }, []);

  const clear = useCallback(() => {
    setStatus(Status.INIT);
  }, []);

  const importFn = useCallback((json: string) => {
    const result = requestStore.import(json);
    setSpecEndpoints();
    setAllHosts(new Set(requestStore.hosts()));
    return result;
  }, []);

  if (status === Status.INIT) {
    return <Start start={start} />;
  }

  return (
    <Context.Provider
      value={{
        allHosts,
        setAllHosts,
        endpointsByHost,
        setEndpointsByHost,
        disabledHosts,
        setDisabledHosts,
        parameterise,
        endpoints,
        export: requestStore.export,
        import: importFn,
        options: requestStore.options,
      }}
    >
      <div className={classes.wrapper}>
        <Control start={start} stop={stop} clear={clear} status={status} />
        <RedocStandalone
          spec={spec || {}}
          options={{
            hideHostname: true,
            sortEnumValuesAlphabetically: true,
            sortOperationsAlphabetically: true,
            sortPropsAlphabetically: true,
            hideLoading: true,
            nativeScrollbars: true,
            downloadFileName: "openapi-devtools-spec.json",
            expandDefaultServerVariables: false,
            expandSingleSchemaField: false,
          }}
        />
      </div>
    </Context.Provider>
  );
}

export default Main;
