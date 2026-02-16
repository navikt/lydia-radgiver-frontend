import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Loader } from "@navikt/ds-react";
import { statiskeSidetitler, useTittel } from "../../../util/useTittel";
import { loggSideLastet } from "../../../util/analytics-klient";
import { VirksomhetsVisning } from "./VirksomhetsVisning";
import { useHentVirksomhetNyFlyt } from "../../../api/lydia-api/nyFlyt";

export const NyVirksomhetsside = () => {
    const { oppdaterTittel } = useTittel(statiskeSidetitler.virksomhetsside);
    const { orgnummer } = useParams();

    const { data: virksomhetsinformasjon, loading: lasterVirksomhet } =
        useHentVirksomhetNyFlyt(orgnummer);

    useEffect(() => {
        if (virksomhetsinformasjon) {
            oppdaterTittel(`Fia - ${virksomhetsinformasjon.navn}`);
            loggSideLastet("Virksomhetsside");
        }
    }, [virksomhetsinformasjon?.navn]);

    if (lasterVirksomhet) {
        return <LasterVirksomhet />;
    }

    if (virksomhetsinformasjon) {
        return <VirksomhetsVisning virksomhet={virksomhetsinformasjon} />;
    } else {
        return <p>Kunne ikke laste ned informasjon om virksomhet</p>;
    }
};

const LasterVirksomhet = () => (
    <Loader
        title={"Laster inn virksomhet"}
        variant={"interaction"}
        size={"xlarge"}
    />
);
