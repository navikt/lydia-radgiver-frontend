import { BellDotFillIcon, BellIcon } from "@navikt/aksel-icons";
import {
    ActionMenu,
    BodyShort,
    Heading,
    InternalHeader,
} from "@navikt/ds-react";
import { lokalDato } from "../../util/dato";
import styles from "./nyheter.module.scss";
import { FILTRERT_SORTERT_NYHETSLISTE } from "../../Pages/Nyheter/Nyhetsdata";

export default function Nyheter() {
    const filtrertNyhetsliste = FILTRERT_SORTERT_NYHETSLISTE;
    if (filtrertNyhetsliste.length === 0) {
        return null;
    }

    return (
        <ActionMenu>
            <ActionMenu.Trigger>
                <InternalHeader.Button>
                    {new Date().getTime() -
                        filtrertNyhetsliste[
                            filtrertNyhetsliste.length - 1
                        ].dato.getTime() <
                    7 * 24 * 60 * 60 * 1000 ? (
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
                        <>
                            <ActionMenu.Item
                                key={nyhet.id}
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
