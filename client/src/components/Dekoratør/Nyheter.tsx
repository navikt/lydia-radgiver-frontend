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

export default function Nyheter() {
    const filtrertNyhetsliste = UFILTRERT_NYHETSLISTE.filter(
        (nyhet) => erIDev || !nyhet.bareIDev,
    );
    if (filtrertNyhetsliste.length === 0) {
        return null;
    }

    return (
        <ActionMenu>
            <ActionMenu.Trigger>
                <InternalHeader.Button className={styles.nyhetsmenyknapp}>
                    {new Date().getTime() -
                        filtrertNyhetsliste[
                            filtrertNyhetsliste.length - 1
                        ].dato.getTime() <
                    7 * 24 * 60 * 60 * 1000 ? (
                        <BellDotFillIcon
                            title="Nye nyheter"
                            fontSize="1.5rem"
                        />
                    ) : (
                        <BellIcon title="Ingen nye nyheter" fontSize="1.5rem" />
                    )}
                </InternalHeader.Button>
            </ActionMenu.Trigger>
            <ActionMenu.Content className={styles.nyhetsmenyinnhold}>
                <ActionMenu.Group label="Nyheter">
                    {filtrertNyhetsliste.toReversed().map((nyhet) => (
                        <>
                            <ActionMenu.Item
                                key={nyhet.id}
                                className={styles.nyhet}
                                as="a"
                                href={`/nyheter/${nyhet.id}`}
                            >
                                <Heading
                                    size="small"
                                    level="3"
                                    className={styles.nyhetstittel}
                                >
                                    {nyhet.tittel}
                                </Heading>
                                <BodyShort className={styles.nyhetsingress}>
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
                                    key={`divider-${nyhet.id}`}
                                />
                            )}
                        </>
                    ))}
                </ActionMenu.Group>
            </ActionMenu.Content>
        </ActionMenu>
    );
}
