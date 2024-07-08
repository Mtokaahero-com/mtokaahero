import * as yup from 'yup';


export const schemaForms = yup.object().shape({
    firstName: yup.string().required('First name is required').matches(/^[a-zA-Z]+$/, 'First name must be a string'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phone: yup.string().required('Phone number is required').matches(/^[0-9]+$/, 'Phone number must be a number'),
    address: yup.string().required('Address is required'),
    password: yup.string().required('Password is required'),
});


export const schemaFormsLogin = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().required('Password is required'),
});