import { BodyLong, Button, ButtonProps, Detail, Label } from "@navikt/ds-react";
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

interface AdministrerIaProsesserKnappProps {
    alleSamarbeid: IaSakProsess[];
    iaSak: IASak;
    brukerErEierAvSak: boolean;
    variant?: ButtonProps["variant"];
}

export const AdministrerIaProsesserKnapp = ({
    alleSamarbeid,
    iaSak,
    brukerErEierAvSak,
    variant = "secondary",
}: AdministrerIaProsesserKnappProps) => {
    const kanAdministrereProsesser =
        brukerErEierAvSak && ["KARTLEGGES", "VI_BISTÅR"].includes(iaSak.status);

    const [åpen, setÅpen] = useState(false);

    return (
        <>
            <Button
                style={{ maxWidth: "12rem" }}
                variant={variant}
                size={"small"}
                disabled={!kanAdministrereProsesser}
                icon={<PlusIcon />}
                onClick={() => setÅpen(true)}
            >
                Nytt samarbeid
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
                <NyttSamarbeidKnapp iaSak={iaSak} />
            </BekreftValgModal>
        </>
    );
};

export const NyttSamarbeidKnapp = ({ iaSak }: { iaSak: IASak }) => {
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
        <Button
            variant={"secondary"}
            size={"small"}
            icon={<PlusIcon />}
            iconPosition={"left"}
            onClick={opprettIaProsess}
        >
            Nytt samarbeid
        </Button>
    );
};
