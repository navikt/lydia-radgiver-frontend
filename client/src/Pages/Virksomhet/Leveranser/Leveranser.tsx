import styled from "styled-components";
import { BodyShort, Heading } from "@navikt/ds-react";
import { IAProsessStatusEnum, IASak } from "../../../domenetyper/domenetyper";
import { LeggTilLeveranse } from "./LeggTilLeveranse";
import { LeveranseOversikt } from "./LeveranseOversikt";
import { tabInnholdStyling } from "../../../styling/containere";
import { EksternLenke } from "../../../components/EksternLenke";
import { EksternNavigeringKategorier, loggNavigeringMedEksternLenke } from "../../../util/amplitude-klient";

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 3rem;

  ${tabInnholdStyling};
`;

interface Props {
    iaSak: IASak;
}

export const Leveranser = ({ iaSak }: Props) => {
    const sakenErIViBistår = iaSak.status === IAProsessStatusEnum.enum.VI_BISTÅR;

    return (
        <Container>
            <div>
                <Heading spacing={true} size="large">Leveranser</Heading>
                <BodyShort>
                    Her kan du legge inn og få oversikt over leveranser til virksomheten. Du må være på status
                    “Vi bistår” for å registrere leveransen.
                </BodyShort>
                <BodyShort>
                    Du kan bare legge inn IA-tjenester og leveranser som er beskrevet i <EksternLenke
                    href="https://navno.sharepoint.com/sites/fag-og-ytelser-veileder-for-inkluderende-arbeidsliv"
                    onClick={() => loggNavigeringMedEksternLenke(EksternNavigeringKategorier.IAVEILEDER)}>
                    IA-veilederen 4.1-4.3
                </EksternLenke>.
                </BodyShort>
            </div>
            <LeveranseOversikt iaSak={iaSak} />
            {sakenErIViBistår &&
                <LeggTilLeveranse iaSak={iaSak} />
            }
        </Container>
    )
}
