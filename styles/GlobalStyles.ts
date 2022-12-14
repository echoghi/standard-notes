import { createGlobalStyle } from 'styled-components';
import { breakpoints } from '.';

const GlobalStyles = createGlobalStyle`
    html:root {
        --sn-stylekit-neutral-color: #72767e;
        --sn-stylekit-neutral-contrast-color: #ffffff;
        --sn-stylekit-info-color: #086dd6;
        --sn-stylekit-info-color-darkened: #065cb5;
        --sn-stylekit-info-contrast-color: #ffffff;
        --sn-stylekit-info-backdrop-color: #2b6fcf0f;
        --sn-stylekit-success-color: #007662;
        --sn-stylekit-success-contrast-color: #ffffff;
        --sn-stylekit-warning-color: #ebad00;
        --sn-stylekit-warning-contrast-color: #ffffff;
        --sn-stylekit-danger-color: #cc2128;
        --sn-stylekit-danger-contrast-color: #ffffff;
        --sn-stylekit-danger-light-color: #f9e4e5;
        --sn-stylekit-shadow-color: #c8c8c8;
        --sn-stylekit-background-color: #ffffff;
        --sn-stylekit-border-color: #dfe1e4;
        --sn-stylekit-foreground-color: #19191c;
        --sn-stylekit-contrast-background-color: rgba(244, 245, 247, 1);
        --sn-stylekit-contrast-foreground-color: #2e2e2e;
        --sn-stylekit-contrast-border-color: #e3e3e3;
        --sn-stylekit-secondary-background-color: #eeeff1;
        --sn-stylekit-secondary-foreground-color: #2e2e2e;
        --sn-stylekit-secondary-border-color: #e3e3e3;
        --sn-stylekit-secondary-contrast-background-color: #e3e3e3;
        --sn-stylekit-secondary-contrast-foreground-color: #2e2e2e;
        --sn-stylekit-secondary-contrast-border-color: #a2a2a2;
        --sn-stylekit-editor-background-color: var(--sn-stylekit-background-color);
        --sn-stylekit-editor-foreground-color: var(--sn-stylekit-foreground-color);
        --sn-stylekit-paragraph-text-color: #454545;
        --sn-stylekit-input-placeholder-color: #a8a8a8;
        --sn-stylekit-input-border-color: #e3e3e3;
        --sn-stylekit-scrollbar-thumb-color: #dfdfdf;
        --sn-stylekit-scrollbar-track-border-color: #e7e7e7;
        --sn-stylekit-theme-type: light;
        --sn-stylekit-theme-name: sn-light;
        --sn-stylekit-passive-color-0: #515357;
        --sn-stylekit-passive-color-1: #72767e;
        --sn-stylekit-passive-color-2: #bbbec4;
        --sn-stylekit-passive-color-3: #dfe1e4;
        --sn-stylekit-passive-color-4: #eeeff1;
        --sn-stylekit-passive-color-4-opacity-variant: #bbbec43d;
        --sn-stylekit-passive-color-5: #f4f5f7;
        --sn-stylekit-passive-color-6: #e5e5e5;
        --sn-stylekit-passive-color-super-light: #f9f9f9;
        --sn-stylekit-accessory-tint-color-1: #086dd6;
        --sn-stylekit-accessory-tint-color-2: #ea6595;
        --sn-stylekit-accessory-tint-color-3: #ebad00;
        --sn-stylekit-accessory-tint-color-4: #7049cf;
        --sn-stylekit-accessory-tint-color-5: #1aa772;
        --sn-stylekit-accessory-tint-color-6: #f28c52;

        --modal-background-color: var(--sn-stylekit-background-color);

        --editor-header-bar-background-color: var(--sn-stylekit-background-color);
        --editor-background-color: var(--sn-stylekit-editor-background-color);
        --editor-foreground-color: var(--sn-stylekit-editor-foreground-color);
        --editor-title-bar-border-bottom-color: var(--sn-stylekit-border-color);
        --editor-title-input-color: var(--sn-stylekit-editor-foreground-color);
        --editor-pane-background-color: var(--sn-stylekit-background-color);
        --editor-pane-editor-background-color: var(--sn-stylekit-editor-background-color);
        --editor-pane-editor-foreground-color: var(--sn-stylekit-editor-foreground-color);
        --editor-pane-component-stack-item-background-color: var(--sn-stylekit-background-color);

        --text-selection-color: var(--sn-stylekit-info-contrast-color);
        --text-selection-background-color: var(--sn-stylekit-info-color);

        --note-preview-progress-color: var(--sn-stylekit-info-color);
        --note-preview-progress-background-color: var(--sn-stylekit-passive-color-4-opacity-variant);

        --note-preview-selected-progress-color: var(--sn-stylekit-secondary-background-color);
        --note-preview-selected-progress-background-color: var(--sn-stylekit-passive-color-4-opacity-variant);

        --items-column-background-color: var(--sn-stylekit-background-color);
        --items-column-items-background-color: var(--sn-stylekit-background-color);
        --items-column-border-left-color: var(--sn-stylekit-border-color);
        --items-column-border-right-color: var(--sn-stylekit-border-color);
        --items-column-search-background-color: var(--sn-stylekit-contrast-background-color);
        --item-cell-selected-background-color: var(--sn-stylekit-contrast-background-color);
        --item-cell-selected-border-left-color: var(--sn-stylekit-info-color);

        --navigation-column-background-color: var(--sn-stylekit-secondary-background-color);
        --navigation-section-title-color: var(--sn-stylekit-secondary-foreground-color);
        --navigation-item-text-color: var(--sn-stylekit-secondary-foreground-color);
        --navigation-item-count-color: var(--sn-stylekit-neutral-color);
        --navigation-item-selected-background-color: rgb(253, 253, 253);

        --preferences-navigation-icon-color: var(--sn-stylekit-neutral-color);
        --preferences-navigation-selected-background-color: var(--sn-stylekit-info-backdrop-color);

        --dropdown-menu-radio-button-inactive-color: var(--sn-stylekit-passive-color-1);

        --panel-resizer-background-color: var(--sn-stylekit-secondary-contrast-background-color);
        --link-element-color: var(--sn-stylekit-info-color);
        --sn-stylekit-sync-contrast-color: var(--sn-stylekit-passive-color-1);

        --z-index-dropdown-menu: 100;
        --sn-stylekit-base-font-size:  0.813rem;
        
        --tw-border-spacing-x: 0;
        --tw-border-spacing-y: 0;
        --tw-translate-y: 0;
        --tw-translate-x-on: 0;
        --tw-translate-x: calc(2rem - 1.125rem);
        --tw-rotate: 0;
        --tw-skew-x: 0;
        --tw-skew-y: 0;
        --tw-scale-x: 1;
        --tw-scale-y: 1;

        --tw-scroll-snap-strictness: proximity;

        --tw-ring-offset-width: 0px;
        --tw-ring-offset-color: #fff;
        --tw-ring-color: rgb(59 130 246 / 0.5);
        --tw-ring-offset-shadow: 0 0 #0000;
        --tw-ring-shadow: 0 0 #0000;
        --tw-shadow: 0 0 #0000;
        --tw-shadow-colored: 0 0 #0000;

        --sn-stylekit-font-size-editor: .9375rem;
        --sn-stylekit-sans-serif-font:  -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", var(--sn-stylekit-simplified-chinese-font), sans-serif;
        --sn-stylekit-editor-font-family: var(--sn-stylekit-sans-serif-font);

        @media (max-width: ${breakpoints.md}px) {
            --sn-stylekit-font-size-editor: 1rem;
        }
    }

    body {
        padding: 0;
        margin: 0;
        font-family: -apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif;
        font-size: var(--sn-stylekit-base-font-size);
        overflow: hidden;
    }

    a {
        color: inherit;
        text-decoration: none;
    }

    * {
        box-sizing: border-box;
    }
`;

export default GlobalStyles;
