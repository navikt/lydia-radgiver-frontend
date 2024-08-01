import { BodyLong, Button, Detail, Label } from "@navikt/ds-react";
import { BekreftValgModal } from "../../../components/Modal/BekreftValgModal";
import { IaProsessRad } from "./IaProsessRad";
import React, { useState } from "react";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";
import { IASak } from "../../../domenetyper/domenetyper";

interface AdministrerIaProsesserKnappProps {
    iaProsesser: IaSakProsess[];
    iaSak: IASak;
}

export const AdministrerIaProsesserKnapp = ({
    iaProsesser,
    iaSak,
}: AdministrerIaProsesserKnappProps) => {
    const [åpen, setÅpen] = useState(false);

    return (
        <>
            <Button variant="tertiary" onClick={() => setÅpen(true)}>
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
                    virksomheten. Navnet vises på <i>Min Side Arbeidsgiver</i>{" "}
                    og må gjenspeile det virksomheten bruker selv.
                </BodyLong>
                <br />
                <Label>Navngi samarbeid</Label>
                <Detail>
                    Husk, aldri skriv personopplysninger. Maks 25 tegn.
                </Detail>
                {iaProsesser.map((iaProsess) => (
                    <IaProsessRad
                        key={iaProsess.id}
                        iaProsess={iaProsess}
                        iaSak={iaSak}
                    />
                ))}
            </BekreftValgModal>
        </>
    );
};
