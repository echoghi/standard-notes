import { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import { SlOptions } from 'react-icons/sl';
import { BiTrash } from 'react-icons/bi';
import { BsPin } from 'react-icons/bs';
import { CgNotes, CgTrashEmpty } from 'react-icons/cg';
import { IoMdClose, IoMdCopy } from 'react-icons/io';
import { MdOutlineEditOff, MdSettingsBackupRestore, MdOutlineDownload } from 'react-icons/md';
import { AiOutlineStar } from 'react-icons/ai';
import { VscPreview } from 'react-icons/vsc';
import Switch from './Switch';
import { useOnClickOutside } from '@echoghi/hooks';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { formatDate, getNoteStats, getReadTime } from '../lib/formatters';
import { decrypt, generateUuid } from '../lib/encryption';
import { clearTrash, remove, update, duplicate } from '../lib/mutations';
import Modal from './Modal';

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

    &:active {
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
    top: 90px;
    right: 14px;
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
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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

    const isTrash = view === 'deleted';

    useOnClickOutside(ref, () => setIsMenuOpen(false));

    const handleClick = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const handleUpdate = useCallback(
        async (data: any) => {
            updateNote({ ...note, ...data });

            try {
                setLoading(true);
                await update({
                    id: note.id,
                    data
                });

                setLoading(false);
            } catch (err) {
                setError(true);
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

        if (isTrash) {
            updateNote(tempNote);
        } else {
            updateStarred(tempNote);
        }

        try {
            setLoading(true);
            await update({
                id: note.id,
                data: { starred: !note.starred }
            });

            setLoading(false);
        } catch (err) {
            setError(true);
        }
    }, [note]);

    const handleRestoreNote = useCallback(async () => {
        restoreNote({ ...note, deleted: false, deletedAt: null });

        try {
            setLoading(true);
            await update({
                id: note.id,
                data: { deleted: false, deletedAt: null }
            });

            setLoading(false);
        } catch (err) {
            setError(true);
        }
    }, [note]);

    const handleDeleteNote = useCallback(async () => {
        deleteNote({ ...note, deleted: !note.deleted });

        try {
            setLoading(true);
            await remove({
                id: note.id,
                trashed: view === 'deleted'
            });

            setLoading(false);
        } catch (err) {
            setError(true);
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
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(decrypt(note.content)));
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
            <MenuButton onClick={handleClick}>
                <SlOptions size="16px" color="var(--sn-stylekit-neutral-color)" />
            </MenuButton>
            {isMenuOpen && (
                <Modal>
                    <MenuContainer open={isMenuOpen && note} ref={ref}>
                        <Menu aria-label="Note Options Menu">
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
                                            <ItemContent alignAlt={true}>
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
