import { BodyLong, Button, Detail, Label } from "@navikt/ds-react";
import { BekreftValgModal } from "../../../components/Modal/BekreftValgModal";
import { IaProsessRad } from "./IaProsessRad";
import React, { useState } from "react";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";
import { IASak } from "../../../domenetyper/domenetyper";
import {
    nyHendelsePåSak,
    useHentAktivSakForVirksomhet,
    useHentSamarbeid,
    useHentSamarbeidshistorikk,
} from "../../../api/lydia-api";
import { PlusIcon } from "@navikt/aksel-icons";
import styled from "styled-components";

interface AdministrerIaProsesserKnappProps {
    alleSamarbeid: IaSakProsess[];
    iaSak: IASak;
    brukerErEierAvSak: boolean;
}

const NyttSamarbeidKnapp = styled(Button)`
    max-height: 2rem;
`;

export const AdministrerIaProsesserKnapp = ({
    alleSamarbeid,
    iaSak,
    brukerErEierAvSak,
}: AdministrerIaProsesserKnappProps) => {
    const kanAdministrereProsesser =
        brukerErEierAvSak && ["KARTLEGGES", "VI_BISTÅR"].includes(iaSak.status);

    const [åpen, setÅpen] = useState(false);

    const { mutate: hentSamarbeidshistorikkPåNytt } =
        useHentSamarbeidshistorikk(iaSak.orgnr);
    const { mutate: mutateHentSaker } = useHentAktivSakForVirksomhet(
        iaSak.orgnr,
    );
    const { mutate: hentSamarbeidPåNytt } = useHentSamarbeid(
        iaSak.orgnr,
        iaSak.saksnummer,
    );

    function opprettIaProsess() {
        nyHendelsePåSak(iaSak, {
            saksHendelsestype: "NY_PROSESS",
            gyldigeÅrsaker: [],
        }).then(() => {
            mutateHentSaker();
            hentSamarbeidshistorikkPåNytt();
            hentSamarbeidPåNytt();
        });
    }

    return (
        <>
            <Button
                variant="secondary"
                size={"small"}
                disabled={!kanAdministrereProsesser}
                onClick={() => setÅpen(true)}
            >
                Opprett og administrer samarbeid
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
                {alleSamarbeid.map((iaProsess) => (
                    <div key={iaProsess.id}>
                        <IaProsessRad iaProsess={iaProsess} iaSak={iaSak} />
                        <br />
                    </div>
                ))}
                <NyttSamarbeidKnapp
                    variant={"secondary"}
                    icon={<PlusIcon />}
                    iconPosition={"left"}
                    onClick={opprettIaProsess}
                >
                    {" "}
                    Nytt samarbeid
                </NyttSamarbeidKnapp>
            </BekreftValgModal>
        </>
    );
};
