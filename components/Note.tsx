import styled from 'styled-components';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { MdOutlineNotes, MdOutlineEditOff, MdMoveToInbox } from 'react-icons/md';
import { BsPinFill } from 'react-icons/bs';
import { AiFillStar } from 'react-icons/ai';
import { BiTrash } from 'react-icons/bi';

import { formatDate } from '../utils';
import { decrypt } from '../services';
import { Note as NoteType } from '../types';
import { breakpoints } from '../styles';
import { useMediaQuery } from '../hooks';

const NoteContainer = styled.div<{ isActive: boolean }>`
    display: flex;
    align-items: stretch;
    width: 100%;
    color: var(--sn-stylekit-foreground-color);
    border-left: ${(props: any) => (props.isActive ? '2px solid var(--sn-stylekit-accessory-tint-color-1)' : '0')};
    cursor: pointer;
    background: ${(props: any) =>
        props.isActive ? 'var(--item-cell-selected-background-color)' : 'var(--sn-stylekit-background-color)'};

    &:hover {
        background: var(--item-cell-selected-background-color);
    }
`;

const ContentContainer = styled.div<{ archived: boolean }>`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 1rem 0;
    overflow: hidden;
    opacity: ${(props: any) => (props.archived ? '0.5' : '1')};
    border-bottom: 1px solid var(--sn-stylekit-border-color);
`;

const NoteTitle = styled.div`
    font-size: 1.125rem;
    font-weight: bold;
`;

const NoteContent = styled.div`
    font-size: 1rem;
    line-height: 1.75rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;

    @media (min-width: ${breakpoints.lg}px) {
        font-size: 0.8rem;
    }
`;

const NoteInner = styled.div`
    overflow: hidden;
`;

const NoteTime = styled.div`
    font-size: 0.875rem;
    line-height: 1rem;
    opacity: 0.5;
    margin-top: 0.25rem;

    @media (min-width: ${breakpoints.lg}px) {
        font-size: 0.75rem;
    }
`;

const NoteIcons = styled.div`
    display: flex;
    padding: 1rem;
    padding-left: 0;
    align-items: flex-start;
    border-bottom: 1px solid var(--sn-stylekit-border-color);

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
    const isFullLayout = useMediaQuery(`(min-width: ${breakpoints.lg}px)`);

    const sortSetting = useStoreState((state: any) => state.sortSetting);
    const activeNote = useStoreState((state: any) => state.activeNote);
    const setActiveNote = useStoreActions((store: any) => store.setActiveNote);
    const setTagsPanel = useStoreActions((store: any) => store.setTagsPanel);

    const isActive = activeNote?.id === note.id;

    const handleClick = () => {
        setActiveNote(note);

        if (!isFullLayout) setTagsPanel(false);
    };

    return (
        <NoteContainer onClick={handleClick} isActive={isActive}>
            <IconWrapper>
                <MdOutlineNotes title="note" size="20px" color="var(--sn-stylekit-accessory-tint-color-1)" />
            </IconWrapper>
            <ContentContainer archived={note?.archived}>
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
                {note?.archived && (
                    <span>
                        <MdMoveToInbox
                            size="14px"
                            color="var(--sn-stylekit-accessory-tint-color-3)"
                            aria-label="Archived"
                            title="Archived"
                        />
                    </span>
                )}
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
