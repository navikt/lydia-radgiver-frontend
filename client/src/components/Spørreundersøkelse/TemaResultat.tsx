import {
    BodyShort,
    Heading,
    HeadingProps,
    HStack,
    ToggleGroup,
} from "@navikt/ds-react";
import BarChart from "./Grafer/BarChart";
import { PersonGroupFillIcon } from "@navikt/aksel-icons";
import { SpørsmålResultat } from "../../domenetyper/spørreundersøkelseResultat";
import styles from "./spørreundersøkelse.module.scss";
import TekstligResultatvisning from "./TekstligResultatvisning";

interface Props {
    navn: string;
    spørsmålResultat: SpørsmålResultat[];
    erIEksportMode?: boolean;
    headingSize?: HeadingProps["size"];
    brukTekstvisning?: boolean;
    setBrukTekstvisning?: React.Dispatch<React.SetStateAction<boolean>>;
    index?: number;
}

export const TemaResultat = ({
    navn,
    spørsmålResultat,
    erIEksportMode = false,
    headingSize = "medium",
    brukTekstvisning,
    setBrukTekstvisning,
    index,
}: Props) => {
    return (
        <>
            <HStack justify="space-between" align="center" as="span">
                <Heading level="3" size={headingSize}>
                    {navn}
                </Heading>
                {brukTekstvisning !== undefined &&
                    setBrukTekstvisning !== undefined &&
                    index !== undefined &&
                    index === 0 && (
                        <ToggleGroup
                            className={styles.grafTabellBryter}
                            size="small"
                            value={brukTekstvisning ? "tabell" : "graf"}
                            aria-label="Hvis du bruker skjermleser, bør du velge tabell"
                            onChange={(value) => {
                                setBrukTekstvisning(value === "tabell");
                            }}
                        >
                            <ToggleGroup.Item value="graf">
                                Graf
                            </ToggleGroup.Item>
                            <ToggleGroup.Item value="tabell">
                                Tabell
                            </ToggleGroup.Item>
                        </ToggleGroup>
                    )}
                <AntallDeltakere
                    antallDeltakere={Math.min(
                        ...spørsmålResultat.map(
                            (spørsmål: SpørsmålResultat) =>
                                spørsmål.antallDeltakereSomHarSvart,
                        ),
                    )}
                />
            </HStack>
            <div className={styles.temaContainer}>
                {spørsmålResultat.map((spørsmål: SpørsmålResultat) => (
                    <div key={spørsmål.id} className={styles.temaGrafContainer}>
                        {spørsmål.kategori ? (
                            <BodyShort
                                className={styles.kategoriTittel}
                                style={{
                                    color: getGraffargeFromTema(navn, true),
                                }}
                            >
                                {spørsmål.kategori}
                            </BodyShort>
                        ) : null}
                        {brukTekstvisning && !erIEksportMode ? (
                            <TekstligResultatvisning
                                spørsmål={spørsmål}
                                farge={getGraffargeFromTema(navn)}
                            />
                        ) : (
                            <BarChart
                                horizontal={spørsmål.flervalg}
                                spørsmål={spørsmål}
                                erIEksportMode={erIEksportMode}
                                farge={getGraffargeFromTema(navn)}
                            />
                        )}
                    </div>
                ))}
            </div>
        </>
    );
};

export function getGraffargeFromTema(navn: string, mørk: boolean = false) {
    switch (navn?.toLowerCase()) {
        case "sykefraværsarbeid":
            return "var(--a-green-500)";
        case "arbeidsmiljø":
            return `var(--a-orange-${mørk ? "700" : "600"})`;
        case "partssamarbeid":
        default:
            return "var(--a-blue-500)";
    }
}

export function AntallDeltakere({
    antallDeltakere,
}: {
    antallDeltakere: number;
}) {
    if (antallDeltakere === 0) {
        return (
            <HStack align="center" className={styles.antallDeltakere}>
                <PersonGroupFillIcon fontSize="1.5rem" aria-hidden />
                For få besvarelser til å vise resultater
            </HStack>
        );
    }
    return (
        <HStack align="center" className={styles.antallDeltakere}>
            <PersonGroupFillIcon fontSize="1.5rem" aria-hidden />
            {`${antallDeltakere} deltakere`}
        </HStack>
    );
}
