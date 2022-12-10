import Notes from '../components/Notes';
import { useStoreActions, useStoreState } from 'easy-peasy';
import styled from 'styled-components';
import Editor from '../components/Editor';
import { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import getNotes from '../prisma/getNotes';
import AuthBar from '../components/AuthBar';
import { GetServerSideProps } from 'next';
import { getLocalStorage } from '../lib/storage';

const Container = styled.div`
    display: grid;
    grid-template-columns: ${(props: any) => (props.editorOpen ? '220px 400px 2fr' : '220px 1fr')};
    grid-template-rows: 1fr 2rem;
    height: 100%;
    overflow: hidden;
    position: relative;
    vertical-align: top;
    width: 100%;
`;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { userId } = context.req.cookies;

    const response = await getNotes(userId);

    return {
        props: { noteData: { ...response, newNote: response.notes[0] }, userId }
    };
};

export default function Home({ noteData, userId }) {
    const setUserId = useStoreActions((store: any) => store.setUserId);
    const starred = useStoreState((store: any) => store.starred);
    const deleted = useStoreState((store: any) => store.deleted);
    const notes = useStoreState((store: any) => store.notes);
    const activeNote = useStoreState((state: any) => state.activeNote);

    const setNotes = useStoreActions((store: any) => store.setNotes);

    // save userId to store
    useEffect(() => {
        setUserId(userId);
    }, [userId]);

    // save prisma notes to store
    useEffect(() => {
        setNotes({ ...noteData });
    }, [noteData]);

    return (
        <Container id="app" editorOpen={activeNote}>
            <Navigation />
            <Notes notes={notes} starred={starred} deleted={deleted} />

            {activeNote && <Editor />}

            <AuthBar />
        </Container>
    );
}
