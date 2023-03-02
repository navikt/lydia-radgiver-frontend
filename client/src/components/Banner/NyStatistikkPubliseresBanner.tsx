import { BodyShort, Heading } from "@navikt/ds-react";
import { BannerMedLukkeknapp } from "./BannerMedLukkeknapp";
import { useHentGjeldendePeriodeForVirksomhetSiste4Kvartal } from "../../api/lydia-api";
import { KvartalFraTil } from "../../domenetyper/kvartal";

const publiseringsdag = "torsdag 2. mars";
const nyPeriode: KvartalFraTil = {
    fra: {
        kvartal: 1,
        årstall: 2022,
    },
    til: {
        kvartal: 4,
        årstall: 2022
    },
}
const nyttKvartal = `${nyPeriode.til.kvartal}. kvartal ${nyPeriode.til.årstall}`;
const siste4fra = `${nyPeriode.fra.kvartal}. kvartal ${nyPeriode.fra.årstall}`;
const siste4til = nyttKvartal;

export const NyStatistikkPubliseresBanner = () => {
    const {
        data: gjeldendePeriodeSiste4kvartal,
        loading: lasterGjeldendePeriodeSiste4kvartal
    } = useHentGjeldendePeriodeForVirksomhetSiste4Kvartal()

    if (lasterGjeldendePeriodeSiste4kvartal) {
        return null;
    }

    const statistikkErPublisert = JSON.stringify(nyPeriode) === JSON.stringify(gjeldendePeriodeSiste4kvartal);

    return (
        <>
            {statistikkErPublisert
                ? <NyStatistikkErUte />
                : <NyStatistikkKommerSnart />
            }
        </>
    )
}

const NyStatistikkKommerSnart = () => {
    return (
        <BannerMedLukkeknapp variant="info">
            <Heading size="xsmall">Snart kommer sykefraværsstatistikk for {nyttKvartal}</Heading>
            <BodyShort>Fia blir oppdatert med nye tall i løpet av {publiseringsdag}.</BodyShort>
        </BannerMedLukkeknapp>
    )
}

const NyStatistikkErUte = () => {
    return (
        <BannerMedLukkeknapp variant="info">
            <Heading size="xsmall">Sykefraværsstatistikken i Fia er oppdatert med tall fra {nyttKvartal}</Heading>
            <BodyShort>
                Tall for de siste fire kvartalene er nå basert på {siste4fra} til {siste4til}.
            </BodyShort>
        </BannerMedLukkeknapp>
    )
}
