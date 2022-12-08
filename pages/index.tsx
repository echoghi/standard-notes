import Notes from '../components/Notes';
import { useStoreActions, useStoreState } from 'easy-peasy';
import styled from 'styled-components';
import Editor from '../components/Editor';
import prisma from '../lib/prisma';
import { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';

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
    // get all prisma notes order by the createdAt field in descending order but keep all pinned notes at the top
    const notes = await prisma.note.findMany({
        orderBy: {
            pinned: 'desc'
        }
    });

    // get all starred notes
    const starred = await prisma.note.findMany({
        where: {
            starred: true
        }
    });

    const deleted = await prisma.note.findMany({
        where: {
            deleted: true
        }
    });

    // get Number of deleted notes
    const deletedCount = await prisma.note.count({
        where: {
            deleted: true
        }
    });

    // get Number of  notes
    const notesCount = await prisma.note.count();

    // get number of starred notes
    const starredCount = await prisma.note.count({
        where: {
            starred: true
        }
    });

    return {
        props: { noteData: { notes, deleted, starred, deletedCount, notesCount, starredCount, newNote: notes[0] } }
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
