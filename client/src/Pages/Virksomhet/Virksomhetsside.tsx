import {useParams} from "react-router-dom";
import {
    iaSakHentHendelserPath,
    useHentSakerForVirksomhet,
    useHentSakshendelserPåSak,
    useHentSykefraværsstatistikkForVirksomhet,
    useHentVirksomhetsinformasjon
} from "../../api/lydia-api";
import {Loader} from "@navikt/ds-react";
import {VirksomhetOversikt} from "./VirksomhetOversikt";
import {IAProsessStatusEnum, IASak, SykefraversstatistikkVirksomhet} from "../../domenetyper";
import {mutate} from "swr";
import {useCallback} from "react";

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

    const {
        data: iaSaker,
        loading: lasterIaSaker
    } = useHentSakerForVirksomhet(orgnummer)

    const iaSak = aktivIaSak(iaSaker)

    const {
        data: iaSakshendelser,
    } = useHentSakshendelserPåSak(iaSak)

    if (lasterVirksomhet || lasterSykefraværsstatistikk || lasterIaSaker) {
        return <LasterVirksomhet/>
    }

    const muterState = useCallback(() => {
        iaSak && mutate(`${iaSakHentHendelserPath}/${iaSak.saksnummer}`)
    }, [iaSak])

    if (virksomhetsinformasjon &&
        sykefraværsstatistikk &&
        sykefraværsstatistikk.length > 0 &&
        iaSaker
    ) {
        document.title = `Fia - ${virksomhetsinformasjon.navn}`
        const statistikkForSisteKvartal = filtrerPåSisteKvartal(sykefraværsstatistikk)
        return <VirksomhetOversikt
            virksomhet={virksomhetsinformasjon}
            sykefraværsstatistikk={statistikkForSisteKvartal}
            iaSak={iaSak}
            sakshendelser={iaSakshendelser ?? []}
            muterState={muterState}
        />
    } else {
        return <p>Kunne ikke laste ned informasjon om virksomhet</p>
    }
};

const aktivIaSak = (iaSaker?: IASak[]) : IASak | undefined =>
    iaSaker?.find((sak) => sak.status !== IAProsessStatusEnum.enum.IKKE_AKTIV)

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
