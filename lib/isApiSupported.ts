/**
 * Exports a boolean value reporting whether the given API is supported or not
 */
const isAPISupported = (api: string) => api in window;

export default isAPISupported;
