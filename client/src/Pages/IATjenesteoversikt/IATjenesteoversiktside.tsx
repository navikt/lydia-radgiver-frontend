import { BodyShort, Heading, Loader } from "@navikt/ds-react";
import { erIDev } from "../../components/Dekoratør/Dekoratør";
import { IATjenestekort } from "./IATjenestekort";
import { useMineIATjenester } from "../../api/lydia-api";
import { useEffect } from "react";
import { loggSideLastet } from "../../util/amplitude-klient";
import styled from "styled-components";
import { hvitBoksMedSkygge } from "../../styling/containere";
import { sorterAlfabetisk, sorterPåDatoStigende } from "../../util/sortering";

const Container = styled.div`
  padding: 1.5rem;
  ${hvitBoksMedSkygge}
`;

export const IATjenesteoversiktside = () => {
    if (!erIDev) {
        return null;
    }

    useEffect(() => {
        loggSideLastet("MineIATjenesterside");
    });

    const { data, loading, error } = useMineIATjenester();

    if (loading) {
        return (
            <Container>
                <Heading size="large">IA-tjenester på saker jeg eier</Heading>
                <Loader />
            </Container>
        )
    }
    if (error) {
        return (
            <Container>
                <Heading size="large">IA-tjenester på saker jeg eier</Heading>
                <BodyShort>Kunne ikke hente IA-tjenester</BodyShort>
            </Container>
        )
    }

    return (
        <Container>
            <Heading size="large">IA-tjenester på saker jeg eier</Heading>
            {data?.length ?
                /*
                 Sorterer slik at rekkefølga blir (inkludert kva vi ser på om to er like):
                 tidlegaste frist først,
                 alfabetisk etter virksomhetsnavn,
                 alfabetisk etter IA-tjeneste+modulnavn
                */
                data.sort((a, b) => sorterAlfabetisk(`${a.iaTjeneste.navn} (${a.modul.navn})`, `${b.iaTjeneste.navn} (${b.modul.navn})`))
                    .sort((a, b) => sorterAlfabetisk(a.virksomhetsnavn, b.virksomhetsnavn))
                    .sort((a, b) => sorterPåDatoStigende(a.tentativFrist, b.tentativFrist))
                    .map((leveranse) => {
                    return (
                        <IATjenestekort iaTjeneste={leveranse} key={`${leveranse.orgnr}-${leveranse.modul.id}`} />
                    );
                })
                : <BodyShort>Du har ingen IA-tjenester som er under arbeid</BodyShort>
            }
        </Container>
    );
}
