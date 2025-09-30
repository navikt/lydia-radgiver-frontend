import SakshistorikkMedDatahenting from "./SakshistorikkInnhold";

interface SakshistorikkProps {
    orgnr: string;
}

export const SakshistorikkFane = ({
    orgnr,
}: SakshistorikkProps) => {
    return (
        <SakshistorikkMedDatahenting orgnr={orgnr} />
    )
};
