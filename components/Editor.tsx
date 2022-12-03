import styled from 'styled-components';
import { useStoreState, useStoreActions } from 'easy-peasy';
import React, { useEffect, useState } from 'react';
import fetcher from '../lib/fetcher';

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

const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric'
    });
};

const throttle = (func: any, limit: number) => {
    let inThrottle: boolean;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};

const Editor = ({ notes }: { notes: any }) => {
    const note = useStoreState((state: any) => state.activeNote);
    const setNotes = useStoreActions((store: any) => store.setNotes);
    const [editorContent, setEditorContent] = useState(note?.content || '');
    const [editorTitle, setEditorTitle] = useState(note?.title || formatDate());

    useEffect(() => {
        if (note?.content) setEditorContent(note.content);
        if (note?.title) setEditorTitle(note.title);
    }, [note]);

    const onEditTitle = async (e: any) => {
        setEditorTitle(e.target.value);

        const upsert = await fetcher('/edit', { id: note?.id || null, content: editorContent, title: e.target.value });

        // map through notes and replace the note with the same id as the upset note
        const updatedNotes = notes.map((n: any) => (n.id === upsert.id ? upsert : n));

        setNotes(updatedNotes);

        throttle(upsert, 150);
    };

    const onEditContent = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditorContent(e.target.value);

        const upsert = await fetcher('/edit', { id: note?.id || null, content: e.target.value, title: editorTitle });

        const updatedNotes = notes.map((n: any) => (n.id === upsert.id ? upsert : n));

        setNotes(updatedNotes);

        throttle(upsert, 150);
    };

    return (
        <Container>
            <Title onChange={onEditTitle} value={editorTitle} />
            <EditPanel onChange={onEditContent} value={editorContent} />
        </Container>
    );
};

export default Editor;
