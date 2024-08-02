import { PlanRessurs } from "../../../domenetyper/plan";
import { Headerrad } from "./Headerrad";
import { Verktøyrad } from "./Verktøyrad";
import React from "react";
import styled from "styled-components";

const VerktøyListeWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr min-content;
    grid-gap: 1rem;
`;

export function VerktøyListe({
    minVerktøyliste,
    setMinVerktøyliste,
}: {
    minVerktøyliste: PlanRessurs[];
    setMinVerktøyliste: (t: PlanRessurs[]) => void;
}) {
    const setVerktøy = (verktøy: PlanRessurs, index: number) => {
        const nyeVerktøy = [...minVerktøyliste];
        nyeVerktøy[index] = verktøy;

        return setMinVerktøyliste(nyeVerktøy);
    };
    const slettVerktøy = (index: number) => {
        const nyeVerktøy = [...minVerktøyliste];
        nyeVerktøy.splice(index, 1);

        return setMinVerktøyliste(nyeVerktøy);
    };
    return (
        <VerktøyListeWrapper>
            <Headerrad />
            {minVerktøyliste.map((verktøy, index) => (
                <Verktøyrad
                    key={index}
                    verktøy={verktøy}
                    setVerktøy={(ressurs: PlanRessurs) =>
                        setVerktøy(ressurs, index)
                    }
                    slettVerktøy={
                        index < minVerktøyliste.length - 1
                            ? () => slettVerktøy(index)
                            : undefined
                    }
                />
            ))}
        </VerktøyListeWrapper>
    );
}
