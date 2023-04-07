import { useState } from 'react';

export const useErrors = () => {
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const onErrorHandler = (message) => {
        setError(true);
        setErrorMsg(message);
        setTimeout(() => {
            setError(false);
        }, 2000);
    };

    return {
        error, errorMsg, onErrorHandler
    };
};
