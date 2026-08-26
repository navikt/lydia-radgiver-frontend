import { Heading } from "@navikt/ds-react";
import SakshistorikkMedDatahenting from "./SakshistorikkInnhold";
import VirksomhetshistorikkMedDatahenting, {
    VirksomhetshistorikkWrapperProps,
    VirksomhetshistorikkInnhold,
} from "./VirksomhetshistorikkInnhold";
import innholdStyles from "./SakshistorikkInnhold/sykefraværshistorikkinnhold.module.scss";

interface SakshistorikkProps {
    orgnr: string;
}

export const SakshistorikkFane = ({ orgnr }: SakshistorikkProps) => {
    return <SakshistorikkMedDatahenting orgnr={orgnr} />;
};

export const NySakshistorikkFane = ({ orgnr }: SakshistorikkProps) => {
    return <VirksomhetshistorikkMedDatahenting orgnr={orgnr} />;
};

export const VirksomhetshistorikkFane = ({
    virksomhetshistorikk,
    lasterVirksomhetshistorikk,
    orgnr,
}: VirksomhetshistorikkWrapperProps) => {
    return (
        <div className={innholdStyles.samarbeidshistorikkfaneContainer}>
            <Heading level="3" size="large" spacing={true}>
                Historikk v2
            </Heading>
            <VirksomhetshistorikkInnhold
                virksomhetshistorikk={virksomhetshistorikk}
                lasterVirksomhetshistorikk={lasterVirksomhetshistorikk}
                orgnr={orgnr}
            />
        </div>
    );
};
