import {useContext, useEffect} from "react";
import { useParams } from "react-router-dom";
import { Loader } from "@navikt/ds-react";
import {
    useHentSakerForVirksomhet,
    useHentVirksomhetsinformasjon
} from "../../api/lydia-api";
import { VirksomhetsVisning } from "./VirksomhetsVisning";
import { IASak } from "../../domenetyper/domenetyper";
import { statiskeSidetitler, TittelContext } from "../Prioritering/TittelContext";

const Virksomhetsside = () => {
    const {oppdaterTittel} = useContext(TittelContext)
    const params = useParams();
    const orgnummer = params.orgnummer

    const {
        data: virksomhetsinformasjon,
        loading: lasterVirksomhet
    } = useHentVirksomhetsinformasjon(orgnummer);

    useEffect(() => {
        if (virksomhetsinformasjon)
            oppdaterTittel(`Fia - ${virksomhetsinformasjon.navn}`)
        else
            oppdaterTittel(statiskeSidetitler.virksomhetsside)
    }, [oppdaterTittel, virksomhetsinformasjon])

    const {
        data: iaSaker,
        mutate: mutateHentSaker,
        loading: lasterIaSaker
    } = useHentSakerForVirksomhet(orgnummer)

    const iaSak = nyesteSak(iaSaker)

    if (lasterVirksomhet || lasterIaSaker) {
        return <LasterVirksomhet />
    }

    if (virksomhetsinformasjon && iaSaker) {
        return <VirksomhetsVisning
            virksomhet={virksomhetsinformasjon}
            iaSak={iaSak}
            muterState={mutateHentSaker}
        />
    } else {
        return <p>Kunne ikke laste ned informasjon om virksomhet</p>
    }
};

const nyesteSak = (iaSaker?: IASak[]): IASak | undefined => !iaSaker || iaSaker.length === 0 ? undefined : iaSaker[0]

const LasterVirksomhet = () => <Loader title={"Laster inn virksomhet"} variant={"interaction"} size={"xlarge"} />

export default Virksomhetsside;
