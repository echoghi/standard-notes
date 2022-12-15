import styled from 'styled-components';
import { FaSortAmountDown } from 'react-icons/fa';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { useRef, useState } from 'react';
import Modal from './Modal';
import { useOnClickOutside } from '../lib/hooks';
import { Divider, Menu, MenuButton, MenuContainer, MenuItem, RadioButton, RadioFill, RadioText } from '../styles';

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
    const ref = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [position, setPosition] = useState({ left: 0, top: 0 });
    const sortSetting = useStoreState((store: any) => store.sortSetting);
    const setSort = useStoreActions((store: any) => store.setSort);

    useOnClickOutside(ref, () => setIsMenuOpen(false));

    const handleMenuOpen = () => {
        // Get the bounding client rect of the button element
        if (buttonRef?.current) {
            const buttonRect = buttonRef?.current?.getBoundingClientRect();
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

        setIsMenuOpen((state) => !state);
    };

    return (
        <>
            <MenuButton onClick={handleMenuOpen} ref={buttonRef} aria-label="Sort Notes">
                <FaSortAmountDown size="18px" color="var(--sn-stylekit-neutral-color)" />
            </MenuButton>
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
