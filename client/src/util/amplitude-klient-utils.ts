
export const maskerOrgnr = (url: string | undefined): string => {
    if (url) {
        const regex = /\d{9}/g;
        return url.length > 8 ?
            url.replace(regex, '*********')
            : url;
    } else {
        return '';
    }
}
