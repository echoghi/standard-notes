import styled from 'styled-components';
import { RiAccountCircleFill } from 'react-icons/ri';
import { MdOutlinePalette } from 'react-icons/md';

const Container = styled.footer`
    position: relative;
    grid-column-start: 1;
    grid-column-end: 4;
    display: flex;
    padding: 0 0.75rem;
    color: var(--sn-stylekit-contrast-foreground-color);
    background-color: var(--sn-stylekit-contrast-background-color);
    border-top: 1px solid var(--sn-stylekit-border-color);
    justify-content: space-between;
    align-items: center;
    height: 2rem;
    width: 100%;
    user-select: none;
    z-index: var(--z-index-footer-bar);
`;

const Group = styled.div`
    display: flex;
    height: 100%;
`;

const Status = styled.div`
    display: flex;
    align-items: center;
    font-weight: 700;
    font-size: 0.75rem;
    line-height: 1rem;
    color: var(--sn-stylekit-contrast-foreground-color);
`;

const Button = styled.button`
    border-radius: 9999px;
    justify-content: center;
    align-items: center;
    display: flex;
    cursor: pointer;
    width: 2rem;
    border: none;
    height: 100%;
    background-color: transparent;

    svg:hover {
        fill: var(--sn-stylekit-info-color);
    }

    &:active {
        box-shadow: 0 0 0 2px var(--sn-stylekit-background-color), 0 0 0 4px var(--sn-stylekit-info-color);
    }

    &:focus {
        background-color: var(--sn-stylekit-border-color);
    }
`;

const AuthBar = () => {
    return (
        <Container>
            <Group>
                <Button>
                    <RiAccountCircleFill size="20px" color="var(--sn-stylekit-neutral-color)" />
                </Button>
                <Button>
                    <MdOutlinePalette size="20px" color="var(--sn-stylekit-neutral-color)" />
                </Button>
            </Group>
            <Group>
                <Status>Offline</Status>
            </Group>
        </Container>
    );
};

export default AuthBar;
