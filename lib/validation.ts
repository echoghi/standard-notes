import * as Yup from 'yup';

export const getValidationSchema = (isSignIn: boolean) => {
    if (isSignIn) {
        return Yup.object().shape({
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().required('Password is required')
        });
    } else {
        return Yup.object().shape({
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().required('Password is required'),
            confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
        });
    }
};
