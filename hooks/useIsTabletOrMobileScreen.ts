import { useEffect, useState } from 'react';

import { debounce } from '../utils';

export function useIsTabletOrMobileScreen() {
    const [windowSize, setWindowSize] = useState(0);

    useEffect(() => {
        const handleResize = debounce(() => {
            setWindowSize(window.innerWidth);
        }, 100);

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return {
        isTabletOrMobile: windowSize < 1024,
        isMobile: windowSize < 768,
        isTablet: windowSize < 1024 && windowSize > 768
    };
}
