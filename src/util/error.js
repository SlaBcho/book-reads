export const errors = (setError, setErrorMsg, message) => {
    setError(true);
    setErrorMsg(message);
    setTimeout(() => {
        setError(false);
    }, 2000);
};
