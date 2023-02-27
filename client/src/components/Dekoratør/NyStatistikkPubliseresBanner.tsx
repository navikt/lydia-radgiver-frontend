import styled from "styled-components";
import { Alert, BodyShort, Button, Heading } from "@navikt/ds-react";
import { BorderRadius } from "../../styling/borderRadius";
import { useState } from "react";

const Banner = styled(Alert)`
  position: relative; // For å halde lukk-knappen (position: absolute) inne i banneret
  padding-right: 5rem; // Hindrar overlapp mellom lukk-knapp og tekst
  border-radius: 0 0 ${BorderRadius.medium} ${BorderRadius.medium};
`;

const Lukkeknapp = styled(Button).attrs({ size: "small", variant: "secondary" })`
  position: absolute;
  right: 0.5rem;
  bottom: 0.5rem;
`;

export const NyStatistikkPubliseresBanner = () => {
    const statistikkErPublisert = false;
    const [visBanner, setVisBanner] = useState(true);

    const lukkMeg = () => {
        setVisBanner(false)
    }
    if (!visBanner) {
        return null;
    }

    return (
        <>
            {statistikkErPublisert
                ? <NyStatistikkErUte lukkMeg={lukkMeg} />
                : <NyStatistikkKommerSnart lukkMeg={lukkMeg} />
            }
        </>
    )
}

interface Props {
    lukkMeg: () => void;
}

const NyStatistikkKommerSnart = ({ lukkMeg }: Props) => {
    return (
        <Banner variant="info">
            <Heading size="xsmall">Snart kommer sykefraværsstatistikk for 4. kvartal 2022</Heading>
            <BodyShort>Fia blir oppdatert med nye tall i løpet av torsdag 2. mars.</BodyShort>
            <Lukkeknapp onClick={lukkMeg} size="small" variant="secondary">Lukk</Lukkeknapp>
        </Banner>
    )
}

const NyStatistikkErUte = ({ lukkMeg }: Props) => {
    return (
        <Banner variant="info">
            <Heading size="xsmall">Sykefraværsstatistikken i Fia er oppdatert med tall fra 4. kvartal 2022</Heading>
            <BodyShort>
                Løsningen er oppdatert med offisiell sykefraværsstatistikk for de siste fire kvartalene
                (1. kvartal 2022 – 4. kvartal 2022)
            </BodyShort>
            <BodyShort>
                Tall for de siste fire kvartalene er nå basert på 1. kvartal 2022 til 4. kvartal
                2022
            </BodyShort>
            <Lukkeknapp onClick={lukkMeg} size="small" variant="secondary">Lukk</Lukkeknapp>
        </Banner>
    )
}
