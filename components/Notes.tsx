import { CgNotes } from 'react-icons/cg';
import { MdAddCircle } from 'react-icons/md';
import { useStoreState, useStoreActions } from 'easy-peasy';
import styled from 'styled-components';
import Note from './Note';
import fetcher from '../lib/fetcher';
import { formatTitleDate } from '../lib/formatters';
import { useEffect, useState } from 'react';

const TitleContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid var(--sn-stylekit-border-color);
`;

const FlexCenter = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Actions = styled(FlexCenter)`
    svg {
        transition: 0.25s all ease;
        cursor: pointer;
        fill: var(--sn-stylekit-info-color);

        &:hover {
            filter: brightness(1.25);
        }
    }
`;

const Title = styled.div`
    margin-left: 0.5rem;
    color: var(--sn-stylekit-contrast-foreground-color);
    font-weight: 600;
    font-size: 1.125rem;
    line-height: 1.75rem;
`;

const NoteContainer = styled.div`
    overflow: auto;
    overflow-x: hidden;
    height: ${(props: { isEmpty: boolean }) => (props.isEmpty ? '100%' : 'auto')};
`;

const Empty = styled.div`
    flex-grow: 1;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: var(--sn-stylekit-font-size-h3);
    height: 100%;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    height: 100%;
    border: 1px solid var(--sn-stylekit-border-color);
`;

const Notes = ({ notes, deleted, starred }) => {
    const view = useStoreState((store: any) => store.view);
    const setView = useStoreActions((store: any) => store.setView);
    const setNotes = useStoreActions((store: any) => store.setNotes);
    const setError = useStoreActions((store: any) => store.setError);

    const isEmpty =
        (view === 'trashed' && deleted.length === 0) ||
        (view === 'starred' && starred.length === 0) ||
        (view === 'notes' && notes.length === 0);

    const createNote = async () => {
        try {
            const updatedNotes: any = await fetcher('/create', { title: formatTitleDate(new Date()), content: '' });

            setNotes(updatedNotes);
            if (view !== 'notes') {
                setView('notes');
            }
        } catch (err) {
            setError(true);
        }
    };

    return (
        <Container id="items-column" aria-label="Notes">
            <TitleContainer className="flex justify-between items-center ml-3">
                <FlexCenter>
                    <CgNotes color="gray" size="20px" />
                    <Title>Notes</Title>
                </FlexCenter>

                <Actions>
                    <MdAddCircle
                        id="add-note-button"
                        size="40px"
                        className="cursor-pointer"
                        title="Create a new note"
                        aria-label="Create a new note"
                        onClick={createNote}
                    />
                </Actions>
            </TitleContainer>
            <NoteContainer isEmpty={isEmpty}>
                {view === 'notes' && notes.map((note: any) => <Note note={note} key={note.id} />)}
                {view === 'starred' && starred.map((note: any) => <Note note={note} key={note.id} />)}
                {view === 'trashed' && deleted.map((note: any) => <Note note={note} key={note.id} />)}
                {isEmpty && <Empty>No items.</Empty>}
            </NoteContainer>
        </Container>
    );
};

export default Notes;
