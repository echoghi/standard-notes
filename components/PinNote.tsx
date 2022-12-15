import styled from 'styled-components';
import { BsPin } from 'react-icons/bs';
import { useStoreActions } from 'easy-peasy';
import { useCallback } from 'react';
import { update } from '../lib/mutations';
import { Note } from '../types';

const MenuButton = styled.button<{ pinned: boolean }>`
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

const PinNote = ({ note }: { note: Note }) => {
    const updateNote = useStoreActions((store: any) => store.updateNote);
    const setLoading = useStoreActions((store: any) => store.setLoading);
    const setError = useStoreActions((store: any) => store.setError);

    const handlePinNote = useCallback(async () => {
        updateNote({ ...note, pinned: !note.pinned });

        try {
            setLoading(true);

            await update({
                id: note.id,
                data: { pinned: !note.pinned }
            });

            setLoading(false);
        } catch (err) {
            setError(true);
        }
    }, [note, setLoading, setError, updateNote]);

    return (
        <MenuButton onClick={handlePinNote} pinned={note?.pinned} aria-label="Pin note">
            <BsPin size="18px" color={`${!note?.pinned ? 'var(--sn-stylekit-neutral-color)' : 'white'}`} />
        </MenuButton>
    );
};

export default PinNote;
