import styled from "styled-components";
import { IASak } from "../../domenetyper/domenetyper";
import { loggFølgeSak } from "../../util/amplitude-klient";
import { BodyShort, Button, HStack } from "@navikt/ds-react";
import { NavIdentMedLenke } from "../../components/NavIdentMedLenke";
import {
    HeartFillIcon,
    HeartIcon,
    PersonFillIcon,
    PersonIcon,
} from "@navikt/aksel-icons";
import { useHentBrukerinformasjon } from "../../api/lydia-api/bruker";
import {
    fjernBrukerFraTeam,
    leggBrukerTilTeam,
    useHentTeam,
} from "../../api/lydia-api/team";
import { useErPåAktivSak } from "../Virksomhet/VirksomhetContext";

const EierBoks = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const EierKnappBoks = styled.div`
    display: flex;
    gap: 0.6rem;
    flex-direction: column;
    align-items: flex-start;
`;

const FølgereBoks = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
`;
const FølgereHeader = styled.div`
    margin-top: 1rem;
    font-weight: 700;
`;
const FølgereListe = styled.div`
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    flex-wrap: wrap;
`;

function følgerSak(
    brukerIdent: string | undefined,
    følgere?: string[],
): boolean {
    return !!følgere?.some((følger) => følger === brukerIdent);
}

export default function TeamInnhold({
    iaSak,
    lukkEksternContainer = () => { },
    erPåMineSaker = false,
    åpneTaEierskapModal,
}: {
    iaSak: IASak,
    lukkEksternContainer?: () => void;
    erPåMineSaker?: boolean;
    åpneTaEierskapModal: () => void;
}) {
    const { data: brukerInformasjon } = useHentBrukerinformasjon();

    const { data: følgere = [], mutate: muterFølgere } = useHentTeam(
        iaSak.saksnummer,
    );

    const brukerIdent = brukerInformasjon?.ident;
    const erPåAktivSak = useErPåAktivSak();

    const kanTaEierskap = iaSak.gyldigeNesteHendelser
        .map((h) => h.saksHendelsestype)
        .includes("TA_EIERSKAP_I_SAK") && (erPåAktivSak || erPåMineSaker);


    return (
        <>
            <EierBoks>
                <div>
                    <b>Eier:</b>{" "}
                    {iaSak.eidAv ? (
                        <NavIdentMedLenke navIdent={iaSak.eidAv} />
                    ) : (
                        "Ingen eier"
                    )}
                </div>

                <EierKnappBoks>
                    <span>
                        Ønsker du å ta eierskap til saken? Nåværende eier blir
                        automatisk fjernet.
                    </span>
                    <Button
                        size="small"
                        iconPosition="right"
                        variant="secondary"
                        disabled={!kanTaEierskap}
                        onClick={åpneTaEierskapModal}
                    >
                        <HStack gap={"2"} align={"center"}>
                            {iaSak.eidAv !== brukerIdent ? (
                                <PersonIcon aria-hidden />
                            ) : (
                                <PersonFillIcon aria-hidden />
                            )}
                            {iaSak.eidAv !== brukerIdent ? (
                                <BodyShort>Ta eierskap</BodyShort>
                            ) : (
                                <BodyShort>Du eier saken</BodyShort>
                            )}
                        </HStack>
                    </Button>
                </EierKnappBoks>
            </EierBoks>
            <FølgereBoks>
                <FølgereHeader>Følgere:</FølgereHeader>
                {!!følgere.length && (
                    <FølgereListe>
                        {følgere.map((følger) => (
                            <NavIdentMedLenke key={følger} navIdent={følger} />
                        ))}
                    </FølgereListe>
                )}
                <span>
                    Følg saken for å se den under &ldquo;Mine saker&rdquo;
                </span>
                {følgerSak(brukerIdent, følgere) ? (
                    <Button
                        size="small"
                        icon={<HeartFillIcon />}
                        iconPosition="left"
                        variant="secondary"
                        onClick={async () => {
                            await fjernBrukerFraTeam(iaSak.saksnummer);
                            muterFølgere();
                            loggFølgeSak(false);
                            lukkEksternContainer();
                        }}
                        disabled={!(erPåAktivSak || erPåMineSaker)}
                    >
                        Slutt å følge saken
                    </Button>
                ) : (
                    <Button
                        icon={<HeartIcon />}
                        size="small"
                        iconPosition="left"
                        onClick={async () => {
                            await leggBrukerTilTeam(iaSak.saksnummer);
                            muterFølgere();
                            loggFølgeSak(true);
                            lukkEksternContainer();
                        }}
                        disabled={!(erPåAktivSak || erPåMineSaker)}
                    >
                        Følg saken
                    </Button>
                )}
            </FølgereBoks>
        </>
    );
}
