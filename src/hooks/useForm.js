import { useState } from 'react';

export const useForm = (initialState) => {
    const [formValues, setFormValues] = useState(initialState);

    const onChangeHandler = (e) => {
        setFormValues(state => ({ ...state, [e.target.name]: e.target.value }));
    };

    return { 
        formValues, 
        onChangeHandler 
    };
};