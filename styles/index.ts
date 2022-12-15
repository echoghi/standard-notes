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
