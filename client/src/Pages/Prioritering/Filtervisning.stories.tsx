import { ComponentMeta } from "@storybook/react";
import { rest } from "msw";
import { Filtervisning } from "./Filtervisning";
import { filterverdierMock } from "./mocks/filterverdierMock";
import { brukerMedVeldigLangtNavn } from "./mocks/innloggetAnsattMock";
import { innloggetAnsattPath } from "../../api/lydia-api";
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

Hovedstory.parameters = {
    msw: {
        handlers: [
            rest.get(innloggetAnsattPath, (req, res, ctx) => {
                return res(ctx.json(brukerMedVeldigLangtNavn));
            }),
        ],
    },
};
