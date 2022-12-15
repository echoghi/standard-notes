import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { User } from '../types';
import fetcher from './fetcher';
import { toggleDarkMode } from './theme';

export const useUser = () => {
    const { data, error } = useSWR('/user', fetcher);

    return {
        user: (data as User) || null,
        isLoading: !data && !error,
        isError: error
    };
};

// prettier-ignore
export const useTheme = () => {
    const [theme, setTheme] = useState(() => {
        // Read the initial value of the "--sn-stylekit-theme-type" CSS variable
        if (typeof window !== 'undefined') {
            return window.getComputedStyle(document.documentElement).getPropertyValue('--sn-stylekit-theme-type');
        }

        return 'light';
    });

    useEffect(() => {
        const mediaQuery = window?.matchMedia('(prefers-color-scheme: dark)');

        // set the initial value of the theme based on the user's preference on mount
        if (mediaQuery.matches) {
            setTheme('dark');
            toggleDarkMode(true);
        }

        // listen for changes to the user's preferred color scheme
        const handleMediaQueryChange = (event: any) => {
            if (event.matches) {
                // If the user prefers dark mode, enable it
                setTheme('dark');
                toggleDarkMode(true);
            } else {
                // If the user does not prefer dark mode, disable it
                setTheme('light');
                toggleDarkMode(false);
            }
        };

        // Listen for changes to the user's preferred color scheme
        mediaQuery.addListener(handleMediaQueryChange);

        // Clean up the event listener when the component unmounts
        return () => mediaQuery.removeListener(handleMediaQueryChange);
    }, []);

    useEffect(() => {
        if (theme === 'dark') {
            toggleDarkMode(true);
        } else {
            toggleDarkMode(false);
        }
    }, [theme]);

    const toggleTheme = () => setTheme((state) => (state === 'dark' ? 'light' : 'dark'));

    return { toggleTheme, theme };
};

// eslint-disable-next-line
export function useOnClickOutside(ref: React.MutableRefObject<any>, handler: (event: Event) => void) {
    useEffect(() => {
        // eslint-disable-next-line
        const listener = (event: Event) => {
            // Do nothing if clicking ref's element or descendent elements
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }

            handler(event);
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
}
/* prettier-enable */
