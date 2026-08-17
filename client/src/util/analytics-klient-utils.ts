export const PROXY_PLASSHOLDER = {
    ORGNR: "[PROXY-ORG-NUMBER]",
    SAKSNR: "[PROXY-SAK-NUMBER]",
    SAMARBEID_ID: "[PROXY-SAMARBEID-ID]",
} as const;

const maskeringsRegler: { mønster: RegExp; erstatning: string }[] = [
    {
        mønster: /\d{9}/g,
        erstatning: `${PROXY_PLASSHOLDER.ORGNR}`,
    },
    {
        mønster: /(\/sak\/)[^/?#]+/g,
        erstatning: `$1${PROXY_PLASSHOLDER.SAKSNR}`,
    },
    {
        mønster: /(\/samarbeid\/)[^/?#]+/g,
        erstatning: `$1${PROXY_PLASSHOLDER.SAMARBEID_ID}`,
    },
];

export const maskerSensitiveVerdierIUrl = (url: string | undefined): string => {
    if (!url) return "";

    if (url.length <= 8) return url;

    return maskeringsRegler.reduce(
        (it, { mønster, erstatning }) => it.replace(mønster, erstatning),
        url,
    );
};
