import { useEffect } from "react";
import styled from "styled-components";
import { BodyShort, Heading, Loader } from "@navikt/ds-react";
import { IATjenestekort } from "./IATjenestekort";
import { useMineIATjenester } from "../../api/lydia-api";
import { loggAntallIATjenesterPåIATjenesteoversikt, loggSideLastet } from "../../util/amplitude-klient";
import { hvitBoksMedSkygge } from "../../styling/containere";
import { sorterAlfabetisk, sorterPåDatoStigende } from "../../util/sortering";
import { contentSpacing } from "../../styling/contentSpacing";
import { statiskeSidetitler, useTittel } from "../../util/useTittel";
import { desktopAndUp, tabletAndUp } from "../../styling/breakpoints";

const Container = styled.div`
  margin-top: ${contentSpacing.mobileY};
  padding: ${contentSpacing.mobileX};

  ${tabletAndUp} {
    padding: 1.5rem;
  }
  
  ${desktopAndUp} {
    padding: 3rem;
  }

  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  ${hvitBoksMedSkygge}
`;

const IATjenesteListe = styled.ol`
  padding-left: 0;

  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  list-style: none;
`;

export const IATjenesteoversiktside = () => {
    useTittel(statiskeSidetitler.iaTjenesteoversikt);

    useEffect(() => {
        loggSideLastet("MineIATjenesterside");
    });

    const { data, loading, error } = useMineIATjenester();

    useEffect(() => {
        if (data) {
            loggAntallIATjenesterPåIATjenesteoversikt(data.length)
        }
    }, [data]);

    if (loading) {
        return (
            <Container>
                <Heading size="large">Mine IA-tjenester</Heading>
                <Loader />
            </Container>
        )
    }
    if (error) {
        return (
            <Container>
                <Heading size="large">Mine IA-tjenester</Heading>
                <BodyShort>Kunne ikke hente IA-tjenester</BodyShort>
            </Container>
        )
    }

    return (
        <Container>
            <Heading size="large">Mine IA-tjenester</Heading>
            {data?.length ?
                <IATjenesteListe>
                    {/*
                    Sorterer IA-tjenestene:
                    tidlegaste frist først,
                    innafor same frist sorterer vi alfabetisk etter virksomhetsnavn,
                    innafor same virksomhet sorterer vi alfabetisk etter IA-tjeneste+modulnavn (som er unikt).
                    */
                        data.sort((a, b) => sorterAlfabetisk(
                            `${a.iaTjeneste.navn} (${a.modul.navn})`,
                            `${b.iaTjeneste.navn} (${b.modul.navn})`)
                        )
                            .sort((a, b) => sorterAlfabetisk(a.virksomhetsnavn, b.virksomhetsnavn))
                            .sort((a, b) => sorterPåDatoStigende(a.tentativFrist, b.tentativFrist))
                            .map((leveranse) => {
                                return (
                                    <IATjenestekort iaTjeneste={leveranse}
                                                    key={`${leveranse.orgnr}-${leveranse.modul.id}`} />
                                );
                            })}
                </IATjenesteListe>
                : <BodyShort>Du har ingen IA-tjenester som er under arbeid</BodyShort>
            }
        </Container>
    );
}
