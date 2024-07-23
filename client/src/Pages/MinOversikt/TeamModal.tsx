import { Button, Modal } from "@navikt/ds-react";
import styled from "styled-components";
import { NavIdentMedLenke } from "../../components/NavIdentMedLenke";
import { BrukerITeamDTO } from "../../domenetyper/brukeriteam";
import { HeartFillIcon, HeartIcon } from "@navikt/aksel-icons";
import {
    fjernBrukerFraTeam,
    leggBrukerTilTeam,
    nyHendelsePåSak,
    useHentAktivSakForVirksomhet,
    useHentBrukerinformasjon,
    useHentMineSaker,
    useHentTeam,
} from "../../api/lydia-api";

const ModalBodyWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 3rem;
`;

const EierBoks = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const EierTekst = styled.div`
    font-style: italic;
    color: var(--Surface-Action, #0067c5);
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
    font-weight: 700;
`;
const FølgereListe = styled.div`
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    flex-wrap: wrap;
`;

interface TeamModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    saksnummer: string;
    orgnummer: string;
}

function følgerSak(
    brukerIdent: string | undefined,
    følgere?: BrukerITeamDTO[],
): boolean {
    return !!følgere?.some((følger) => følger.ident === brukerIdent);
}

export const TeamModal = ({
    open,
    setOpen,
    orgnummer,
    saksnummer,
}: TeamModalProps) => {
    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    const { mutate: muterMineSaker } = useHentMineSaker();
    const { data: iasak, mutate: muterIaSak } =
        useHentAktivSakForVirksomhet(orgnummer);
    const { data: følgere = [], mutate: muterFølgere } =
        useHentTeam(saksnummer);

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
                    <ModalBodyWrapper>
                        <EierBoks>
                            <div>
                                <b>Eier:</b>{" "}
                                {iasak?.eidAv ? (
                                    <NavIdentMedLenke navIdent={iasak.eidAv} />
                                ) : (
                                    "Ingen eier"
                                )}
                            </div>

                            <EierKnappBoks>
                                <span>
                                    Ønsker du å ta eierskap til saken? Nåværende
                                    eier blir automatisk fjernet.
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
                                    {iasak && iasak.eidAv === brukerIdent
                                        ? `Du er allerede eier av denne saken.`
                                        : !kanTaEierskap
                                          ? `Kan ikke bli eier`
                                          : ``}
                                </EierTekst>
                            </EierKnappBoks>
                        </EierBoks>
                        <FølgereBoks>
                            <FølgereHeader>Følgere:</FølgereHeader>
                            {!!følgere.length && (
                                <FølgereListe>
                                    {følgere.map((member) => (
                                        <NavIdentMedLenke
                                            key={member.ident}
                                            navIdent={member.ident}
                                        />
                                    ))}
                                    {/* 
                                    [
                                        ...sakInfo.følgere,
                                        ...sakInfo.følgere,
                                        ...sakInfo.følgere,
                                        ...sakInfo.følgere,
                                        ...sakInfo.følgere,
                                    ].map((member, i) => (
                                        <NavIdentMedLenke
                                            key={member.ident + i}
                                            navIdent={member.ident}
                                        />
                                    )) */}
                                </FølgereListe>
                            )}
                            <span>
                                Følg saken for å se den under &ldquo;Mine
                                saker&rdquo;
                            </span>
                            {følgerSak(brukerIdent, følgere) ? (
                                <Button
                                    size="small"
                                    icon={<HeartFillIcon />}
                                    iconPosition="right"
                                    variant="secondary"
                                    onClick={async () => {
                                        await fjernBrukerFraTeam(saksnummer);
                                        muterFølgere();
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
                                        await leggBrukerTilTeam(saksnummer);
                                        muterFølgere();
                                    }}
                                >
                                    Følg saken
                                </Button>
                            )}
                        </FølgereBoks>
                    </ModalBodyWrapper>
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
