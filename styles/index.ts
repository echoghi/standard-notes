import styled, { keyframes } from 'styled-components';

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
};

export const fadeOut = keyframes`
  from {
     opacity: 1;
  }

  to {
    opacity: 0;
  }
`;

export const MenuButton = styled.button<{ ref?: any }>`
  height: 2.5rem;
  width: 2.5rem;
  min-width: 2.5rem;
  border: 1px solid var(--sn-stylekit-border-color);
  border-radius: 9999px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: var(--sn-stylekit-background-color);

  &:active,
  &:focus {
    box-shadow: 0 0 0 2px var(--sn-stylekit-background-color),
      0 0 0 4px var(--sn-stylekit-info-color);
  }

  &:hover {
    background: var(--sn-stylekit-contrast-background-color);

    svg {
      fill: var(--sn-stylekit-contrast-foreground-color);
    }
  }

  svg {
    pointer-events: none;
  }

  @media (min-width: ${breakpoints.md}px) {
    height: 2rem;
    width: 2rem;
    min-width: 2rem;
  }
`;

export const Menu = styled.menu`
  list-style: none;
  outline: none;
  padding-bottom: 0.5rem;
`;

export const MenuItem = styled.li<{ mobileHide?: boolean }>`
  display: block;

  &:hover {
    background: var(--sn-stylekit-contrast-background-color);
  }

  &#focus-mode {
    @media (max-width: ${breakpoints.sm}px) {
      display: none;
    }
  }

  @media (max-width: ${breakpoints.lg}px) {
    display: ${({ mobileHide }) => (mobileHide ? 'none' : 'block')};
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
  display: ${({ open }) => (open ? 'block' : 'none')};
  visibility: ${({ open }) => (open ? 'visible' : 'hidden')};
  background-color: var(--sn-stylekit-background-color);
  --tw-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12), 0px 2px 8px rgba(0, 0, 0, 0.04);
  --tw-shadow-colored: 0px 4px 8px var(--tw-shadow-color), 0px 2px 8px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 rgba(0, 0, 0, 0)),
    var(--tw-ring-shadow, 0 0 rgba(0, 0, 0, 0)), var(--tw-shadow);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  z-index: var(--z-index-dropdown-menu);
  will-change: transform;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  font-size: 1.1rem;

  #menu-close {
    display: flex;
    justify-content: flex-end;
    padding: 0.5rem 0.75rem;
    align-items: center;
  }

  @media (min-width: ${breakpoints.md}px) {
    top: ${({ top }) => (top ? `${top}px` : 'unset')};
    left: ${({ left }) => (left ? `${left}px` : 'unset')};
    right: ${({ right }) => (right ? `${right}px` : 'unset')};
    bottom: ${({ bottom }) => (bottom ? `${bottom}px` : 'unset')};
    max-width: 20rem;
    height: auto;
    border-radius: 0.25rem;
    width: 20rem;
    font-size: 0.83rem;

    #menu-close,
    #menu-close-divider {
      display: none;
    }
  }
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
    ${({ checked }) =>
      checked ? 'var(--sn-stylekit-info-color)' : 'var(--sn-stylekit-passive-color-1)'};
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
    opacity: ${({ checked }) => (checked ? 1 : 0)};
  }
`;

export const RadioText = styled.div`
  font-size: 1.1rem;
  flex-grow: 1;
  display: flex;
  margin-left: 0.5rem;
  align-items: center;

  @media (min-width: ${breakpoints.md}px) {
    font-size: 0.875rem;
  }
`;

export const ItemText = styled.div<{ color?: string }>`
  font-size: 1.1rem;
  margin-left: 0.5rem;
  color: ${({ color }) => color || 'inherit'};

  @media (min-width: ${breakpoints.md}px) {
    font-size: 0.875rem;
  }
`;
