import { Formik, Form, Field, FormikHelpers } from 'formik';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { getValidationSchema } from '../lib/validation';
import { auth, matchUser } from '../lib/mutations';
import { encryptPassword, generateUuid } from '../lib/encryption';
import { setLocalStorage } from '../lib/storage';

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
    padding: 3rem;
    border: 1px solid var(--sn-stylekit-border-color);
    border-radius: 0.25rem;
    min-width: 450px;
    background-color: var(--sn-stylekit-background-color);

    input {
        font-size: 0.875rem;
        line-height: 1.25rem;
        padding: 0.625rem 0.75rem;
        border: 1px solid var(--sn-stylekit-border-color);
        width: 100%;
        border-radius: 0.25rem;
        height: 100%;
        outline: none;

        &:focus {
            border: none;
            outline: none;
            box-shadow: 0 0 0 1px var(--sn-stylekit-info-color);
        }
    }
`;

const Header = styled.h1`
    margin-top: 1.25rem;
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 2rem;
`;

const SubHead = styled.div`
    font-weight: 500;
    font-size: 0.875rem;
    line-height: 1.25rem;
    margin-bottom: 1.25rem;
`;
const InputContainer = styled.div`
    font-weight: 500;
    font-size: 0.875rem;
    line-height: 1.25rem;
    margin-bottom: 1.25rem;
`;

const Button = styled.button`
    font-weight: 700;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: var(--sn-stylekit-info-contrast-color);
    padding: 0.375rem 1rem;
    background-color: var(--sn-stylekit-info-color);
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

const Label = styled.label`
    color: var(--sn-stylekit-neutral-color);
    display: none;
`;

const SubText = styled.div`
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: var(--sn-stylekit-passive-color-1);
    font-weight: 500;

    a {
        cursor: pointer;
        color: var(--sn-stylekit-info-color);
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

const AuthForm = ({ type }) => {
    const isSignIn = type === 'signin';
    const buttonText = isSignIn ? 'Sign In' : 'Create account';
    const router = useRouter();

    const initialValues: Values = isSignIn
        ? {
              email: '',
              password: ''
          }
        : {
              email: '',
              password: '',
              confirmPassword: ''
          };

    const validationSchema = getValidationSchema(isSignIn);

    const onSubmit = async (values: Values, { setSubmitting, resetForm, setStatus }: FormikHelpers<Values>) => {
        const { email, password } = values;

        setStatus('');

        let user;
        let encrypted;
        let id;

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

            setLocalStorage('pk', encrypted.password);
        } catch (err) {
            if (isSignIn) {
                setStatus('Sign in failed');
            } else {
                setStatus('Sign up failed');
            }
        }

        if (user) {
            resetForm();
            router.push('/');
        } else {
            if (isSignIn) {
                setStatus('Incorrect email or password');
            } else {
                console.log(user);
                setStatus('Account already exists');
            }
        }
    };

    return (
        <Container>
            <SignInFormContainer>
                <svg width="148" height="25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0 5c0-2.761 2.242-5 5.008-5h15.024a5.004 5.004 0 0 1 5.008 5v15c0 2.761-2.242 5-5.008 5H5.008A5.004 5.004 0 0 1 0 20V5Zm5.008-2.813h15.024A2.815 2.815 0 0 1 22.849 5v15a2.815 2.815 0 0 1-2.817 2.813H5.008A2.815 2.815 0 0 1 2.191 20V5a2.815 2.815 0 0 1 2.817-2.813Zm10.157 9.686v5.854h2.187v-5.854c0-2.645-2.203-4.79-4.92-4.79s-4.92 2.145-4.92 4.79v5.854h2.187v-5.854c0-1.47 1.223-2.661 2.733-2.661s2.733 1.191 2.733 2.66Zm57.436 5.848h1.834V6h-1.93v5.225h-.049a3.018 3.018 0 0 0-.37-.388 2.74 2.74 0 0 0-.547-.372 3.066 3.066 0 0 0-.724-.279 3.344 3.344 0 0 0-.95-.124c-.547 0-1.05.103-1.512.31-.461.197-.858.47-1.19.822-.333.351-.59.765-.773 1.24a4.249 4.249 0 0 0-.274 1.535c0 .548.086 1.065.258 1.55.182.476.434.894.756 1.256.333.352.73.636 1.19.853.473.207 1.004.31 1.594.31.547 0 1.056-.114 1.528-.341a2.585 2.585 0 0 0 1.127-.992h.032v1.116Zm-4.393-2.884a3.038 3.038 0 0 1-.129-.868c0-.29.043-.574.13-.853.096-.29.235-.547.417-.775.183-.227.413-.408.692-.543.28-.144.606-.217.982-.217.354 0 .67.073.95.217.278.145.514.331.707.559.204.227.354.485.45.775.108.29.162.579.162.868 0 .29-.054.579-.161.868-.097.28-.247.532-.45.76-.194.227-.43.413-.709.558a2.16 2.16 0 0 1-.95.202c-.375 0-.702-.073-.98-.218a2.13 2.13 0 0 1-.693-.558 2.484 2.484 0 0 1-.418-.775ZM39.662 9.04c-.215-.269-.52-.491-.917-.667a2.681 2.681 0 0 0-1.175-.279c-.236 0-.472.031-.708.093-.236.052-.45.14-.644.264a1.456 1.456 0 0 0-.483.465 1.248 1.248 0 0 0-.176.682c0 .248.053.46.16.636.108.175.252.325.435.45.193.123.424.232.692.325.268.093.563.186.885.279.364.113.74.243 1.126.387.397.145.757.336 1.078.574.333.238.601.538.805.9.214.361.322.81.322 1.348 0 .59-.113 1.106-.338 1.55a3.227 3.227 0 0 1-.901 1.086c-.376.29-.816.506-1.32.65A5.748 5.748 0 0 1 36.91 18c-.74 0-1.464-.13-2.172-.388-.708-.268-1.287-.661-1.738-1.178l1.448-1.302a2.9 2.9 0 0 0 1.11.883c.473.218.934.326 1.384.326.236 0 .478-.026.724-.077.247-.063.467-.16.66-.295.204-.134.365-.3.483-.496.129-.207.193-.46.193-.76 0-.29-.07-.527-.21-.713a1.72 1.72 0 0 0-.562-.496 3.849 3.849 0 0 0-.837-.372l-1.014-.326a10.304 10.304 0 0 1-1.03-.372 3.563 3.563 0 0 1-.933-.573 2.869 2.869 0 0 1-.66-.869c-.171-.351-.257-.785-.257-1.302 0-.558.118-1.039.354-1.442.247-.403.563-.734.95-.992a4.176 4.176 0 0 1 1.335-.59 5.912 5.912 0 0 1 1.528-.2c.58 0 1.164.097 1.754.294.601.196 1.121.49 1.561.883l-1.32 1.396Zm2.13 1.24v1.488h1.351v3.473c0 .362.032.703.097 1.024.075.31.204.589.386.837.193.238.45.429.772.573.322.135.74.202 1.255.202.215 0 .44-.02.676-.062.236-.031.44-.078.612-.14l-.065-1.457a2.026 2.026 0 0 1-.402.124c-.15.02-.29.031-.418.031-.43 0-.708-.108-.837-.325-.118-.218-.177-.491-.177-.822v-3.458h1.93V10.28h-1.93V8.124h-1.899v2.155h-1.352Zm11.325 6.496h.049v.946h1.802v-4.527c0-.372-.054-.744-.161-1.117a2.49 2.49 0 0 0-.531-1.007c-.258-.3-.612-.543-1.062-.729-.44-.186-1.003-.279-1.69-.279a5.43 5.43 0 0 0-1.754.295 4.406 4.406 0 0 0-1.512.883l.997 1.132c.247-.238.558-.44.934-.605a2.885 2.885 0 0 1 1.174-.248c.483 0 .896.114 1.24.341.353.218.53.559.53 1.024v.186c-.6 0-1.217.03-1.85.093a7.09 7.09 0 0 0-1.706.34c-.515.177-.938.43-1.271.76-.322.331-.483.776-.483 1.334 0 .434.091.8.274 1.1.193.29.429.528.708.714.29.176.6.3.933.372.343.083.67.124.982.124.547 0 1.035-.103 1.464-.31.429-.217.74-.491.933-.822Zm-.418-2.45h.434v.264c0 .59-.171 1.054-.515 1.396-.343.34-.847.511-1.512.511-.161 0-.322-.015-.483-.046a1.435 1.435 0 0 1-.434-.155 1.03 1.03 0 0 1-.322-.28.852.852 0 0 1-.113-.45c0-.278.097-.495.29-.65.193-.166.434-.29.724-.372.29-.093.606-.15.95-.17.342-.032.67-.047.98-.047Zm6.353-4.046h-1.835v7.442h1.931v-4.093c0-.248.038-.491.113-.729.075-.248.182-.465.322-.65.15-.187.338-.337.563-.45.225-.125.493-.187.804-.187.311 0 .558.062.74.186.194.124.344.285.451.481.108.186.177.398.21.636.032.238.048.465.048.682v4.124h1.93V13.07c0-.383-.053-.755-.16-1.117a2.628 2.628 0 0 0-.515-.96 2.374 2.374 0 0 0-.885-.667c-.354-.176-.783-.264-1.288-.264-.579 0-1.083.145-1.512.434-.419.28-.714.605-.885.977h-.032v-1.194Zm22.524 6.496h-.048c-.193.33-.504.605-.933.822-.43.207-.917.31-1.465.31-.31 0-.638-.041-.981-.124a3.026 3.026 0 0 1-.933-.372 2.543 2.543 0 0 1-.708-.713c-.183-.3-.274-.667-.274-1.101 0-.558.161-1.003.483-1.333.332-.331.756-.584 1.271-.76a7.089 7.089 0 0 1 1.706-.341c.633-.062 1.25-.093 1.85-.093v-.186c0-.465-.177-.806-.53-1.024-.344-.227-.757-.34-1.24-.34-.407 0-.799.082-1.174.247a3.174 3.174 0 0 0-.934.605l-.997-1.132c.44-.393.944-.687 1.512-.883a5.43 5.43 0 0 1 1.754-.295c.687 0 1.25.093 1.69.28.45.185.804.428 1.062.728.257.3.434.635.53 1.008.108.372.162.744.162 1.116v4.527h-1.803v-.946Zm-.032-2.45h-.434c-.311 0-.638.016-.982.047-.343.02-.66.078-.95.17-.289.083-.53.207-.723.373-.193.155-.29.372-.29.65 0 .177.038.327.113.45.085.114.193.207.322.28.128.072.273.124.434.155.16.03.322.046.483.046.665 0 1.169-.17 1.512-.511.344-.342.515-.807.515-1.396v-.263Zm4.084-4.046h1.85v1.24h.033c.214-.434.515-.785.901-1.054s.837-.403 1.352-.403c.075 0 .155.005.241.016.086 0 .16.01.225.03v1.706a2.693 2.693 0 0 0-.338-.062 2.16 2.16 0 0 0-.257-.016c-.44 0-.794.078-1.062.233a1.905 1.905 0 0 0-.933 1.225c-.054.227-.08.408-.08.542v3.985h-1.932v-7.442Zm13.431 7.442h-1.834v-1.116h-.032a2.585 2.585 0 0 1-1.127.992 3.475 3.475 0 0 1-1.528.341c-.59 0-1.121-.103-1.593-.31a3.915 3.915 0 0 1-1.191-.853 4.057 4.057 0 0 1-.757-1.256 4.62 4.62 0 0 1-.257-1.55c0-.548.091-1.06.274-1.535.182-.475.44-.889.772-1.24.332-.352.73-.626 1.19-.822.462-.207.966-.31 1.513-.31.354 0 .67.041.95.124.279.072.52.165.724.28.214.113.397.237.547.371.15.135.273.264.37.388h.048V6h1.931v11.72Zm-6.356-3.752c0 .29.043.579.129.868.096.29.236.548.418.775.183.228.413.414.692.559.28.144.606.217.982.217.354 0 .67-.068.95-.202.278-.145.514-.33.707-.558.204-.228.354-.48.45-.76.108-.29.162-.579.162-.868 0-.29-.054-.579-.161-.868a2.186 2.186 0 0 0-.45-.775 2.318 2.318 0 0 0-.709-.559 2.03 2.03 0 0 0-.95-.217c-.375 0-.702.073-.98.217-.28.135-.51.316-.693.543a2.482 2.482 0 0 0-.418.775 2.886 2.886 0 0 0-.129.853Zm12.821-7.225h2.688l5.294 8.217h.032V6.744h2.027v10.977h-2.574l-5.407-8.48h-.032v8.48h-2.028V6.744Zm12.009 7.225c0-.59.107-1.121.322-1.597.225-.486.525-.9.901-1.24.375-.341.82-.605 1.335-.79a4.793 4.793 0 0 1 1.642-.28c.579 0 1.126.093 1.641.28.515.185.96.449 1.335.79.376.34.671.754.885 1.24.226.476.338 1.008.338 1.597 0 .59-.112 1.127-.338 1.612a3.788 3.788 0 0 1-.885 1.256c-.375.341-.82.61-1.335.806a4.566 4.566 0 0 1-1.641.295c-.58 0-1.127-.098-1.642-.295a4.166 4.166 0 0 1-1.335-.806 3.998 3.998 0 0 1-.901-1.256 3.94 3.94 0 0 1-.322-1.612Zm1.963 0c0 .29.043.579.129.868.096.29.236.548.418.775.182.228.413.414.692.559.279.144.611.217.998.217.386 0 .718-.073.997-.218.279-.144.51-.33.692-.558.183-.227.317-.485.402-.775.097-.29.145-.579.145-.868 0-.29-.048-.574-.145-.853a2.221 2.221 0 0 0-.402-.775 1.962 1.962 0 0 0-.692-.543c-.279-.144-.611-.217-.997-.217-.387 0-.719.073-.998.217-.279.135-.51.316-.692.543a2.479 2.479 0 0 0-.418.775 2.88 2.88 0 0 0-.129.853Zm7.198-2.202V10.28h1.352V8.124h1.899v2.155h1.931v1.488h-1.931v3.458c0 .33.059.604.177.822.128.217.407.325.836.325.129 0 .269-.01.419-.03.15-.032.284-.073.402-.125l.064 1.457a2.93 2.93 0 0 1-.611.14 3.922 3.922 0 0 1-.676.062c-.515 0-.933-.067-1.255-.202a2.06 2.06 0 0 1-.772-.573 2.308 2.308 0 0 1-.386-.837 5.142 5.142 0 0 1-.097-1.024v-3.473h-1.352Zm13.949 2.326v.248c0 .083-.006.166-.016.248h-5.874c.022.269.092.517.21.744.128.217.295.409.498.574.204.155.435.279.692.372.258.093.526.14.805.14.483 0 .89-.083 1.223-.248.332-.176.606-.414.821-.714l1.287.993c-.762.992-1.867 1.488-3.315 1.488a5.002 5.002 0 0 1-1.657-.264 4.141 4.141 0 0 1-1.32-.775 3.62 3.62 0 0 1-.869-1.21c-.204-.485-.305-1.033-.305-1.643 0-.599.101-1.142.305-1.627.215-.497.504-.915.869-1.256.365-.352.794-.62 1.287-.806a4.443 4.443 0 0 1 1.626-.295c.536 0 1.03.088 1.48.264.461.165.858.418 1.191.76.332.33.59.749.772 1.255.193.496.29 1.08.29 1.752Zm-1.931-.837c0-.238-.038-.465-.113-.682a1.445 1.445 0 0 0-.901-.962 1.912 1.912 0 0 0-.804-.155c-.58 0-1.073.17-1.481.512-.397.33-.617.76-.66 1.287h3.959Zm8.033-.992a2.136 2.136 0 0 0-.708-.559 2.003 2.003 0 0 0-.982-.248c-.311 0-.595.062-.853.186a.64.64 0 0 0-.386.62c0 .29.14.497.419.62.289.114.708.233 1.255.357.289.062.579.145.869.248.3.104.568.243.804.419.247.165.445.377.596.636.15.248.225.553.225.914 0 .455-.091.843-.274 1.163-.171.31-.407.563-.708.76a2.848 2.848 0 0 1-1.029.419c-.387.093-.789.139-1.207.139a5.092 5.092 0 0 1-1.754-.31 3.79 3.79 0 0 1-1.416-.915l1.271-1.147c.214.269.493.49.837.667.343.175.724.263 1.142.263.14 0 .279-.015.418-.046.151-.031.285-.078.403-.14a.875.875 0 0 0 .306-.279.744.744 0 0 0 .112-.419c0-.31-.15-.532-.45-.666-.29-.135-.73-.269-1.32-.403a7.95 7.95 0 0 1-.853-.233 3.2 3.2 0 0 1-.724-.388 1.904 1.904 0 0 1-.515-.604c-.128-.238-.193-.532-.193-.884 0-.413.086-.77.258-1.07.182-.3.418-.542.708-.728.289-.197.616-.341.981-.434.365-.094.74-.14 1.127-.14.557 0 1.099.093 1.625.28.536.185.96.47 1.271.852l-1.255 1.07Z"
                        fill="#086DD6"
                    ></path>
                </svg>
                <Header>{isSignIn ? 'Sign in' : 'Create your free account'}</Header>
                <SubHead>to continue to Standard Notes</SubHead>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                    validateOnBlur={false}
                    validateOnChange={false}
                >
                    {({ isSubmitting, errors, touched, status }) => (
                        <Form>
                            <InputContainer>
                                <Label htmlFor="email">Email:</Label>
                                <Field id="email" name="email" type="email" placeholder="Email" />
                                {errors.email && touched.email ? <ErrorMsg>{errors.email}</ErrorMsg> : null}
                            </InputContainer>
                            <InputContainer>
                                <Label htmlFor="password">Password:</Label>
                                <Field id="password" name="password" type="password" placeholder="Password" />
                                {errors.password && touched.password && !status ? (
                                    <ErrorMsg>{errors.password}</ErrorMsg>
                                ) : null}
                            </InputContainer>
                            {!isSignIn && (
                                <>
                                    <InputContainer>
                                        <Label htmlFor="password">Repeat Password:</Label>
                                        <Field
                                            id="confirm-password"
                                            name="confirmPassword"
                                            type="password"
                                            placeholder="Repeat Password"
                                        />
                                    </InputContainer>
                                    {errors.confirmPassword && touched.confirmPassword && !status ? (
                                        <ErrorMsg>{errors.confirmPassword}</ErrorMsg>
                                    ) : null}
                                </>
                            )}
                            {status ? <ErrorMsg>{status}</ErrorMsg> : null}
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Signing in...' : buttonText}
                            </Button>
                        </Form>
                    )}
                </Formik>
                {!isSignIn && (
                    <SubText>
                        <Link href={`/signin`}>Sign in instead</Link>
                    </SubText>
                )}
                {isSignIn && (
                    <SubText>
                        Don't have an account yet? <Link href={`/signup`}>Create account</Link>
                    </SubText>
                )}
            </SignInFormContainer>
        </Container>
    );
};

export default AuthForm;
