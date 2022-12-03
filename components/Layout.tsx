import styled from 'styled-components';

const Container = styled.div`
    height: 100vh;
`;

const Layout = ({ children }: { children: any }) => {
    return <Container>{children}</Container>;
};

export default Layout;
