import { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { RiAccountCircleFill } from 'react-icons/ri';
import { MdOutlinePalette } from 'react-icons/md';
import { FiChevronLeft } from 'react-icons/fi';
import { useOnClickOutside, useLocalStorage } from '@rennalabs/hooks';

import { logOut, updateUserSettings } from '../../services';
import { useTheme } from '../../hooks';
import { breakpoints } from '../../styles';
import { Theme } from '../../types';
import AuthMenu from './AuthMenu';
import SettingsMenu from './SettingsMenu';

const Container = styled.footer`
  position: absolute;
  bottom: 0;
  grid-column-start: 1;
  grid-column-end: 4;
  display: flex;
  padding: 0.625rem 0.75rem;
  color: var(--sn-stylekit-contrast-foreground-color);
  background-color: var(--sn-stylekit-contrast-background-color);
  border-top: 1px solid var(--sn-stylekit-border-color);
  justify-content: space-between;
  align-items: center;
  min-height: 50px;
  width: 100%;
  user-select: none;
  z-index: 1;

  @media (min-width: ${breakpoints.md}px) {
    height: 2rem;
    min-height: unset;
    padding: 0 0.75rem;
    position: relative;
    z-index: var(--z-index-footer-bar);
  }
`;

const Group = styled.div<{ focusMode: boolean; fullLayout?: boolean }>`
  display: flex;
  align-items: center;
  height: 100%;
  opacity: ${({ focusMode }) => (focusMode ? 0.08 : 1)};
  transition: ${({ focusMode }) => (focusMode ? 'opacity 0.25s ease-in-out' : 'none')};
  gap: 0.5rem;

  &:hover {
    opacity: 1;
  }

  @media (max-width: ${breakpoints.md}px) {
    display: ${({ fullLayout }) => (fullLayout ? 'none' : 'flex')};
    flex-grow: 1;

    button:first-child {
      margin-right: auto;
    }
  }
`;

const Status = styled.div`
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 0.75rem;
  line-height: 1rem;
  color: var(--sn-stylekit-foreground-color);
`;

const Button = styled.button<{ ref?: any }>`
  border-radius: 9999px;
  justify-content: center;
  align-items: center;
  display: flex;
  cursor: pointer;
  width: 2.5rem;
  border: none;
  height: 2.5rem;
  background-color: var(--sn-stylekit-background-color);

  svg {
    pointer-events: none;
  }

  svg:hover {
    fill: var(--sn-stylekit-info-color);
  }

  &:active {
    box-shadow: 0 0 0 2px var(--sn-stylekit-background-color),
      0 0 0 4px var(--sn-stylekit-info-color);

    svg {
      fill: var(--sn-stylekit-info-color);
    }
  }

  &:focus {
    background-color: var(--sn-stylekit-border-color);
  }

  @media (min-width: ${breakpoints.md}px) {
    width: 2rem;
    height: 2rem;
    background-color: transparent;

    &#mobile-back {
      display: none;
    }
  }
`;

const AuthBar = ({ id, email }: { id: string; email: string }) => {
  const user = useStoreState((store: any) => store.user);
  const synced = useStoreState((store: any) => store.synced);
  const focusMode = useStoreState((store: any) => store.focusMode);
  const userTheme = useStoreState((store: any) => store.theme);

  const setTagsPanel = useStoreActions((store: any) => store.setTagsPanel);
  const setNotesPanel = useStoreActions((store: any) => store.setNotesPanel);

  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pk, setPk, removePk] = useLocalStorage('pk', '');
  const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const { toggleTheme } = useTheme(userTheme);

  const [authButton, setAuthButton] = useState(null);
  const [authMenu, setAuthMenu] = useState(null);
  const [settingsMenu, setSettingsMenu] = useState(null);
  const [settingsButton, setSettingsButton] = useState(null);

  useOnClickOutside(() => setIsAuthMenuOpen(false), null, [authButton, authMenu]);
  useOnClickOutside(() => setIsSettingsMenuOpen(false), null, [settingsButton, settingsMenu]);

  const status = id ? '' : 'Offline';

  const handleAuthClick = () => {
    setIsAuthMenuOpen(prev => !prev);
  };

  const handleSettingsClick = () => {
    setIsSettingsMenuOpen(prev => !prev);
  };

  const handleSignOut = async () => {
    await logOut();
    removePk();
    router.push('/signin');
  };

  const handleThemeChange = (newTheme: Theme) => {
    toggleTheme(newTheme);
    updateUserSettings({ theme: newTheme });
  };

  const handleBack = () => {
    setTagsPanel(false);
    setNotesPanel(true);
  };

  return (
    <Container>
      <Group focusMode={focusMode}>
        <Button onClick={handleBack} id="mobile-back" aria-label="Go Back">
          <FiChevronLeft size="22px" color="var(--sn-stylekit-neutral-color)" />
        </Button>
        <Button
          id="auth-menu-button"
          onClick={handleAuthClick}
          ref={setAuthButton}
          aria-label="Open Auth Menu"
        >
          <RiAccountCircleFill
            size="20px"
            color={!synced ? 'var(--sn-stylekit-danger-color)' : 'var(--sn-stylekit-info-color)'}
          />
        </Button>
        <Button
          id="theme-menu-button"
          onClick={handleSettingsClick}
          ref={setSettingsButton}
          aria-label="Open Theme Menu"
        >
          <MdOutlinePalette
            size="20px"
            color={
              isSettingsMenuOpen
                ? 'var(--sn-stylekit-info-color)'
                : 'var(--sn-stylekit-neutral-color)'
            }
          />
        </Button>
      </Group>
      <Group focusMode={focusMode} fullLayout>
        <Status>{synced ? '' : 'Unable to sync'}</Status>
      </Group>
      <Group focusMode={focusMode} fullLayout>
        <Status>{status}</Status>
      </Group>

      {isAuthMenuOpen && (
        <AuthMenu
          user={user}
          email={email}
          isOpen={isAuthMenuOpen}
          setRef={setAuthMenu}
          handleSignOut={handleSignOut}
          handleClose={handleAuthClick}
        />
      )}

      {isSettingsMenuOpen && (
        <SettingsMenu
          isOpen={isSettingsMenuOpen}
          setRef={setSettingsMenu}
          handleThemeChange={handleThemeChange}
          handleClose={() => setIsSettingsMenuOpen(false)}
        />
      )}
    </Container>
  );
};

export default AuthBar;
