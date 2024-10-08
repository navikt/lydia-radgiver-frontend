export const formaterProsent = (prosent?: {
    erMaskert: boolean;
    prosent: number;
}): string => {
    if (prosent?.erMaskert) {
        return "***";
    } else if (prosent?.prosent === undefined) {
        return "";
    } else {
        return (prosent?.prosent + " %")?.replace(".", ",");
    }
};
