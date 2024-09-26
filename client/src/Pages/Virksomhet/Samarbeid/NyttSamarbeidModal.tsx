import { IASak } from "../../../domenetyper/domenetyper";
import {
    BodyShort,
    Button,
    Detail,
    HStack,
    Modal,
    TextField,
} from "@navikt/ds-react";
import { StyledModal } from "../../../components/Modal/StyledModal";
import React, { useState } from "react";
import {
    nyHendelsePåSak,
    useHentAktivSakForVirksomhet,
    useHentSamarbeid,
    useHentSamarbeidshistorikk,
} from "../../../api/lydia-api";

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
                hentSamarbeidPåNytt();
            })
            .then(lukkModal);
    };

    return (
        <StyledModal
            open={åpen}
            onClose={lukkModal}
            header={{
                heading: "Opprett nytt samarbeid",
                size: "medium",
                closeButton: true,
            }}
            width={"small"}
        >
            <Modal.Body>
                <BodyShort>
                    Her kan du opprette og navngi ulike samarbeid med
                    virksomheten.
                </BodyShort>
                <br />
                <BodyShort>
                    Navnet kan vises på <i>Min Side Arbeidsgiver </i>
                    og må gjenspeile det virksomheten bruker selv.
                </BodyShort>
                <>
                    <Detail>
                        Husk, aldri skriv personopplysninger. Maks 25 tegn.
                    </Detail>
                </>
                <>
                    <HStack justify={"space-between"}>
                        <TextField
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
                    </HStack>
                    <Detail
                        style={{
                            marginTop: "0.5rem",
                            marginBottom: "0.5rem",
                        }}
                    >
                        {antallTegn}/25 tegn
                    </Detail>
                </>
                <Modal.Footer>
                    <Button variant={"primary"} onClick={nyttSamarbeid}>
                        Lagre
                    </Button>
                    <Button variant={"secondary"} onClick={lukkModal}>
                        Avbryt
                    </Button>
                </Modal.Footer>
            </Modal.Body>
        </StyledModal>
    );
};
