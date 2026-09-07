import SakshistorikkMedDatahenting from "./SakshistorikkInnhold";
import VirksomhetshistorikkMedDatahenting from "./VirksomhetshistorikkInnhold";

interface SakshistorikkProps {
    orgnr: string;
}

export const SakshistorikkFane = ({ orgnr }: SakshistorikkProps) => {
    return <SakshistorikkMedDatahenting orgnr={orgnr} />;
};

export const NySakshistorikkFane = ({ orgnr }: SakshistorikkProps) => {
    return <VirksomhetshistorikkMedDatahenting orgnr={orgnr} />;
};
