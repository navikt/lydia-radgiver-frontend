import { Heading } from "@navikt/ds-react";
import SakshistorikkMedDatahenting from "./SakshistorikkInnhold";
import SakshistorikkMedSamarbeidOgDatahenting, {
    SakshistorikkMedSamarbeidInnholdProps,
    SakshistorikkMedSamarbeidInnhold,
} from "./SakshistorikkMedSamarbeidInnhold";
import innholdStyles from "./SakshistorikkInnhold/sykefraværshistorikkinnhold.module.scss";

interface SakshistorikkProps {
    orgnr: string;
}

export const SakshistorikkFane = ({ orgnr }: SakshistorikkProps) => {
    return <SakshistorikkMedDatahenting orgnr={orgnr} />;
};

export const NySakshistorikkFane = ({ orgnr }: SakshistorikkProps) => {
    return (
        <SakshistorikkMedSamarbeidOgDatahenting
            orgnr={orgnr}
            Innhold={NyFane}
        />
    );
};

const NyFane = ({
    sakshistorikk,
    lasterSakshistorikk,
    orgnr,
}: SakshistorikkMedSamarbeidInnholdProps) => {
    return (
        <div className={innholdStyles.samarbeidshistorikkfaneContainer}>
            <Heading level="3" size="large" spacing={true}>
                Historikk v2
            </Heading>
            <SakshistorikkMedSamarbeidInnhold
                sakshistorikk={sakshistorikk}
                lasterSakshistorikk={lasterSakshistorikk}
                orgnr={orgnr}
            />
        </div>
    );
};
