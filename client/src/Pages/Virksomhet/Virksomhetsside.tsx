import {useParams} from "react-router-dom";
import {useHentSykefraværsstatistikkForVirksomhet, useHentVirksomhetsinformasjon} from "../../api/lydia-api";
import {Loader} from "@navikt/ds-react";
import {VirksomhetOversikt} from "./VirksomhetOversikt";
import {SykefraversstatistikkVirksomhet} from "../../domenetyper";

const Virksomhetsside = () => {
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

    if (lasterVirksomhet || lasterSykefraværsstatistikk) {
        return <LasterVirksomhet/>
    }
    if (virksomhetsinformasjon && sykefraværsstatistikk && sykefraværsstatistikk.length > 0) {
        const statistikkForSisteKvartal = filtrerPåSisteKvartal(sykefraværsstatistikk)
        return <VirksomhetOversikt
            virksomhet={virksomhetsinformasjon}
            sykefraværsstatistikk={statistikkForSisteKvartal}/>
    } else {
        return <p>Kunne ikke laste ned informasjon om virksomhet</p>
    }
};

const sorterPåÅrstallOgSåKvartal = (a: SykefraversstatistikkVirksomhet, b: SykefraversstatistikkVirksomhet) =>
    a.arstall !== b.arstall ? a.arstall - b.arstall : a.kvartal - b.kvartal

// TODO: bruk noe lignende et Either-pattern for å håndtere eventuell tomme lister her
const filtrerPåSisteKvartal =
    (sykefraværsstatistikk: SykefraversstatistikkVirksomhet[]): SykefraversstatistikkVirksomhet =>
    sykefraværsstatistikk.sort(sorterPåÅrstallOgSåKvartal)[0]

const LasterVirksomhet = () => <Loader
    title={"Laster inn virksomhet"}
    variant={"interaction"}
    size={"xlarge"}
/>

export default Virksomhetsside;
