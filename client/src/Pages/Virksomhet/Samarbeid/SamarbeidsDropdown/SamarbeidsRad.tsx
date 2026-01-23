import { ActionMenu, Button } from "@navikt/ds-react";
import React from "react";
import { IaSakProsess } from "../../../../domenetyper/iaSakProsess";
import { NotePencilIcon } from "@navikt/aksel-icons";
import { useErPåAktivSak } from "../../VirksomhetContext";

import styles from "./samarbeidsdropdown.module.scss";
import Samarbeidslenke from "./Samarbeidslenke";

interface SamarbeidsRadProps {
    orgnr: string;
    saksnummer: string;
    samarbeid: IaSakProsess;
    setÅpen: React.Dispatch<React.SetStateAction<boolean>>;
    setValgtSamarbeid: React.Dispatch<
        React.SetStateAction<IaSakProsess | null>
    >;
    kanEndreSamarbeid: boolean;
}

export const SamarbeidsRad = ({
    orgnr,
    saksnummer,
    samarbeid,
    setÅpen,
    setValgtSamarbeid,
    kanEndreSamarbeid,
}: SamarbeidsRadProps) => {
    const erPåAktivSak = useErPåAktivSak();

    return (
        <ActionMenu.Item className={styles.actionMenuItem}>
            <Samarbeidslenke
                orgnr={orgnr}
                saksnummer={saksnummer}
                samarbeid={samarbeid}
            />
            {kanEndreSamarbeid && erPåAktivSak && (
                <Button
                    icon={<NotePencilIcon fontSize="1.5rem" />}
                    variant="tertiary"
                    size="small"
                    title="Endre samarbeid"
                    onClick={() => {
                        setÅpen(true);
                        setValgtSamarbeid(samarbeid);
                    }}
                />
            )}
        </ActionMenu.Item>
    );
};
