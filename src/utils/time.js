export const checkRecent = (isoString, windowMs = 24 * 60 * 60 * 1000) => {
    const ts = new Date(isoString).getTime();
    return Date.now() - ts < windowMs;
};
