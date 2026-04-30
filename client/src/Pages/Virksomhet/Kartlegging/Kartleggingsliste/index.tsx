import { HStack } from "@navikt/ds-react";
import React from "react";
import OpprettNySpørreundersøkelseKnapp from "@/components/Spørreundersøkelse/OpprettNySpørreundersøkelseKnapp";
import { SpørreundersøkelseProvider } from "@/components/Spørreundersøkelse/SpørreundersøkelseContext";
import { SpørreundersøkelseHeading } from "@/components/Spørreundersøkelse/SpørreundersøkelseHeading";
import Spørreundersøkelseliste from "@/components/Spørreundersøkelse/Spørreundersøkelseliste";
import { IASak } from "@/domenetyper/domenetyper";
import { VisHvisSamarbeidErÅpent } from "@/Pages/Virksomhet/Samarbeid/SamarbeidContext";
import {
    erSaksbehandler,
    useHentBrukerinformasjon,
} from "@features/bruker/api/bruker";
import { useHentTeam } from "@features/bruker/api/team";
import { useSpørreundersøkelsesliste } from "@features/kartlegging/api/spørreundersøkelse";
import {
    SpørreundersøkelseType,
    SpørreundersøkelseTypeEnum,
} from "@features/kartlegging/types/spørreundersøkelseMedInnhold";
import { useHentPlan } from "@features/plan/api/plan";
import { opprettKartleggingNyFlyt } from "@features/sak/api/nyFlyt";
import { useHentIASaksStatus } from "@features/sak/api/sak";
import { IaSakProsess } from "@features/sak/types/iaSakProsess";

export function Kartleggingsliste({
    iaSak,
    gjeldendeSamarbeid,
}: {
    iaSak?: IASak;
    gjeldendeSamarbeid: IaSakProsess;
}) {
    if (!iaSak) {
        return null;
    }
    return <Innhold iaSak={iaSak} gjeldendeSamarbeid={gjeldendeSamarbeid} />;
}

function Innhold({
    iaSak,
    gjeldendeSamarbeid,
}: {
    iaSak: IASak;
    gjeldendeSamarbeid: IaSakProsess;
}) {
    const [sistOpprettetType, setSistOpprettetType] =
        React.useState<SpørreundersøkelseType | null>(null);
    const [sisteOpprettedeId, setSisteOpprettedeId] = React.useState("");
    const {
        data,
        loading,
        validating,
        mutate: hentSpørreundersøkelserPåNytt,
    } = useSpørreundersøkelsesliste(
        iaSak.orgnr,
        iaSak.saksnummer,
        gjeldendeSamarbeid.id,
    );
    const { mutate: oppdaterSaksStatus } = useHentIASaksStatus(
        iaSak.orgnr,
        iaSak.saksnummer,
    );
    const { data: følgere = [] } = useHentTeam(iaSak?.saksnummer);
    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    const brukerFølgerSak = følgere.some(
        (følger) => følger === brukerInformasjon?.ident,
    );

    const { data: samarbeidsplan } = useHentPlan(
        iaSak.orgnr,
        iaSak.saksnummer,
        gjeldendeSamarbeid.id,
    );
    const brukerErEierAvSak = iaSak?.eidAv === brukerInformasjon?.ident;
    const kanEndreSpørreundersøkelser =
        (erSaksbehandler(brukerInformasjon) &&
            (brukerFølgerSak || brukerErEierAvSak)) ||
        false;

    const sakErIRettStatus = ["KARTLEGGES", "VI_BISTÅR", "AKTIV"].includes(
        iaSak.status,
    );

    const opprettSpørreundersøkelseOgMuter = (type: SpørreundersøkelseType) => {
        setSistOpprettetType(null);
        opprettKartleggingNyFlyt(iaSak.orgnr, gjeldendeSamarbeid.id, type).then(
            ({ id }) => {
                setSisteOpprettedeId(id);
                hentSpørreundersøkelserPåNytt();
                oppdaterSaksStatus();
                setSistOpprettetType(type);
            },
        );
    };

    if (loading || !data) {
        return <div>Laster kartlegginger...</div>;
    }

    return (
        <SpørreundersøkelseProvider
            spørreundersøkelseType={sistOpprettetType ?? "EVALUERING"}
            spørreundersøkelseliste={data}
            iaSak={iaSak}
            samarbeid={gjeldendeSamarbeid}
            brukerRolle={brukerInformasjon?.rolle}
            kanEndreSpørreundersøkelser={kanEndreSpørreundersøkelser}
            sisteOpprettedeSpørreundersøkelseId={sisteOpprettedeId}
            setSisteOpprettedeSpørreundersøkelseId={setSisteOpprettedeId}
            lasterSpørreundersøkelser={loading}
            validererSpørreundersøkelser={validating}
            hentSpørreundersøkelserPåNytt={hentSpørreundersøkelserPåNytt}
        >
            <SpørreundersøkelseHeading samarbeid={gjeldendeSamarbeid}>
                <VisHvisSamarbeidErÅpent>
                    <HStack gap="4">
                        <OpprettNySpørreundersøkelseKnapp
                            onClick={() =>
                                opprettSpørreundersøkelseOgMuter(
                                    SpørreundersøkelseTypeEnum.enum
                                        .BEHOVSVURDERING,
                                )
                            }
                            disabled={
                                !(
                                    sakErIRettStatus &&
                                    kanEndreSpørreundersøkelser
                                )
                            }
                            loading={false}
                            type={
                                SpørreundersøkelseTypeEnum.enum.BEHOVSVURDERING
                            }
                        />
                        <OpprettNySpørreundersøkelseKnapp
                            onClick={() =>
                                opprettSpørreundersøkelseOgMuter(
                                    SpørreundersøkelseTypeEnum.enum.EVALUERING,
                                )
                            }
                            disabled={
                                !(
                                    sakErIRettStatus &&
                                    kanEndreSpørreundersøkelser
                                ) || samarbeidsplan === undefined
                            }
                            loading={false}
                            type={SpørreundersøkelseTypeEnum.enum.EVALUERING}
                            disabledTooltipTekst={
                                samarbeidsplan === undefined
                                    ? "Det må være en samarbeidsplan for å opprette evaluering"
                                    : undefined
                            }
                        />
                    </HStack>
                </VisHvisSamarbeidErÅpent>
            </SpørreundersøkelseHeading>
            <Spørreundersøkelseliste />
        </SpørreundersøkelseProvider>
    );
}
