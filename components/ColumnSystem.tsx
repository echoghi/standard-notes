import { useEffect, useState } from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';
import styled from 'styled-components';

import Editor from './Editor';
import Notes from './Notes';
import Navigation from './Navigation';
import { useIsTabletOrMobileScreen } from '../hooks';
import {
  animatePaneEntranceTransitionFromOffscreenToTheRight,
  animatePaneExitTransitionOffscreenToTheRight,
} from './ColumnAnimator';
import { fadeOut } from '../styles';

const AppGrid = styled.div`
  height: 100%;
  overflow: hidden;
  position: relative;
  vertical-align: top;
  width: 100%;

  &.focus-mode {
    #items-column,
    #navigation-column {
      will-change: opacity;
      animation: ${fadeOut} 0.5s forwards;
      transition: width 0.5s;
      transition-delay: 0s;
      width: 0px !important;
      flex: none !important;
    }
  }
`;

export function isPanesChangeLeafDismiss(from: any, to: any): boolean {
  const fromWithoutLast = from.slice(0, from.length - 1);

  // @ts-ignore
  return (
    fromWithoutLast.length === to.length &&
    fromWithoutLast.every((pane: any, index: any) => pane === to[index])
  );
}

export function isPanesChangePush(from: any, to: any): boolean {
  const toWithoutLast = to.slice(0, to.length - 1);
  // @ts-ignore
  return (
    toWithoutLast.length === from.length &&
    toWithoutLast.every((pane: any, index: any) => pane === from[index])
  );
}

const ColumnSystem = () => {
  const { isMobile, isTabletOrMobile } = useIsTabletOrMobileScreen();

  const starred = useStoreState((store: any) => store.starred);
  const deleted = useStoreState((store: any) => store.deleted);
  const archived = useStoreState((store: any) => store.archived);
  const notes = useStoreState((store: any) => store.notes);
  const activeNote = useStoreState((state: any) => state.activeNote);
  const notesPanel = useStoreState((state: any) => state.notesPanel);
  const tagsPanel = useStoreState((state: any) => state.tagsPanel);
  const focusMode = useStoreState((state: any) => state.focusMode);

  const navActive = isMobile || tagsPanel;

  const setTagsPanel = useStoreActions((store: any) => store.setTagsPanel);

  const [renderPanes, setRenderPanes] = useState(
    [
      notesPanel && 'items-column',
      navActive && 'navigation-column',
      !!activeNote && 'editor-column',
    ].filter(Boolean),
  );

  const [panesPendingEntrance, setPanesPendingEntrance] = useState([]);
  const [panesPendingExit, setPanesPendingExit] = useState([]);

  const animationsSupported = isMobile;

  const isFullLayout = !isTabletOrMobile;

  useEffect(() => {
    // toggle navigation on layout change
    setTagsPanel(isFullLayout);
  }, [isFullLayout]);

  useEffect(() => {
    if (!panesPendingEntrance || panesPendingEntrance?.length === 0 || !animationsSupported) {
      return;
    }

    if (panesPendingEntrance.length > 1) {
      console.warn('More than one pane pending entrance. This is not supported.');
      return;
    }

    void animatePaneEntranceTransitionFromOffscreenToTheRight(panesPendingEntrance[0]).then(() => {
      setPanesPendingEntrance([]);
    });
  }, [panesPendingEntrance]);

  useEffect(() => {
    if (!panesPendingExit || panesPendingExit?.length === 0 || !animationsSupported) {
      return;
    }

    if (panesPendingExit.length > 1) {
      console.warn('More than one pane pending exit. This is not supported.');
      return;
    }

    void animatePaneExitTransitionOffscreenToTheRight(panesPendingExit[0]).then(() => {
      setPanesPendingExit([]);
    });
  }, [panesPendingExit]);

  useEffect(() => {
    if (!animationsSupported) {
      return;
    }

    const activePanes = [
      navActive && 'navigation-column',
      notesPanel && 'items-column',
      !!activeNote && 'editor-column',
    ].filter(Boolean);

    const panes = activePanes;
    const previousPanes = renderPanes;
    if (!previousPanes) {
      setPanesPendingEntrance([]);
      return;
    }

    const isPush = isPanesChangePush(previousPanes, panes);
    if (isPush) {
      // @ts-ignore
      setPanesPendingEntrance([panes[panes.length - 1]]);
    }
  }, [activeNote, tagsPanel, notesPanel, animationsSupported]);

  useEffect(() => {
    if (!animationsSupported) {
      return;
    }

    const activePanes = [
      navActive && 'navigation-column',
      notesPanel && 'items-column',
      !!activeNote && 'editor-column',
    ].filter(Boolean);

    const panes = activePanes;
    const previousPanes = renderPanes;
    if (!previousPanes) {
      setPanesPendingExit([]);
      return;
    }

    const isExit = isPanesChangeLeafDismiss(previousPanes, panes);
    if (isExit) {
      // @ts-ignore
      setPanesPendingExit([previousPanes[previousPanes.length - 1]]);
    }
  }, [activeNote, tagsPanel, notesPanel, animationsSupported]);

  useEffect(() => {
    const activePanes = [
      navActive && 'navigation-column',
      notesPanel && 'items-column',
      !!activeNote && 'editor-column',
    ].filter(Boolean);

    setRenderPanes(activePanes);
  }, [activeNote, tagsPanel, notesPanel]);

  const columns = [...renderPanes, ...panesPendingExit];

  const computeStylesForContainer = (): React.CSSProperties => {
    const numPanes = columns.length;
    const baseStyles = { display: 'grid', transition: 'grid-template-columns .25s ease' };

    if (isMobile) {
      return {};
    }

    /* eslint-disable */
    switch (numPanes) {
      case 1: {
        return {
          ...baseStyles,
          gridTemplateColumns: 'auto',
        };
      }
      case 2: {
        if (focusMode) {
          return {
            ...baseStyles,
            gridTemplateColumns: '0 1fr',
          };
        }
        if (isTabletOrMobile) {
          return {
            ...baseStyles,
            gridTemplateColumns: '1fr 2fr',
          };
        } else {
          if (columns[0] === 'navigation-column') {
            return {
              ...baseStyles,
              gridTemplateColumns: `200px auto`,
            };
          } else {
            return {
              ...baseStyles,
              gridTemplateColumns: `400px auto`,
            };
          }
        }
      }
      case 3: {
        if (focusMode) {
          return {
            ...baseStyles,
            gridTemplateColumns: '0 0 1fr',
          };
        }
        return {
          ...baseStyles,
          gridTemplateColumns: `220px 400px 2fr`,
        };
      }
      default:
        return {};
    }
  };

  return (
    <AppGrid className={focusMode && 'focus-mode'} style={{ ...computeStylesForContainer() }}>
      {columns.map((pane: 'navigation-column' | 'items-column' | 'editor-column') => {
        if (pane === 'navigation-column') {
          return <Navigation key={pane} />;
        } else if (pane === 'items-column') {
          return (
            <Notes
              notes={notes}
              starred={starred}
              deleted={deleted}
              archived={archived}
              key={pane}
            />
          );
        } else if (pane === 'editor-column') {
          return <Editor key={pane} />;
        }
      })}
    </AppGrid>
  );
  /* eslint-enable */
};

export default ColumnSystem;
