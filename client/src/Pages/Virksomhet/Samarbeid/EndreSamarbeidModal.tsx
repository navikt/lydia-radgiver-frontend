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
import {
    nyHendelsePåSak,
    useHentAktivSakForVirksomhet,
    useHentSamarbeid,
    useHentSamarbeidshistorikk,
} from "../../../api/lydia-api";
import styled from "styled-components";
import { StyledModal } from "../../../components/Modal/StyledModal";
import { TrashIcon } from "@navikt/aksel-icons";

export const NavngiSamarbeidInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 1rem;
`;

const HeaderStylet = styled.div``;

export const ModalBodyStyled = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const TextFieldStyled = styled(TextField)`
    min-width: fit-content;
    width: 100%;
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
        setAntallTegn(samarbeid.navn?.length ?? 0);
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
        nyHendelse("ENDRE_PROSESS");
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
            aria-label={"Endre samarbeid"}
        >
            <Modal.Header closeButton={true}>
                <HeaderStylet>
                    <Heading size="medium">Administrer samarbeid</Heading>
                </HeaderStylet>
            </Modal.Header>
            <ModalBodyStyled>
                <Modal.Body>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr min-content",
                            gap: "0.5rem",
                        }}
                    >
                        <BodyShort
                            style={{
                                gridColumn: "1 / span 2",
                                marginBottom: "0.25rem",
                            }}
                        >
                            Her kan du endre navn på samarbeidet &quot;
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
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                gap: "0.5rem",
                            }}
                        >
                            <Detail>
                                Husk, aldri skriv personopplysninger.
                            </Detail>
                            <Detail>{antallTegn}/25 tegn</Detail>
                        </div>
                        <Detail style={{ gridColumn: "1" }}>
                            Navnet kan vises på <i>Min Side Arbeidsgiver </i>
                            og må gjenspeile det virksomheten bruker selv.
                        </Detail>
                    </div>
                </Modal.Body>
            </ModalBodyStyled>
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
