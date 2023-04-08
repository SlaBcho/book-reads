import { useState } from 'react';

export const useErrors = () => {
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onErrorHandler = (message) => {
        setError(true);
        setErrorMessage(message);
        setTimeout(() => {
            setError(false);
        }, 2000);
    };

    return {
        error, errorMessage, onErrorHandler
    };
};
