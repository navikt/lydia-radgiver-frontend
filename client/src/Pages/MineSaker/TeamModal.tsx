import { BodyShort, Button, HStack, Modal } from "@navikt/ds-react";
import styled from "styled-components";
import { NavIdentMedLenke } from "../../components/NavIdentMedLenke";
import {
    HeartFillIcon,
    HeartIcon,
    PersonFillIcon,
    PersonIcon,
} from "@navikt/aksel-icons";
import {
    fjernBrukerFraTeam,
    leggBrukerTilTeam,
    nyHendelsePåSak,
    useHentAktivSakForVirksomhet,
    useHentBrukerinformasjon,
    useHentMineSaker,
    useHentTeam,
} from "../../api/lydia-api";
import { loggFølgeSak } from "../../util/amplitude-klient";
import { IASak } from "../../domenetyper/domenetyper";

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
    iaSak: IASak;
}

function følgerSak(
    brukerIdent: string | undefined,
    følgere?: string[],
): boolean {
    return !!følgere?.some((følger) => følger === brukerIdent);
}

export const TeamModal = ({ open, setOpen, iaSak }: TeamModalProps) => {
    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    const { mutate: muterMineSaker } = useHentMineSaker();
    const { mutate: muterIaSak } = useHentAktivSakForVirksomhet(iaSak.orgnr);

    const { data: følgere = [], mutate: muterFølgere } = useHentTeam(
        iaSak.saksnummer,
    );

    const brukerIdent = brukerInformasjon?.ident;

    const kanTaEierskap = iaSak.gyldigeNesteHendelser
        .map((h) => h.saksHendelsestype)
        .includes("TA_EIERSKAP_I_SAK");

    return (
        <>
            <Modal
                closeOnBackdropClick={true}
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
                                {iaSak.eidAv ? (
                                    <NavIdentMedLenke navIdent={iaSak.eidAv} />
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
                                        await nyHendelsePåSak(
                                            iaSak,
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
                                    <HStack gap={"2"} align={"center"}>
                                        {iaSak.eidAv !== brukerIdent ? (
                                            <PersonIcon />
                                        ) : (
                                            <PersonFillIcon />
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
                                        <NavIdentMedLenke
                                            key={følger}
                                            navIdent={følger}
                                        />
                                    ))}
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
                                    iconPosition="left"
                                    variant="secondary"
                                    onClick={async () => {
                                        await fjernBrukerFraTeam(
                                            iaSak.saksnummer,
                                        );
                                        muterFølgere();
                                        loggFølgeSak(false);
                                    }}
                                >
                                    Slutt å følge saken
                                </Button>
                            ) : (
                                <Button
                                    icon={<HeartIcon />}
                                    size="small"
                                    iconPosition="left"
                                    onClick={async () => {
                                        await leggBrukerTilTeam(
                                            iaSak.saksnummer,
                                        );
                                        muterFølgere();
                                        loggFølgeSak(true);
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
