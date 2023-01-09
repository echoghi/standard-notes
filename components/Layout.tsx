import styled from 'styled-components';
import GlobalStyles from '../styles/GlobalStyles';
import Seo from './SEO';

const Container = styled.div`
    height: 100vh;
`;

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Container>
            <Seo
                pageTitle="Notes · Standard Notes"
                currentURL="https://app.standardnotes.com/"
                description="Standard Notes is an easy-to-use encrypted note-taking app for digitalists and professionals. Capture your notes, documents, and life's work all in one place."
            />
            <GlobalStyles />
            {children}
        </Container>
    );
};

export default Layout;
