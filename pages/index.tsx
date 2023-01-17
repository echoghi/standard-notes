import { GetServerSideProps } from 'next';
import { useEffect } from 'react';
import jwt from 'jsonwebtoken';
import { useStoreActions } from 'easy-peasy';
import styled from 'styled-components';

import AuthBar from '../components/AuthBar';
import { Note } from '../types';
import OfflineSync from '../components/OfflineSync';
import { useMediaQuery } from '../hooks';
import ColumnSystem from '../components/ColumnSystem';
import getNotes from '../prisma/getNotes';

const Container = styled.div`
    position: relative;
    height: 100%;
    background: var(--sn-stylekit-background-color);
    display: flex;
    flex-direction: column;
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
    const isMobile = useMediaQuery(`(max-width: 768px)`);

    const setNotes = useStoreActions((store: any) => store.setNotes);

    // save prisma notes to store
    useEffect(() => {
        const newNote = !isMobile ? noteData.newNote : null;

        // load active note if in tablet layout or larger
        setNotes({ ...noteData, newNote });
    }, [noteData]);

    return (
        <Container id="app">
            <OfflineSync />
            <ColumnSystem />

            <AuthBar id={userId} email={email} />
            <div id="modal-root" />
        </Container>
    );
};

export default Home;
