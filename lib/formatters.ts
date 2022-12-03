export const formatDate = (date: Date) => {
    return new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric'
    });
};
