import { Theme } from 'types';

const themeMap: any = {
    light: {
        'theme-type': 'light',
        'background-color': '#ffffff',
        'secondary-foreground-color': '#2e2e2e',
        'foreground-color': '#19191c',
        'border-color': '#dfe1e4',
        'contrast-background-color': 'rgba(244, 245, 247, 1)',
        'contrast-foreground-color': '#2e2e2e',
        'info-color': '#086dd6',
        'sync-contrast-color': 'var(--sn-stylekit-passive-color-1)',
        'secondary-background-color': '#eeeff1',
        'navigation-item-selected-background-color': 'rgb(253, 253, 253)'
    },
    dark: {
        'theme-type': 'dark',
        'background-color': '#0f1011',
        'secondary-foreground-color': '#ffffff',
        'foreground-color': '#eeeeee',
        'border-color': '#000000',
        'contrast-background-color': '#000000',
        'contrast-foreground-color': '#ffffff',
        'info-color': '#a464c2',
        'sync-contrast-color': '#ffffff',
        'secondary-background-color': '#1c1d1e',
        'navigation-item-selected-background-color': '#0f1011'
    },
    solarized: {
        'theme-type': 'solarized',
        'background-color': '#002b36',
        'foreground-color': '#fdf6e3',
        'secondary-foreground-color': '#fdf6e3',
        'border-color': '#00252e',
        'contrast-background-color': '#083642',
        'contrast-foreground-color': '#fdf6e3',
        'info-color': '#2aa198',
        'sync-contrast-color': '#ffffff',
        'secondary-background-color': '#083642',
        'navigation-item-selected-background-color': '#002b36'
    },
    futura: {
        'theme-type': 'futura',
        'background-color': '#20202b',
        'foreground-color': '#a9aabe',
        'secondary-foreground-color': '#a9aabe',
        'border-color': '#0f1116',
        'contrast-background-color': '#272734',
        'contrast-foreground-color': '#a9aabe',
        'info-color': '#fca429',
        'sync-contrast-color': '#ffffff',
        'secondary-background-color': '#2c2c39',
        'navigation-item-selected-background-color': '#20202b'
    },
    autobiography: {
        'theme-type': 'autobiography',
        'background-color': '#ede4da',
        'foreground-color': '#5c3f27',
        'secondary-foreground-color': '#5c3f27',
        'border-color': '#d9c6b1',
        'contrast-background-color': '#e8d9c8',
        'contrast-foreground-color': '#5c3f27',
        'info-color': '#620613',
        'sync-contrast-color': '#ffffff',
        'secondary-background-color': '#e3d5c4',
        'navigation-item-selected-background-color': '#ede4da'
    },
    midnight: {
        'theme-type': 'midnight',
        'background-color': '#20202b',
        'foreground-color': '#d8d8d8',
        'secondary-foreground-color': '#d8d8d8',
        'border-color': '#13131a',
        'contrast-background-color': '#313142',
        'contrast-foreground-color': '#d8d8d8',
        'info-color': '#4ca3ff',
        'sync-contrast-color': '#ffffff',
        'secondary-background-color': '#313142',
        'navigation-item-selected-background-color': '#20202b'
    },
    titanium: {
        'theme-type': 'titanium',
        'background-color': '#eeeff1',
        'foreground-color': '#3d3c40',
        'secondary-foreground-color': '#3d3c40',
        'border-color': '#c9cccf',
        'contrast-background-color': '#e7e7e7',
        'contrast-foreground-color': '#3d3c40',
        'info-color': '#663399',
        'sync-contrast-color': '#ffffff',
        'secondary-background-color': '#d9dbde',
        'navigation-item-selected-background-color': '#eeeff1'
    }
};

export const handleTheme = (theme: Theme) => {
    const themeProps = themeMap[theme];
    const root = document.documentElement;

    for (const prop in themeProps) {
        if (prop) {
            const prefix = prop === 'navigation-item-selected-background-color' ? '--' : '--sn-stylekit-';
            root.style.setProperty(`${prefix}${prop}`, themeProps[prop]);
        }
    }
};
