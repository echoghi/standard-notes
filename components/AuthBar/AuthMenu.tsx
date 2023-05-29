import React from 'react';
import styled from 'styled-components';
import { MdLogout } from 'react-icons/md';
import { IoMdClose } from 'react-icons/io';
import { AiOutlineCheckCircle } from 'react-icons/ai';

import { formatDate } from '../../utils';
import Modal from '../Modal';
import {
  breakpoints,
  Divider,
  ItemText,
  Menu,
  MenuButton,
  MenuContainer,
  MenuItem,
} from '../../styles';

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

const MenuStatus = styled.div`
  padding: 0 0.75rem;
  font-size: 14px;
  margin-bottom: 0.75rem;
  color: var(--sn-stylekit-contrast-foreground-color);
`;

const Email = styled.div`
  font-weight: 700;
  margin: 0.125rem 0;
  word-wrap: break-word;
  word-break: break-all;
`;

const SyncContainer = styled.div`
  display: flex;
  padding: 0 0.75rem;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

const SyncStatus = styled.div`
  display: flex;
  align-items: flex-start;

  svg {
    margin-right: 0.5rem;
  }
`;

const SyncTitle = styled.div`
  color: var(--sn-stylekit-success-color);
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
`;

const LastUpdated = styled.div`
  color: var(--sn-stylekit-contrast-foreground-color);
  font-size: 0.875rem;
  line-height: 1.25rem;
`;

interface AuthMenuProps {
  user: any;
  email: string;
  isOpen: boolean;
  handleClose: () => void;
  handleSignOut: () => void;
  setRef: (node: any) => void;
}

const AuthMenu: React.FC<AuthMenuProps> = ({
  isOpen,
  email,
  user,
  setRef,
  handleClose,
  handleSignOut,
}) => (
  <Modal>
    <MenuContainer open={isOpen} ref={setRef} left={13} bottom={32}>
      <Menu>
        <div id="menu-close">
          <MenuButton onClick={handleClose} aria-label="Close Auth Menu">
            <IoMdClose size="28px" color="var(--sn-stylekit-neutral-color)" />
          </MenuButton>
        </div>
        <Divider id="menu-close-divider" />
        <MenuTitle>
          <div>Account</div>
          <IoMdClose size="18px" color="var(--sn-stylekit-neutral-color)" onClick={handleClose} />
        </MenuTitle>
        <MenuStatus>
          <div>You&apos;re signed in as:</div>
          <Email>{email}</Email>
        </MenuStatus>
        <SyncContainer>
          <SyncStatus>
            <AiOutlineCheckCircle size="22px" color="var(--sn-stylekit-success-color)" />
            <div>
              <SyncTitle>Last synced:</SyncTitle>
              <LastUpdated>{formatDate(user?.updatedAt)}</LastUpdated>
            </div>
          </SyncStatus>
        </SyncContainer>
        <Divider />
        <MenuItem>
          <Item onClick={handleSignOut} aria-label="Log Out">
            <ItemContent>
              <MdLogout size="22px" color="var(--sn-stylekit-neutral-color)" />
              <ItemText>Sign out workspace</ItemText>
            </ItemContent>
          </Item>
        </MenuItem>
      </Menu>
    </MenuContainer>
  </Modal>
);

export default AuthMenu;
