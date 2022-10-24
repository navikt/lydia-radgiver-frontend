import {ComponentMeta} from "@storybook/react";
import { StyledFiltervisning } from "./Filtervisning";
import {filterverdierMock} from "./mocks/filterverdierMock";
import "@navikt/ds-css";
import {rest} from "msw";
import {innloggetAnsattPath} from "../../api/lydia-api";
import {brukerMedVeldigLangtNavn} from "./mocks/innloggetAnsattMock";

export default {
    title: "Prioritering/Filtervisning",
    component: StyledFiltervisning,
} as ComponentMeta<typeof StyledFiltervisning>;

export const Hovedstory = () => (
    <StyledFiltervisning
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        søkPåNytt={() => {}}
        filterverdier={filterverdierMock}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        oppdaterSøkeverdier={() => {}}
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
