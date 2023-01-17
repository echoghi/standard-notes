import styled from 'styled-components';
import { BsPin } from 'react-icons/bs';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { useCallback } from 'react';

import { Note } from '../types';
import { storeEncryptedNotes, saveBulkNotes } from '../services';
import { breakpoints } from '../styles';

const MenuButton = styled.button<{ pinned: boolean }>`
    height: 2.5rem;
    width: 2.5rem;
    border: ${({ pinned }) =>
        pinned ? '1px solid var(--sn-stylekit-info-color)' : '1px solid var(--sn-stylekit-border-color)'};
    border-radius: 9999px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background-color: ${({ pinned }) =>
        pinned ? 'var(--sn-stylekit-info-color)' : 'var(--sn-stylekit-background-color)'};

    &:hover {
        background: var(--sn-stylekit-contrast-background-color);

        svg {
            fill: var(--sn-stylekit-info-color);
        }
    }

    @media (min-width: ${breakpoints.md}px) {
        height: 2rem;
        width: 2rem;
    }
`;

const PinNote = ({ note }: { note: Note }) => {
    const syncToken = useStoreState((store: any) => store.syncToken);

    const updateNote = useStoreActions((store: any) => store.updateNote);
    const setLoading = useStoreActions((store: any) => store.setLoading);
    const setError = useStoreActions((store: any) => store.setError);

    const handlePinNote = useCallback(async () => {
        const newNote = { ...note, pinned: !note.pinned };
        updateNote(newNote);

        const handleError = () => {
            storeEncryptedNotes(newNote);
            setError(true);
            setLoading(false);
        };

        try {
            setLoading(true);
            setError(false);
            const res = await saveBulkNotes({
                items: [newNote],
                syncToken
            });

            if (res.error) {
                handleError();
            } else {
                setLoading(false);
                setError(false);
            }
        } catch (err) {
            handleError();
        }
    }, [note, setLoading, setError, updateNote]);

    return (
        <MenuButton onClick={handlePinNote} pinned={note?.pinned} aria-label="Pin note">
            <BsPin size="18px" color={`${!note?.pinned ? 'var(--sn-stylekit-neutral-color)' : 'white'}`} />
        </MenuButton>
    );
};

export default PinNote;
