import styled from 'styled-components';
import { FaSortAmountDown } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { useState } from 'react';
import { useOnClickOutside } from '@rennalabs/hooks';

import Modal from './Modal';
import {
  Divider,
  Menu,
  MenuButton,
  MenuContainer,
  MenuItem,
  RadioButton,
  RadioFill,
  RadioText,
} from '../styles';
import { updateUserSettings } from '../services';

const MenuTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.75rem;
  margin: 0.25rem 0;
  margin-bottom: 0.5rem;
  color: var(--sn-stylekit-contrast-foreground-color);
  font-size: 12px;
  line-height: 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
`;

const PrefStatus = styled.div`
  width: 100%;
  margin-bottom: 0.375rem;
  display: flex;
  padding: 0 0.75rem;

  div {
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: var(--sn-stylekit-info-contrast-color);
    background-color: var(--sn-stylekit-info-color);
    border-radius: 9999px;
    cursor: pointer;
    padding: 0.15rem 0.5rem;
  }
`;

const SortNotes = () => {
  const [button, setButton] = useState(null);
  const [menu, setMenu] = useState(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const sortSetting = useStoreState((store: any) => store.sortSetting);
  const setSort = useStoreActions((store: any) => store.setSort);

  useOnClickOutside(() => setIsMenuOpen(false), null, [button, menu]);

  const handleMenuOpen = () => {
    // Get the bounding client rect of the button element
    if (button) {
      // @ts-ignore
      const buttonRect = button.getBoundingClientRect();
      // Calculate the position of the dropdown menu
      // eslint-disable-next-line
      const top = buttonRect.top + buttonRect.height;
      // eslint-disable-next-line
      let left = buttonRect.left;

      if (buttonRect.left + 200 > window.innerWidth) {
        left = window.innerWidth - 380;
      }

      // Open the dropdown menu at the calculated position
      setPosition({ top, left });
    }

    setIsMenuOpen(state => !state);
  };

  const handleSort = (sort: string) => {
    setSort(sort);
    updateUserSettings({ sort });
  };

  return (
    <>
      <MenuButton onClick={handleMenuOpen} ref={setButton} aria-label="Sort Notes">
        <FaSortAmountDown size="18px" color="var(--sn-stylekit-neutral-color)" />
      </MenuButton>
      {isMenuOpen && (
        <Modal>
          <MenuContainer open={isMenuOpen} ref={setMenu} top={position.top} left={position.left}>
            <div id="menu-close">
              <MenuButton onClick={() => setIsMenuOpen(false)} aria-label="Close Menu">
                <IoMdClose size="28px" color="var(--sn-stylekit-neutral-color)" />
              </MenuButton>
            </div>
            <Divider id="menu-close-divider" />
            <MenuTitle>PREFERENCES FOR</MenuTitle>
            <PrefStatus>
              <div>Global</div>
            </PrefStatus>
            <Divider />
            <MenuTitle>SORT BY</MenuTitle>

            <Menu>
              <MenuItem>
                <RadioButton role="menuitemradio" onClick={() => handleSort('updatedAt')}>
                  <RadioFill checked={sortSetting === 'updatedAt'} />
                  <RadioText>Date modified</RadioText>
                </RadioButton>
              </MenuItem>
              <MenuItem>
                <RadioButton role="menuitemradio" onClick={() => handleSort('createdAt')}>
                  <RadioFill checked={sortSetting === 'createdAt'} />
                  <RadioText>Date created</RadioText>
                </RadioButton>
              </MenuItem>
              <MenuItem>
                <RadioButton role="menuitemradio" onClick={() => handleSort('title')}>
                  <RadioFill checked={sortSetting === 'title'} />
                  <RadioText>Title</RadioText>
                </RadioButton>
              </MenuItem>
            </Menu>
          </MenuContainer>
        </Modal>
      )}
    </>
  );
};
export default SortNotes;
