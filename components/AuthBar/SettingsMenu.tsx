import React, { useState } from 'react';
import styled from 'styled-components';
import { IoMdClose } from 'react-icons/io';
import { useStoreState, useStoreActions } from 'easy-peasy';

import Modal from '../Modal';
import Switch from '../Switch';
import {
  breakpoints,
  Divider,
  ItemText,
  Menu,
  MenuButton,
  MenuContainer,
  MenuItem,
  RadioButton,
  RadioFill,
  RadioText,
} from '../../styles';
import { Theme } from '../../types';

const Item = styled.button`
  cursor: pointer;
  display: flex;
  font-size: 0.85rem;
  align-items: center;
  width: 100%;
  padding: 0.375rem 0.75rem;
  color: var(--sn-stylekit-contrast-foreground-color);
  text-align: left;
  background: var(--sn-stylekit-background-color);
  border: 0;

  &:hover {
    background: var(--sn-stylekit-contrast-background-color);
  }
`;

const ItemContent = styled.div<{ alignAlt?: boolean }>`
  display: flex;
  align-items: ${({ alignAlt }) => (alignAlt ? 'flex-start' : 'center')};
  flex-grow: 1;
`;

const MenuTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.75rem;
  margin: 0.25rem 0;
  margin-bottom: 0.5rem;
  color: var(--sn-stylekit-contrast-foreground-color);

  div {
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 700;
  }

  svg {
    display: none;
    cursor: pointer;
  }

  @media (min-width: ${breakpoints.md}px) {
    svg {
      display: block;
    }
  }
`;

const ThemeCircle = styled.div<{ color: string }>`
  background-color: ${({ color }) => color};
  height: 1.25rem;
  width: 1.25rem;
  border-radius: 9999px;
`;

interface SettingsMenuProps {
  isOpen: boolean;
  handleClose: () => void;
  setRef: (node: any) => void;
  handleThemeChange: (theme: Theme) => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({
  isOpen,
  setRef,
  handleClose,
  handleThemeChange,
}) => {
  const focusMode = useStoreState((store: any) => store.focusMode);
  const tagsPanel = useStoreState((store: any) => store.tagsPanel);
  const notesPanel = useStoreState((store: any) => store.notesPanel);
  const initialTheme = useStoreState((store: any) => store.theme);

  const toggleFocusMode = useStoreActions((store: any) => store.toggleFocusMode);
  const toggleTagsPanel = useStoreActions((store: any) => store.toggleTagsPanel);
  const toggleNotesPanel = useStoreActions((store: any) => store.toggleNotesPanel);

  const [theme, setTheme] = useState(initialTheme);

  const handleTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    handleThemeChange(newTheme);
  };

  return (
    <Modal>
      <MenuContainer open={isOpen} ref={setRef} left={45} bottom={32}>
        <Menu>
          <div id="menu-close">
            <MenuButton onClick={handleClose} aria-label="Close Appearance Menu">
              <IoMdClose size="28px" color="var(--sn-stylekit-neutral-color)" />
            </MenuButton>
          </div>
          <Divider id="menu-close-divider" />
          <MenuTitle>APPEARANCE</MenuTitle>
          <MenuItem>
            <RadioButton role="menuitemradio" onClick={() => handleTheme('light')}>
              <RadioFill checked={theme === 'light'} />
              <RadioText>Default</RadioText>
            </RadioButton>
          </MenuItem>

          <MenuItem>
            <RadioButton role="menuitemradio" onClick={() => handleTheme('system')}>
              <RadioFill checked={theme === 'system'} />
              <RadioText>System</RadioText>
            </RadioButton>
          </MenuItem>
          <MenuItem>
            <RadioButton role="menuitemradio" onClick={() => handleTheme('dark')}>
              <RadioFill checked={theme === 'dark'} />
              <RadioText>Dark</RadioText>
              <ThemeCircle color="rgb(164, 100, 194)" />
            </RadioButton>
          </MenuItem>
          <MenuItem>
            <RadioButton role="menuitemradio" onClick={() => handleTheme('autobiography')}>
              <RadioFill checked={theme === 'autobiography'} />
              <RadioText>Autobiography</RadioText>
              <ThemeCircle color="rgb(157, 116, 65)" />
            </RadioButton>
          </MenuItem>
          <MenuItem>
            <RadioButton role="menuitemradio" onClick={() => handleTheme('futura')}>
              <RadioFill checked={theme === 'futura'} />
              <RadioText>Futura</RadioText>
              <ThemeCircle color="rgb(252, 164, 41)" />
            </RadioButton>
          </MenuItem>
          <MenuItem>
            <RadioButton role="menuitemradio" onClick={() => handleTheme('midnight')}>
              <RadioFill checked={theme === 'midnight'} />
              <RadioText>Midnight</RadioText>
              <ThemeCircle color="rgb(8, 109, 214)" />
            </RadioButton>
          </MenuItem>
          <MenuItem>
            <RadioButton role="menuitemradio" onClick={() => handleTheme('solarized')}>
              <RadioFill checked={theme === 'solarized'} />
              <RadioText>Solarized Dark</RadioText>
              <ThemeCircle color="rgb(42, 161, 152)" />
            </RadioButton>
          </MenuItem>
          <MenuItem>
            <RadioButton role="menuitemradio" onClick={() => handleTheme('titanium')}>
              <RadioFill checked={theme === 'titanium'} />
              <RadioText>Titanium</RadioText>
              <ThemeCircle color="rgb(110, 43, 158)" />
            </RadioButton>
          </MenuItem>
          <Divider />
          <MenuItem id="focus-mode">
            <Item onClick={toggleFocusMode}>
              <ItemContent>
                <ItemText>Focus Mode</ItemText>
              </ItemContent>
              <div>
                <Switch value={focusMode} />
              </div>
            </Item>
          </MenuItem>
          <MenuItem mobileHide>
            <Item onClick={toggleTagsPanel}>
              <ItemContent>
                <ItemText>Show Tags Panel</ItemText>
              </ItemContent>
              <div>
                <Switch value={tagsPanel} />
              </div>
            </Item>
          </MenuItem>
          <MenuItem mobileHide>
            <Item onClick={toggleNotesPanel}>
              <ItemContent>
                <ItemText>Show Notes Panel</ItemText>
              </ItemContent>
              <div>
                <Switch value={notesPanel} />
              </div>
            </Item>
          </MenuItem>
        </Menu>
      </MenuContainer>
    </Modal>
  );
};

export default SettingsMenu;
