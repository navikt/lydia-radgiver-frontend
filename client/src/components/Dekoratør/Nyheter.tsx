import React from "react";
import { BellDotFillIcon, BellIcon } from "@navikt/aksel-icons";
import {
    ActionMenu,
    BodyShort,
    Heading,
    InternalHeader,
} from "@navikt/ds-react";
import { lokalDato } from "../../util/dato";
import styles from "./nyheter.module.scss";
import { UFILTRERT_NYHETSLISTE } from "../../Pages/Nyheter/Nyhetsdata";
import { erIDev } from "./Dekoratør";

const EN_UKE_I_MILLISEKUNDER = 7 * 24 * 60 * 60 * 1000;

export default function Nyheter() {
    const filtrertNyhetsliste = React.useMemo(
        () =>
            UFILTRERT_NYHETSLISTE.filter(
                (nyhet) => erIDev || !nyhet.bareIDev,
            ).sort((a, b) => b.dato.getTime() - a.dato.getTime()),
        [UFILTRERT_NYHETSLISTE],
    );
    if (filtrertNyhetsliste.length === 0) {
        return null;
    }

    const nyesteNyhet = filtrertNyhetsliste[0];
    const harUlesteNyheter =
        new Date().getTime() - nyesteNyhet.dato.getTime() <
        EN_UKE_I_MILLISEKUNDER;

    return (
        <ActionMenu>
            <ActionMenu.Trigger>
                <InternalHeader.Button>
                    {harUlesteNyheter ? (
                        <BellDotFillIcon
                            title="Uleste nyheter"
                            fontSize="1.5rem"
                        />
                    ) : (
                        <BellIcon
                            title="Ingen uleste nyheter"
                            fontSize="1.5rem"
                        />
                    )}
                </InternalHeader.Button>
            </ActionMenu.Trigger>
            <ActionMenu.Content className={styles.nyhetsmenyinnhold}>
                <ActionMenu.Group label="Nyheter">
                    {filtrertNyhetsliste.map((nyhet) => (
                        <React.Fragment key={nyhet.id}>
                            <ActionMenu.Item
                                className={styles.nyhet}
                                as="a"
                                href={`/nyheter/${nyhet.id}`}
                            >
                                <Heading size="small" level="3">
                                    {nyhet.tittel}
                                </Heading>
                                <BodyShort>
                                    {nyhet.shortIngress ?? nyhet.ingress}
                                </BodyShort>
                                <BodyShort
                                    size="small"
                                    className={styles.nyhetsdato}
                                >
                                    {lokalDato(nyhet.dato)}
                                </BodyShort>
                            </ActionMenu.Item>
                            {nyhet.id !== filtrertNyhetsliste[0].id && (
                                <ActionMenu.Divider
                                    className={styles.nyhetsmenydivider}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </ActionMenu.Group>
            </ActionMenu.Content>
        </ActionMenu>
    );
}
