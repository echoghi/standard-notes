import styled from 'styled-components';
import { useStoreState, useStoreActions } from 'easy-peasy';
import React, { useCallback, useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import { formatDate } from '../lib/formatters';
import SaveStatus from './SaveStatus';
import NoteMenu from './NoteMenu';
import PinNote from './PinNote';
import EditModeBanner from './EditModeBanner';
import { decrypt, encrypt, generateUuid, storeEncryptedNotes } from '../lib/encryption';
import { edit } from '../lib/mutations';
import { animation, breakpoints, MenuButton, slideAnimation } from '../styles';
import { useMediaQuery } from '../lib/hooks';

const Container = styled.div<{ focusMode: boolean }>`
    display: flex;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: center;
    background: ${({ focusMode }) =>
        focusMode ? 'var(--sn-stylekit-contrast-background-color)' : 'var(--sn-stylekit-background-color)'};
    padding: ${({ focusMode }) => (focusMode ? '25px 10% 0px 10%' : '0')};
    animation: ${slideAnimation} ${animation.slideDuration} ${animation.slideTimingFunction};
    animation-fill-mode: forwards;
    z-index: 3;

    @media (min-width: ${breakpoints.md}px) {
        height: auto;
        width: auto;
        position: relative;
        transform: none;
        animation: none;
        top: unset;
        left: unset;
        right: unset;
    }

    @media (min-width: ${breakpoints.lg}px) {
        padding: ${({ focusMode }) => (focusMode ? '25px 20% 0px 20%' : '0')};
    }
`;

const TitleContainer = styled.div`
    display: flex;
    padding: 1rem 14px;
    padding-bottom: 10px;
    justify-content: space-between;
    align-items: center;
    background-color: var(--sn-stylekit-background-color);
    border-bottom: 1px solid var(--sn-stylekit-border-color);
    width: 100%;
`;

const InputContainer = styled.div`
    flex-grow: 1;
    display: flex;

    button {
        margin-right: 0.75rem;

        @media (min-width: ${breakpoints.lg}px) {
            display: none;
        }
    }
`;

const ActionContainer = styled.div<{ focusMode: boolean }>`
    display: flex;
    opacity: ${({ focusMode }: { focusMode: boolean }) => (focusMode ? '0' : '1')};
    align-items: center;
    gap: 0.75rem;

    &:hover {
        opacity: 1;
    }
`;

const Title = styled.input`
    text-overflow: ellipsis;
    font-weight: bold;
    border: none;
    outline: none;
    background-color: rgba(0, 0, 0, 0);
    color: var(--editor-title-input-color);
    width: 100%;
    font-size: 1.125rem;
    line-height: 1.75rem;
`;

const EditPanel = styled.textarea`
    width: 100%;
    height: 100%;
    overflow-y: auto;
    width: 100%;
    font-family: var(--sn-stylekit-editor-font-family);
    font-size: var(--sn-stylekit-font-size-editor);
    background-color: var(--editor-pane-editor-background-color);
    color: var(--editor-pane-editor-foreground-color);
    border: none;
    outline: none;
    padding: 15px;
    resize: none;
    line-height: 1.5;
`;

const Editor = () => {
    const isSmallLayout = useMediaQuery(`(max-width: ${breakpoints.sm}px)`);

    const note = useStoreState((state: any) => state.activeNote);
    const focusMode = useStoreState((state: any) => state.focusMode);
    const notesPanel = useStoreState((store: any) => store.notesPanel);

    const setActiveNote = useStoreActions((store: any) => store.setActiveNote);
    const createNote = useStoreActions((store: any) => store.createNote);
    const updateNote = useStoreActions((store: any) => store.updateNote);
    const setLoading = useStoreActions((store: any) => store.setLoading);
    const setError = useStoreActions((store: any) => store.setError);
    const toggleNotesPanel = useStoreActions((store: any) => store.toggleNotesPanel);
    const setNotesPanel = useStoreActions((store: any) => store.setNotesPanel);

    const [editorContent, setEditorContent] = useState(note?.content || '');
    const [editorTitle, setEditorTitle] = useState(note?.title || formatDate(new Date()));
    const [isEditing, setIsEditing] = useState(false);
    const [hasEdited, setHasEdited] = useState(false);

    const throttledSetEdit: any = useCallback(
        (newValue: any) => {
            if (throttledSetEdit.timeout) {
                clearTimeout(throttledSetEdit.timeout);
            }

            throttledSetEdit.timeout = setTimeout(() => {
                setIsEditing(newValue);
            }, 1000);
        },
        [setIsEditing]
    );

    useEffect(() => {
        if (note) {
            setEditorContent(decrypt(note?.content) || '');
            setEditorTitle(decrypt(note?.title));
        }
    }, [note]);

    // save note when user has stopped editing
    useEffect(() => {
        if (!isEditing && hasEdited) {
            setLoading(true);

            const newNote = {
                ...note,
                content: editorContent || note?.content,
                title: editorTitle || note?.title
            };

            // encrypt note
            newNote.content = encrypt(newNote.content);
            newNote.title = encrypt(newNote.title);

            if (note.id) {
                // optimistically update note
                updateNote(newNote);
            } else {
                // optimistically create note
                newNote.id = generateUuid();
                createNote(newNote);
            }

            const handleError = () => {
                setError(true);
                setLoading(false);
                storeEncryptedNotes(newNote);
            };

            const saveNote = async () => {
                try {
                    const res = await edit(newNote);

                    setLoading(false);

                    if (res.error) handleError();
                } catch (err) {
                    handleError();
                }
            };

            saveNote();
        }
    }, [isEditing, hasEdited]);

    const onEditTitle = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsEditing(true);
        setHasEdited(true);
        setEditorTitle(e.target.value);

        throttledSetEdit(false);
    };

    const onEditContent = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setIsEditing(true);
        setHasEdited(true);
        setEditorContent(e.target.value);

        throttledSetEdit(false);
    };

    const handleBack = () => {
        if (isSmallLayout) {
            setNotesPanel(true);
            setActiveNote(null);
        } else {
            toggleNotesPanel();
        }
    };

    return (
        <Container focusMode={focusMode}>
            {!note?.editEnabled && <EditModeBanner note={note} />}
            <TitleContainer>
                <InputContainer>
                    {!focusMode && (
                        <MenuButton onClick={handleBack}>
                            {notesPanel ? (
                                <FiChevronLeft size="22px" color="var(--sn-stylekit-neutral-color)" />
                            ) : (
                                <FiChevronRight size="22px" color="var(--sn-stylekit-neutral-color)" />
                            )}
                        </MenuButton>
                    )}
                    <Title
                        onChange={onEditTitle}
                        value={editorTitle}
                        spellCheck={false}
                        disabled={!note?.editEnabled}
                    />
                </InputContainer>
                <ActionContainer focusMode={focusMode}>
                    <SaveStatus />
                    <PinNote note={note} />
                    <NoteMenu />
                </ActionContainer>
            </TitleContainer>
            <EditPanel
                onChange={onEditContent}
                value={editorContent}
                spellCheck={note?.spellCheck}
                disabled={!note?.editEnabled}
            />
        </Container>
    );
};

export default Editor;
