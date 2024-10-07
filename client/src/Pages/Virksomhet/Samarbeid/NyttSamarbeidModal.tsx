import { IASak } from "../../../domenetyper/domenetyper";
import { BodyShort, Button, Detail, Heading, Modal } from "@navikt/ds-react";
import { StyledModal } from "../../../components/Modal/StyledModal";
import React, { useState } from "react";
import {
    nyHendelsePåSak,
    useHentAktivSakForVirksomhet,
    useHentSamarbeid,
    useHentSamarbeidshistorikk,
} from "../../../api/lydia-api";
import {
    DetaljerWrapper,
    ModalBodyInnholdGrid,
    TextFieldStyled,
} from "./EndreSamarbeidModal";
import { useNavigate } from "react-router-dom";

interface NyttSamarbeidProps {
    iaSak: IASak;
    åpen: boolean;
    setÅpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NyttSamarbeidModal = ({
    iaSak,
    åpen,
    setÅpen,
}: NyttSamarbeidProps) => {
    const [navn, setNavn] = useState("");
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
    const { mutate: hentSamarbeidPåNytt } = useHentSamarbeid(
        iaSak.orgnr,
        iaSak.saksnummer,
    );
    const navigate = useNavigate();

    const nyttSamarbeid = () => {
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
                navn: navn,
            },
        )
            .then(() => {
                hentAktivSakPåNytt();
                hentHistorikkPåNytt();
                hentSamarbeidPåNytt().then((alleSamarbeidListe) => {
                    const sisteNyeSamarbeid = alleSamarbeidListe
                        ?.filter((s) => s.navn === navn)
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

                    <div
                        style={{
                            gridColumn: "1 / span 2",
                            marginBottom: "0.25rem",
                        }}
                    >
                        <TextFieldStyled
                            maxLength={25}
                            size="small"
                            label="Navngi samarbeid"
                            value={navn}
                            onChange={(event) => {
                                const nyttNavn = event.target.value;
                                setNavn(nyttNavn);
                            }}
                            hideLabel
                        />
                    </div>

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
