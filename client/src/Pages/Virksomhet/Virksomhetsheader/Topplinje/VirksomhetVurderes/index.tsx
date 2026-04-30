import { HStack } from "@navikt/ds-react";
import { IASak } from "@/domenetyper/domenetyper";
import { EierskapKnapp } from "@/Pages/Virksomhet/Samarbeid/EierskapKnapp";
import {
    erSaksbehandler,
    useHentBrukerinformasjon,
} from "@features/bruker/api/bruker";
import { useHentTeam } from "@features/bruker/api/team";
import { Virksomhet } from "@features/virksomhet/types/virksomhet";
import { Salesforcelenke } from "../../";
import { AvsluttVurderingModal } from "./AvsluttVurderingModal";

export function VirksomhetVurderes({
    iaSak,
    virksomhet,
}: {
    iaSak: IASak;
    virksomhet: Virksomhet;
}) {
    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    const { data: følgere = [] } = useHentTeam(iaSak?.saksnummer);
    const brukerFølgerSak = følgere.some(
        (følger) => følger === brukerInformasjon?.ident,
    );
    const brukerErEierAvSak = iaSak?.eidAv === brukerInformasjon?.ident;
    const eierEllerFølgerSak =
        (erSaksbehandler(brukerInformasjon) && brukerFølgerSak) ||
        brukerErEierAvSak;

    return (
        <HStack gap={"4"}>
            <AvsluttVurderingModal
                erSuperbruker={brukerInformasjon?.rolle === "Superbruker"}
                virksomhet={virksomhet}
                eierEllerFølgerSak={eierEllerFølgerSak}
            />
            <EierskapKnapp iaSak={iaSak} />
            <Salesforcelenke orgnr={virksomhet.orgnr} />
        </HStack>
    );
}
