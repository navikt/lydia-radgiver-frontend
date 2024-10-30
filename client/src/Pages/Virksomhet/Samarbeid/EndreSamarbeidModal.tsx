import {
    defaultNavnHvisTomt,
    IaSakProsess,
} from "../../../domenetyper/iaSakProsess";
import {
    Alert,
    BodyShort,
    Button,
    Detail,
    Heading,
    Modal,
    TextField,
} from "@navikt/ds-react";
import { IASak, IASakshendelseType } from "../../../domenetyper/domenetyper";
import React, { useEffect, useState } from "react";
import { useHentSamarbeidshistorikk } from "../../../api/lydia-api/virksomhet";
import { useHentAktivSakForVirksomhet } from "../../../api/lydia-api/virksomhet";
import { nyHendelsePåSak } from "../../../api/lydia-api/sak";
import styled from "styled-components";
import { StyledModal } from "../../../components/Modal/StyledModal";
import { TrashIcon } from "@navikt/aksel-icons";
import { useHentSamarbeid } from "../../../api/lydia-api/spørreundersøkelse";

export const ModalBodyInnholdGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr min-content;
    gap: 0.5rem;
`;

export const TextFieldStyled = styled(TextField)`
    min-width: fit-content;
    width: 100%;
`;

export const DetaljerWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 0.5rem;
`;

interface EndreSamarbeidModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    samarbeid: IaSakProsess;
    iaSak: IASak;
}

export const EndreSamarbeidModal = ({
    open,
    setOpen,
    samarbeid,
    iaSak,
}: EndreSamarbeidModalProps) => {
    const [antallTegn, setAntallTegn] = useState(samarbeid.navn?.length ?? 0);
    const [navn, setNavn] = useState(defaultNavnHvisTomt(samarbeid.navn));
    const [lagreNavnVellykket, setLagreNavnVellykket] = useState(false);

    useEffect(() => {
        setNavn(defaultNavnHvisTomt(samarbeid.navn));
        setAntallTegn(defaultNavnHvisTomt(samarbeid.navn)?.length ?? 0);
    }, [samarbeid]);

    useEffect(() => {
        setLagreNavnVellykket(false);
    }, [open]);

    const { mutate: mutateSamarbeidshistorikk } = useHentSamarbeidshistorikk(
        iaSak.orgnr,
    );
    const { mutate: mutateHentSaker } = useHentAktivSakForVirksomhet(
        iaSak.orgnr,
    );
    const { mutate: hentSamarbeidPåNytt } = useHentSamarbeid(
        iaSak.orgnr,
        iaSak.saksnummer,
    );

    const avbrytEndring = () => {
        setOpen(false);
        setLagreNavnVellykket(false);
        hentSamarbeidPåNytt().then(() => {
            setNavn(defaultNavnHvisTomt(samarbeid.navn));
        });
    };

    const slettSamarbeid = () => {
        nyHendelse("SLETT_PROSESS").then(() => {
            setOpen(false);
        });
    };

    const endreNavn = () => {
        nyHendelse("ENDRE_PROSESS").then(() => {
            setOpen(false);
        });
    };

    const nyHendelse = (hendelsestype: IASakshendelseType) => {
        return nyHendelsePåSak(
            iaSak,
            {
                saksHendelsestype: hendelsestype,
                gyldigeÅrsaker: [],
            },
            null,
            {
                ...samarbeid,
                navn: navn,
            },
        ).then(() => {
            mutateHentSaker();
            mutateSamarbeidshistorikk();
            hentSamarbeidPåNytt().then(() => {
                setLagreNavnVellykket(true);
            });
        });
    };

    return (
        <StyledModal
            open={open}
            onClose={() => {
                avbrytEndring();
            }}
            width={"small"}
            aria-label={"Administrer samarbeid"}
        >
            <Modal.Header closeButton={true}>
                <Heading size="medium">Administrer samarbeid</Heading>
            </Modal.Header>
            <Modal.Body>
                <ModalBodyInnholdGrid>
                    <BodyShort
                        style={{
                            gridColumn: "1 / span 2",
                            marginBottom: "0.75rem",
                        }}
                    >
                        Her kan du endre navn på samarbeidet <br />
                        &quot;
                        {defaultNavnHvisTomt(samarbeid.navn)}&quot;
                    </BodyShort>
                    <TextFieldStyled
                        maxLength={25}
                        size="small"
                        label="Navngi samarbeid"
                        value={navn}
                        onChange={(nyttnavn) => {
                            setNavn(nyttnavn.target.value);
                            setLagreNavnVellykket(false);
                            setAntallTegn(nyttnavn.target.value.length);
                        }}
                        hideLabel
                    />
                    <Button
                        icon={
                            <TrashIcon
                                focusable="true"
                                title={`Slett "${samarbeid.navn}"`}
                                fontSize="2rem"
                            />
                        }
                        size={"small"}
                        variant="tertiary"
                        title={`Slett "${samarbeid.navn}"`}
                        onClick={slettSamarbeid}
                    />

                    <DetaljerWrapper>
                        <Detail>Husk, aldri skriv personopplysninger.</Detail>
                        <Detail>{antallTegn}/25 tegn</Detail>
                    </DetaljerWrapper>
                    <Detail style={{ gridColumn: "1", marginTop: "1.25rem" }}>
                        Navnet kan vises på <i>Min Side Arbeidsgiver </i>
                        og må gjenspeile det virksomheten bruker selv.
                    </Detail>
                </ModalBodyInnholdGrid>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="primary"
                    onClick={() => {
                        endreNavn();
                    }}
                    disabled={navn === defaultNavnHvisTomt(samarbeid.navn)}
                >
                    Lagre
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => {
                        avbrytEndring();
                    }}
                >
                    Avbryt
                </Button>
                {lagreNavnVellykket && (
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <Alert inline variant="success" size="small">
                            Lagret
                        </Alert>
                    </div>
                )}
            </Modal.Footer>
        </StyledModal>
    );
};
