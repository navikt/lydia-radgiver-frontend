import { IaSakProsess } from "../../../domenetyper/iaSakProsess";
import {
    Alert,
    Button,
    Detail,
    HStack,
    Label,
    Modal,
    TextField,
} from "@navikt/ds-react";
import { IASak } from "../../../domenetyper/domenetyper";
import React, { useEffect, useState } from "react";
import {
    nyHendelsePåSak,
    useHentAktivSakForVirksomhet,
    useHentSamarbeid,
    useHentSamarbeidshistorikk,
} from "../../../api/lydia-api";
import styled from "styled-components";
import { StyledModal } from "../../../components/Modal/StyledModal";

const NavngiSamarbeidInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 1rem 0;
`;

const IaSamarbeidNavnfelt = styled.div`
    min-width: fit-content;
    width: 50%;
    max-width: 100%;
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
    const [navn, setNavn] = useState(samarbeid.navn ?? "Samarbeid uten navn");
    const [lagreNavnVellykket, setLagreNavnVellykket] = useState(false);
    useEffect(() => {
        setNavn(samarbeid.navn ?? "Samarbeid uten navn");
    }, [samarbeid]);

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
            setNavn(samarbeid.navn ?? "Samarbeid uten navn");
        });
    };

    const endreNavn = () => {
        nyHendelsePåSak(
            iaSak,
            {
                saksHendelsestype: "ENDRE_PROSESS",
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
            header={{
                heading: `Endre samarbeid "${samarbeid.navn}"`,
                size: "medium",
                closeButton: true,
            }}
            width="medium"
        >
            <NavngiSamarbeidInfo>
                <Label>Navngi samarbeid</Label>
                <Detail>
                    Husk, aldri skriv personopplysninger. Maks 25 tegn.
                </Detail>
            </NavngiSamarbeidInfo>

            <IaSamarbeidNavnfelt>
                <TextField
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
                <Detail style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}>
                    {antallTegn}/25 tegn
                </Detail>
            </IaSamarbeidNavnfelt>

            <Modal.Footer>
                <Button
                    variant="primary"
                    onClick={() => {
                        endreNavn();
                    }}
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
                    <HStack align="center">
                        <Alert inline variant="success" size="small">
                            Lagret
                        </Alert>
                    </HStack>
                )}
            </Modal.Footer>
        </StyledModal>
    );
};
