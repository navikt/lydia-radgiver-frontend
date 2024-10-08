import styled from "styled-components";
import { Heading } from "@navikt/ds-react";
import {
    Leveranse as LeveranseType,
    LeveranserPerIATjeneste,
} from "../../../domenetyper/leveranse";
import { Leveranse } from "./Leveranse";
import { IASak } from "../../../domenetyper/domenetyper";
import { sorterAlfabetisk } from "../../../util/sortering";

const IATjenestenavn = styled(Heading)`
    // Etterliknar stylinga til tabell-rader
    padding: ${12 / 16}rem;
`;

const LeveranseListe = styled.ol`
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
`;

interface Props {
    iaTjenesteMedLeveranser: LeveranserPerIATjeneste;
    iaSak: IASak;
}

export const IATjeneste = ({ iaTjenesteMedLeveranser, iaSak }: Props) => {
    if (iaTjenesteMedLeveranser.leveranser.length < 1) {
        return null;
    }

    return (
        <div>
            <IATjenestenavn level="4" size="xsmall">
                {iaTjenesteMedLeveranser.iaTjeneste.navn}
            </IATjenestenavn>
            <LeveranseListe>
                {iaTjenesteMedLeveranser.leveranser
                    .sort(leveranseStigendeEtterFrist)
                    .map((leveranse) => (
                        <Leveranse
                            leveranse={leveranse}
                            iaSak={iaSak}
                            key={leveranse.id}
                        />
                    ))}
            </LeveranseListe>
        </div>
    );
};

const leveranseStigendeEtterFrist = (a: LeveranseType, b: LeveranseType) => {
    // Alfabetisk om frist er lik
    if (a.frist.getTime() === b.frist.getTime()) {
        return sorterAlfabetisk(a.modul.navn, b.modul.navn);
    }
    return a.frist.getTime() - b.frist.getTime();
};
