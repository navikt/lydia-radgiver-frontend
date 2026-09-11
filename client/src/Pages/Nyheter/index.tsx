import React from "react";
import { NavLink, useParams } from "react-router-dom";
import SideContainer from "../../components/SideContainer";
import { Heading, HStack, VStack } from "@navikt/ds-react";
import { NyheterInnhold, UFILTRERT_NYHETSLISTE } from "./Nyhetsdata";
import styles from "./nyhetsside.module.scss";
import { lokalDato } from "../../util/dato";
import { erIDev } from "../../components/Dekoratør/Dekoratør";

export default function Nyheter() {
    const { nyhetsId } = useParams<{ nyhetsId: string }>();
    const filtrertNyhetsliste = UFILTRERT_NYHETSLISTE.filter(
        (nyhet) => erIDev || !nyhet.bareIDev,
    ).sort((a, b) => b.dato.getTime() - a.dato.getTime());

    const valgtNyhet = React.useMemo(
        () =>
            filtrertNyhetsliste.find(
                (nyhet) => nyhet.id.toString() === nyhetsId,
            ),
        [nyhetsId, filtrertNyhetsliste],
    );

    return (
        <SideContainer className={styles.nyhetsside}>
            <Nyhetsliste nyheter={filtrertNyhetsliste} />
            {valgtNyhet && <Nyhetsdetaljer nyhet={valgtNyhet} />}
        </SideContainer>
    );
}

function Nyhetsliste({ nyheter }: { nyheter: NyheterInnhold[] }) {
    return (
        <VStack className={styles.nyhetsliste}>
            <Heading level="2" size="medium">
                Nyheter
            </Heading>
            {nyheter.map((nyhet) => (
                <NyhetslisteEntry key={nyhet.id} nyhet={nyhet} />
            ))}
        </VStack>
    );
}

function NyhetslisteEntry({ nyhet }: { nyhet: NyheterInnhold }) {
    //Link to /nyheter/:nyhetsId
    return (
        <NavLink
            to={`/nyheter/${nyhet.id}`}
            className={({ isActive }) =>
                isActive
                    ? `${styles.nyhetslisteEntry} ${styles.aktivLenke}`
                    : styles.nyhetslisteEntry
            }
        >
            {nyhet.tittel}
        </NavLink>
    );
}

function Nyhetsdetaljer({ nyhet }: { nyhet: NyheterInnhold }) {
    return (
        <div className={styles.nyhetsdetaljer}>
            <HStack justify="space-between" align="baseline">
                <h3>{nyhet.tittel}</h3>
                <span>{lokalDato(nyhet.dato)}</span>
            </HStack>
            <p>{nyhet.ingress}</p>
        </div>
    );
}
