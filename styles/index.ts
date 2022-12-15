import styled from 'styled-components';

export const MenuButton = styled.button<{ ref: any }>`
    height: 2rem;
    width: 2rem;
    border: 1px solid var(--sn-stylekit-border-color);
    border-radius: 9999px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background-color: var(--sn-stylekit-background-color);

    &:active,
    &:focus {
        box-shadow: 0 0 0 2px var(--sn-stylekit-background-color), 0 0 0 4px var(--sn-stylekit-info-color);
    }

    &:hover {
        background: var(--sn-stylekit-contrast-background-color);

        svg {
            fill: var(--sn-stylekit-contrast-foreground-color);
        }
    }
`;

export const Menu = styled.menu`
    list-style: none;
    outline: none;
    padding-bottom: 0.5rem;
`;

export const MenuItem = styled.li`
    &:hover {
        background: var(--sn-stylekit-contrast-background-color);
    }
`;

export const MenuContainer = styled.div<{
    open: boolean;
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
    ref: any;
}>`
    position: absolute;
    user-select: none;
    padding-top: 0.5rem;
    display: ${(props: any) => (props.open ? 'block' : 'none')};
    visibility: ${(props: any) => (props.open ? 'visible' : 'hidden')};
    background-color: var(--sn-stylekit-background-color);
    --tw-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12), 0px 2px 8px rgba(0, 0, 0, 0.04);
    --tw-shadow-colored: 0px 4px 8px var(--tw-shadow-color), 0px 2px 8px var(--tw-shadow-color);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 rgba(0, 0, 0, 0)), var(--tw-ring-shadow, 0 0 rgba(0, 0, 0, 0)),
        var(--tw-shadow);
    max-width: 20rem;
    height: auto;
    border-radius: 0.25rem;
    width: 20rem;
    display: flex;
    flex-direction: column;
    z-index: var(--z-index-dropdown-menu);
    will-change: transform;
    top: ${(props: any) => (props.top ? `${props.top}px` : 'unset')};
    left: ${(props: any) => (props.left ? `${props.left}px` : 'unset')};
    right: ${(props: any) => (props.right ? `${props.right}px` : 'unset')};
    bottom: ${(props: any) => (props.bottom ? `${props.bottom}px` : 'unset')};
`;

export const Divider = styled.hr`
    width: 100%;
    height: 1px;
    margin: 0.5rem 0;
    background-color: var(--sn-stylekit-border-color);
    border-style: none;
`;

export const RadioButton = styled.button`
    font-size: 0.813rem;
    padding: 0.375rem 0.75rem;
    color: var(--sn-stylekit-contrast-foreground-color);
    text-align: left;
    background-color: transparent;
    border: none;
    align-items: center;
    cursor: pointer;
    width: 100%;
    display: flex;
`;

export const RadioFill = styled.div<{ checked: boolean }>`
    border: 2px solid
        ${(props) => (props.checked ? 'var(--sn-stylekit-info-color)' : 'var(--sn-stylekit-passive-color-1)')};
    border-radius: 9999px;
    width: 1rem;
    height: 1rem;
    position: relative;

    &:after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 9999px;
        background-color: var(--sn-stylekit-info-color);
        opacity: ${(props) => (props.checked ? 1 : 0)};
    }
`;

export const RadioText = styled.div`
    flex-grow: 1;
    display: flex;
    margin-left: 0.5rem;
    align-items: center;
`;

export const setGrid = ({
    editorOpen,
    notesPanel,
    tagsPanel,
    focusMode
}: {
    editorOpen: boolean;
    notesPanel: boolean;
    tagsPanel: boolean;
    focusMode: boolean;
}) => {
    if (editorOpen) {
        if (notesPanel && tagsPanel) {
            if (focusMode) return '0 0 1fr';
            return '220px 400px 2fr';
        }
        if (notesPanel) {
            if (focusMode) return '0 1fr';
            return '400px 2fr';
        }
        if (tagsPanel) {
            if (focusMode) return '0 1fr';
            return '220px 2fr';
        }

        return '1fr';
    } else {
        if (focusMode) return '1fr';
        if (notesPanel && tagsPanel) return '220px 1fr';
        return '1fr';
    }
};
