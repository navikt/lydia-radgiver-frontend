import { ComponentMeta } from "@storybook/react";
import { Filtervisning } from "./Filtervisning";
import { filterverdierMock } from "./mocks/filterverdierMock";
import { useFiltervisningState } from "../Virksomhet/filtervisning-reducer";
import { useEffect } from "react";

export default {
    title: "Prioritering/Filtervisning",
    component: Filtervisning,
} as ComponentMeta<typeof Filtervisning>;

export const Hovedstory = () => {
    const filtervisning = useFiltervisningState();
    useEffect(() => {
        filtervisning.lastData({
            filterverdier: filterverdierMock,
        });
    }, []);
    return (
        <Filtervisning
            søkPåNytt={() => {
                return;
            }}
            filtervisning={filtervisning}
        />
    );
};
