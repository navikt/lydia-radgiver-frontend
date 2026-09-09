import React from "react";
import { useParams } from "react-router-dom";
import SideContainer from "../../components/SideContainer";
import { HStack, VStack } from "@navikt/ds-react";
import { InternLenke } from "../../components/InternLenke";
import { NyheterInnhold, UFILTRERT_NYHETSLISTE } from "./Nyhetsdata";
import { erIDev } from "../../components/Dekoratør/Dekoratør";
import styles from "./nyhetsside.module.scss";

export default function Nyheter() {
    const { nyhetsId } = useParams<{ nyhetsId: string }>();
    const filtrertNyhetsliste = UFILTRERT_NYHETSLISTE.filter(
        (nyhet) => erIDev || !nyhet.bareIDev,
    );

    const valgtNyhet = React.useMemo(
        () =>
            filtrertNyhetsliste.find(
                (nyhet) => nyhet.id.toString() === nyhetsId,
            ),
        [nyhetsId, filtrertNyhetsliste],
    );

    return (
        <SideContainer className={styles.nyhetsside}>
            <HStack align="stretch" wrap={false}>
                <Nyhetsliste nyheter={filtrertNyhetsliste} />
                {valgtNyhet && <Nyhetsdetaljer nyhet={valgtNyhet} />}
            </HStack>
        </SideContainer>
    );
}

function Nyhetsliste({ nyheter }: { nyheter: NyheterInnhold[] }) {
    return (
        <VStack className={styles.nyhetsliste}>
            {nyheter.map((nyhet) => (
                <NyhetslisteEntry key={nyhet.id} nyhet={nyhet} />
            ))}
        </VStack>
    );
}

function NyhetslisteEntry({ nyhet }: { nyhet: NyheterInnhold }) {
    //Link to /nyheter/:nyhetsId
    return (
        <InternLenke
            href={`/nyheter/${nyhet.id}`}
            className={styles.nyhetslisteEntry}
        >
            {nyhet.tittel}
        </InternLenke>
    );
}

function Nyhetsdetaljer({ nyhet }: { nyhet: NyheterInnhold }) {
    return (
        <div className={styles.nyhetsdetaljer}>
            <h3>{nyhet.tittel}</h3>

            <p>{nyhet.ingress}</p>
        </div>
    );
}
