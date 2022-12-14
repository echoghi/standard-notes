import styled from 'styled-components';
import { FaSortAmountDown } from 'react-icons/fa';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { useOnClickOutside } from '@echoghi/hooks';
import { useRef, useState } from 'react';
import Modal from './Modal';

const Button = styled.button`
    height: 2rem;
    width: 2rem;
    border: 1px solid var(--sn-stylekit-border-color);
    border-radius: 9999px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background-color: var(--sn-stylekit-background-color);

    &:active,
    &:focus {
        box-shadow: 0 0 0 2px var(--sn-stylekit-background-color), 0 0 0 4px var(--sn-stylekit-info-color);
    }

    &:hover {
        background: var(--sn-stylekit-contrast-background-color);

        svg {
            fill: var(--sn-stylekit-contrast-foreground-color);
        }
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
    top: ${(props: any) => (props.top ? `${props.top}px` : '0')};
    left: ${(props: any) => (props.left ? `${props.left}px` : '0')};
`;

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

const Menu = styled.menu`
    list-style: none;
    outline: none;
    padding-bottom: 0.5rem;
`;

const MenuItem = styled.li`
    &:hover {
        background: var(--sn-stylekit-contrast-background-color);
    }
`;

const Divider = styled.hr`
    width: 100%;
    height: 1px;
    margin: 0.5rem 0;
    background-color: var(--sn-stylekit-border-color);
    border-style: none;
`;

const RadioButton = styled.button`
    font-size: 0.813rem;
    padding: 0.375rem 0.75rem;
    color: var(--sn-stylekit-contrast-foreground-color);
    text-align: left;
    background-color: transparent;
    border: none;
    align-items: center;
    cursor: pointer;
    width: 100%;
    display: flex;
`;

const RadioFill = styled.div`
    border: 2px solid
        ${(props) => (props.checked ? 'var(--sn-stylekit-info-color)' : 'var(--sn-stylekit-passive-color-1)')};
    border-radius: 9999px;
    width: 1rem;
    height: 1rem;
    position: relative;

    &:after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 9999px;
        background-color: var(--sn-stylekit-info-color);
        opacity: ${(props) => (props.checked ? 1 : 0)};
    }
`;

const RadioText = styled.div`
    flex-grow: 1;
    display: flex;
    margin-left: 0.5rem;
    align-items: center;
`;

const SortNotes = () => {
    const ref = useRef();
    const buttonRef = useRef();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [position, setPosition] = useState({ left: 0, top: 0 });
    const sortSetting = useStoreState((store: any) => store.sortSetting);
    const setSort = useStoreActions((store: any) => store.setSort);

    useOnClickOutside(ref, () => setIsMenuOpen(false));

    const handleMenuOpen = () => {
        // Get the bounding client rect of the button element
        if (buttonRef.current) {
            const buttonRect = buttonRef.current.getBoundingClientRect();

            // Calculate the position of the dropdown menu
            const top = buttonRect.top + buttonRect.height;
            let left = buttonRect.left;

            if (buttonRect.left + 200 > window.innerWidth) {
                left = window.innerWidth - 380;
            }

            // Open the dropdown menu at the calculated position
            setPosition({ top, left });
        }

        setIsMenuOpen((state) => !state);
    };

    return (
        <>
            <Button onClick={handleMenuOpen} ref={buttonRef} aria-label="Sort Notes">
                <FaSortAmountDown size="18px" color="var(--sn-stylekit-neutral-color)" />
            </Button>
            {isMenuOpen && (
                <Modal>
                    <MenuContainer open={isMenuOpen} ref={ref} top={position.top} left={position.left}>
                        <MenuTitle>PREFERENCES FOR</MenuTitle>
                        <PrefStatus>
                            <div>Global</div>
                        </PrefStatus>
                        <Divider />
                        <MenuTitle>SORT BY</MenuTitle>

                        <Menu>
                            <MenuItem>
                                <RadioButton role="menuitemradio" onClick={() => setSort('updatedAt')}>
                                    <RadioFill checked={sortSetting === 'updatedAt'} />
                                    <RadioText>Date modified</RadioText>
                                </RadioButton>
                            </MenuItem>
                            <MenuItem>
                                <RadioButton role="menuitemradio" onClick={() => setSort('createdAt')}>
                                    <RadioFill checked={sortSetting === 'createdAt'} />
                                    <RadioText>Date created</RadioText>
                                </RadioButton>
                            </MenuItem>
                            <MenuItem>
                                <RadioButton role="menuitemradio" onClick={() => setSort('title')}>
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
