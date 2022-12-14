import { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import { SlOptions } from 'react-icons/sl';
import { BiTrash } from 'react-icons/bi';
import { BsPin } from 'react-icons/bs';
import { CgNotes, CgTrashEmpty } from 'react-icons/cg';
import { IoMdClose, IoMdCopy } from 'react-icons/io';
import { MdOutlineEditOff, MdSettingsBackupRestore, MdOutlineDownload, MdMoveToInbox } from 'react-icons/md';
import { AiOutlineStar } from 'react-icons/ai';
import { VscPreview } from 'react-icons/vsc';
import { useStoreActions, useStoreState } from 'easy-peasy';
import Switch from './Switch';
import { formatDate, getNoteStats, getReadTime } from '../lib/formatters';
import { decrypt, generateUuid, storeEncryptedNotes } from '../lib/encryption';
import { clearTrash, remove, update, duplicate } from '../lib/mutations';
import Modal from './Modal';
import { useOnClickOutside } from '../lib/hooks';
import { breakpoints, Divider, ItemText, Menu, MenuButton, MenuContainer, MenuItem } from '../styles';

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
    align-items: ${(props: any) => (props.alignAlt ? 'flex-start' : 'center')};
    flex-grow: 1;
`;

const Container = styled.div`
    position: relative;
`;

const Info = styled.div`
    font-size: 0.875rem;
    line-height: 1rem;
    color: var(--sn-stylekit-neutral-color);
    font-weight: 500;
    padding: 0.375rem 0.75rem;

    div {
        margin-bottom: 0.25rem;
    }

    @media (min-width: ${breakpoints.md}px) {
        font-size: 0.75rem;
    }
`;

const FlexText = styled.div`
    display: flex;
    flex-direction: column;
`;

const SmallText = styled.div`
    font-size: 0.75rem;
    line-height: 1rem;
    margin-left: 0.5rem;
    color: var(--sn-stylekit-contrast-foreground-color);
`;

const NoteMenu = () => {
    const ref = useRef();
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [position, setPosition] = useState({ right: 0, top: 0 });

    const view = useStoreState((store: any) => store.view);
    const note = useStoreState((store: any) => store.activeNote);
    const deleted = useStoreState((store: any) => store.deleted);

    const updateNote = useStoreActions((store: any) => store.updateNote);
    const updateStarred = useStoreActions((store: any) => store.updateStarred);
    const emptyTrash = useStoreActions((store: any) => store.emptyTrash);
    const deleteNote = useStoreActions((store: any) => store.deleteNote);
    const restoreNote = useStoreActions((store: any) => store.restoreNote);
    const setLoading = useStoreActions((store: any) => store.setLoading);
    const setError = useStoreActions((store: any) => store.setError);
    const createNote = useStoreActions((store: any) => store.createNote);
    const updateArchived = useStoreActions((store: any) => store.updateArchived);

    const isTrash = view === 'deleted';
    const isArchived = view === 'archived';

    useOnClickOutside(ref, () => setIsMenuOpen(false));

    const handleClick = () => {
        // Get the bounding client rect of the button element
        if (buttonRef.current) {
            const buttonRect = buttonRef.current.getBoundingClientRect();
            const { top, height, right } = buttonRect;

            // Calculate the position of the dropdown menu
            const menuTop = top + height;
            const menuRight = window.innerWidth - right - 10;

            // Open the dropdown menu at the calculated position
            setPosition({ top: menuTop, right: menuRight });
        }

        setIsMenuOpen((prev) => !prev);
    };

    const handleUpdate = useCallback(
        async (data: any) => {
            updateNote({ ...note, ...data });

            const handleError = () => {
                storeEncryptedNotes({
                    ...note,
                    ...data
                });
                setError(true);
                setLoading(false);
            };

            try {
                setLoading(true);
                setError(false);
                const res = await update({
                    id: note.id,
                    data
                });

                if (res.error) {
                    handleError();
                } else {
                    setLoading(false);
                    setError(false);
                }
            } catch (err) {
                handleError();
            }
        },
        [note]
    );

    const handlePinNote = () => handleUpdate({ pinned: !note.pinned });

    const handleSpellCheck = () => handleUpdate({ spellCheck: !note.spellCheck });

    const toggleEditMode = () => handleUpdate({ editEnabled: !note.editEnabled });

    const togglePreviewMode = () => handleUpdate({ preview: !note.preview });

    const handleStarNote = useCallback(async () => {
        const tempNote = { ...note, starred: !note.starred };

        if (isTrash || isArchived) {
            updateNote(tempNote);
        } else {
            updateStarred(tempNote);
        }

        const handleError = () => {
            storeEncryptedNotes({
                ...note,
                starred: !note.starred
            });
            setError(true);
            setLoading(false);
        };

        try {
            setLoading(true);
            setError(false);
            const res = await update({
                id: note.id,
                data: { starred: !note.starred }
            });

            if (res.error) {
                handleError();
            } else {
                setLoading(false);
                setError(false);
            }
        } catch (err) {
            handleError();
        }
    }, [note]);

    const handleArchivedNote = useCallback(async () => {
        const tempNote = { ...note, archived: !note.archived };

        if (isTrash) {
            updateNote(tempNote);
        } else {
            updateArchived(tempNote);
        }

        const handleError = () => {
            storeEncryptedNotes({
                ...note,
                archived: !note.archived
            });
            setError(true);
            setLoading(false);
        };

        try {
            setLoading(true);
            setError(false);
            const res = await update({
                id: note.id,
                data: { archived: !note.archived }
            });

            if (res.error) {
                handleError();
            } else {
                setLoading(false);
                setError(false);
            }
        } catch (err) {
            handleError();
        }
    }, [note]);

    const handleRestoreNote = useCallback(async () => {
        restoreNote({ ...note, deleted: false, deletedAt: null });

        const handleError = () => {
            storeEncryptedNotes({
                ...note,
                deleted: false,
                deletedAt: null
            });
            setError(true);
            setLoading(false);
        };

        try {
            setLoading(true);
            setError(false);
            const res = await update({
                id: note.id,
                data: { deleted: false, deletedAt: null }
            });

            if (res.error) {
                handleError();
            } else {
                setLoading(false);
                setError(false);
            }
        } catch (err) {
            handleError();
        }
    }, [note]);

    const handleDeleteNote = useCallback(async () => {
        deleteNote({ ...note, deleted: !note.deleted });

        const handleError = () => {
            storeEncryptedNotes({
                ...note,
                deleted: !note.deleted,
                deleteFlag: view === 'deleted' ? true : undefined
            });
            setError(true);
            setLoading(false);
        };

        try {
            setLoading(true);
            setError(false);
            const res = await remove({
                id: note.id,
                trashed: view === 'deleted'
            });

            if (res.error) {
                handleError();
            } else {
                setLoading(false);
                setError(false);
            }
        } catch (err) {
            handleError();
        }
    }, [note]);

    const handleEmptyTrash = useCallback(async () => {
        emptyTrash();

        try {
            setLoading(true);
            await clearTrash();
        } catch (err) {
            setError(true);
        }
    }, [note]);

    const handleExportNote = useCallback(async () => {
        try {
            const element = document.createElement('a');
            element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(decrypt(note.content))}`);
            element.setAttribute('download', `${decrypt(note.title)}.txt`);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        } catch (err) {
            console.log(err);
        }
    }, [note]);

    const handleDuplicateNote = useCallback(async () => {
        const newId = generateUuid();
        createNote({ ...note, id: newId });

        try {
            setLoading(true);
            await duplicate({
                id: note.id,
                newId
            });

            setLoading(false);
        } catch (err) {
            setError(true);
        }
    }, [note]);

    return (
        <Container>
            <MenuButton onClick={handleClick} ref={buttonRef} aria-label="Note Options">
                <SlOptions size="16px" color="var(--sn-stylekit-neutral-color)" />
            </MenuButton>
            {isMenuOpen && (
                <Modal>
                    <MenuContainer open={isMenuOpen && note} ref={ref} top={position.top} right={position.right}>
                        <Menu aria-label="Note Options Menu">
                            <div id="menu-close">
                                <MenuButton onClick={() => setIsMenuOpen(false)} aria-label="Close Menu">
                                    <IoMdClose size="28px" color="var(--sn-stylekit-neutral-color)" />
                                </MenuButton>
                            </div>
                            <Divider id="menu-close-divider" />
                            <MenuItem>
                                <Item onClick={toggleEditMode}>
                                    <ItemContent>
                                        <MdOutlineEditOff size="22px" color="var(--sn-stylekit-neutral-color)" />
                                        <ItemText>Prevent editing</ItemText>
                                    </ItemContent>
                                    <div>
                                        <Switch value={!note?.editEnabled} />
                                    </div>
                                </Item>
                            </MenuItem>
                            <MenuItem>
                                <Item onClick={togglePreviewMode}>
                                    <ItemContent>
                                        <VscPreview size="22px" color="var(--sn-stylekit-neutral-color)" />
                                        <ItemText>Show preview</ItemText>
                                    </ItemContent>
                                    <div>
                                        <Switch value={note?.preview} />
                                    </div>
                                </Item>
                            </MenuItem>
                            <Divider />
                            <MenuItem>
                                <Item onClick={handleStarNote}>
                                    <ItemContent>
                                        <AiOutlineStar size="22px" color="var(--sn-stylekit-neutral-color)" />
                                        <ItemText>{note?.starred ? 'Unstar' : 'Star'}</ItemText>
                                    </ItemContent>
                                </Item>
                            </MenuItem>
                            <MenuItem>
                                <Item onClick={handlePinNote}>
                                    <ItemContent>
                                        {note?.pinned ? (
                                            <>
                                                <BsPin size="22px" color="var(--sn-stylekit-neutral-color)" />
                                                <ItemText>Unpin</ItemText>
                                            </>
                                        ) : (
                                            <>
                                                <BsPin size="22px" color="var(--sn-stylekit-neutral-color)" />
                                                <ItemText>Pin to top</ItemText>
                                            </>
                                        )}
                                    </ItemContent>
                                </Item>
                            </MenuItem>
                            <MenuItem>
                                <Item onClick={handleExportNote}>
                                    <ItemContent>
                                        <MdOutlineDownload size="22px" color="var(--sn-stylekit-neutral-color)" />
                                        <ItemText>Export</ItemText>
                                    </ItemContent>
                                </Item>
                            </MenuItem>
                            <MenuItem>
                                <Item onClick={handleDuplicateNote}>
                                    <ItemContent>
                                        <IoMdCopy size="22px" color="var(--sn-stylekit-neutral-color)" />
                                        <ItemText>Duplicate</ItemText>
                                    </ItemContent>
                                </Item>
                            </MenuItem>
                            <MenuItem>
                                <Item onClick={handleArchivedNote}>
                                    <ItemContent>
                                        <MdMoveToInbox size="22px" color="var(--sn-stylekit-accessory-tint-color-3)" />
                                        <ItemText color="var(--sn-stylekit-accessory-tint-color-3)">
                                            {note?.archived ? 'Unarchive' : 'Archive'}
                                        </ItemText>
                                    </ItemContent>
                                </Item>
                            </MenuItem>
                            {!isTrash && (
                                <MenuItem>
                                    <Item onClick={handleDeleteNote}>
                                        <ItemContent>
                                            <BiTrash size="22px" color="var(--sn-stylekit-danger-color)" />
                                            <ItemText color="var(--sn-stylekit-danger-color)">Move to trash</ItemText>
                                        </ItemContent>
                                    </Item>
                                </MenuItem>
                            )}
                            {isTrash && (
                                <>
                                    <MenuItem>
                                        <Item onClick={handleRestoreNote}>
                                            <ItemContent>
                                                <MdSettingsBackupRestore
                                                    size="22px"
                                                    color="var(--sn-stylekit-success-color)"
                                                />
                                                <ItemText color="var(--sn-stylekit-success-color)">Restore</ItemText>
                                            </ItemContent>
                                        </Item>
                                    </MenuItem>
                                    <MenuItem>
                                        <Item onClick={handleDeleteNote}>
                                            <ItemContent>
                                                <IoMdClose size="22px" color="var(--sn-stylekit-danger-color)" />
                                                <ItemText color="var(--sn-stylekit-danger-color)">
                                                    Delete permanently
                                                </ItemText>
                                            </ItemContent>
                                        </Item>
                                    </MenuItem>
                                    <MenuItem>
                                        <Item onClick={handleEmptyTrash}>
                                            <ItemContent alignAlt>
                                                <CgTrashEmpty size="22px" color="var(--sn-stylekit-danger-color)" />
                                                <FlexText>
                                                    <ItemText color="var(--sn-stylekit-danger-color)">
                                                        Empty Trash
                                                    </ItemText>
                                                    <SmallText>{`${deleted.length} notes in Trash`}</SmallText>
                                                </FlexText>
                                            </ItemContent>
                                        </Item>
                                    </MenuItem>
                                </>
                            )}
                            <Divider />
                            <MenuItem>
                                <Item onClick={handleSpellCheck}>
                                    <ItemContent>
                                        <CgNotes size="22px" color="var(--sn-stylekit-neutral-color)" />
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
                </Modal>
            )}
        </Container>
    );
};

export default NoteMenu;
