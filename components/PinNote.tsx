import styled from 'styled-components';
import { BsPin } from 'react-icons/bs';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { useCallback } from 'react';
import fetcher from '../lib/fetcher';

const MenuButton = styled.button`
    height: 2rem;
    width: 2rem;
    border: ${(props: any) =>
        props.pinned ? '1px solid var(--sn-stylekit-info-color)' : '1px solid var(--sn-stylekit-border-color)'};
    border-radius: 9999px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background-color: ${(props: any) =>
        props.pinned ? 'var(--sn-stylekit-info-color)' : 'var(--sn-stylekit-background-color)'};

    &:hover {
        background: var(--sn-stylekit-contrast-background-color);

        svg {
            fill: var(--sn-stylekit-info-color);
        }
    }
`;

const PinNote = ({ note }) => {
    const view = useStoreState((store: any) => store.view);
    const setActiveNote = useStoreActions((store: any) => store.setActiveNote);
    const setNotes = useStoreActions((store: any) => store.setNotes);
    const setLoading = useStoreActions((store: any) => store.setLoading);
    const setError = useStoreActions((store: any) => store.setError);

    const handlePinNote = useCallback(async () => {
        try {
            setLoading(true);
            const updatedNotes: any = await fetcher('/pin', {
                id: note.id,
                pinned: !note.pinned,
                trashed: view === 'trashed'
            });

            setActiveNote(updatedNotes.newNote);
            setNotes(updatedNotes);
        } catch (err) {
            setError(true);
        }
    }, [note]);

    return (
        <MenuButton onClick={handlePinNote} pinned={note?.pinned} aria-label="Pin note">
            <BsPin size="18px" color={`${!note?.pinned ? 'var(--sn-stylekit-neutral-color)' : 'white'}`} />
        </MenuButton>
    );
};

export default PinNote;
