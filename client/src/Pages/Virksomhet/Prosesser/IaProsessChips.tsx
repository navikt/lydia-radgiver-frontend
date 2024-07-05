import { Chips } from "@navikt/ds-react";
import React, { useState } from "react";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";
import styled from "styled-components";

const IAProsessChipsContainer = styled(Chips)`
    margin-right: 1rem;
`;

interface IaProsessChipsProps {
    iaProsesser: IaSakProsess[];
}

export const IaProsessChips = ({ iaProsesser }: IaProsessChipsProps) => {
    const navngitteProsesser = iaProsesser.filter(
        (iaProsess) => iaProsess.navn && iaProsess.navn !== "",
    );
    const [valgtProsess, setValgtProsess] = useState(navngitteProsesser[0]?.id);

    return (
        <IAProsessChipsContainer>
            {navngitteProsesser.map((iaProsess) => (
                <Chips.Toggle
                    key={iaProsess.id}
                    selected={valgtProsess == iaProsess.id}
                    onClick={() => setValgtProsess(iaProsess.id)}
                >
                    {iaProsess.navn ?? ""}
                </Chips.Toggle>
            ))}
        </IAProsessChipsContainer>
    );
};
