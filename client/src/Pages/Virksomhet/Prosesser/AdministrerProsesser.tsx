import React, { useState } from "react";
import { useHentProsesser } from "../../../api/lydia-api";
import { BodyLong, Button, Detail, Label } from "@navikt/ds-react";
import styled from "styled-components";
import { BekreftValgModal } from "../../../components/Modal/BekreftValgModal";
import { ProsessRad } from "./ProsessRad";
import { IASak } from "../../../domenetyper/domenetyper";

const ProsessKnappContainer = styled.div`
    margin-bottom: 1.5rem;
`;

interface AdministrerProsesserProps {
    orgnummer: string;
    iaSak: IASak;
}

export const AdministrerProsesser = ({
    orgnummer,
    iaSak,
}: AdministrerProsesserProps) => {
    const { data: iaProsesser } = useHentProsesser(orgnummer, iaSak.saksnummer);
    const harAktiveProsesser = iaProsesser && iaProsesser.length > 0;
    const [åpen, setÅpen] = useState(false);

    return (
        harAktiveProsesser && (
            <ProsessKnappContainer>
                <Button variant="secondary" onClick={() => setÅpen(true)}>
                    Administrer samarbeid
                </Button>
                <BekreftValgModal
                    onConfirm={() => setÅpen(false)}
                    onCancel={() => setÅpen(false)}
                    åpen={åpen}
                    title="Administrer samarbeid"
                    jaTekst="Ferdig"
                >
                    <br />
                    <BodyLong>
                        Her kan du opprette og navngi ulike samarbeid med
                        virksomheten. Navnet vises på{" "}
                        <i>Min Side Arbeidsgiver</i> og må gjenspeile det
                        virksomheten bruker selv.
                    </BodyLong>
                    <br />
                    <Label>Navngi samarbeid</Label>
                    <Detail>
                        Husk, aldri skriv personopplysninger. Maks 25 tegn.
                    </Detail>
                    {iaProsesser.map((iaProsess) => (
                        <ProsessRad
                            key={iaProsess.id}
                            iaProsess={iaProsess}
                            iaSak={iaSak}
                        />
                    ))}
                </BekreftValgModal>
            </ProsessKnappContainer>
        )
    );
};
