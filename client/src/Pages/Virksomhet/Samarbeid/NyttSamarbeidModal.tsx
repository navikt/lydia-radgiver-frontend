import { IASak } from "../../../domenetyper/domenetyper";
import { BodyShort, Button, Checkbox, Detail, Heading, Modal } from "@navikt/ds-react";
import { StyledModal } from "../../../components/Modal/StyledModal";
import React, { useState } from "react";

import { useHentSamarbeidshistorikk } from "../../../api/lydia-api/virksomhet";
import { useHentAktivSakForVirksomhet } from "../../../api/lydia-api/virksomhet";
import { nyHendelsePåSak } from "../../../api/lydia-api/sak";
import {
    DetaljerWrapper,
    MAX_LENGDE_SAMARBEIDSNAVN,
    ModalBodyInnholdGrid,
    TextFieldStyled,
} from "./EndreSamarbeidModal";
import { useNavigate } from "react-router-dom";
import { useHentSamarbeid } from "../../../api/lydia-api/spørreundersøkelse";
import { Virksomhet } from "../../../domenetyper/virksomhet";

interface NyttSamarbeidProps {
    iaSak: IASak;
    åpen: boolean;
    setÅpen: React.Dispatch<React.SetStateAction<boolean>>;
    virksomhet: Virksomhet;
}


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
    const { mutate: hentAktivSakPåNytt } = useHentAktivSakForVirksomhet(
        iaSak.orgnr,
    );
    const { mutate: hentHistorikkPåNytt } = useHentSamarbeidshistorikk(
        iaSak.orgnr,
    );
    const { mutate: hentSamarbeidPåNytt, data: samarbeidData } = useHentSamarbeid(
        iaSak.orgnr,
        iaSak.saksnummer,
    );
    const samarbeidsnavnBasertPåVirksomhet = virksomhet.navn.length > MAX_LENGDE_SAMARBEIDSNAVN ? `${virksomhet.navn.substring(0, MAX_LENGDE_SAMARBEIDSNAVN - 3)}...` : virksomhet.navn;
    const kanBrukeVirksomhetsnavn = samarbeidData?.find((s) => s.navn === samarbeidsnavnBasertPåVirksomhet) === undefined;
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
        <StyledModal
            open={åpen}
            onClose={lukkModal}
            width={"small"}
            aria-label={"Opprett nytt samarbeid"}
        >
            <Modal.Header closeButton={true}>
                <Heading size="medium">Opprett nytt samarbeid</Heading>
            </Modal.Header>
            <Modal.Body>
                <ModalBodyInnholdGrid>
                    <BodyShort
                        style={{
                            gridColumn: "1 / span 2",
                            marginBottom: "0.75rem",
                        }}
                    >
                        Her kan du opprette og navngi ulike samarbeid med
                        virksomheten.
                    </BodyShort>
                    {
                        kanBrukeVirksomhetsnavn && (
                            <Checkbox
                                size="small"
                                checked={brukVirksomhetsnavn}
                                onChange={() => {
                                    setBrukVirksomhetsnavn(!brukVirksomhetsnavn);
                                    if (!brukVirksomhetsnavn) {
                                        setNavn(samarbeidsnavnBasertPåVirksomhet);
                                    }
                                }}
                            >Bruk virksomhetsnavn</Checkbox>
                        )
                    }
                    <div
                        style={{
                            gridColumn: "1 / span 2",
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
                            hideLabel
                            onKeyDown={(event) => {
                                // Submit på enter.
                                if (event.key === "Enter") {
                                    nyttSamarbeid();
                                }
                            }}
                        />
                    </div>
                    <DetaljerWrapper $disabled={brukVirksomhetsnavn}>
                        <Detail>Husk, aldri skriv personopplysninger.</Detail>
                        <Detail>{antallTegn}/{MAX_LENGDE_SAMARBEIDSNAVN} tegn</Detail>
                    </DetaljerWrapper>
                    <Detail style={{ gridColumn: "1", marginTop: "1.25rem" }}>
                        Navnet kan vises på <i>Min Side Arbeidsgiver </i>
                        og må gjenspeile det virksomheten bruker selv.
                    </Detail>
                </ModalBodyInnholdGrid>
            </Modal.Body>
            <Modal.Footer>
                <Button variant={"primary"} onClick={nyttSamarbeid}>
                    Opprett
                </Button>
                <Button variant={"secondary"} onClick={lukkModal}>
                    Avbryt
                </Button>
            </Modal.Footer>
        </StyledModal>
    );
};
