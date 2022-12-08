import styled from 'styled-components';
import Seo from './SEO';

const Container = styled.div`
    height: 100vh;
`;

const Layout = ({ children }: { children: any }) => {
    return (
        <Container>
            <Seo
                pageTitle="Notes · Standard Notes"
                currentURL="https://app.standardnotes.com/"
                description="Standard Notes is an easy-to-use encrypted note-taking app for digitalists and professionals. Capture your notes, documents, and life's work all in one place."
            />
            {children}
        </Container>
    );
};

export default Layout;
