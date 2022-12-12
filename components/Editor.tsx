import styled from 'styled-components';
import { useStoreState, useStoreActions } from 'easy-peasy';
import React, { useCallback, useEffect, useState } from 'react';
import fetcher from '../lib/fetcher';
import { formatDate } from '../lib/formatters';
import SaveStatus from './SaveStatus';
import NoteMenu from './NoteMenu';
import PinNote from './PinNote';
import EditModeBanner from './EditModeBanner';
import { decrypt, encrypt, generateUuid } from '../lib/encryption';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const TitleContainer = styled.div`
    display: flex;
    padding: 1rem 14px;
    padding-bottom: 10px;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--sn-stylekit-border-color);
    width: 100%;
`;

const InputContainer = styled.div`
    flex-grow: 1;
`;

const ActionContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
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
    background-color: var(--editor-pane-editor-background-color);
    color: var(--editor-pane-editor-foreground-color);
    border: none;
    outline: none;
    padding: 15px;
    resize: none;
`;

const Editor = () => {
    const userId = useStoreState((state: any) => state.userId);
    const note = useStoreState((state: any) => state.activeNote);

    const createNote = useStoreActions((store: any) => store.createNote);
    const updateNote = useStoreActions((store: any) => store.updateNote);
    const setLoading = useStoreActions((store: any) => store.setLoading);
    const setError = useStoreActions((store: any) => store.setError);

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
                userId,
                content: editorContent ? editorContent : note?.content,
                title: editorTitle ? editorTitle : note?.title
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

            const saveNote = async () => {
                try {
                    const updatedNote = await fetcher('/edit', newNote);

                    setLoading(false);
                } catch (err) {
                    setError(true);
                }
            };

            saveNote();
        }
    }, [isEditing, hasEdited]);

    const onEditTitle = async (e: any) => {
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

    return (
        <Container>
            {!note?.editEnabled && <EditModeBanner note={note} />}
            <TitleContainer>
                <InputContainer>
                    <Title
                        onChange={onEditTitle}
                        value={editorTitle}
                        spellCheck={false}
                        disabled={!note?.editEnabled}
                    />
                </InputContainer>
                <ActionContainer>
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
