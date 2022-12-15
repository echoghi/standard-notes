import styled from 'styled-components';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { MdOutlineNotes, MdOutlineEditOff } from 'react-icons/md';
import { BsPinFill } from 'react-icons/bs';
import { AiFillStar } from 'react-icons/ai';
import { BiTrash } from 'react-icons/bi';
import { formatDate } from '../lib/formatters';
import { decrypt } from '../lib/encryption';
import { Note as NoteType } from '../types';

const NoteContainer = styled.div<{ isActive: boolean }>`
    display: flex;
    align-items: stretch;
    width: 100%;
    color: var(--sn-stylekit-foreground-color);
    border-left: ${(props: any) => (props.isActive ? '2px solid var(--sn-stylekit-accessory-tint-color-1)' : '0')};
    border-bottom: 1px solid var(--sn-stylekit-border-color);
    cursor: pointer;
    background: ${(props: any) =>
        props.isActive ? 'var(--item-cell-selected-background-color)' : 'var(--sn-stylekit-background-color)'};

    &:hover {
        background: var(--item-cell-selected-background-color);
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

const Note = ({ note }: { note: NoteType }) => {
    const sortSetting = useStoreState((state: any) => state.sortSetting);
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
                <NoteTime>
                    {sortSetting === 'updatedAt'
                        ? `Modified ${formatDate(note.updatedAt)}`
                        : formatDate(note.createdAt)}
                </NoteTime>
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
