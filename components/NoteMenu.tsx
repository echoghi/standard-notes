import { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import { SlOptions } from 'react-icons/sl';
import { BiTrash } from 'react-icons/bi';
import { BsPin } from 'react-icons/bs';
import { CgNotes } from 'react-icons/cg';
import Switch from './Switch';
import { useOnClickOutside } from '@echoghi/hooks';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { AiOutlineStar } from 'react-icons/ai';
import { formatDate, getNoteStats, getReadTime } from '../lib/formatters';
import fetcher from '../lib/fetcher';

const MenuButton = styled.button`
    height: 2rem;
    width: 2rem;
    border: 1px solid var(--sn-stylekit-border-color);
    border-radius: 9999px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background-color: var(--sn-stylekit-background-color);

    &:focus {
        box-shadow: 0 0 0 2px var(--sn-stylekit-background-color), 0 0 0 4px var(--sn-stylekit-info-color);
    }

    &:hover {
        background: var(--sn-stylekit-contrast-background-color);
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
    transform: translate(-285px, 10px);
    left: 0;
    right: 0;
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
    font-size: 0.813rem;
    align-items: center;
    width: 100%;
    padding: 0.375rem 0.75rem;
    color: var(--sn-stylekit-contrast-foreground-color);
    text-align: left;
    background: white;
    border: 0;

    &:hover {
        background: var(--sn-stylekit-contrast-background-color);
    }
`;

const ItemContent = styled.div`
    display: flex;
    align-items: center;
    flex-grow: 1;
`;

const ItemText = styled.div`
    margin-left: 0.5rem;
    color: ${(props: any) => props.color || 'inherit'};
`;

const Container = styled.div`
    position: relative;
`;

const Divider = styled.hr`
    width: 100%;
    height: 1px;
    margin: 0.5rem 0;
    background-color: var(--sn-stylekit-border-color);
    border-style: none;
`;

const Info = styled.div`
    font-size: 0.75rem;
    line-height: 1rem;
    color: var(--sn-stylekit-neutral-color);
    font-weight: 500;
    padding: 0.375rem 0.75rem;

    div {
        margin-bottom: 0.25rem;
    }
`;

const NoteMenu = () => {
    const ref = useRef();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const view = useStoreState((store: any) => store.view);
    const note = useStoreState((store: any) => store.activeNote);
    const setLoading = useStoreActions((store: any) => store.setLoading);
    const setError = useStoreActions((store: any) => store.setError);
    const setNotes = useStoreActions((store: any) => store.setNotes);

    useOnClickOutside(ref, () => setIsMenuOpen(false));

    const handleClick = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const handlePinNote = useCallback(async () => {
        try {
            setLoading(true);
            const updatedNotes: any = await fetcher('/pin', {
                id: note.id,
                pinned: !note.pinned,
                trashed: view === 'trashed'
            });

            setNotes(updatedNotes);
        } catch (err) {
            setError(true);
        }
    }, [note]);

    const handleStarNote = useCallback(async () => {
        try {
            setLoading(true);
            const updatedNotes: any = await fetcher('/star', {
                id: note.id,
                starred: !note.starred,
                trashed: view === 'trashed'
            });

            setNotes(updatedNotes);
        } catch (err) {
            setError(true);
        }
    }, [note]);

    const handleDeleteNote = useCallback(async () => {
        try {
            setLoading(true);
            const updatedNotes: any = await fetcher('/delete', {
                ...note,
                trashed: view === 'trashed'
            });

            setNotes(updatedNotes);
        } catch (err) {
            setError(true);
        }
    }, [note]);

    const handleSpellCheck = useCallback(async () => {
        try {
            setLoading(true);
            const updatedNotes: any = await fetcher('/spellCheck', {
                id: note.id,
                spellCheck: !note.spellCheck,
                trashed: view === 'trashed'
            });

            setNotes(updatedNotes);
        } catch (err) {
            setError(true);
        }
    }, [note]);

    return (
        <Container ref={ref}>
            <MenuButton onClick={handleClick}>
                <SlOptions size="16px" color="var(--sn-stylekit-neutral-color)" />
            </MenuButton>
            {note && (
                <MenuContainer open={isMenuOpen && note}>
                    <Menu aria-label="Note Options Menu">
                        <MenuItem>
                            <Item onClick={handleStarNote}>
                                <ItemContent>
                                    <AiOutlineStar size="20px" color="var(--sn-stylekit-neutral-color)" />
                                    <ItemText>{note?.starred ? 'Unstar' : 'Star'}</ItemText>
                                </ItemContent>
                            </Item>
                        </MenuItem>
                        <MenuItem>
                            <Item onClick={handlePinNote}>
                                <ItemContent>
                                    {note?.pinned ? (
                                        <>
                                            <BsPin size="20px" color="var(--sn-stylekit-neutral-color)" />
                                            <ItemText>Unpin</ItemText>
                                        </>
                                    ) : (
                                        <>
                                            <BsPin size="20px" color="var(--sn-stylekit-neutral-color)" />
                                            <ItemText>Pin to top</ItemText>
                                        </>
                                    )}
                                </ItemContent>
                            </Item>
                        </MenuItem>
                        <MenuItem>
                            <Item onClick={handleDeleteNote}>
                                <ItemContent>
                                    <BiTrash size="20px" color="var(--sn-stylekit-danger-color)" />
                                    <ItemText color="var(--sn-stylekit-danger-color)">
                                        {view === 'trashed' ? 'Delete permanently' : 'Move to trash'}
                                    </ItemText>
                                </ItemContent>
                            </Item>
                        </MenuItem>
                        <Divider />
                        <MenuItem>
                            <Item onClick={handleSpellCheck}>
                                <ItemContent>
                                    <CgNotes size="20px" color="var(--sn-stylekit-neutral-color)" />
                                    <ItemText>Spellcheck</ItemText>
                                </ItemContent>
                                <div>
                                    <Switch value={note?.spellCheck} />
                                </div>
                            </Item>
                        </MenuItem>
                        <Divider />
                        <Info>
                            <div>{getNoteStats(note.content)}</div>
                            <div>Read time: {getReadTime(note.content)}</div>
                            <div>Last modified: {formatDate(note.updatedAt)}</div>
                            <div>Created: {formatDate(note.createdAt)}</div>
                            <div>Note ID: {note.id}</div>
                        </Info>
                    </Menu>
                </MenuContainer>
            )}
        </Container>
    );
};

export default NoteMenu;
