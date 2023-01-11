import { Theme } from 'types';

export const handleTheme = (theme: Theme) => {
    if (theme === 'light') {
        document.documentElement.style.setProperty('--sn-stylekit-theme-type', 'light');
        document.documentElement.style.setProperty('--sn-stylekit-background-color', '#ffffff');
        document.documentElement.style.setProperty('--sn-stylekit-secondary-foreground-color', '#2e2e2e');
        document.documentElement.style.setProperty('--sn-stylekit-foreground-color', '#19191c');
        document.documentElement.style.setProperty('--sn-stylekit-border-color', '#dfe1e4');
        document.documentElement.style.setProperty('--sn-stylekit-contrast-background-color', 'rgba(244, 245, 247, 1)');
        document.documentElement.style.setProperty('--sn-stylekit-contrast-foreground-color', '#2e2e2e');
        document.documentElement.style.setProperty('--sn-stylekit-info-color', '#086dd6');
        document.documentElement.style.setProperty(
            '--sn-stylekit-sync-contrast-color',
            'var(--sn-stylekit-passive-color-1)'
        );
        document.documentElement.style.setProperty('--sn-stylekit-secondary-background-color', '#eeeff1');
        document.documentElement.style.setProperty('--navigation-item-selected-background-color', 'rgb(253, 253, 253)');
    } else if (theme === 'solarized') {
        document.documentElement.style.setProperty('--sn-stylekit-theme-type', 'solarized');
        document.documentElement.style.setProperty('--sn-stylekit-background-color', '#002b36');
        document.documentElement.style.setProperty('--sn-stylekit-foreground-color', '#fdf6e3');
        document.documentElement.style.setProperty('--sn-stylekit-secondary-foreground-color', '#fdf6e3');
        document.documentElement.style.setProperty('--sn-stylekit-border-color', '#00252e');
        document.documentElement.style.setProperty('--sn-stylekit-contrast-background-color', '#083642');
        document.documentElement.style.setProperty('--sn-stylekit-contrast-foreground-color', '#fdf6e3');
        document.documentElement.style.setProperty('--sn-stylekit-info-color', '#2aa198');
        document.documentElement.style.setProperty('--sn-stylekit-sync-contrast-color', '#ffffff');
        document.documentElement.style.setProperty('--sn-stylekit-secondary-background-color', '#083642');
        document.documentElement.style.setProperty('--navigation-item-selected-background-color', '#002b36');
    } else if (theme === 'futura') {
        document.documentElement.style.setProperty('--sn-stylekit-theme-type', 'futura');
        document.documentElement.style.setProperty('--sn-stylekit-background-color', '#20202b');
        document.documentElement.style.setProperty('--sn-stylekit-foreground-color', '#a9aabe');
        document.documentElement.style.setProperty('--sn-stylekit-secondary-foreground-color', '#a9aabe');
        document.documentElement.style.setProperty('--sn-stylekit-border-color', '#0f1116');
        document.documentElement.style.setProperty('--sn-stylekit-contrast-background-color', '#272734');
        document.documentElement.style.setProperty('--sn-stylekit-contrast-foreground-color', '#a9aabe');
        document.documentElement.style.setProperty('--sn-stylekit-info-color', '#fca429');
        document.documentElement.style.setProperty('--sn-stylekit-sync-contrast-color', '#ffffff');
        document.documentElement.style.setProperty('--sn-stylekit-secondary-background-color', '#1c1d1e');
        document.documentElement.style.setProperty('--navigation-item-selected-background-color', '#0f101');
    } else {
        document.documentElement.style.setProperty('--sn-stylekit-theme-type', 'dark');
        document.documentElement.style.setProperty('--sn-stylekit-background-color', '#0f1011');
        document.documentElement.style.setProperty('--sn-stylekit-foreground-color', '#eeeeee');
        document.documentElement.style.setProperty('--sn-stylekit-secondary-foreground-color', '#ffffff');
        document.documentElement.style.setProperty('--sn-stylekit-border-color', '#000000');
        document.documentElement.style.setProperty('--sn-stylekit-contrast-background-color', '#000000');
        document.documentElement.style.setProperty('--sn-stylekit-contrast-foreground-color', '#ffffff');
        document.documentElement.style.setProperty('--sn-stylekit-info-color', '#a464c2');
        document.documentElement.style.setProperty('--sn-stylekit-sync-contrast-color', '#ffffff');
        document.documentElement.style.setProperty('--sn-stylekit-secondary-background-color', '#1c1d1e');

        document.documentElement.style.setProperty('--navigation-item-selected-background-color', '#0f1011');
    }
};
