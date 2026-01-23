import { Virksomhet } from "../../../../domenetyper/virksomhet";
import {
    IAProsessStatusEnum,
    IASak,
} from "../../../../domenetyper/domenetyper";
import { ActionMenu, BodyShort, Button } from "@navikt/ds-react";
import { ChevronDownIcon } from "@navikt/aksel-icons";
import React, { useState } from "react";
import { SamarbeidsRad } from "./SamarbeidsRad";
import { SamarbeidsDropdownFooter } from "./SamarbeidsDropdownFooter";
import {
    erSaksbehandler,
    useHentBrukerinformasjon,
} from "../../../../api/lydia-api/bruker";
import { EndreSamarbeidModal } from "../EndreSamarbeidModal";
import { IaSakProsess } from "../../../../domenetyper/iaSakProsess";
import { useHentSamarbeid } from "../../../../api/lydia-api/spørreundersøkelse";
import FullførteSamarbeid from "./FullførteSamarbeid";
import { useHentTeam } from "../../../../api/lydia-api/team";

import styles from "./samarbeidsdropdown.module.scss";
interface SamarbeidsDropdown2Props {
    iaSak: IASak | undefined;
    virksomhet: Virksomhet;
    setNyttSamarbeidModalÅpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SamarbeidsDropdown = ({
    iaSak,
    virksomhet,
    setNyttSamarbeidModalÅpen,
}: SamarbeidsDropdown2Props) => {
    const { data: uflitrertAlleSamarbeid, mutate: hentSamarbeidPåNytt } =
        useHentSamarbeid(iaSak?.orgnr, iaSak?.saksnummer);
    const alleSamarbeid = uflitrertAlleSamarbeid?.filter(
        (samarbeid) => samarbeid.status === IAProsessStatusEnum.enum.AKTIV,
    );

    const harIngenAktiveSamarbeid =
        alleSamarbeid === undefined || alleSamarbeid?.length === 0;

    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    const { data: følgere = [] } = useHentTeam(iaSak?.saksnummer);
    const brukerFølgerSak = følgere.some(
        (følger) => følger === brukerInformasjon?.ident,
    );
    const brukerErEierAvSak = iaSak?.eidAv === brukerInformasjon?.ident;
    const kanEndreSamarbeid =
        (erSaksbehandler(brukerInformasjon) && brukerFølgerSak) ||
        brukerErEierAvSak;

    const [endreSamarbeidModalÅpen, setEndreSamarbeidModalÅpen] =
        useState(false);
    const [valgtSamarbeid, setValgtSamarbeid] = useState<IaSakProsess | null>(
        null,
    );
    return (
        <>
            <ActionMenu>
                <ActionMenu.Trigger>
                    <Button
                        icon={<ChevronDownIcon aria-hidden />}
                        iconPosition="right"
                        variant="primary-neutral"
                        size="small"
                        onClick={() => {
                            hentSamarbeidPåNytt();
                            setValgtSamarbeid(null);
                            setEndreSamarbeidModalÅpen(false);
                        }}
                    >
                        Samarbeid
                        {harIngenAktiveSamarbeid
                            ? ""
                            : ` (${alleSamarbeid?.length})`}
                    </Button>
                </ActionMenu.Trigger>
                <ActionMenu.Content className={styles.samarbeidsDropdown}>
                    {harIngenAktiveSamarbeid ? (
                        <BodyShort style={{ padding: "1rem" }}>
                            <b>Ingen aktive samarbeid </b>
                        </BodyShort>
                    ) : (
                        iaSak &&
                        alleSamarbeid && (
                            <ActionMenu.Group label={virksomhet.navn}>
                                {alleSamarbeid.map((samarbeid) => (
                                    <SamarbeidsRad
                                        key={samarbeid.id}
                                        orgnr={iaSak.orgnr}
                                        saksnummer={iaSak.saksnummer}
                                        samarbeid={samarbeid}
                                        kanEndreSamarbeid={kanEndreSamarbeid}
                                        setÅpen={setEndreSamarbeidModalÅpen}
                                        setValgtSamarbeid={setValgtSamarbeid}
                                    />
                                ))}
                            </ActionMenu.Group>
                        )
                    )}
                    <SamarbeidsDropdownFooter
                        setÅpen={setNyttSamarbeidModalÅpen}
                        kanEndreSamarbeid={kanEndreSamarbeid}
                        iaSakStatus={iaSak?.status}
                    />
                    <FullførteSamarbeid
                        iaSak={iaSak}
                        alleSamarbeid={uflitrertAlleSamarbeid}
                    />
                </ActionMenu.Content>
            </ActionMenu>
            {valgtSamarbeid && iaSak && (
                <EndreSamarbeidModal
                    samarbeid={valgtSamarbeid}
                    iaSak={iaSak}
                    open={endreSamarbeidModalÅpen}
                    setOpen={setEndreSamarbeidModalÅpen}
                />
            )}
        </>
    );
};
