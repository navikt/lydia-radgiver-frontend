import { BodyShort, Loader } from "@navikt/ds-react";
import { IATjeneste } from "./IATjeneste";
import { useHentIASakLeveranser } from "../../../api/lydia-api";
import { IASak } from "../../../domenetyper/domenetyper";

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
        <>
            {
                iaSakLeveranserPerTjeneste.map((iaTjenesteMedLeveranser) => (
                        <IATjeneste iaTjenesteMedLeveranser={iaTjenesteMedLeveranser}
                                    iaSak={iaSak}
                                    key={iaTjenesteMedLeveranser.iaTjeneste.id}/>
                    )
                )
            }
        </>
    )
}
