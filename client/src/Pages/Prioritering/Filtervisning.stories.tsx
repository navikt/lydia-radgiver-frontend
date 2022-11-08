import { ComponentMeta } from "@storybook/react";
import { rest } from "msw";
import { Filtervisning } from "./Filtervisning";
import { filterverdierMock } from "./mocks/filterverdierMock";
import { brukerMedVeldigLangtNavn } from "./mocks/innloggetAnsattMock";
import { innloggetAnsattPath } from "../../api/lydia-api";

export default {
    title: "Prioritering/Filtervisning",
    component: Filtervisning,
} as ComponentMeta<typeof Filtervisning>;

export const Hovedstory = () => (
    <Filtervisning
        søkPåNytt={() => {return}}
        filterverdier={filterverdierMock}
        oppdaterSøkeverdier={() => {return}}
    />
);

Hovedstory.parameters = {
    msw: {
        handlers: [
            rest.get(innloggetAnsattPath, (req, res, ctx) => {
                return res(ctx.json(brukerMedVeldigLangtNavn));
            }),
        ],
    },
};
