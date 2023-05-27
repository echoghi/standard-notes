import styled from 'styled-components';
import Link from 'next/link';

const SubText = styled.div`
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--sn-stylekit-passive-color-0);
  font-weight: 500;

  a {
    cursor: pointer;
    color: #086dd6;
  }
`;

const FormLink = ({ isSignIn }: { isSignIn: boolean }) => (
  <SubText>
    {!isSignIn ? (
      <Link href="/signin">Sign in instead</Link>
    ) : (
      <>
        Don&apos;t have an account yet? <Link href="/signup">Create account</Link>
      </>
    )}
  </SubText>
);

export default FormLink;
