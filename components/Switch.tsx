import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const SwitchContainer = styled.label`
    position: relative;
    display: flex;
    cursor: pointer;
    justify-content: space-between;
`;

const SwitchContent = styled.span<{ checked: boolean }>`
    background-color: ${(props: any) =>
        props.checked ? 'var(--sn-stylekit-info-color)' : 'var(--sn-stylekit-neutral-color)'};
    border-color: rgba(0, 0, 0, 0);
    border-style: solid;
    border-width: 2px;
    border-radius: 9999px;
    cursor: pointer;
    width: 1.75rem;
    height: 0.875rem;
    display: inline-block;
    box-sizing: content-box;
    position: relative;
`;

const SwitchInput = styled.input`
    outline: 2px solid rgba(0, 0, 0, 0);
    outline-offset: 2px;
    box-shadow: var(--tw-ring-offset-shadow, 0 0 rgba(0, 0, 0, 0)), var(--tw-ring-shadow, 0 0 rgba(0, 0, 0, 0)),
        var(--tw-shadow);
    opacity: 0;
    padding: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
    margin: 0;
    left: 0;
    top: 0;
    position: absolute;
`;

const SwitchSlider = styled.span<{ checked: boolean }>`
    transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
    transition-duration: 150ms;
    transition-property: transform;
    background-color: var(--sn-stylekit-background-color);
    border-radius: 9999px;
    height: 0.875rem;
    width: 0.875rem;
    display: block;
    left: 2px;
    top: 50%;

    transform: ${(props: any) =>
        !props.checked
            ? 'translate(var(--tw-translate-x-on), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))'
            : 'translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))'};
`;

const Switch = ({ value, onChange = () => {}, disabled, ...rest }: any) => {
    const [isChecked, setIsChecked] = useState(value);

    useEffect(() => {
        setIsChecked(value);
    }, [value]);

    // prettier-ignore
    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = event.target;
        setIsChecked(checked);
        onChange(checked);
    };

    return (
        <SwitchContainer disabled={disabled} {...rest}>
            <SwitchContent checked={isChecked}>
                <SwitchInput type="checkbox" checked={isChecked} onChange={handleOnChange} disabled={disabled} />
                <SwitchSlider checked={isChecked} />
            </SwitchContent>
        </SwitchContainer>
    );
};

export default Switch;
