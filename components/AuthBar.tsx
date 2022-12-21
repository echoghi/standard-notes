import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { RiAccountCircleFill } from 'react-icons/ri';
import { MdOutlinePalette, MdLogout } from 'react-icons/md';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { IoMdClose } from 'react-icons/io';
import { useRef, useState } from 'react';
import { logOut, saveTheme } from '../lib/mutations';
import { useOnClickOutside, useTheme, useUser } from '../lib/hooks';
import { formatDate } from '../lib/formatters';
import Modal from './Modal';
import { Divider, Menu, MenuContainer, MenuItem, RadioButton, RadioFill, RadioText } from '../styles';
import Switch from './Switch';

const Container = styled.footer`
    position: relative;
    grid-column-start: 1;
    grid-column-end: 4;
    display: flex;
    padding: 0 0.75rem;
    color: var(--sn-stylekit-contrast-foreground-color);
    background-color: var(--sn-stylekit-contrast-background-color);
    border-top: 1px solid var(--sn-stylekit-border-color);
    justify-content: space-between;
    align-items: center;
    height: 2rem;
    width: 100%;
    user-select: none;
    z-index: var(--z-index-footer-bar);
`;

const Group = styled.div<{ focusMode: boolean }>`
    display: flex;
    height: 100%;
    opacity: ${({ focusMode }) => (focusMode ? 0.08 : 1)};
    transition: ${({ focusMode }) => (focusMode ? 'opacity 0.25s ease-in-out' : 'none')};

    &:hover {
        opacity: 1;
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

const Button = styled.button`
    border-radius: 9999px;
    justify-content: center;
    align-items: center;
    display: flex;
    cursor: pointer;
    width: 2rem;
    border: none;
    height: 100%;
    background-color: transparent;

    svg:hover {
        fill: var(--sn-stylekit-info-color);
    }

    &:active {
        box-shadow: 0 0 0 2px var(--sn-stylekit-background-color), 0 0 0 4px var(--sn-stylekit-info-color);

        svg {
            fill: var(--sn-stylekit-info-color);
        }
    }

    &:focus {
        background-color: var(--sn-stylekit-border-color);
    }
`;

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

const ItemContent = styled.div`
    display: flex;
    align-items: ${(props: any) => (props.alignAlt ? 'flex-start' : 'center')};
    flex-grow: 1;
`;

const ItemText = styled.div`
    margin-left: 0.5rem;
    color: ${(props: any) => props.color || 'inherit'};
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
        cursor: pointer;
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

const AuthBar = ({ id, email }: { id: string; email: string }) => {
    const synced = useStoreState((store: any) => store.synced);
    const focusMode = useStoreState((store: any) => store.focusMode);
    const tagsPanel = useStoreState((store: any) => store.tagsPanel);
    const notesPanel = useStoreState((store: any) => store.notesPanel);
    const userTheme = useStoreState((store: any) => store.theme);

    const setFocusMode = useStoreActions((store: any) => store.setFocusMode);
    const setTagsPanel = useStoreActions((store: any) => store.setTagsPanel);
    const setNotesPanel = useStoreActions((store: any) => store.setNotesPanel);

    const { user } = useUser();
    const router = useRouter();
    const authRef = useRef();
    const settingsRef = useRef();

    const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false);
    const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
    const { toggleTheme, theme } = useTheme(userTheme);

    useOnClickOutside(authRef, () => setIsAuthMenuOpen(false));
    useOnClickOutside(settingsRef, () => setIsSettingsMenuOpen(false));

    const status = id ? '' : 'Offline';

    const handleAuthClick = () => {
        setIsAuthMenuOpen((prev) => !prev);
    };

    const handleSettingsClick = () => {
        setIsSettingsMenuOpen((prev) => !prev);
    };

    const handleSignOut = async () => {
        await logOut();
        router.push('/signin');
    };

    const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
        toggleTheme(theme);
        saveTheme(theme);
    };

    return (
        <Container>
            <Group focusMode={focusMode}>
                <Button onClick={handleAuthClick}>
                    <RiAccountCircleFill
                        size="20px"
                        color={!synced ? 'var(--sn-stylekit-danger-color)' : 'var(--sn-stylekit-info-color)'}
                    />
                </Button>
                <Button onClick={handleSettingsClick}>
                    <MdOutlinePalette
                        size="20px"
                        color={
                            isSettingsMenuOpen ? 'var(--sn-stylekit-info-color)' : 'var(--sn-stylekit-neutral-color)'
                        }
                    />
                </Button>
            </Group>
            <Group focusMode={focusMode}>
                <Status>{synced ? '' : 'Unable to sync'}</Status>
            </Group>
            <Group focusMode={focusMode}>
                <Status>{status}</Status>
            </Group>

            {isAuthMenuOpen && (
                <Modal>
                    <MenuContainer open={isAuthMenuOpen} ref={authRef} left={13} bottom={32}>
                        <Menu>
                            <MenuTitle>
                                <div>Account</div>
                                <IoMdClose
                                    size="18px"
                                    color="var(--sn-stylekit-neutral-color)"
                                    onClick={handleAuthClick}
                                />
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
                                <Item onClick={handleSignOut}>
                                    <ItemContent>
                                        <MdLogout size="22px" color="var(--sn-stylekit-neutral-color)" />
                                        <ItemText>Sign out workspace</ItemText>
                                    </ItemContent>
                                </Item>
                            </MenuItem>
                        </Menu>
                    </MenuContainer>
                </Modal>
            )}

            {isSettingsMenuOpen && (
                <Modal>
                    <MenuContainer open={isSettingsMenuOpen} ref={settingsRef} left={45} bottom={32}>
                        <Menu>
                            <MenuTitle>APPEARANCE</MenuTitle>
                            <MenuItem>
                                <RadioButton role="menuitemradio" onClick={() => handleThemeChange('light')}>
                                    <RadioFill checked={theme === 'light'} />
                                    <RadioText>Default</RadioText>
                                </RadioButton>
                            </MenuItem>
                            <MenuItem>
                                <RadioButton role="menuitemradio" onClick={() => handleThemeChange('dark')}>
                                    <RadioFill checked={theme === 'dark'} />
                                    <RadioText>Dark</RadioText>
                                </RadioButton>
                            </MenuItem>
                            <MenuItem>
                                <RadioButton role="menuitemradio" onClick={() => handleThemeChange('system')}>
                                    <RadioFill checked={theme === 'system'} />
                                    <RadioText>System</RadioText>
                                </RadioButton>
                            </MenuItem>
                            <Divider />
                            <MenuItem>
                                <Item onClick={setFocusMode}>
                                    <ItemContent>
                                        <ItemText>Focus Mode</ItemText>
                                    </ItemContent>
                                    <div>
                                        <Switch value={focusMode} />
                                    </div>
                                </Item>
                            </MenuItem>
                            <MenuItem>
                                <Item onClick={setTagsPanel}>
                                    <ItemContent>
                                        <ItemText>Show Tags Panel</ItemText>
                                    </ItemContent>
                                    <div>
                                        <Switch value={tagsPanel} />
                                    </div>
                                </Item>
                            </MenuItem>
                            <MenuItem>
                                <Item onClick={setNotesPanel}>
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
            )}
        </Container>
    );
};

export default AuthBar;
