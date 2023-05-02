import { BodyShort, Heading } from "@navikt/ds-react";
import { BannerMedLukkeknapp } from "./BannerMedLukkeknapp";
import { useHentPubliseringsinfo } from "../../api/lydia-api";
import { skalViseStatistikkKommer, skjulNyStatistikkBanner } from "../../util/nyStatistikkBannerUtils";
import { Publiseringsinfo } from "../../domenetyper/publiseringsinfo";

export const NyStatistikkPubliseresBanner = () => {
    const {
        data: publiseringsinfo,
        loading: lasterPubliseringsinfo
    } = useHentPubliseringsinfo()

    if (lasterPubliseringsinfo) {
        return null;
    }

    const idag = new Date()

    if (!publiseringsinfo || skjulNyStatistikkBanner(idag, publiseringsinfo)) {
        return null;
    }

    const statistikkErIkkePublisert = skalViseStatistikkKommer(idag, publiseringsinfo)

    return (
        <>
            {statistikkErIkkePublisert
                ? <NyStatistikkKommerSnart publiseringsinfo={publiseringsinfo} />
                : <NyStatistikkErUte publiseringsinfo={publiseringsinfo}/>
            }
        </>
    )
}

interface NyStatistikkProps {
    publiseringsinfo: Publiseringsinfo;
}
const NyStatistikkKommerSnart = (props: NyStatistikkProps) => {
    return (
        <BannerMedLukkeknapp variant="info">
            <Heading size="xsmall">Snart kommer sykefraværsstatistikk for {props.publiseringsinfo.fraTil.til.kvartal}. kvartal {props.publiseringsinfo.fraTil.til.årstall}</Heading>
            <BodyShort>Fia blir oppdatert med nye tall i løpet av {props.publiseringsinfo.nestePubliseringsdato}.</BodyShort>
        </BannerMedLukkeknapp>
    )
}

const NyStatistikkErUte = (props: NyStatistikkProps) => {
    const sisteKvartal = `${props.publiseringsinfo.fraTil.til.kvartal}. kvartal ${props.publiseringsinfo.fraTil.til.årstall}`;
    return (
        <BannerMedLukkeknapp variant="info">
            <Heading size="xsmall">Sykefraværsstatistikken i Fia er oppdatert med tall
                fra {sisteKvartal}</Heading>
            <BodyShort>
                Tall for de siste fire kvartalene er nå basert på {props.publiseringsinfo.fraTil.fra.kvartal}. kvartal {props.publiseringsinfo.fraTil.fra.årstall} til {sisteKvartal}.
            </BodyShort>
        </BannerMedLukkeknapp>
    )
}
