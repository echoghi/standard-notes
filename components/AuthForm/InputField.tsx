import { Field } from 'formik';
import styled from 'styled-components';

const InputContainer = styled.div`
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  margin-bottom: 1.25rem;
`;

const Label = styled.label`
  color: #72767e;
  display: none;
`;

const ErrorMsg = styled.div`
  color: var(--sn-stylekit-danger-color);
  margin-bottom: 1rem;
  font-weight: 400;
  font-size: 0.85rem;
`;

interface InputFieldProps {
  id: string;
  name: string;
  type: string;
  placeholder: string;
  isError: boolean;
  errorMessage: string | undefined;
  label: string;
}

const InputField = ({
  id,
  name,
  type,
  placeholder,
  isError,
  errorMessage,
  label,
}: InputFieldProps) => (
  <InputContainer>
    <Label htmlFor={name}>{label}:</Label>
    <Field id={id} name={name} type={type} placeholder={placeholder} />
    {isError ? <ErrorMsg>{errorMessage}</ErrorMsg> : null}
  </InputContainer>
);

export default InputField;
