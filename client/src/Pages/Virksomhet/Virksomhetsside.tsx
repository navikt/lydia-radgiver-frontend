import {useParams} from "react-router-dom";
import {
    hentSakshendelserForSak,
    useHentSakerForVirksomhet,
    useHentSykefraværsstatistikkForVirksomhet,
    useHentVirksomhetsinformasjon
} from "../../api/lydia-api";
import {Loader} from "@navikt/ds-react";
import {VirksomhetOversikt} from "./VirksomhetOversikt";
import {IAProsessStatusEnum, IASak, IASakshendelse, SykefraversstatistikkVirksomhet} from "../../domenetyper";
import {useEffect, useState} from "react";

const Virksomhetsside = () => {
    const params = useParams();
    const orgnummer = params.orgnummer
    const [sakshendelser, setSakshendelser] = useState<IASakshendelse[]>([])

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
        loading: lasterIaSaker
    } = useHentSakerForVirksomhet(orgnummer)

    useEffect(() => {
        if (!iaSaker)
            return
        const aktivSak = aktivIaSak(iaSaker)
        if (aktivSak){
            hentSakshendelserForSak(aktivSak)
                .then(hendelser => setSakshendelser(hendelser))
                .catch(() => {
                    // TODO: indiker at noe går galt
                    setSakshendelser([])
                })
        }
    }, [iaSaker])

    if (lasterVirksomhet || lasterSykefraværsstatistikk || lasterIaSaker) {
        return <LasterVirksomhet/>
    }

    if (virksomhetsinformasjon && sykefraværsstatistikk && sykefraværsstatistikk.length > 0 && iaSaker) {
        const statistikkForSisteKvartal = filtrerPåSisteKvartal(sykefraværsstatistikk)
        const iaSak = aktivIaSak(iaSaker)
        return <VirksomhetOversikt
            virksomhet={virksomhetsinformasjon}
            sykefraværsstatistikk={statistikkForSisteKvartal}
            iaSak={iaSak}
            sakshendelser={sakshendelser}
        />
    } else {
        return <p>Kunne ikke laste ned informasjon om virksomhet</p>
    }
};

const aktivIaSak = (iaSaker: IASak[]) : IASak | undefined =>
    iaSaker.find((sak) => sak.status !== IAProsessStatusEnum.enum.IKKE_AKTIV)

const sorterPåSisteÅrstallOgKvartal = (a: SykefraversstatistikkVirksomhet, b: SykefraversstatistikkVirksomhet) =>
    a.arstall !== b.arstall ? b.arstall - a.arstall : b.kvartal - a.kvartal

// TODO: bruk noe lignende et Either-pattern for å håndtere eventuell tomme lister her
const filtrerPåSisteKvartal =
    (sykefraværsstatistikk: SykefraversstatistikkVirksomhet[]): SykefraversstatistikkVirksomhet =>
    sykefraværsstatistikk.sort(sorterPåSisteÅrstallOgKvartal)[0]

const LasterVirksomhet = () => <Loader
    title={"Laster inn virksomhet"}
    variant={"interaction"}
    size={"xlarge"}
/>

export default Virksomhetsside;
