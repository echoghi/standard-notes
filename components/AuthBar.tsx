import styled from 'styled-components';
import { RiAccountCircleFill } from 'react-icons/ri';
import { MdOutlinePalette, MdLogout } from 'react-icons/md';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { useOnClickOutside } from '@echoghi/hooks';
import { IoMdClose } from 'react-icons/io';
import { useRef, useState } from 'react';
import { logOut } from '../lib/mutations';
import { useRouter } from 'next/router';
import { useTheme, useUser } from '../lib/hooks';
import { formatDate } from '../lib/formatters';
import Modal from './Modal';

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

const Group = styled.div`
    display: flex;
    height: 100%;
`;

const Status = styled.div`
    display: flex;
    align-items: center;
    font-weight: 700;
    font-size: 0.75rem;
    line-height: 1rem;
    color: var(--sn-stylekit-contrast-foreground-color);
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

const MenuContainer = styled.div`
    position: absolute;
    user-select: none;
    padding-top: 0.5rem;
    display: ${(props: any) => (props.open ? 'block' : 'none')};
    visibility: ${(props: any) => (props.open ? 'visible' : 'hidden')};
    background-color: var(--sn-stylekit-background-color);
    --tw-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12), 0px 2px 8px rgba(0, 0, 0, 0.04);
    --tw-shadow-colored: 0px 4px 8px var(--tw-shadow-color), 0px 2px 8px var(--tw-shadow-color);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 rgba(0, 0, 0, 0)), var(--tw-ring-shadow, 0 0 rgba(0, 0, 0, 0)),
        var(--tw-shadow);
    max-width: 20rem;
    height: auto;
    border-radius: 0.25rem;
    width: 20rem;
    display: flex;
    flex-direction: column;
    z-index: var(--z-index-dropdown-menu);
    will-change: transform;
    transform: translate(10px, 18px);
    left: 0;
    bottom: 50px;
    padding: 0.5rem 0;
`;

const Menu = styled.menu`
    list-style: none;
    outline: none;
`;

const MenuItem = styled.li`
    &:hover {
        background: var(--sn-stylekit-contrast-background-color);
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

const Divider = styled.hr`
    width: 100%;
    height: 1px;
    margin: 0.5rem 0;
    background-color: var(--sn-stylekit-border-color);
    border-style: none;
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
    const { user } = useUser();
    const router = useRouter();
    const ref = useRef();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { toggleTheme } = useTheme();

    useOnClickOutside(ref, () => setIsMenuOpen(false));

    const status = id ? '' : 'Offline';

    const handleClick = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const handleSignOut = async () => {
        await logOut();
        router.push('/signin');
    };

    return (
        <Container>
            <Group>
                <Button onClick={handleClick}>
                    <RiAccountCircleFill size="20px" color="var(--sn-stylekit-info-color)" />
                </Button>
                <Button onClick={toggleTheme}>
                    <MdOutlinePalette size="20px" color="var(--sn-stylekit-neutral-color)" />
                </Button>
            </Group>
            <Group>
                <Status>{status}</Status>
            </Group>

            {isMenuOpen && (
                <Modal>
                    <MenuContainer open={isMenuOpen} ref={ref}>
                        <Menu>
                            <MenuTitle>
                                <div>Account</div>
                                <IoMdClose size="18px" color="var(--sn-stylekit-neutral-color)" onClick={handleClick} />
                            </MenuTitle>
                            <MenuStatus>
                                <div>You're signed in as:</div>
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
        </Container>
    );
};

export default AuthBar;
