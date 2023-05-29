import { Formik, Form, FormikHelpers } from 'formik';
import styled from 'styled-components';
import { useLocalStorage } from '@rennalabs/hooks';
import { useRouter } from 'next/router';

import {
  encryptPassword,
  generateUuid,
  getValidationSchema,
  matchUser,
  auth,
} from '../../services';
import { breakpoints } from '../../styles';
import InputField from './InputField';
import FormHeader from './FormHeader';
import FormLink from './FormLink';

const Container = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: var(--sn-stylekit-passive-color-super-light);
`;

const SignInFormContainer = styled.div`
  width: fit-content;
  margin: 0 auto;
  padding: 2rem;
  border: 1px solid #dfe1e4;
  border-radius: 0.25rem;
  background-color: #fff;

  input {
    font-size: 16px;
    line-height: 1.25rem;
    padding: 0.625rem 0.75rem;
    border: 1px solid #dfe1e4;
    width: 100%;
    border-radius: 0.25rem;
    height: 100%;
    outline: none;

    &:focus {
      outline: none;
      box-shadow: 0 0 0 1px #086dd6;
    }
  }

  @media (min-width: ${breakpoints.lg}px) {
    min-width: 450px;
    padding: 3rem;

    input {
      font-size: 0.875rem;
    }
  }
`;

const Button = styled.button`
  font-weight: 700;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #fff;
  padding: 0.375rem 1rem;
  background-color: #086dd6;
  border-radius: 0.25rem;
  cursor: pointer;
  min-width: 6rem;
  width: fit-content;
  margin-bottom: 1.25rem;
  border: none;
  outline: none;

  &:hover {
    filter: brightness(1.25);
  }

  &:disabled {
    cursor: not-allowed;
    filter: brightness(0.75);
  }
`;

const ErrorMsg = styled.div`
  color: var(--sn-stylekit-danger-color);
  margin-bottom: 1rem;
  font-weight: 400;
  font-size: 0.85rem;
`;

interface Values {
  email: string;
  password: string;
  confirmPassword?: string;
}

const AuthForm = ({ type }: { type: 'signin' | 'signup' }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pk, setLocalStorage] = useLocalStorage('pk', '');
  const isSignIn = type === 'signin';
  const buttonText = isSignIn ? 'Sign In' : 'Create account';
  const router = useRouter();

  const initialValues: Values = isSignIn
    ? {
        email: '',
        password: '',
      }
    : {
        email: '',
        password: '',
        confirmPassword: '',
      };

  const validationSchema = getValidationSchema(isSignIn);

  const onSubmit = async (values: Values, { resetForm, setStatus }: FormikHelpers<Values>) => {
    const { email, password } = values;

    setStatus('');

    let user;
    let encrypted;
    let id: string;

    try {
      if (isSignIn) {
        const res = await matchUser({ email });

        if (res.error) {
          setStatus('Account does not exist');
          return;
        }

        id = res.id;
        encrypted = encryptPassword(password, res.salt);
      } else {
        id = generateUuid();
        encrypted = encryptPassword(password);
      }

      user = await auth(type, { email, proof: encrypted.proof, salt: encrypted.salt, id });

      setLocalStorage(encrypted.password);
    } catch (err) {
      if (isSignIn) {
        setStatus('Sign in failed');
      } else {
        setStatus('Sign up failed');
      }
    }

    if (!user?.error) {
      resetForm();
      router.push('/');
    } else if (isSignIn) {
      setStatus('Incorrect email or password');
    } else {
      setStatus('Account already exists');
    }
  };

  return (
    <Container>
      <SignInFormContainer>
        <FormHeader isSignIn={isSignIn} />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          validateOnBlur={false}
          validateOnChange={false}
        >
          {({ isSubmitting, errors, touched, status }) => (
            <Form>
              <InputField
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                label="Email"
                isError={!!errors.email && !!touched.email}
                errorMessage={errors.email}
              />
              <InputField
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                label="Password"
                isError={!!errors.password && !!touched.password && !status}
                errorMessage={errors.password}
              />
              {!isSignIn && (
                <InputField
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  label="Confirm Password"
                  isError={!!errors.confirmPassword && !!touched.confirmPassword && !status}
                  errorMessage={errors.confirmPassword}
                />
              )}
              {status ? <ErrorMsg>{status}</ErrorMsg> : null}
              <Button type="submit" disabled={isSubmitting} id="login-button">
                {isSubmitting ? 'Signing in...' : buttonText}
              </Button>
            </Form>
          )}
        </Formik>
        <FormLink isSignIn={isSignIn} />
      </SignInFormContainer>
    </Container>
  );
};

export default AuthForm;
