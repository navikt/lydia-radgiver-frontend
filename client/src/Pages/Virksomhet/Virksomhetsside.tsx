import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Loader } from "@navikt/ds-react";
import { useHentVirksomhetsinformasjon } from "../../api/lydia-api";
import { VirksomhetsVisning } from "./VirksomhetsVisning";
import { statiskeSidetitler, useTittel } from "../../util/useTittel";

const Virksomhetsside = () => {
    const {oppdaterTittel} = useTittel(statiskeSidetitler.virksomhetsside)
    const {orgnummer} = useParams();

    const {
        data: virksomhetsinformasjon,
        loading: lasterVirksomhet
    } = useHentVirksomhetsinformasjon(orgnummer);

    useEffect(() => {
        if (virksomhetsinformasjon)
            oppdaterTittel(`Fia - ${virksomhetsinformasjon.navn}`)
    }, [virksomhetsinformasjon?.navn])

    if (lasterVirksomhet) {
        return <LasterVirksomhet />
    }

    if (virksomhetsinformasjon) {
        return <VirksomhetsVisning
            virksomhet={virksomhetsinformasjon}
        />
    } else {
        return <p>Kunne ikke laste ned informasjon om virksomhet</p>
    }
};

const LasterVirksomhet = () => <Loader title={"Laster inn virksomhet"} variant={"interaction"} size={"xlarge"} />

export default Virksomhetsside;
