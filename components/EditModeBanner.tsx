import { useCallback, useState } from 'react';
import { MdOutlineEditOff, MdOutlineEdit } from 'react-icons/md';
import { useStoreActions, useStoreState } from 'easy-peasy';
import styled from 'styled-components';

import { saveBulkNotes, storeEncryptedNotes } from '../services';
import { Note } from '../types';

const Container = styled.div<{ active: boolean }>`
    font-size: 0.875rem;
    width: 100%;
    line-height: 1.25rem;
    padding: 0.5rem 0.875rem;
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;

    &:after {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0.08;
        background-color: ${(props: any) =>
            props.active ? 'var(--sn-stylekit-info-color)' : 'var(--sn-stylekit-warning-color)'};
    }

    span {
        margin-left: 0.75rem;
        color: ${(props: any) =>
            props.active ? 'var(--sn-stylekit-accessory-tint-color-1)' : 'var(--sn-stylekit-accessory-tint-color-3)'};
    }
`;

const EditModeBanner = ({ note }: { note: Note }) => {
    const syncToken = useStoreState((store: any) => store.syncToken);

    const setLoading = useStoreActions((store: any) => store.setLoading);
    const setError = useStoreActions((store: any) => store.setError);
    const updateNote = useStoreActions((store: any) => store.updateNote);

    const [hover, setHover] = useState(false);
    const text = hover ? 'Enable editing' : 'Note editing disabled.';

    const handleMouseEnter = () => {
        setHover(true);
    };

    const handleMouseLeave = () => {
        setHover(false);
    };

    const enableEditMode = useCallback(async () => {
        const newNote = { ...note, editEnabled: !note.editEnabled };
        updateNote(newNote);

        const handleError = () => {
            setError(true);
            setLoading(false);
            storeEncryptedNotes(newNote);
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
    }, [note]);

    return (
        <Container
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            active={hover}
            onClick={enableEditMode}
        >
            {hover ? (
                <MdOutlineEdit size="20px" color="var(--sn-stylekit-accessory-tint-color-1)" />
            ) : (
                <MdOutlineEditOff size="20px" color="var(--sn-stylekit-accessory-tint-color-3)" />
            )}
            <span>{text}</span>
        </Container>
    );
};

export default EditModeBanner;
