import styled from "styled-components";
import { Statistikkboks } from "./Statistikkboks";
import { formaterSomHeltall, formaterSomProsentMedEnDesimal } from "../../../../util/tallFormatering";
import { Loader } from "@navikt/ds-react";
import {
    useHentGjeldendePeriodeForVirksomhetSiste4Kvartal,
    useHentSykefraværsstatistikkForVirksomhetSisteKvartal,
    useHentVirksomhetsstatistikkSiste4Kvartaler
} from "../../../../api/lydia-api";
import { sorterKvartalStigende } from "../../../../util/sortering";
import { getGjeldendePeriodeTekst } from "../../../../util/gjeldendePeriodeSisteFireKvartal";
import { Kvartal, KvartalFraTil } from "../../../../domenetyper/kvartalTyper";
import { VirksomhetsstatistikkSiste4Kvartaler } from "../../../../domenetyper/virksomhetsstatistikkSiste4Kvartaler";

const Container = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(${230 / 16}rem, 1fr));
`;

interface Props {
    orgnummer: string;
}

export const Sykefraværsstatistikk = ({ orgnummer }: Props) => {
    const {
        data: virksomhetsstatistikkSiste4Kvartaler,
        loading: lasterSykefraværsstatistikkSiste4Kvartal,
    } = useHentVirksomhetsstatistikkSiste4Kvartaler(orgnummer)

    const {
        data: gjeldendePeriodeSisteFireKvartal,
    } = useHentGjeldendePeriodeForVirksomhetSiste4Kvartal()

    const {
        data: sykefraværsstatistikkSisteKvartal,
        loading: lasterSykefraværsstatistikkSisteKvartal,
    } = useHentSykefraværsstatistikkForVirksomhetSisteKvartal(orgnummer)

    if (lasterSykefraværsstatistikkSiste4Kvartal || lasterSykefraværsstatistikkSisteKvartal) {
        return (
            <Loader title={"Laster inn statistikk for virksomhet"}
                    variant={"interaction"}
                    size={"xlarge"}
            />
        )
    } else if (virksomhetsstatistikkSiste4Kvartaler && sykefraværsstatistikkSisteKvartal) {
        const sisteFireKvartalInfo = hvilkeKvartalHarVi(virksomhetsstatistikkSiste4Kvartaler, gjeldendePeriodeSisteFireKvartal);

        return (
            <Container>
                <Statistikkboks
                    tittel="Arbeidsforhold"
                    helpTekst={`Antall arbeidsforhold per ${sykefraværsstatistikkSisteKvartal.kvartal}. kvartal ${sykefraværsstatistikkSisteKvartal.arstall}`}
                    verdi={formaterSomHeltall(sykefraværsstatistikkSisteKvartal.antallPersoner)}
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
            </Container>
        );
    } else {
        return <p>Kunne ikke hente sykefraværsstatistikk for virksomheten</p>
    }
};

const hvilkeKvartalHarVi = (statistikk: VirksomhetsstatistikkSiste4Kvartaler, gjeldendePeriode: KvartalFraTil | undefined) => {
    let kvartalstrenger = "";

    if (statistikk.antallKvartaler === 4) {
        kvartalstrenger = ` siste fire kvartaler${getGjeldendePeriodeTekst(gjeldendePeriode)}`
    } else {
        kvartalstrenger += statistikk.kvartaler.sort(sorterKvartalStigende).map((kvartal: Kvartal) => {
            return ` ${kvartal.kvartal}. kvartal ${kvartal.årstall}`
        })
    }

    return "basert på" + kvartalstrenger;
}
