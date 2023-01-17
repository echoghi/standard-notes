/**
 * Exports a boolean value reporting whether the given API is supported or not
 */
export const isAPISupported = (api: string) => api in window;

/**
 * Exports a boolean value reporting whether is client side or server side by checking on the window object
 */
export const isClient = typeof window === 'object';

export const isFullLayout = () => {
    if (!isClient || !isAPISupported('matchMedia')) return false;

    return window.innerWidth >= 1024;
};
