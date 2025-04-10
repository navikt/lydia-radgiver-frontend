import { IASak } from "../../../domenetyper/domenetyper";
import {
    BodyShort,
    Button,
    Checkbox,
    Detail,
    Heading,
    Modal,
} from "@navikt/ds-react";
import React, { useState } from "react";

import { useHentSakshistorikk } from "../../../api/lydia-api/virksomhet";
import { useHentSakForVirksomhet } from "../../../api/lydia-api/virksomhet";
import { nyHendelsePåSak } from "../../../api/lydia-api/sak";
import {
    DetaljerWrapper,
    MAX_LENGDE_SAMARBEIDSNAVN,
    ModalBodyInnholdFlex,
    TextFieldStyled,
} from "./EndreSamarbeidModal";
import { useNavigate } from "react-router-dom";
import { useHentSamarbeid } from "../../../api/lydia-api/spørreundersøkelse";
import { Virksomhet } from "../../../domenetyper/virksomhet";
import styled from "styled-components";
import { DEFAULT_SAMARBEIDSNAVN } from "../../../domenetyper/iaSakProsess";
import { EksternLenke } from "../../../components/EksternLenke";

interface NyttSamarbeidProps {
    iaSak: IASak;
    åpen: boolean;
    setÅpen: React.Dispatch<React.SetStateAction<boolean>>;
    virksomhet: Virksomhet;
}

export const StyledSamarbeidModal = styled(Modal)`
    max-width: 42rem;
    width: 100%;
`;

export const NyttSamarbeidModal = ({
    iaSak,
    åpen,
    setÅpen,
    virksomhet,
}: NyttSamarbeidProps) => {
    const [navn, setNavn] = useState("");
    const [brukVirksomhetsnavn, setBrukVirksomhetsnavn] = useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const antallTegn = navn.length;
    const lukkModal = () => {
        setNavn("");
        setÅpen(false);
    };
    const { mutate: hentAktivSakPåNytt } = useHentSakForVirksomhet(
        iaSak.orgnr,
        iaSak.saksnummer,
    );
    const { mutate: hentHistorikkPåNytt } = useHentSakshistorikk(
        iaSak.orgnr,
    );
    const { mutate: hentSamarbeidPåNytt, data: samarbeidData } =
        useHentSamarbeid(iaSak.orgnr, iaSak.saksnummer);
    const samarbeidsnavnBasertPåVirksomhet =
        virksomhet.navn.length > MAX_LENGDE_SAMARBEIDSNAVN
            ? `${virksomhet.navn.substring(0, MAX_LENGDE_SAMARBEIDSNAVN - 3)}...`
            : virksomhet.navn;
    const kanBrukeVirksomhetsnavn =
        samarbeidData?.find(
            (s) => s.navn === samarbeidsnavnBasertPåVirksomhet,
        ) === undefined;
    const navnErUbrukt =
        samarbeidData?.find(
            (s) =>
                s.navn?.toLowerCase() === navn.toLowerCase() ||
                (navn.toLowerCase() === DEFAULT_SAMARBEIDSNAVN.toLowerCase() &&
                    s.navn === ""),
        ) === undefined;
    const navigate = useNavigate();

    const nyttSamarbeid = () => {
        const nyttNavn = navn.trim();
        nyHendelsePåSak(
            iaSak,
            {
                saksHendelsestype: "NY_PROSESS",
                gyldigeÅrsaker: [],
            },
            null,
            {
                id: 0,
                status: "AKTIV",
                saksnummer: iaSak.saksnummer,
                navn: nyttNavn,
                sistEndret: null,
                opprettet: null,
            },
        )
            .then(() => {
                hentAktivSakPåNytt();
                hentHistorikkPåNytt();
                hentSamarbeidPåNytt().then((alleSamarbeidListe) => {
                    const sisteNyeSamarbeid = alleSamarbeidListe
                        ?.filter((s) => s.navn === nyttNavn)
                        .sort((a, b) => b.id - a.id)[0];

                    navigate(
                        sisteNyeSamarbeid
                            ? `/virksomhet/${iaSak.orgnr}/sak/${iaSak.saksnummer}/samarbeid/${sisteNyeSamarbeid.id}`
                            : `/virksomhet/${iaSak.orgnr}`,
                    );
                });
            })
            .finally(lukkModal);
    };

    React.useEffect(() => {
        // Fokus på inputfeltet når modalen åpnes
        if (åpen) {
            inputRef.current?.focus();
            setBrukVirksomhetsnavn(false);
        }
    }, [åpen]);

    return (
        <StyledSamarbeidModal
            open={åpen}
            onClose={lukkModal}
            width={"small"}
            aria-label={"Opprett nytt samarbeid"}
        >
            <Modal.Header closeButton={true}>
                <Heading size="medium">Opprett nytt samarbeid</Heading>
            </Modal.Header>
            <Modal.Body>
                <ModalBodyInnholdFlex>
                    <BodyShort
                        style={{
                            marginBottom: "0.75rem",
                        }}
                    >
                        Samarbeidsnavn skal beskrive den avdelingen eller
                        gruppen man samarbeider med. Navnet må være det samme
                        som virksomheten bruker selv.{" "}
                        {kanBrukeVirksomhetsnavn && (
                            <>
                                Er det bare ett samarbeid huker du av for{" "}
                                <i>Bruk virksomhetens navn</i>.
                            </>
                        )}
                    </BodyShort>
                    {kanBrukeVirksomhetsnavn && (
                        <Checkbox
                            size="small"
                            checked={brukVirksomhetsnavn}
                            onChange={() => {
                                setBrukVirksomhetsnavn(!brukVirksomhetsnavn);
                                if (!brukVirksomhetsnavn) {
                                    setNavn(samarbeidsnavnBasertPåVirksomhet);
                                }
                            }}
                        >
                            Bruk virksomhetsnavn
                        </Checkbox>
                    )}
                    <div
                        style={{
                            marginBottom: "0.25rem",
                        }}
                    >
                        <TextFieldStyled
                            ref={inputRef}
                            readOnly={brukVirksomhetsnavn}
                            maxLength={MAX_LENGDE_SAMARBEIDSNAVN}
                            size="small"
                            label="Navngi samarbeid"
                            value={navn}
                            onChange={(event) => {
                                const nyttNavn = event.target.value;
                                setNavn(nyttNavn);
                            }}
                            error={
                                navnErUbrukt
                                    ? undefined
                                    : navn === "" ||
                                        navn === "Samarbeid uten navn"
                                        ? `Navnet er allerede i bruk (tomt navn og "Samarbeid uten navn" regnes som like)`
                                        : "Navnet er allerede i bruk"
                            }
                            hideLabel
                            onKeyDown={(event) => {
                                // Submit på enter.
                                if (event.key === "Enter" && navnErUbrukt) {
                                    nyttSamarbeid();
                                }
                            }}
                        />
                    </div>
                    <DetaljerWrapper $disabled={brukVirksomhetsnavn}>
                        <Detail>
                            <b>
                                Husk, aldri skriv{" "}
                                <EksternLenke
                                    href="https://www.datatilsynet.no/rettigheter-og-plikter/personopplysninger/"
                                    inlineText
                                >
                                    personopplysninger
                                </EksternLenke>
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
                    variant={"primary"}
                    onClick={nyttSamarbeid}
                    disabled={!navnErUbrukt}
                >
                    Opprett
                </Button>
                <Button variant={"secondary"} onClick={lukkModal}>
                    Avbryt
                </Button>
            </Modal.Footer>
        </StyledSamarbeidModal>
    );
};
