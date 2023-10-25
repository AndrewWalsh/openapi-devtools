import store from "store2";

const namespace = "openapi-devtools";

const get = () => store.get(namespace);
const set = (value: unknown) => store.set(namespace, value);
const clear = () => store.clear();

export default {
  get,
  set,
  clear,
};
