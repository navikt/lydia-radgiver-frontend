import { Button, Modal } from "@navikt/ds-react";
import styled from "styled-components";
import { NavIdentMedLenke } from "../../components/NavIdentMedLenke";
import { BrukerITeamDTO } from "../../domenetyper/brukeriteam";
import { KeyedMutator } from "swr";
import { HeartFillIcon, HeartIcon } from "@navikt/aksel-icons";
import {
    fjernBrukerFraTeam,
    leggBrukerTilTeam,
    nyHendelsePåSak,
    useHentAktivSakForVirksomhet,
    useHentBrukerinformasjon,
    useHentMineSaker,
} from "../../api/lydia-api";

const EierBoks = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
`;

const EierHeader = styled.span`
    flex: 1;
    text-align: left;
`;

const EierTekst = styled.div`
    display: flex;
    font-style: italic;
    color: var(--Surface-Action, #0067c5);
`;

const EierKnappBoks = styled.div`
    display: flex;
    gap: 0.5rem;
    flex-direction: column;
    align-items: flex-start;
`;

const FølgereBoks = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;
const FølgereHeader = styled.div`
    font-weight: 700;
`;
const FølgereListe = styled.div`
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    flex-wrap: wrap;
`;
const FølgereKnappBoks = styled.div`
    display: flex;
    gap: 0.5rem;
    flex-direction: column;
    align-items: flex-start;
`;
interface SakInfo {
    saksnummer: string;
    orgnavn: string;
    orgnummer: string;
    navIdent: string | null;
    følgere: BrukerITeamDTO[];
    mutate: KeyedMutator<BrukerITeamDTO[]>;
}

interface TeamModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    sakInfo: SakInfo;
}

function følgerSak(brukerIdent: string | undefined, sakInfo: SakInfo): boolean {
    return sakInfo.følgere.some((follower) => follower.ident === brukerIdent);
}

export const TeamModal = ({ open, setOpen, sakInfo }: TeamModalProps) => {
    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    const { mutate: muterMineSaker } = useHentMineSaker();
    const { data: iasak, mutate: muterIaSak } = useHentAktivSakForVirksomhet(
        sakInfo.orgnummer,
    );

    const brukerIdent = brukerInformasjon?.ident;

    const kanTaEierskap = iasak?.gyldigeNesteHendelser
        .map((h) => h.saksHendelsestype)
        .includes("TA_EIERSKAP_I_SAK");

    return (
        <>
            <Modal
                open={open}
                onClose={() => {
                    muterMineSaker();
                    setOpen(false);
                }}
                header={{
                    heading: "Administrer gruppe",
                    size: "small",
                    closeButton: true,
                }}
                width="small"
            >
                <Modal.Body>
                    <div>
                        <EierBoks>
                            <EierHeader>
                                <b>Eier:</b>{" "}
                                {sakInfo && sakInfo.navIdent ? (
                                    <NavIdentMedLenke
                                        navIdent={sakInfo.navIdent}
                                    />
                                ) : (
                                    "Ikke tilgjengelig"
                                )}
                            </EierHeader>

                            <EierKnappBoks>
                                    <span>
                                        Ønsker du å ta eierskap til saken?
                                        Nåværende eier blir automatisk fjernet.
                                    </span>
                                    <Button
                                        size="small"
                                        iconPosition="right"
                                        variant="secondary"
                                        disabled={!kanTaEierskap}
                                        onClick={async () => {
                                            if (!iasak) return;
                                            await nyHendelsePåSak(
                                                iasak,
                                                {
                                                    saksHendelsestype:
                                                        "TA_EIERSKAP_I_SAK",
                                                    gyldigeÅrsaker: [], // TODO: trengs dette å defineres
                                                },
                                                null,
                                                null,
                                            );
                                            muterIaSak();
                                            muterMineSaker();
                                        }}
                                    >
                                        Ta eierskap
                                    </Button>
                                <EierTekst>
                                    {iasak && iasak.eidAv == brukerIdent
                                        ? `Du er allerede eier av denne saken.`
                                        : !kanTaEierskap
                                          ? `Kan ikke bli eier`
                                          : ``}
                                </EierTekst>
                            </EierKnappBoks>
                        </EierBoks>
                        <FølgereBoks>
                            <FølgereHeader>Følgere i sak:</FølgereHeader>
                            <FølgereListe>
                                {sakInfo.følgere &&
                                    sakInfo.følgere.map((member) => (
                                        <NavIdentMedLenke
                                            key={member.ident}
                                            navIdent={member.ident}
                                        />
                                    ))}
                                {/* sakInfo.følgere &&
                                    [...sakInfo.følgere, ...sakInfo.følgere, ...sakInfo.følgere, ...sakInfo.følgere,...sakInfo.følgere].map((member) => (
                                        <NavIdentMedLenke
                                            key={member.ident}
                                            navIdent={member.ident}
                                        />
                                    ))}
                                */}
                            </FølgereListe>

                            <FølgereKnappBoks>
                                <span>
                                    {følgerSak(brukerIdent, sakInfo)
                                        ? "Du følger denne saken"
                                        : "Følg saken for å se den i mine saker"}
                                </span>
                                {følgerSak(brukerIdent, sakInfo) ? (
                                    <Button
                                        size="small"
                                        icon={<HeartFillIcon />}
                                        iconPosition="right"
                                        variant="secondary"
                                        onClick={async () => {
                                            await fjernBrukerFraTeam(
                                                sakInfo.saksnummer,
                                            );
                                            sakInfo.mutate();
                                        }}
                                    >
                                        Slutt å følge saken
                                    </Button>
                                ) : (
                                    <Button
                                        icon={<HeartIcon />}
                                        size="small"
                                        iconPosition="right"
                                        onClick={async () => {
                                            await leggBrukerTilTeam(
                                                sakInfo.saksnummer,
                                            );
                                            sakInfo.mutate();
                                        }}
                                    >
                                        Følg saken
                                    </Button>
                                )}
                            </FølgereKnappBoks>
                        </FølgereBoks>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        type="button"
                        iconPosition="right"
                        onClick={() => setOpen(false)}
                    >
                        Ferdig
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
