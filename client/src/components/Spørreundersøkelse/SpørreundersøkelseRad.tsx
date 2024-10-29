import { ExpansionCard } from "@navikt/ds-react";
import styled from "styled-components";
import { Spørreundersøkelse } from "../../domenetyper/spørreundersøkelse";
import React from "react";
import {
    useSpørreundersøkelseKomponenter,
    useSpørreundersøkelseType,
} from "./SpørreundersøkelseContext";

const StyledExpansionCard = styled(ExpansionCard)<{ $avstandFraSiste: number }>`
    margin-bottom: 1rem;

    & > div {
        z-index: ${(props) => props.$avstandFraSiste + 5};
    }
`;

export default function SpørreundersøkelseRad({
    spørreundersøkelse,
    dato,
    defaultOpen,
    avstandFraSiste,
}: {
    spørreundersøkelse: Spørreundersøkelse;
    dato?: string;
    defaultOpen?: boolean;
    avstandFraSiste: number;
}) {
    const [erÅpen, setErÅpen] = React.useState(defaultOpen);

    const spørreundersøkelseType = useSpørreundersøkelseType();
    const { CardHeader, CardInnhold } = useSpørreundersøkelseKomponenter();

    return (
        <StyledExpansionCard
            aria-label={spørreundersøkelseType}
            open={erÅpen}
            onToggle={(open: boolean) => {
                setErÅpen(open);
            }}
            $avstandFraSiste={avstandFraSiste}
        >
            <CardHeader behovsvurdering={spørreundersøkelse} dato={dato} />
            {erÅpen && spørreundersøkelse.status === "AVSLUTTET" && (
                <CardInnhold behovsvurdering={spørreundersøkelse} />
            )}
        </StyledExpansionCard>
    );
}
