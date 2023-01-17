import { useEffect, useState } from 'react';

import { handleTheme } from '../theme';
import { Theme } from '../types';
import { isAPISupported, isClient } from '../utils';

// prettier-ignore
export const useTheme = (initialTheme: Theme) => {
    const [theme, setTheme] = useState(() => {
        return initialTheme || 'light';
    });

    if (!isClient || !isAPISupported('matchMedia')) {
        // eslint-disable-next-line no-console
        console.warn(
            'matchMedia is not supported, this could happen both because window.matchMedia is not supported by' +
                " your current browser or you're using the useMediaQuery hook whilst server side rendering."
        );
    }

    useEffect(() => {
        const mediaQuery = window?.matchMedia('(prefers-color-scheme: dark)');

        // set the initial value of the theme based on the user's preference on mount
        if (mediaQuery.matches && initialTheme === 'system') {
            handleTheme('dark');
        }

        setTheme(initialTheme);
    }, [initialTheme]);

    useEffect(() => {
        const mediaQuery = window?.matchMedia('(prefers-color-scheme: dark)');

        setTheme(theme);

        if (theme === 'system') {
            if (mediaQuery.matches) {
                handleTheme('dark');
            } else {
                handleTheme('light');
            }
        } else {
            handleTheme(theme);
        }

        // listen for changes to the user's preferred color scheme
        const handleMediaQueryChange = (event: any) => {
            if(theme !== 'system') return;
            if (event.matches) {
                // If the user prefers dark mode, enable it
                handleTheme('dark');
            } else {
                // If the user does not prefer dark mode, disable it
                handleTheme('light');
            }
        };

        // Listen for changes to the user's preferred color scheme
        mediaQuery.addListener(handleMediaQueryChange);

        // Clean up the event listener when the component unmounts
        return () => mediaQuery.removeListener(handleMediaQueryChange);
    }, [theme]);

    const toggleTheme = (newTheme: Theme) => setTheme(newTheme);

    return { toggleTheme, theme };
};
