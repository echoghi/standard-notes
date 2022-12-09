import Notes from '../components/Notes';
import { useStoreActions, useStoreState } from 'easy-peasy';
import styled from 'styled-components';
import Editor from '../components/Editor';
import { useEffect } from 'react';
import Navigation from '../components/Navigation';
import getNotes from '../prisma/getNotes';

const Container = styled.div`
    display: grid;
    grid-template-columns: ${(props: any) => (props.editorOpen ? '220px 400px 2fr' : '220px 1fr')};
    height: 100%;
    overflow: hidden;
    position: relative;
    vertical-align: top;
    width: 100%;
`;

export const getServerSideProps = async () => {
    const response = await getNotes();

    return {
        props: { noteData: { ...response, newNote: response.notes[0] } }
    };
};

export default function Home({ noteData }) {
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
        </Container>
    );
}
