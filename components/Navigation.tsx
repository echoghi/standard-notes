import styled from 'styled-components';
import { CgNotes } from 'react-icons/cg';
import { AiFillStar } from 'react-icons/ai';
import { BiTrash } from 'react-icons/bi';
import { MdMoveToInbox } from 'react-icons/md';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { useMediaQuery } from '../lib/hooks';
import { breakpoints } from '../styles';

const Container = styled.div`
    overflow: hidden;
    flex-grow: 1;
    background-color: var(--navigation-column-background-color);
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;

    @media (min-width: ${breakpoints.md}px) {
        position: relative;
        top: unset;
        left: unset;
        right: unset;
    }
`;

const Title = styled.div`
    color: var(--navigation-section-title-color);
    padding-top: 0.8125rem;
    padding-bottom: 8px;
    padding-left: 16px;
    padding-right: 16px;
    font-size: 1rem;
    font-weight: 600;

    @media (min-width: ${breakpoints.lg}px) {
        font-size: 0.9rem;
    }
`;

const NavItem = styled.button`
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 0;
    width: 100%;
    color: var(--navigation-section-title-color);
    padding: 8px 16px;
    font-size: 1rem;
    background-color: ${(props: { active: boolean }) =>
        props.active ? 'var(--navigation-item-selected-background-color)' : 'transparent'};

    &:hover {
        background-color: var(--navigation-item-selected-background-color);
    }

    div {
        display: flex;
        align-items: center;
    }

    span {
        font-size: 1rem;
        color: ${(props: { active: boolean }) => (props.active ? 'var(--sn-stylekit-foreground-color);' : 'inherit')};
        font-weight: ${(props: { active: boolean }) => (props.active ? '700' : '400')};
    }

    @media (min-width: ${breakpoints.lg}px) {
        font-size: 0.875rem;
        span {
            font-size: 0.875rem;
        }
    }
`;

const NavItemName = styled.div`
    margin-left: 0.5rem;
    font-weight: 600;
    color: var(--navigation-item-text-color);
    font-size: 0.88rem;
`;

const Navigation = () => {
    const isSmallLayout = useMediaQuery(`(max-width: ${breakpoints.sm}px)`);
    const isMediumLayout = useMediaQuery(`(max-width: ${breakpoints.lg}px)`);

    const setNotesPanel = useStoreActions((store: any) => store.setNotesPanel);
    const setTagsPanel = useStoreActions((store: any) => store.setTagsPanel);
    const setView = useStoreActions((store: any) => store.setView);
    const setActiveNote = useStoreActions((store: any) => store.setActiveNote);
    const view = useStoreState((store: any) => store.view);
    const starred = useStoreState((store: any) => store.starred);
    const deleted = useStoreState((store: any) => store.deleted);
    const notes = useStoreState((store: any) => store.notes);
    const archived = useStoreState((store: any) => store.archived);
    const starredCount = useStoreState((store: any) => store.starredCount);
    const noteCount = useStoreState((store: any) => store.notesCount);

    const activeNoteColor = view === 'notes' ? 'var(--sn-stylekit-info-color)' : 'var(--sn-stylekit-neutral-color)';
    const activeArchiveColor =
        view === 'archived' ? 'var(--sn-stylekit-info-color)' : 'var(--sn-stylekit-neutral-color)';
    const activeTrashColor = view === 'deleted' ? 'var(--sn-stylekit-info-color)' : 'var(--sn-stylekit-neutral-color)';

    const handleViewChange = (nextView: string) => {
        setView(nextView);
        let activeNoteArray;
        if (nextView === 'notes') {
            activeNoteArray = notes;
        } else if (nextView === 'starred') {
            activeNoteArray = starred;
        } else if (nextView === 'deleted') {
            activeNoteArray = deleted;
        } else if (nextView === 'archived') {
            activeNoteArray = archived;
        }

        setActiveNote(activeNoteArray.length && !isSmallLayout ? activeNoteArray[0] : null);

        if (isMediumLayout) {
            setTagsPanel(false);
            setNotesPanel(true);
        }
    };

    const handleNoteView = () => handleViewChange('notes');
    const handleStarView = () => handleViewChange('starred');
    const handleDeletedView = () => handleViewChange('deleted');
    const handleArchivedView = () => handleViewChange('archived');

    return (
        <Container id="navigation">
            <section>
                <Title>Views</Title>
                <NavItem onClick={handleNoteView} active={view === 'notes'}>
                    <div>
                        <CgNotes color={activeNoteColor} size="18px" />
                        <NavItemName>Notes</NavItemName>
                    </div>
                    <span>{noteCount}</span>
                </NavItem>
                <NavItem onClick={handleStarView} active={view === 'starred'}>
                    <div>
                        <AiFillStar title="starred" size="18px" color="var(--sn-stylekit-warning-color)" />
                        <NavItemName>Starred</NavItemName>
                    </div>
                    <span>{starredCount}</span>
                </NavItem>
                <NavItem onClick={handleArchivedView} active={view === 'archived'}>
                    <div>
                        <MdMoveToInbox color={activeArchiveColor} size="18px" />
                        <NavItemName>Archived</NavItemName>
                    </div>
                </NavItem>
                <NavItem onClick={handleDeletedView} active={view === 'deleted'}>
                    <div>
                        <BiTrash title="trash" size="18px" color={activeTrashColor} />
                        <NavItemName>Trash</NavItemName>
                    </div>
                </NavItem>
            </section>
        </Container>
    );
};

export default Navigation;
