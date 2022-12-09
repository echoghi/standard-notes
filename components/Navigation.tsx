import styled from 'styled-components';
import { CgNotes } from 'react-icons/cg';
import { AiFillStar } from 'react-icons/ai';
import { BiTrash } from 'react-icons/bi';
import { useStoreActions, useStoreState } from 'easy-peasy';

const Container = styled.div`
    overflow: hidden;
    flex-grow: 1;
    background-color: var(--navigation-column-background-color);
    height: 100%;
    position: relative;
`;

const Title = styled.div`
    color: var(--navigation-section-title-color);
    padding-top: 0.8125rem;
    padding-bottom: 8px;
    padding-left: 16px;
    padding-right: 16px;
    font-size: 0.9rem;
    font-weight: 600;
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
    font-size: 12px;
    background-color: ${(props: { active: boolean }) =>
        props.active ? 'var(--navigation-item-selected-background-color);' : 'transparent'};

    &:hover {
        background-color: var(--navigation-item-selected-background-color);
    }

    div {
        display: flex;
        align-items: center;
    }

    span {
        font-size: 0.875rem;
        color: ${(props: { active: boolean }) => (props.active ? 'var(--sn-stylekit-foreground-color);' : 'inherit')};
        font-weight: ${(props: { active: boolean }) => (props.active ? '700' : '400')};
    }
`;

const NavItemName = styled.div`
    margin-left: 0.5rem;
    font-weight: 600;
    color: var(--navigation-item-text-color);
    font-size: 0.88rem;
`;

const Navigation = () => {
    const setView = useStoreActions((store: any) => store.setView);
    const setActiveNote = useStoreActions((store: any) => store.setActiveNote);
    const view = useStoreState((store: any) => store.view);
    const starred = useStoreState((store: any) => store.starred);
    const deleted = useStoreState((store: any) => store.deleted);
    const notes = useStoreState((store: any) => store.notes);
    const starredCount = useStoreState((store: any) => store.starredCount);
    const deletedCount = useStoreState((store: any) => store.deletedCount);
    const noteCount = useStoreState((store: any) => store.notesCount);

    const handleViewChange = (nextView: string) => {
        setView(nextView);

        if (nextView === 'notes') {
            if (notes.length) {
                setActiveNote(notes[0]);
            } else {
                setActiveNote(null);
            }

            setView('notes');
        } else if (nextView === 'starred') {
            if (starred.length) {
                setActiveNote(starred[0]);
            } else {
                setActiveNote(null);
            }
            setView('starred');
        } else if (nextView === 'trashed') {
            if (deleted.length) {
                setActiveNote(deleted[0]);
            } else {
                setActiveNote(null);
            }
            setView('trashed');
        }
    };

    return (
        <Container id="navigation">
            <section>
                <Title>Views</Title>
                <NavItem onClick={() => handleViewChange('notes')} active={view === 'notes'}>
                    <div>
                        <CgNotes color="var(--sn-stylekit-info-color)" size="18px" />
                        <NavItemName>Notes</NavItemName>
                    </div>
                    <span>{noteCount}</span>
                </NavItem>
                <NavItem onClick={() => handleViewChange('starred')} active={view === 'starred'}>
                    <div>
                        <AiFillStar title="starred" size="18px" color="var(--sn-stylekit-warning-color)" />
                        <NavItemName>Starred</NavItemName>
                    </div>
                    <span>{starredCount}</span>
                </NavItem>
                <NavItem onClick={() => handleViewChange('trashed')} active={view === 'trashed'}>
                    <div>
                        <BiTrash title="trash" size="18px" color="var(--sn-stylekit-neutral-color)" />
                        <NavItemName>Trash</NavItemName>
                    </div>
                </NavItem>
            </section>
        </Container>
    );
};

export default Navigation;
