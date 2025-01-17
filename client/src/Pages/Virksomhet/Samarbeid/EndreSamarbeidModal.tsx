import {
    DEFAULT_SAMARBEIDSNAVN,
    defaultNavnHvisTomt,
    IaSakProsess,
} from "../../../domenetyper/iaSakProsess";
import {
    Alert,
    BodyShort,
    Button,
    Detail,
    Heading,
    Link,
    Modal,
    TextField,
} from "@navikt/ds-react";
import { IASak, IASakshendelseType } from "../../../domenetyper/domenetyper";
import React, { useEffect, useState } from "react";
import {
    useHentAktivSakForVirksomhet,
    useHentSamarbeidshistorikk,
} from "../../../api/lydia-api/virksomhet";
import { nyHendelsePåSak } from "../../../api/lydia-api/sak";
import styled from "styled-components";
import { ExternalLinkIcon, TrashIcon } from "@navikt/aksel-icons";
import { useHentSamarbeid } from "../../../api/lydia-api/spørreundersøkelse";
import { StyledSamarbeidModal } from "./NyttSamarbeidModal";

export const ModalBodyInnholdFlex = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

export const TextFieldStyled = styled(TextField)`
    min-width: fit-content;
    width: 100%;
`;

export const DetaljerWrapper = styled.div<{ $disabled?: boolean }>`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 0.5rem;
    opacity: ${({ $disabled }) => ($disabled ? 0.25 : 1)};
`;

const SquareButton = styled(Button)`
    width: 3rem;
    height: 3rem;
`;

interface EndreSamarbeidModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    samarbeid: IaSakProsess;
    iaSak: IASak;
}

export const MAX_LENGDE_SAMARBEIDSNAVN = 50;

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
    const { mutate: hentSamarbeidPåNytt, data: samarbeidData } =
        useHentSamarbeid(iaSak.orgnr, iaSak.saksnummer);

    const navnErUbrukt =
        samarbeidData?.find(
            (s) =>
                s.navn?.toLowerCase() === navn.toLowerCase() ||
                (navn.toLowerCase() === DEFAULT_SAMARBEIDSNAVN.toLowerCase() &&
                    s.navn === ""),
        ) === undefined;

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
        const nyttNavn = navn.trim();
        return nyHendelsePåSak(
            iaSak,
            {
                saksHendelsestype: hendelsestype,
                gyldigeÅrsaker: [],
            },
            null,
            {
                ...samarbeid,
                navn: nyttNavn,
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
        <StyledSamarbeidModal
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
                <ModalBodyInnholdFlex>
                    <BodyShort>
                        Her kan du endre navn på samarbeidet &quot;
                        {defaultNavnHvisTomt(samarbeid.navn)}&quot;
                        Samarbeidsnavn skal beskrive den avdelingen eller
                        gruppen man samarbeider med. Navnet må være det samme
                        som virksomheten bruker selv.
                    </BodyShort>
                    <br />
                    <TextFieldStyled
                        maxLength={MAX_LENGDE_SAMARBEIDSNAVN}
                        size="small"
                        label="Navngi samarbeid"
                        value={navn}
                        onChange={(nyttnavn) => {
                            setNavn(nyttnavn.target.value);
                            setLagreNavnVellykket(false);
                            setAntallTegn(nyttnavn.target.value.length);
                        }}
                        error={
                            navnErUbrukt || samarbeid.navn === navn
                                ? undefined
                                : "Navnet er allerede i bruk"
                        }
                        onKeyDown={(event) => {
                            // Submit på enter.
                            if (event.key === "Enter" && navnErUbrukt) {
                                endreNavn();
                            }
                        }}
                        hideLabel
                    />
                    <DetaljerWrapper>
                        <Detail>
                            <b>
                                Husk, aldri skriv{" "}
                                <Link
                                    href="https://www.datatilsynet.no/rettigheter-og-plikter/personopplysninger/"
                                    inlineText
                                >
                                    personopplysninger
                                    <ExternalLinkIcon aria-hidden />
                                </Link>
                                .
                            </b>
                        </Detail>
                        <Detail>
                            {antallTegn}/{MAX_LENGDE_SAMARBEIDSNAVN} tegn
                        </Detail>
                    </DetaljerWrapper>
                </ModalBodyInnholdFlex>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="primary"
                    onClick={() => {
                        endreNavn();
                    }}
                    disabled={
                        !navnErUbrukt ||
                        navn === defaultNavnHvisTomt(samarbeid.navn)
                    }
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
                <SquareButton
                    icon={
                        <TrashIcon
                            title={`Slett "${samarbeid.navn}"`}
                            fontSize="2rem"
                        />
                    }
                    size={"small"}
                    variant="secondary-neutral"
                    title={`Slett "${samarbeid.navn}"`}
                    onClick={slettSamarbeid}
                />
                {lagreNavnVellykket && (
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <Alert inline variant="success" size="small">
                            Lagret
                        </Alert>
                    </div>
                )}
            </Modal.Footer>
        </StyledSamarbeidModal>
    );
};
