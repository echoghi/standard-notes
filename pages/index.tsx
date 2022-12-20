import { GetServerSideProps } from 'next';
import { useEffect } from 'react';
import jwt from 'jsonwebtoken';
import { useStoreActions, useStoreState } from 'easy-peasy';
import styled from 'styled-components';

import Editor from '../components/Editor';
import Notes from '../components/Notes';
import Navigation from '../components/Navigation';
import getNotes from '../prisma/getNotes';
import AuthBar from '../components/AuthBar';
import { Note } from '../types';
import OfflineSync from '../components/OfflineSync';
import { setGrid } from '../styles';

const Container = styled.div`
    position: relative;
    height: 100%;
    background: var(--sn-stylekit-background-color);
    display: flex;
    flex-direction: column;
`;

const AppGrid = styled.div<{ grid: string; focusMode: boolean }>`
    display: grid;
    grid-template-columns: ${(props: any) => (props.grid ? props.grid : '220px 1fr')};
    height: 100%;
    overflow: hidden;
    position: relative;
    vertical-align: top;
    width: 100%;
    transition: ${(props: any) => (props.focusMode ? 'grid-template-columns .25s' : 'none')};
`;

interface NoteData {
    notes: Note[];
    deleted: Note[];
    starred: Note[];
    archived: Note[];
    newNote: Note;
    starredCount: number;
    deletedCount: number;
    notesCount: number;
    sortSetting: string;
}

interface Props {
    noteData: NoteData;
    userId: string;
    email: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { proof, _sn_session } = context.req.cookies;

    // eslint-disable-next-line
    if (proof && _sn_session) {
        // @ts-ignore
        const { id, email } = jwt.verify(_sn_session, proof);

        const response = await getNotes(id);

        return {
            props: { noteData: { ...response, newNote: response.notes[0] || null }, userId: id, email }
        };
    }

    return { props: {} };
};

const Home = ({ noteData, userId, email }: Props) => {
    const starred = useStoreState((store: any) => store.starred);
    const deleted = useStoreState((store: any) => store.deleted);
    const archived = useStoreState((store: any) => store.archived);
    const notes = useStoreState((store: any) => store.notes);
    const activeNote = useStoreState((state: any) => state.activeNote);
    const notesPanel = useStoreState((state: any) => state.notesPanel);
    const tagsPanel = useStoreState((state: any) => state.tagsPanel);
    const focusMode = useStoreState((state: any) => state.focusMode);

    const setNotes = useStoreActions((store: any) => store.setNotes);

    // save prisma notes to store
    useEffect(() => {
        setNotes({ ...noteData });
    }, [noteData]);

    const grid = setGrid({ editorOpen: activeNote, notesPanel, tagsPanel, focusMode });

    return (
        <Container id="app">
            <AppGrid grid={grid} focusMode={focusMode}>
                <OfflineSync />
                {tagsPanel && <Navigation />}
                {notesPanel && <Notes notes={notes} starred={starred} deleted={deleted} archived={archived} />}

                {activeNote && <Editor />}
            </AppGrid>

            <AuthBar id={userId} email={email} />
            <div id="modal-root" />
        </Container>
    );
};

export default Home;
