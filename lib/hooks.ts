import React, { useEffect, useState } from 'react';
import { breakpoints } from '../styles';
import isAPISupported from './isApiSupported';
import isClient from './isClient';
import { toggleDarkMode } from './theme';

// prettier-ignore
export const useTheme = (initialTheme: 'light' | 'dark' | 'system') => {
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

/**
 * Accepts a media query string then uses the
 * [window.matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) API to determine if it
 * matches with the current document.<br />
 * It also monitor the document changes to detect when it matches or stops matching the media query.<br />
 * Returns the validity state of the given media query.
 *
 */
export const useMediaQuery = (mediaQuery: string) => {
    if (!isClient || !isAPISupported('matchMedia')) {
        // eslint-disable-next-line no-console
        console.warn(
            'matchMedia is not supported, this could happen both because window.matchMedia is not supported by' +
                " your current browser or you're using the useMediaQuery hook whilst server side rendering."
        );

        return null;
    }

    // eslint-disable-next-line
    const [isVerified, setIsVerified] = useState(!!window.matchMedia(mediaQuery).matches);
    // eslint-disable-next-line
    useEffect(() => {
        const mediaQueryList = window.matchMedia(mediaQuery);
        const documentChangeHandler = () => setIsVerified(!!mediaQueryList.matches);

        mediaQueryList.addListener(documentChangeHandler);

        documentChangeHandler();
        return () => {
            mediaQueryList.removeListener(documentChangeHandler);
        };
    }, [mediaQuery, window.matchMedia]);

    return isVerified;
};

type LayoutConfig = {
    editorOpen: boolean;
    notesPanel: boolean;
    tagsPanel: boolean;
    focusMode: boolean;
    setNavigation: any;
};

export const useGrid = ({ editorOpen, notesPanel, tagsPanel, focusMode, setNavigation }: LayoutConfig) => {
    const [grid, setGrid] = useState('1fr');
    const isFullLayout = useMediaQuery(`(min-width: ${breakpoints.lg}px)`);

    useEffect(() => {
        // toggle navigation on layout change
        setNavigation(isFullLayout);
    }, [isFullLayout]);

    useEffect(() => {
        switch (true) {
            case isFullLayout && editorOpen && notesPanel && tagsPanel && focusMode:
                return setGrid('0 0 1fr');
            case isFullLayout && editorOpen && notesPanel && tagsPanel:
                return setGrid('220px 400px 2fr');
            case isFullLayout && editorOpen && notesPanel && focusMode:
                return setGrid('0 1fr');
            case isFullLayout && editorOpen && notesPanel:
                return setGrid('400px 2fr');
            case isFullLayout && editorOpen && tagsPanel && focusMode:
                return setGrid('0 1fr');
            case isFullLayout && editorOpen && tagsPanel:
                return setGrid('220px 2fr');
            case isFullLayout && editorOpen:
                return setGrid('1fr');
            case isFullLayout && focusMode:
                return setGrid('0');
            case isFullLayout && notesPanel && tagsPanel:
                return setGrid('220px 1fr');
            case isFullLayout:
                return setGrid('1fr');
            case !isFullLayout && editorOpen && notesPanel && focusMode:
                return setGrid('0 1fr');
            case !isFullLayout && editorOpen && notesPanel:
                return setGrid('1fr 2fr');
            case !isFullLayout && editorOpen:
                return setGrid('1fr');
            case !isFullLayout && focusMode:
                return setGrid('0');
            case !isFullLayout && notesPanel && tagsPanel:
                return setGrid('1fr 2fr');
            case !isFullLayout && notesPanel:
                return setGrid('1fr');
            default:
                return setGrid('220px 1fr');
        }
    }, [editorOpen, notesPanel, tagsPanel, focusMode, isFullLayout]);

    return grid;
};
