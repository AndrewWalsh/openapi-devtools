import store2 from "store2";
import type { Options } from "../RequestStore";

const namespace = "openapi-devtools-options";
const key = "options";
const store = store2.namespace(namespace);

export const defaultOptions: Readonly<Options> = {
  enableMoreInfo: false,
};

const get = (): Options => {
  const options = store.get(key);
  if (options) return options;
  store.set(key, defaultOptions);
  return defaultOptions;
};
const set = (value: Partial<Options>) => {
  const options = get();
  const newOptions = { ...options, ...value };
  store.set(key, newOptions);
};
const clear = () => store.clear();

export default {
  get,
  set,
  clear,
};
