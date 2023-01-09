import isAPISupported from './isApiSupported';
import isClient from './isClient';

const isSmallLayout = () => {
    if (!isClient || !isAPISupported('matchMedia')) return false;

    return window.innerWidth <= 640;
};

export default isSmallLayout;
