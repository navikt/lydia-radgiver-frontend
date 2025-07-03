import { BodyShort, Heading, ToggleGroup } from "@navikt/ds-react";
import { useHentHistoriskstatistikk } from "../../../../api/lydia-api/virksomhet";
import Graf from "./Graf";
import React from "react";
import Tabell from "../Tabell/Tabell";
import styles from "./graf.module.scss";

interface HistoriskStatistikkProps {
    orgnr: string;
}

export const Historiskstatistikk = ({ orgnr }: HistoriskStatistikkProps) => {
    const { data: historiskStatistikk } = useHentHistoriskstatistikk(orgnr);
    const [visTabell, setVisTabell] = React.useState(false);

    if (!historiskStatistikk) {
        return null;
    }

    return (
        <div className={styles.historikkStatistikkContainer}>
            <div className={styles.flexContainer}>
                <div className={styles.headingContainer}>
                    <Heading spacing={true} level="4" size="medium">
                        Historisk statistikk
                    </Heading>
                    <BodyShort>
                        Her kan du se hvordan det legemeldte sykefraværet
                        utvikler seg over tid.
                    </BodyShort>
                </div>
                <ToggleGroup
                    className={styles.graphOrTableSwitch}
                    value={visTabell ? "tabell" : "graf"}
                    aria-label="Hvis du bruker skjermleser, bør du velge tabell"
                    onChange={(value) => {
                        setVisTabell(value === "tabell");
                    }}
                >
                    <ToggleGroup.Item value="graf">Graf</ToggleGroup.Item>
                    <ToggleGroup.Item value="tabell">Tabell</ToggleGroup.Item>
                </ToggleGroup>
            </div>
            {visTabell ? (
                <Tabell historiskStatistikk={historiskStatistikk} />
            ) : (
                <Graf historiskStatistikk={historiskStatistikk} />
            )}
        </div>
    );
};
