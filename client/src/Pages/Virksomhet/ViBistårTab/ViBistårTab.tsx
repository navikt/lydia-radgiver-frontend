import { BodyShort, Heading, Loader } from "@navikt/ds-react";
import styled from "styled-components";
import { IAProsessStatusEnum, IASak } from "../../../domenetyper/domenetyper";
import { NyIALeveranseSkjema } from "./NyIALeveranseSkjema";
import { IASakLeveranse } from "./IASakLeveranse";
import { IATjenester } from "../mocks/iaSakLeveranseMock";
import { useHentIASakLeveranser } from "../../../api/lydia-api";

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

interface Props {
    iaSak: IASak;
}

export const ViBistårTab = ({ iaSak }: Props) => {
    const iaTjenester = IATjenester;
    const {
        data: leveranser,
        loading: lasterLeveranser
    } = useHentIASakLeveranser(iaSak.orgnr, iaSak.saksnummer);

    return (
        <Container>
            <div>
                <Heading size="medium">Leveranser</Heading>
                <BodyShort>Her kan du legge leveranser når du bistår i saken.</BodyShort>
            </div>
            {
                lasterLeveranser
                    ? <Loader />
                    : !leveranser
                        ? <BodyShort>Kunne ikke hente leveranser</BodyShort>
                        : iaTjenester.map((tjeneste) => (
                            <div key={tjeneste.id}>
                                <Heading size="small" key={tjeneste.id}>{tjeneste.navn}</Heading>
                                {leveranser
                                    .filter((leveranse) => leveranse.modul.iaTjeneste.id === (tjeneste.id))
                                    .map((leveranse) =>
                                    <IASakLeveranse leveranse={leveranse} key={leveranse.id} />)}
                            </div>
                        ))
            }
            {iaSak.status === IAProsessStatusEnum.enum.VI_BISTÅR &&
                <NyIALeveranseSkjema iaSak={iaSak} />
            }
        </Container>
    )
}
