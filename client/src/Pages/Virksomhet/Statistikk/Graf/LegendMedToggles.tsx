import { Checkbox, CheckboxGroup } from "@navikt/ds-react";
import { graflinjer } from "./graflinjer";
import styled from "styled-components";
import { SymbolSvg } from "./SymbolSvg";

const SymbolOgTekstWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const LegendSymbol = styled(SymbolSvg)`
  margin-right: 0.5rem;
`;

const dotStrl = 18;

export const LegendMedToggles = () => {
    return (
        <CheckboxGroup legend="Velg statistikk som skal vises i grafen" disabled={true}>
            {Object.entries(graflinjer).map(([key, value]) =>
                (<Checkbox value={key} checked={true} key={key}>
                    <SymbolOgTekstWrapper>
                        <LegendSymbol
                            size={dotStrl}
                            fill={value.farge}
                            symbol={value.symbol}
                        />
                        {value.navn}
                    </SymbolOgTekstWrapper>
                </Checkbox>))
            }
        </CheckboxGroup>
    )
};
