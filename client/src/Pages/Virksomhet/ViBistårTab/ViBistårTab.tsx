import { BodyShort, Heading, Loader } from "@navikt/ds-react";
import styled from "styled-components";
import { IAProsessStatusEnum, IASak } from "../../../domenetyper/domenetyper";
import { NyIALeveranseSkjema } from "./NyIALeveranseSkjema";
import { useHentIASakLeveranser } from "../../../api/lydia-api";
import { NavFarger } from "../../../styling/farger";
import { BorderRadius } from "../../../styling/borderRadius";
import { Skygger } from "../../../styling/skygger";
import { IATjeneste } from "./IATjeneste";

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  background: ${NavFarger.white};
  padding: 0.75rem 1.5rem 1.5rem;
  border-radius: ${BorderRadius.medium};
  box-shadow: ${Skygger.small};

  // TODO legg på borders på leveranserader
`;

interface Props {
    iaSak: IASak;
}

export const ViBistårTab = ({ iaSak }: Props) => {
    const {
        data: iaSakLeveranserPerTjeneste,
        loading: lasterIASakLeveranserPerTjeneste
    } = useHentIASakLeveranser(iaSak.orgnr, iaSak.saksnummer);

    return (
        <Container>
            <div>
                <Heading size="large">Leveranser</Heading>
                <BodyShort>Her kan du legge leveranser når du bistår i saken.</BodyShort>
            </div>
            {
                lasterIASakLeveranserPerTjeneste
                    ? <Loader />
                    : !iaSakLeveranserPerTjeneste
                        ? <BodyShort>Kunne ikke hente leveranser</BodyShort>
                        : iaSakLeveranserPerTjeneste.map((iaTjenesteMedLeveranser) => (
                                <IATjeneste iaTjenesteMedLeveranser={iaTjenesteMedLeveranser}
                                            iaSak={iaSak}
                                            key={iaTjenesteMedLeveranser.iaTjeneste.id} />
                            )
                        )
            }
            {iaSak.status === IAProsessStatusEnum.enum.VI_BISTÅR &&
                <NyIALeveranseSkjema iaSak={iaSak} />
            }
        </Container>
    )
}
