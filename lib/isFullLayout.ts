import isAPISupported from './isApiSupported';
import isClient from './isClient';

const isFullLayout = () => {
    if (!isClient || !isAPISupported('matchMedia')) return false;

    return window.innerWidth >= 1024;
};

export default isFullLayout;
