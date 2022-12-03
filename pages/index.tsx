import Notes from '../components/Notes';
import Navigation from '../components/Navigation';
import styled from 'styled-components';
import Editor from '../components/Editor';
import prisma from '../lib/prisma';

const Container = styled.div`
    display: grid;
    grid-template-columns: 400px 1fr;
    height: 100%;
    overflow: hidden;
    position: relative;
    vertical-align: top;
    width: 100%;
`;

export const getServerSideProps = async () => {
    const notes = await prisma.note.findMany({
        orderBy: {
            updatedAt: 'desc'
        }
    });

    return {
        props: { notes }
    };
};

export default function Home({ notes }: { notes: any }) {
    return (
        <Container id="app">
            {/* <Navigation /> */}

            <Notes notes={notes} />

            <Editor notes={notes} />
        </Container>
    );
}
