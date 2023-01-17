import { useEffect } from 'react';

export function useOnClickOutside(
    ref: React.MutableRefObject<any>,
    buttonRef: React.MutableRefObject<any>,
    // eslint-disable-next-line
    handler: (event: Event) => void
) {
    useEffect(() => {
        // eslint-disable-next-line
        const listener = (event: Event) => {
            // Do nothing if clicking ref's element, menu button, or descendent elements
            if (
                !ref.current ||
                !buttonRef.current ||
                ref.current.contains(event.target) ||
                event.target === buttonRef.current
            ) {
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
