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
export const useTheme = (initialTheme: 'light' | 'dark' | 'system') => {

    const [theme, setTheme] = useState(() => {
        return initialTheme || 'light';
    });

    useEffect(() => {
        const mediaQuery = window?.matchMedia('(prefers-color-scheme: dark)');

        // set the initial value of the theme based on the user's preference on mount
        if (mediaQuery.matches && initialTheme === 'system') {
            toggleDarkMode(true);
        }

        setTheme(initialTheme);
    }, [initialTheme]);

    useEffect(() => {
        const mediaQuery = window?.matchMedia('(prefers-color-scheme: dark)');

        if (theme === 'dark') {
            toggleDarkMode(true);
        } else if(theme === 'light'){
            toggleDarkMode(false);
        } else {
            setTheme('system');

            if (mediaQuery.matches) {
                toggleDarkMode(true);
            } else {
                toggleDarkMode(false);
            }
        }

        // listen for changes to the user's preferred color scheme
        const handleMediaQueryChange = (event: any) => {
            if(theme !== 'system') return;
            if (event.matches) {
                // If the user prefers dark mode, enable it
                toggleDarkMode(true);
            } else {
                // If the user does not prefer dark mode, disable it
                toggleDarkMode(false);
            }
        };

        // Listen for changes to the user's preferred color scheme
        mediaQuery.addListener(handleMediaQueryChange);

        // Clean up the event listener when the component unmounts
        return () => mediaQuery.removeListener(handleMediaQueryChange);
    }, [theme]);

    const toggleTheme = (newTheme: 'light' | 'dark' | 'system') => setTheme(newTheme);

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
