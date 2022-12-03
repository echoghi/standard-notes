import { useEffect, useState } from 'react';
import { CgNotes } from 'react-icons/cg';
import { MdAddCircle } from 'react-icons/md';
import { useStoreState } from 'easy-peasy';
import styled from 'styled-components';
import Note from './Note';

const TitleContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: 0.8rem;
    padding: 1rem;
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
    margin-left: 0.75rem;
    color: var(--sn-stylekit-contrast-foreground-color);
    font-size: 1.125rem;
    line-height: 1.75rem;
`;

const NoteContainer = styled.div`
    overflow: auto;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    height: 100%;
    border: 1px solid var(--sn-stylekit-border-color);
`;

const Notes = ({ notes }: { notes: any }) => {
    const [displayedNotes, setDisplayedNotes] = useState(notes);
    const savedNotes = useStoreState((state: any) => state.notes);

    useEffect(() => {
        if (savedNotes && savedNotes.length) {
            // order updated notes by the updatedAt field
            const orderedNotes = savedNotes.sort((a: any, b: any) => {
                return new Date(b.updatedAt) - new Date(a.updatedAt);
            });

            setDisplayedNotes(orderedNotes);
        }
    }, [savedNotes]);

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
                    />
                </Actions>
            </TitleContainer>
            <NoteContainer>
                {displayedNotes.map((note: any) => (
                    <Note note={note} key={note.id} />
                ))}
            </NoteContainer>
        </Container>
    );
};

export default Notes;
