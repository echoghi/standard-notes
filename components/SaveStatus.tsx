import { useStoreState } from 'easy-peasy';
import { useState } from 'react';
import { AiFillCheckCircle, AiOutlineInfoCircle } from 'react-icons/ai';
import { TiArrowSync } from 'react-icons/ti';
import { RiErrorWarningFill } from 'react-icons/ri';
import styled, { keyframes } from 'styled-components';

const Container = styled.button`
    cursor: pointer;
    position: relative;
    height: 24px;
    width: 24px;
    border-radius: 50%;
    background: transparent;
    border: none;
    padding: 0;

    &:active,
    &:focus {
        box-shadow: 0 0 0 2px var(--sn-stylekit-background-color), 0 0 0 4px var(--sn-stylekit-info-color);
    }
`;

const spin = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`;

const Bg = styled.div`
    border-radius: 50%;
    height: 24px;
    width: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const SyncBg = styled(Bg)`
    background: var(--sn-stylekit-contrast-background-color);
    animation: ${spin} 1s linear infinite;
`;

const DisabledBg = styled(Bg)`
    background: var(--sn-stylekit-contrast-background-color);
`;

const ErrorBg = styled(Bg)`
    background: var(--sn-stylekit-danger-color);
`;

const Tooltip = styled.div<{ active: boolean; error: boolean }>`
    display: ${(props: any) => (props.active ? 'block' : 'none')};
    position: absolute;
    top: 0;
    left: 0;
    border: 1px solid var(--sn-stylekit-border-color);
    border-radius: 0.25rem;
    text-align: left;
    padding: 0.375rem 0.75rem;
    line-height: 1.25rem;
    background-color: var(--sn-stylekit-background-color);
    color: ${(props: any) => (props.error ? 'var(--sn-stylekit-danger-color)' : 'var(--editor-title-input-color)')};
    transform: translate(-8rem, 1.5rem);
    user-select: none;
    min-width: max-content;
    z-index: 99;
`;

const TooltipTitle = styled.div`
    font-weight: 700;
    font-size: 0.875rem;
`;

const TooltipBody = styled.div`
    margin-top: 0.125rem;
    font-size: 13px;
`;

// prettier-ignore
const SaveStatus = () => {
    const loading = useStoreState((state: any) => state.loading);
    const error = useStoreState((state: any) => state.error);
    const [tooltipActive, setTooltipActive] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    // eslint-disable-next-line
    const tooltipText = loading ? 'Saving...' : error ? 'Sync Unreachable' : 'All Changes Saved';
    // eslint-disable-next-line
    const tooltipBodyText = loading ? '' : error ? 'changes saved offline' : '';
    const disabledText = 'Note Status updates are disabled';
    const disabledBodyText = 'click to enable';

    const toggleStatus = () => {
        setIsDisabled((prev) => !prev);
    };

    const onHoverStart = () => {
        if (!tooltipActive) setTooltipActive(true);
    };

    const onHoverEnd = () => {
        if (tooltipActive) setTooltipActive(false);
    };

    return (
        <Container onMouseEnter={onHoverStart} onMouseLeave={onHoverEnd} onClick={toggleStatus}>
            {loading && !error && !isDisabled && (
                <SyncBg>
                    <TiArrowSync size="15px" color="var(--sn-stylekit-sync-contrast-color)" />
                </SyncBg>
            )}
            {!loading && !error && !isDisabled && (
                <AiFillCheckCircle size="24px" color="var(--sn-stylekit-success-color)" />
            )}
            {!loading && error && !isDisabled && (
                <ErrorBg>
                    <RiErrorWarningFill size="15px" color="white" />
                </ErrorBg>
            )}
            {isDisabled && (
                <DisabledBg>
                    <AiOutlineInfoCircle size="15px" color="var(--sn-stylekit-passive-color-1)" />
                </DisabledBg>
            )}
            <Tooltip active={tooltipActive} error={error && !isDisabled}>
                <TooltipTitle>{isDisabled ? disabledText : tooltipText}</TooltipTitle>
                <TooltipBody>{isDisabled ? disabledBodyText : tooltipBodyText}</TooltipBody>
            </Tooltip>
        </Container>
    );
};

export default SaveStatus;
