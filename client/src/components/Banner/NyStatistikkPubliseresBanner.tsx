import { BodyShort, Heading } from "@navikt/ds-react";
import { BannerMedLukkeknapp } from "./BannerMedLukkeknapp";
import { useHentPubliseringsinfo } from "../../api/lydia-api/virksomhet";
import {
    skalViseStatistikkKommer,
    skjulNyStatistikkBanner,
} from "../../util/nyStatistikkBannerUtils";
import { Publiseringsinfo } from "../../domenetyper/publiseringsinfo";
import { nesteKvartal } from "../../domenetyper/kvartal";

export const NyStatistikkPubliseresBanner = () => {
    const { data: publiseringsinfo, loading: lasterPubliseringsinfo } =
        useHentPubliseringsinfo();

    if (lasterPubliseringsinfo) {
        return null;
    }

    const idag = new Date();

    if (!publiseringsinfo || skjulNyStatistikkBanner(idag, publiseringsinfo)) {
        return null;
    }

    const nyStatistikkKommerSnart = skalViseStatistikkKommer(
        idag,
        publiseringsinfo,
    );

    return (
        <>
            {nyStatistikkKommerSnart ? (
                <NyStatistikkKommerSnart publiseringsinfo={publiseringsinfo} />
            ) : (
                <NyStatistikkErUte publiseringsinfo={publiseringsinfo} />
            )}
        </>
    );
};

interface NyStatistikkProps {
    publiseringsinfo: Publiseringsinfo;
}
const NyStatistikkKommerSnart = (props: NyStatistikkProps) => {
    const nesteTilgjengeligKvartal = nesteKvartal(
        props.publiseringsinfo.fraTil.til,
    );

    return (
        <BannerMedLukkeknapp variant="info">
            <Heading size="xsmall">
                Snart kommer sykefraværsstatistikk for{" "}
                {nesteTilgjengeligKvartal.kvartal}. kvartal{" "}
                {nesteTilgjengeligKvartal.årstall}
            </Heading>
            <BodyShort>
                Fia blir oppdatert med nye tall i løpet av{" "}
                {props.publiseringsinfo.nestePubliseringsdato}.
            </BodyShort>
        </BannerMedLukkeknapp>
    );
};

const NyStatistikkErUte = (props: NyStatistikkProps) => {
    const sisteKvartal = `${props.publiseringsinfo.fraTil.til.kvartal}. kvartal ${props.publiseringsinfo.fraTil.til.årstall}`;
    return (
        <BannerMedLukkeknapp variant="info">
            <Heading size="xsmall">
                Sykefraværsstatistikken i Fia er oppdatert med tall fra{" "}
                {sisteKvartal}
            </Heading>
            <BodyShort>
                Tall for de siste fire kvartalene er nå basert på{" "}
                {props.publiseringsinfo.fraTil.fra.kvartal}. kvartal{" "}
                {props.publiseringsinfo.fraTil.fra.årstall} til {sisteKvartal}.
            </BodyShort>
        </BannerMedLukkeknapp>
    );
};
