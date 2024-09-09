import React from "react";
import {
    useHentBrukerinformasjon,
    useHentIaProsesser,
} from "../../../api/lydia-api";
import styled from "styled-components";
import { IASak } from "../../../domenetyper/domenetyper";
import { IaProsessChips } from "./IaProsessChips";
import { AdministrerIaProsesserKnapp } from "./AdministrerIaProsesserKnapp";

const AdministrerProsesserContainer = styled.div`
    margin-bottom: 0.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    justify-content: space-between;
`;

interface AdministrerIaProsesserProps {
    orgnummer: string;
    iaSak: IASak;
}

export const AdministrerIaProsesser = ({
    orgnummer,
    iaSak,
}: AdministrerIaProsesserProps) => {
    const { data: iaProsesser } = useHentIaProsesser(
        orgnummer,
        iaSak.saksnummer,
    );
    const harAktiveProsesser = iaProsesser && iaProsesser.length > 0;
    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    const brukerErEierAvSak = iaSak.eidAv === brukerInformasjon?.ident;

    return (
        harAktiveProsesser && (
            <AdministrerProsesserContainer>
                <IaProsessChips iaProsesser={iaProsesser} />
                {brukerErEierAvSak && (
                    <AdministrerIaProsesserKnapp
                        iaProsesser={iaProsesser}
                        iaSak={iaSak}
                        brukerErEierAvSak={brukerErEierAvSak}
                    />
                )}
            </AdministrerProsesserContainer>
        )
    );
};
