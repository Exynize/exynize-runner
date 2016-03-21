export default err => JSON.stringify(
    Object.getOwnPropertyNames(err).reduce((acc, key) => ({
        ...acc,
        [key]: err[key],
    }), {})
);
