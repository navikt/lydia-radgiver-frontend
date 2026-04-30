import { Heading } from "@navikt/ds-react";
import React from "react";
import { useSpørreundersøkelse } from "@/components/Spørreundersøkelse/SpørreundersøkelseContext";
import { lokalDatoMedKlokkeslett } from "@/util/dato";
import capitalizeFirstLetterLowercaseRest from "@/util/formatering/capitalizeFirstLetterLowercaseRest";
import { useHentSpørreundersøkelseMedInnhold } from "@features/kartlegging/api/spørreundersøkelse";
import { GruppertSpørsmålRenderer } from "./GruppertSpørsmålRenderer";
import styles from "./spørreundersøkelseForhåndsvisningModal.module.scss";

export { GruppertSpørsmålRenderer };

export default function Forhåndsvisning({
    spørreundersøkelseid,
    setModaltittel,
}: {
    spørreundersøkelseid: string;
    setModaltittel: (tittel: string) => void;
}) {
    const { iaSak, samarbeid } = useSpørreundersøkelse();
    const { data: spørreundersøkelseForhåndsvisning } =
        useHentSpørreundersøkelseMedInnhold(
            iaSak.orgnr,
            iaSak.saksnummer,
            samarbeid.id,
            "EVALUERING",
            spørreundersøkelseid,
        );
    React.useEffect(() => {
        if (spørreundersøkelseForhåndsvisning) {
            setModaltittel(
                `${capitalizeFirstLetterLowercaseRest(spørreundersøkelseForhåndsvisning.type)} opprettet ${lokalDatoMedKlokkeslett(spørreundersøkelseForhåndsvisning.opprettetTidspunkt)}`,
            );
        }
    }, [spørreundersøkelseForhåndsvisning, setModaltittel]);

    return (
        <>
            {spørreundersøkelseForhåndsvisning?.temaer.map((tema) => (
                <React.Fragment key={tema.temaId}>
                    <Heading
                        className={styles.tematittel}
                        level="3"
                        size="large"
                    >
                        {tema.navn}
                    </Heading>
                    <GruppertSpørsmålRenderer tema={tema} />
                </React.Fragment>
            ))}
        </>
    );
}
