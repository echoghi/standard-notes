import { CgNotes } from 'react-icons/cg';
import { AiOutlinePlus, AiFillStar } from 'react-icons/ai';
import { BiTrash } from 'react-icons/bi';
import { MdMoveToInbox } from 'react-icons/md';
import { FiMenu } from 'react-icons/fi';
import { useStoreState, useStoreActions } from 'easy-peasy';
import styled from 'styled-components';

import Note from './Note';
import { formatTitleDate } from '../utils';
import { encrypt } from '../services';
import { Note as NoteType } from '../types';
import SortNotes from './SortNotes';
import { breakpoints, MenuButton } from '../styles';
import { useIsTabletOrMobileScreen } from '../hooks';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;
    overflow: hidden;
    height: 100%;
    border: 1px solid var(--sn-stylekit-border-color);
    border-bottom: 0;
    background: var(--sn-stylekit-background-color);

    @media (min-width: ${breakpoints.md}px) {
        position: relative;
        top: unset;
        left: unset;
        right: unset;
    }
`;

const TitleContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.8125rem;
    border-bottom: 1px solid var(--sn-stylekit-border-color);
`;

const FlexCenter = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;

    #show-menu {
        margin-right: 1rem;
        @media (min-width: ${breakpoints.lg}px) {
            display: none;
        }
    }
`;

const Actions = styled(FlexCenter)`
    gap: 0.5rem;
`;

const Button = styled.button`
    position: fixed;
    right: 1.5rem;
    bottom: 1.5rem;
    width: 3.75rem;
    height: 3.75rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--sn-stylekit-info-color);
    border-radius: 9999px;

    cursor: pointer;
    border: none;

    &:hover {
        filter: brightness(1.25);
    }

    svg {
        width: 32px;
        height: 32px;
    }

    @media (min-width: ${breakpoints.md}px) {
        position: relative;
        height: 2rem;
        width: 2rem;
        right: unset;
        bottom: unset;

        svg {
            width: 20px;
            height: 20px;
        }
    }
`;

const Title = styled.div`
    margin-left: 0.5rem;
    color: var(--sn-stylekit-contrast-foreground-color);
    font-weight: 600;
    font-size: 1.5rem;
    line-height: 2rem;

    @media (min-width: ${breakpoints.md}px) {
        font-size: 1.125rem;
        line-height: 1.75rem;
    }
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
    color: var(--sn-stylekit-foreground-color);
`;

interface Props {
    notes: NoteType[];
    starred: NoteType[];
    deleted: NoteType[];
    archived: NoteType[];
}

const Notes = ({ notes, deleted, starred, archived }: Props) => {
    const { isMobile } = useIsTabletOrMobileScreen();

    const view = useStoreState((store: any) => store.view);

    const setView = useStoreActions((store: any) => store.setView);
    const setActiveNote = useStoreActions((store: any) => store.setActiveNote);
    const setTagsPanel = useStoreActions((store: any) => store.setTagsPanel);
    const toggleNotesPanel = useStoreActions((store: any) => store.toggleNotesPanel);

    const isTrashed = view === 'deleted';
    const isStarred = view === 'starred';
    const isNotes = view === 'notes';
    const isArchived = view === 'archived';

    const isEmpty =
        (isTrashed && deleted.length === 0) ||
        (isStarred && starred.length === 0) ||
        (isNotes && notes.length === 0) ||
        (isArchived && archived.length === 0);

    const handleTagsPanel = () => {
        if (isMobile) {
            toggleNotesPanel();
        }

        setActiveNote(null);
        setTagsPanel(true);
    };

    const createNote = () => {
        setActiveNote({
            title: encrypt(formatTitleDate(new Date())),
            content: '',
            editEnabled: true,
            spellCheck: true,
            preview: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        if (view !== 'notes') {
            setView('notes');
        }
    };

    return (
        <Container id="items-column" aria-label="Notes">
            <TitleContainer className="flex justify-between items-center ml-3">
                <FlexCenter>
                    <MenuButton onClick={handleTagsPanel} id="show-menu">
                        <FiMenu size="20px" color="var(--sn-stylekit-neutral-color)" />
                    </MenuButton>

                    {isNotes && (
                        <>
                            <CgNotes color="var(--sn-stylekit-neutral-color)" size="22px" />
                            <Title>Notes</Title>
                        </>
                    )}

                    {isTrashed && (
                        <>
                            <BiTrash color="var(--sn-stylekit-neutral-color)" size="20px" />
                            <Title>Trash</Title>
                        </>
                    )}

                    {isStarred && (
                        <>
                            <AiFillStar color="var(--sn-stylekit-neutral-color)" size="20px" />
                            <Title>Starred</Title>
                        </>
                    )}

                    {isArchived && (
                        <>
                            <MdMoveToInbox color="var(--sn-stylekit-neutral-color)" size="20px" />
                            <Title>Archived</Title>
                        </>
                    )}
                </FlexCenter>
                <Actions>
                    <SortNotes />
                    <Button>
                        <AiOutlinePlus
                            id="add-note-button"
                            size="20px"
                            className="cursor-pointer"
                            title="Create a new note"
                            aria-label="Create a new note"
                            color="white"
                            onClick={createNote}
                        />
                    </Button>
                </Actions>
            </TitleContainer>
            <NoteContainer isEmpty={isEmpty}>
                {isNotes && notes.map((note: any) => <Note note={note} key={note.id} />)}
                {isStarred && starred.map((note: any) => <Note note={note} key={note.id} />)}
                {isTrashed && deleted.map((note: any) => <Note note={note} key={note.id} />)}
                {isArchived && archived.map((note: any) => <Note note={note} key={note.id} />)}
                {isEmpty && <Empty>No items.</Empty>}
            </NoteContainer>
        </Container>
    );
};

export default Notes;
