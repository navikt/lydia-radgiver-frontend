import styled from "styled-components";
import { Statistikkboks } from "./Statistikkboks";
import { formaterSomHeltall, formaterSomProsentMedEnDesimal } from "../../../../util/tallFormatering";
import { Loader } from "@navikt/ds-react";
import {
    useHentBransjestatistikk,
    useHentNæringsstatistikk,
    useHentPubliseringsinfo,
    useHentSykefraværsstatistikkForVirksomhetSisteKvartal,
    useHentVirksomhetsstatistikkSiste4Kvartaler
} from "../../../../api/lydia-api";
import { sorterKvartalStigende } from "../../../../util/sortering";
import { getGjeldendePeriodeTekst } from "../../../../util/gjeldendePeriodeSisteFireKvartal";
import { Kvartal } from "../../../../domenetyper/kvartal";
import { VirksomhetsstatistikkSiste4Kvartaler } from "../../../../domenetyper/virksomhetsstatistikkSiste4Kvartaler";
import { Publiseringsinfo } from "../../../../domenetyper/publiseringsinfo";
import { Næring } from "../../../../domenetyper/virksomhet";

const Container = styled.dl`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
`;

interface Props {
    orgnummer: string;
    bransje: string | null;
    næring: Næring;
}

export const Sykefraværsstatistikk = ({orgnummer, bransje, næring}: Props) => {
    const {
        data: publiseringsinfo,
    } = useHentPubliseringsinfo()

    const {
        data: virksomhetsstatistikkSiste4Kvartaler,
        loading: lasterSykefraværsstatistikkSiste4Kvartal,
    } = useHentVirksomhetsstatistikkSiste4Kvartaler(orgnummer)

    const {
        data: sykefraværsstatistikkSisteKvartal,
        loading: lasterSykefraværsstatistikkSisteKvartal,
    } = useHentSykefraværsstatistikkForVirksomhetSisteKvartal(orgnummer)

    const {
        data: bransjestatistikk,
    } = useHentBransjestatistikk(bransje)

    const {
        data: næringsstatistikk,
    } = useHentNæringsstatistikk(næring)

    if (lasterSykefraværsstatistikkSiste4Kvartal || lasterSykefraværsstatistikkSisteKvartal) {
        return (
            <Loader title={"Laster inn statistikk for virksomhet"}
                    variant={"interaction"}
                    size={"xlarge"}
            />
        )
    } else if (virksomhetsstatistikkSiste4Kvartaler && sykefraværsstatistikkSisteKvartal) {
        const sisteFireKvartalInfo = hvilkeKvartalHarVi(virksomhetsstatistikkSiste4Kvartaler, publiseringsinfo);

        return (
            <Container>
                <Statistikkboks
                    tittel="Arbeidsforhold"
                    helpTekst={`Antall arbeidsforhold per ${sykefraværsstatistikkSisteKvartal.kvartal}. kvartal ${sykefraværsstatistikkSisteKvartal.arstall}`}
                    verdi={formaterSomHeltall(sykefraværsstatistikkSisteKvartal.antallPersoner)}
                />
                <Statistikkboks
                    tittel="Mulige dagsverk"
                    helpTekst={`Antall mulige dagsverk ${sisteFireKvartalInfo}`}
                    verdi={formaterSomHeltall(virksomhetsstatistikkSiste4Kvartaler.muligeDagsverk)}
                    verdiSisteKvartal={sykefraværsstatistikkSisteKvartal?.muligeDagsverk
                        ? {
                            verdi: formaterSomHeltall(sykefraværsstatistikkSisteKvartal.muligeDagsverk),
                            år: sykefraværsstatistikkSisteKvartal.arstall,
                            kvartal: sykefraværsstatistikkSisteKvartal.kvartal
                        }
                        : undefined}
                />
                <Statistikkboks
                    tittel="Tapte dagsverk"
                    helpTekst={`Antall tapte dagsverk ${sisteFireKvartalInfo}`}
                    verdi={formaterSomHeltall(virksomhetsstatistikkSiste4Kvartaler.tapteDagsverk)}
                    verdiSisteKvartal={sykefraværsstatistikkSisteKvartal?.tapteDagsverk
                        ? {
                            verdi: formaterSomHeltall(sykefraværsstatistikkSisteKvartal.tapteDagsverk),
                            år: sykefraværsstatistikkSisteKvartal.arstall,
                            kvartal: sykefraværsstatistikkSisteKvartal.kvartal
                        }
                        : undefined}
                />
                <Statistikkboks
                    tittel="Sykefravær"
                    helpTekst={`Sykefraværsprosent ${sisteFireKvartalInfo}`}
                    verdi={formaterSomProsentMedEnDesimal(virksomhetsstatistikkSiste4Kvartaler.sykefraversprosent)}
                    verdiSisteKvartal={sykefraværsstatistikkSisteKvartal?.sykefraversprosent
                        ? {
                            verdi: formaterSomProsentMedEnDesimal(sykefraværsstatistikkSisteKvartal.sykefraversprosent),
                            år: sykefraværsstatistikkSisteKvartal.arstall,
                            kvartal: sykefraværsstatistikkSisteKvartal.kvartal
                        }
                        : undefined}
                />
                {bransje && bransjestatistikk?.siste4Kvartal.prosent &&
                    <Statistikkboks
                        tittel="Sykefravær bransje"
                        helpTekst={`Sykefravær i bransje "${bransje.toLowerCase()}" ${sisteFireKvartalInfo}`}
                        verdi={formaterSomProsentMedEnDesimal(bransjestatistikk?.siste4Kvartal.prosent)}
                        verdiSisteKvartal={bransjestatistikk?.sisteGjeldendeKvartal.prosent
                            ? {
                                verdi: formaterSomProsentMedEnDesimal(bransjestatistikk?.sisteGjeldendeKvartal.prosent),
                                år: bransjestatistikk?.sisteGjeldendeKvartal.årstall,
                                kvartal: bransjestatistikk?.sisteGjeldendeKvartal.kvartal,
                            }
                            : undefined}
                    />
                }
                <Statistikkboks
                    tittel="Sykefravær næring"
                    helpTekst={`Sykefravær i næring "${næring.navn}" ${sisteFireKvartalInfo}`}
                    verdi={næringsstatistikk?.siste4Kvartal.prosent ?
                        formaterSomProsentMedEnDesimal(næringsstatistikk?.siste4Kvartal.prosent) : "Ikke funnet"
                    }
                    verdiSisteKvartal={næringsstatistikk?.sisteGjeldendeKvartal.prosent
                        ? {
                            verdi: formaterSomProsentMedEnDesimal(næringsstatistikk?.sisteGjeldendeKvartal.prosent),
                            år: næringsstatistikk?.sisteGjeldendeKvartal.årstall,
                            kvartal: næringsstatistikk?.sisteGjeldendeKvartal.kvartal,
                        }
                        : undefined}
                />
            </Container>
        );
    } else {
        return <p>Kunne ikke hente sykefraværsstatistikk for virksomheten</p>
    }
};

const hvilkeKvartalHarVi = (statistikk: VirksomhetsstatistikkSiste4Kvartaler, publiseringsinfo: Publiseringsinfo | undefined) => {
    let kvartalstrenger = "";

    if (statistikk.antallKvartaler === 4) {
        kvartalstrenger = ` siste fire kvartaler${getGjeldendePeriodeTekst(publiseringsinfo)}`
    } else {
        kvartalstrenger += statistikk.kvartaler.sort(sorterKvartalStigende).map((kvartal: Kvartal) => {
            return ` ${kvartal.kvartal}. kvartal ${kvartal.årstall}`
        })
    }

    return "basert på" + kvartalstrenger;
}
