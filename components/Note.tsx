import styled from 'styled-components';
import { MdOutlineNotes, MdOutlineEditOff } from 'react-icons/md';
import { formatDate } from '../lib/formatters';
import { BsPinFill } from 'react-icons/bs';
import { AiFillStar } from 'react-icons/ai';
import { BiTrash } from 'react-icons/bi';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { decrypt } from '../lib/encryption';

const NoteContainer = styled.div`
    display: flex;
    align-items: stretch;
    width: 100%;
    border-left: ${(props: any) => (props.isActive ? '2px solid var(--sn-stylekit-accessory-tint-color-1)' : '0')};
    border-bottom: 1px solid var(--sn-stylekit-border-color);
    cursor: pointer;
    background: ${(props: any) => (props.isActive ? 'var(--sn-stylekit-passive-color-5)' : '#FFFFFF')};

    &:hover {
        background: var(--sn-stylekit-passive-color-5);
    }
`;

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 1rem 0;
    overflow: hidden;
`;

const NoteTitle = styled.div`
    font-weight: bold;
`;

const NoteContent = styled.div`
    font-size: 0.8rem;
    color: var(--sn-stylekit-contrast-foreground-color);
    line-height: 1.75rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
`;

const NoteInner = styled.div`
    overflow: hidden;
`;

const NoteTime = styled.div`
    font-size: 0.75rem;
    line-height: 1rem;
    opacity: 0.5;
    margin-top: 0.25rem;
`;

const NoteIcons = styled.div`
    display: flex;
    padding: 1rem;
    padding-left: 0;
    align-items: flex-start;

    span {
        margin-left: 0.375rem;
    }
`;

const IconWrapper = styled.div`
    padding: 1rem;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-direction: column;
    margin-right: 0;
`;

const Note = ({ note }: any) => {
    const activeNote = useStoreState((state: any) => state.activeNote);
    const setActiveNote = useStoreActions((store: any) => store.setActiveNote);

    const isActive = activeNote?.id === note.id;

    const handleClick = () => {
        setActiveNote(note);
    };

    return (
        <NoteContainer onClick={handleClick} isActive={isActive}>
            <IconWrapper>
                <MdOutlineNotes title="note" size="20px" color="var(--sn-stylekit-accessory-tint-color-1)" />
            </IconWrapper>
            <ContentContainer>
                <NoteTitle>{decrypt(note.title)}</NoteTitle>
                {note?.preview ? (
                    <NoteContent>
                        <NoteInner>{decrypt(note.content)}</NoteInner>
                    </NoteContent>
                ) : null}
                <NoteTime>{formatDate(note.createdAt)}</NoteTime>
            </ContentContainer>
            <NoteIcons>
                {!note?.editEnabled && (
                    <span>
                        <MdOutlineEditOff
                            size="14px"
                            color="var(--sn-stylekit-info-color)"
                            aria-label="Editing Disabled"
                            title="Editing Disabled"
                        />
                    </span>
                )}
                {note?.deleted && (
                    <span>
                        <BiTrash
                            size="14px"
                            color="var(--sn-stylekit-danger-color)"
                            aria-label="Trashed"
                            title="Trashed"
                        />
                    </span>
                )}
                {note?.pinned && (
                    <span>
                        <BsPinFill
                            size="14px"
                            color="var(--sn-stylekit-info-color)"
                            aria-label="Pinned"
                            title="Pinned"
                        />
                    </span>
                )}
                {note?.starred && (
                    <span>
                        <AiFillStar
                            size="14px"
                            color="var(--sn-stylekit-warning-color)"
                            aria-label="Starred"
                            title="Starred"
                        />
                    </span>
                )}
            </NoteIcons>
        </NoteContainer>
    );
};

export default Note;
