import { Button, Modal } from "@navikt/ds-react";
import styled from "styled-components";
import { NavIdentMedLenke } from "../../components/NavIdentMedLenke";
import { BrukerITeamDTO } from "../../domenetyper/brukeriteam";
import { KeyedMutator } from "swr";
import { FloppydiskIcon, HeartIcon } from "@navikt/aksel-icons";
import { leggBrukerTilTeam } from "../../api/lydia-api";

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
    navIdent: string | null;
    følgere: BrukerITeamDTO[];
    mutate: KeyedMutator<BrukerITeamDTO[]>;
}

interface TeamModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    sakInfo: SakInfo;
}

export const TeamModal = ({ open, setOpen, sakInfo }: TeamModalProps) => {
    return (
        <>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                header={{
                    heading: "Administrer gruppe",
                    size: "small",
                    closeButton: false,
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
                                    Ønsker du å ta eierskap til saken? Nåværende
                                    eier blir automatisk fjernet.
                                </span>
                                <Button
                                    size="small"
                                    iconPosition="right"
                                    variant="secondary"
                                >
                                    Ta eierskap
                                </Button>
                                <EierTekst>
                                    Du er allerede eier av denne saken.
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
                                {sakInfo.følgere &&
                                    sakInfo.følgere.map((member) => (
                                        <NavIdentMedLenke
                                            key={member.ident}
                                            navIdent={member.ident}
                                        />
                                    ))}
                                {sakInfo.følgere &&
                                    sakInfo.følgere.map((member) => (
                                        <NavIdentMedLenke
                                            key={member.ident}
                                            navIdent={member.ident}
                                        />
                                    ))}
                                {sakInfo.følgere &&
                                    sakInfo.følgere.map((member) => (
                                        <NavIdentMedLenke
                                            key={member.ident}
                                            navIdent={member.ident}
                                        />
                                    ))}
                                {sakInfo.følgere &&
                                    sakInfo.følgere.map((member) => (
                                        <NavIdentMedLenke
                                            key={member.ident}
                                            navIdent={member.ident}
                                        />
                                    ))}
                                {sakInfo.følgere &&
                                    sakInfo.følgere.map((member) => (
                                        <NavIdentMedLenke
                                            key={member.ident}
                                            navIdent={member.ident}
                                        />
                                    ))}
                            </FølgereListe>

                            <FølgereKnappBoks>
                                <span>
                                    Følg saken for å se den i mine saker
                                </span>
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
                                <Button size="small">Forlatteam</Button>
                            </FølgereKnappBoks>
                        </FølgereBoks>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        type="button"
                        icon={<FloppydiskIcon />}
                        iconPosition="right"
                        onClick={() => setOpen(false)}
                    >
                        Lagre
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setOpen(false)}
                    >
                        Avbryt
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
