import { BodyShort, Heading, Loader } from "@navikt/ds-react";
import { erIDev } from "../../components/Dekoratør/Dekoratør";
import { IATjenestekort } from "./IATjenestekort";
import { useMineIATjenester } from "../../api/lydia-api";
import { useEffect } from "react";
import { loggSideLastet } from "../../util/amplitude-klient";
import styled from "styled-components";
import { hvitBoksMedSkygge } from "../../styling/containere";

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
                data.map((leveranse) => {
                    return (
                        <IATjenestekort iaTjeneste={leveranse} key={`${leveranse.orgnr}-${leveranse.modul.id}`} />
                    );
                })
                : <BodyShort>Du har ingen IA-tjenester som er under arbeid</BodyShort>
            }
        </Container>
    );
}
