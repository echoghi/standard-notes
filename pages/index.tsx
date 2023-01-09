import { GetServerSideProps } from 'next';
import { useEffect } from 'react';
import jwt from 'jsonwebtoken';
import { useStoreActions, useStoreState } from 'easy-peasy';
import styled from 'styled-components';

import dynamic from 'next/dynamic';

import Editor from '../components/Editor';
import Notes from '../components/Notes';
import getNotes from '../prisma/getNotes';
import AuthBar from '../components/AuthBar';
import { Note } from '../types';
import OfflineSync from '../components/OfflineSync';
import { useGrid, useMediaQuery } from '../lib/hooks';
import { breakpoints } from '../styles';
import isSmallLayout from '../lib/isSmallLayout';

// disable ssr for navigation component
const Navigation = dynamic(() => import('../components/Navigation'), { ssr: false });

const Container = styled.div`
    position: relative;
    height: 100%;
    background: var(--sn-stylekit-background-color);
    display: flex;
    flex-direction: column;
`;

const AppGrid = styled.div<{ grid: string; focusMode: boolean }>`
    height: 100%;
    overflow: hidden;
    position: relative;
    vertical-align: top;
    width: 100%;

    @media (min-width: ${breakpoints.md}px) {
        display: grid;
        grid-template-columns: ${({ grid }) => grid || '1fr 2fr'};
        transition: ${({ focusMode }) => (focusMode ? 'grid-template-columns .25s' : 'none')};
    }

    @media (min-width: ${breakpoints.lg}px) {
        grid-template-columns: ${({ grid }) => grid || '220px 1fr'};
    }
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
    const { req } = context;
    const { proof, _sn_session } = req.cookies;

    // eslint-disable-next-line
    if (proof && _sn_session) {
        try {
            // @ts-ignore
            const { id, email } = jwt.verify(_sn_session, proof);

            const response = await getNotes(id);

            return {
                props: { noteData: { ...response, newNote: response.notes[0] || null }, userId: id, email }
            };
        } catch (error) {
            console.log(error);
        }
    }

    return {
        redirect: {
            permanent: false,
            destination: '/signin'
        },
        props: {}
    };
};

const Home = ({ noteData, userId, email }: Props) => {
    const isMobileLayout = useMediaQuery(`(max-width: ${breakpoints.sm}px)`);

    const starred = useStoreState((store: any) => store.starred);
    const deleted = useStoreState((store: any) => store.deleted);
    const archived = useStoreState((store: any) => store.archived);
    const notes = useStoreState((store: any) => store.notes);
    const activeNote = useStoreState((state: any) => state.activeNote);
    const notesPanel = useStoreState((state: any) => state.notesPanel);
    const tagsPanel = useStoreState((state: any) => state.tagsPanel);
    const focusMode = useStoreState((state: any) => state.focusMode);

    const navActive = isMobileLayout || tagsPanel;

    const setNotes = useStoreActions((store: any) => store.setNotes);
    const setTagsPanel = useStoreActions((store: any) => store.setTagsPanel);

    const grid = useGrid({
        editorOpen: !!activeNote,
        notesPanel,
        tagsPanel,
        focusMode,
        setNavigation: (bool: boolean) => setTagsPanel(bool)
    });

    // save prisma notes to store
    useEffect(() => {
        const isMobile = isSmallLayout();
        const newNote = !isMobile ? noteData.newNote : null;

        // load active note if in tablet layout or larger
        setNotes({ ...noteData, newNote });
    }, [noteData]);

    return (
        <Container id="app">
            <AppGrid grid={grid} focusMode={focusMode}>
                <OfflineSync />
                {navActive && <Navigation />}
                {notesPanel && <Notes notes={notes} starred={starred} deleted={deleted} archived={archived} />}

                {activeNote && <Editor />}
            </AppGrid>

            <AuthBar id={userId} email={email} />
            <div id="modal-root" />
        </Container>
    );
};

export default Home;
