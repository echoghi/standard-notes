import styled from 'styled-components';
import { MdOutlineNotes } from 'react-icons/md';
import { formatDate } from '../lib/formatters';
import { useStoreActions } from 'easy-peasy';

const NoteContainer = styled.div`
    display: flex;
    padding: 1rem;
    border-left: 2px solid var(--sn-stylekit-accessory-tint-color-1);
    border-top: 1px solid var(--sn-stylekit-border-color);
    border-bottom: 1px solid var(--sn-stylekit-border-color);
    cursor: pointer;
    background: var(--sn-stylekit-passive-color-5);

    svg {
        fill: var(--sn-stylekit-accessory-tint-color-1);
    }
`;

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 0.8rem;
`;

const NoteTitle = styled.div`
    font-weight: bold;
`;
const NoteContent = styled.div`
    font-size: 0.8rem;
    color: var(--sn-stylekit-contrast-foreground-color);
    line-height: 1.75rem;
`;

const NoteTime = styled.div`
    font-size: 0.75rem;
    line-height: 1rem;
    opacity: 0.5;
    margin-top: 0.25rem;
`;

const Note = ({ note }: any) => {
    const setActiveNote = useStoreActions((store: any) => store.setActiveNote);

    const handleClick = () => {
        setActiveNote(note);
    };

    return (
        <NoteContainer onClick={handleClick}>
            <MdOutlineNotes size="20px" />
            <ContentContainer>
                <NoteTitle>{note.title}</NoteTitle>
                <NoteContent>{note.content}</NoteContent>
                <NoteTime>{formatDate(note.date)}</NoteTime>
            </ContentContainer>
        </NoteContainer>
    );
};

export default Note;
