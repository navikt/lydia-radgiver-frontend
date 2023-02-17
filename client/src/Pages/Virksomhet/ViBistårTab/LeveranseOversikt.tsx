import { BodyShort, Loader } from "@navikt/ds-react";
import { IATjeneste } from "./IATjeneste";
import { useHentIASakLeveranser } from "../../../api/lydia-api";
import { IASak } from "../../../domenetyper/domenetyper";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  max-width: 60rem;
`;

interface Props {
    iaSak: IASak;
}

export const LeveranseOversikt = ({ iaSak }: Props) => {
    const {
        data: iaSakLeveranserPerTjeneste,
        loading: lasterIASakLeveranserPerTjeneste
    } = useHentIASakLeveranser(iaSak.orgnr, iaSak.saksnummer);

    if (lasterIASakLeveranserPerTjeneste) {
        return <Loader/>
    }

    if (!iaSakLeveranserPerTjeneste) {
        return <BodyShort>Kunne ikke hente leveranser</BodyShort>
    }

    return (
        <Container>
            {
                iaSakLeveranserPerTjeneste.map((iaTjenesteMedLeveranser) => (
                        <IATjeneste iaTjenesteMedLeveranser={iaTjenesteMedLeveranser}
                                    iaSak={iaSak}
                                    key={iaTjenesteMedLeveranser.iaTjeneste.id}/>
                    )
                )
            }
        </Container>
    )
}
