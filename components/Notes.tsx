import { CgNotes } from 'react-icons/cg';
import { MdAddCircle } from 'react-icons/md';
import { useStoreState, useStoreActions } from 'easy-peasy';
import styled from 'styled-components';
import Note from './Note';
import { BiTrash } from 'react-icons/bi';
import { AiFillStar } from 'react-icons/ai';
import { formatTitleDate } from '../lib/formatters';

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
    const setActiveNote = useStoreActions((store: any) => store.setActiveNote);

    const isTrashed = view === 'trashed';
    const isStarred = view === 'starred';
    const isNotes = view === 'notes';

    const isEmpty =
        (isTrashed && deleted.length === 0) || (isStarred && starred.length === 0) || (isNotes && notes.length === 0);

    const createNote = async () => {
        setActiveNote({ title: formatTitleDate(new Date()), content: '', editEnabled: true, spellCheck: true });
        if (view !== 'notes') {
            setView('notes');
        }
    };

    return (
        <Container id="items-column" aria-label="Notes">
            <TitleContainer className="flex justify-between items-center ml-3">
                {isNotes && (
                    <FlexCenter>
                        <CgNotes color="gray" size="20px" />
                        <Title>Notes</Title>
                    </FlexCenter>
                )}

                {isTrashed && (
                    <FlexCenter>
                        <BiTrash color="gray" size="20px" />
                        <Title>Trash</Title>
                    </FlexCenter>
                )}

                {isStarred && (
                    <FlexCenter>
                        <AiFillStar color="gray" size="20px" />
                        <Title>Starred</Title>
                    </FlexCenter>
                )}

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
                {isNotes && notes.map((note: any) => <Note note={note} key={note.id} />)}
                {isStarred && starred.map((note: any) => <Note note={note} key={note.id} />)}
                {isTrashed && deleted.map((note: any) => <Note note={note} key={note.id} />)}
                {isEmpty && <Empty>No items.</Empty>}
            </NoteContainer>
        </Container>
    );
};

export default Notes;
