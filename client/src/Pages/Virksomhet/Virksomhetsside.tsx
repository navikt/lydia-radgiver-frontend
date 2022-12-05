import { useContext } from "react";
import { useParams } from "react-router-dom";
import { Loader } from "@navikt/ds-react";
import {
    useHentSakerForVirksomhet,
    useHentSamarbeidshistorikk,
    useHentVirksomhetsinformasjon
} from "../../api/lydia-api";
import { VirksomhetOversikt } from "./VirksomhetOversikt";
import { IASak } from "../../domenetyper";
import { statiskeSidetitler, TittelContext } from "../Prioritering/TittelContext";

const Virksomhetsside = () => {
    const {oppdaterTittel} = useContext(TittelContext)
    oppdaterTittel(statiskeSidetitler.virksomhetsside)
    const params = useParams();
    const orgnummer = params.orgnummer

    const {
        data: virksomhetsinformasjon,
        loading: lasterVirksomhet
    } = useHentVirksomhetsinformasjon(orgnummer);

    const {
        data: iaSaker,
        mutate: mutateHentSaker,
        loading: lasterIaSaker
    } = useHentSakerForVirksomhet(orgnummer)

    const iaSak = nyesteSak(iaSaker)

    const {
        data: samarbeidshistorik,
        mutate: mutateHentSamarbeidshistorikk
    } = useHentSamarbeidshistorikk(orgnummer)

    if (lasterVirksomhet || lasterIaSaker) {
        return <LasterVirksomhet />
    }

    const muterState = () => {
        mutateHentSaker().then(() => {
            mutateHentSamarbeidshistorikk()
        })
    }

    if (virksomhetsinformasjon && iaSaker) {
        oppdaterTittel(`Fia - ${virksomhetsinformasjon.navn}`)
        return <VirksomhetOversikt
            virksomhet={virksomhetsinformasjon}
            iaSak={iaSak}
            samarbeidshistorikk={samarbeidshistorik ?? []}
            muterState={muterState}
        />
    } else {
        return <p>Kunne ikke laste ned informasjon om virksomhet</p>
    }
};

const nyesteSak = (iaSaker?: IASak[]): IASak | undefined => !iaSaker || iaSaker.length === 0 ? undefined : iaSaker[0]

const LasterVirksomhet = () => <Loader title={"Laster inn virksomhet"} variant={"interaction"} size={"xlarge"} />

export default Virksomhetsside;
