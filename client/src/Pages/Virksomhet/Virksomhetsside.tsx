import {useParams} from "react-router-dom";
import {useHentSykefraværsstatistikkForVirksomhet, useHentVirksomhetsinformasjon} from "../../api/lydia-api";
import {Loader} from "@navikt/ds-react";
import {VirksomhetOversikt} from "./VirksomhetOversikt";

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

    if (lasterVirksomhet || lasterSykefraværsstatistikk)
        return <LasterVirksomhet/>
    if (virksomhetsinformasjon && sykefraværsstatistikk)
        return <VirksomhetOversikt
            virksomhet={virksomhetsinformasjon}
            sykefraværsstatistikk={sykefraværsstatistikk}/>
    else {
        return <p>Kunne ikke laste ned informasjon om virksomhet</p>
    }
};

const LasterVirksomhet = () => <Loader
    title={"Laster inn virksomhet"}
    variant={"interaction"}
    size={"xlarge"}
/>

export default Virksomhetsside;
