import styled from 'styled-components';
import { useStoreState, useStoreActions } from 'easy-peasy';
import React, { useCallback, useEffect, useState } from 'react';
import fetcher from '../lib/fetcher';
import { formatDate } from '../lib/formatters';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Title = styled.input`
    text-overflow: ellipsis;
    width: 100%;
    font-weight: bold;
    border: none;
    outline: none;
    background-color: rgba(0, 0, 0, 0);
    color: var(--editor-title-input-color);
    border-bottom: 1px solid var(--sn-stylekit-border-color);
    padding: 0.8rem;
    height: 100px;
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
    padding: 0.8rem;
`;

const Editor = ({ notes }: { notes: any }) => {
    const note = useStoreState((state: any) => state.activeNote);
    const setNotes = useStoreActions((store: any) => store.setNotes);
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
            }, 500);
        },
        [setIsEditing]
    );

    useEffect(() => {
        if (note?.content) setEditorContent(note.content);
        if (note?.title) setEditorTitle(note.title);
    }, [note]);

    // save note when user has stopped editing
    useEffect(() => {
        if (!isEditing && hasEdited) {
            const newNote = {
                ...note,
                content: editorContent ? editorContent : note?.content,
                title: editorTitle ? editorTitle : note?.title
            };

            const saveNote = async () => {
                const updatedNote: any = await fetcher('/edit', newNote);

                const updatedNotes = notes.map((n: any) => {
                    if (n.id === updatedNote.id) {
                        return updatedNote;
                    }
                    return n;
                });

                setNotes(updatedNotes);
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
            <Title onChange={onEditTitle} value={editorTitle} />
            <EditPanel onChange={onEditContent} value={editorContent} />
        </Container>
    );
};

export default Editor;
