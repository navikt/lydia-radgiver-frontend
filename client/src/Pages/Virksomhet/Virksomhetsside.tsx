import { useParams } from "react-router-dom";
import {
    useHentSakerForVirksomhet,
    useHentSamarbeidshistorikk,
    useHentSykefraværsstatistikkForVirksomhet,
    useHentVirksomhetsinformasjon
} from "../../api/lydia-api";
import { Loader } from "@navikt/ds-react";
import { VirksomhetOversikt } from "./VirksomhetOversikt";
import { IASak, SykefraversstatistikkVirksomhet } from "../../domenetyper";
import { sorterStatistikkPåSisteÅrstallOgKvartal } from "../../util/sortering";
import { useContext } from "react";
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
        data: sykefraværsstatistikk,
        loading: lasterSykefraværsstatistikk
    } = useHentSykefraværsstatistikkForVirksomhet(orgnummer);

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

    if (lasterVirksomhet || lasterSykefraværsstatistikk || lasterIaSaker) {
        return <LasterVirksomhet />
    }

    const muterState = () => {
        mutateHentSaker().then(() => {
            mutateHentSamarbeidshistorikk()
        })
    }

    if (virksomhetsinformasjon &&
        sykefraværsstatistikk &&
        sykefraværsstatistikk.length > 0 &&
        iaSaker
    ) {
        oppdaterTittel(`Fia - ${virksomhetsinformasjon.navn}`)
        const statistikkForSisteKvartal = filtrerPåSisteKvartal(sykefraværsstatistikk)
        return <VirksomhetOversikt
            virksomhet={virksomhetsinformasjon}
            sykefraværsstatistikk={statistikkForSisteKvartal}
            iaSak={iaSak}
            samarbeidshistorikk={samarbeidshistorik ?? []}
            muterState={muterState}
        />
    } else {
        return <p>Kunne ikke laste ned informasjon om virksomhet</p>
    }
};

const nyesteSak = (iaSaker?: IASak[]): IASak | undefined => !iaSaker || iaSaker.length === 0 ? undefined : iaSaker[0]

// TODO: bruk noe lignende et Either-pattern for å håndtere eventuell tomme lister her
const filtrerPåSisteKvartal =
    (sykefraværsstatistikk: SykefraversstatistikkVirksomhet[]): SykefraversstatistikkVirksomhet =>
        sykefraværsstatistikk.sort(sorterStatistikkPåSisteÅrstallOgKvartal)[0]

const LasterVirksomhet = () => <Loader title={"Laster inn virksomhet"} variant={"interaction"} size={"xlarge"} />

export default Virksomhetsside;
