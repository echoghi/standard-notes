import Notes from '../components/Notes';
import jwt from 'jsonwebtoken';
import { useStoreActions, useStoreState } from 'easy-peasy';
import styled from 'styled-components';
import Editor from '../components/Editor';
import { useEffect } from 'react';
import Navigation from '../components/Navigation';
import getNotes from '../prisma/getNotes';
import AuthBar from '../components/AuthBar';
import { GetServerSideProps } from 'next';
import { Note } from '../types';

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

interface NoteData {
    notes: Note[];
    deleted: Note[];
    starred: Note[];
    newNote: Note;
    starredCount: number;
    deletedCount: number;
    notesCount: number;
}

interface Props {
    noteData: NoteData;
    userId: string;
    email: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { proof, _sn_session } = context.req.cookies;

    const { id, email } = jwt.verify(_sn_session, proof);

    const response = await getNotes(id);

    return {
        props: { noteData: { ...response, newNote: response.notes[0] }, userId: id, email }
    };
};

export default function Home({ noteData, userId, email }: Props) {
    const starred = useStoreState((store: any) => store.starred);
    const deleted = useStoreState((store: any) => store.deleted);
    const notes = useStoreState((store: any) => store.notes);
    const activeNote = useStoreState((state: any) => state.activeNote);

    const setNotes = useStoreActions((store: any) => store.setNotes);

    // save prisma notes to store
    useEffect(() => {
        setNotes({ ...noteData });
    }, [noteData]);

    return (
        <Container id="app" editorOpen={activeNote}>
            <Navigation />
            <Notes notes={notes} starred={starred} deleted={deleted} />

            {activeNote && <Editor />}

            <AuthBar id={userId} email={email} />
        </Container>
    );
}
