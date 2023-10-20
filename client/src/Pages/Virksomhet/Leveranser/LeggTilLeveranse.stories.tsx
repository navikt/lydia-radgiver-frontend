import { Meta, StoryObj } from "@storybook/react";
import { rest } from "msw";
import { LeggTilLeveranse } from "./LeggTilLeveranse";
import { iaSakViBistår } from "../mocks/iaSakMock";
import { iaSakPath, innloggetAnsattPath } from "../../../api/lydia-api";
import { brukerSomErSaksbehandler } from "../../Prioritering/mocks/innloggetAnsattMock";
import { mswHandlers } from "../../../../.storybook/mswHandlers";

const meta = {
    title: "Virksomhet/Leveranser/Legg til leveranse",
    component: LeggTilLeveranse,
} satisfies Meta<typeof LeggTilLeveranse>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Hovedstory: Story = {
    args: {
        iaSak: iaSakViBistår,
    },
    parameters: {
        msw: [
            rest.get(`${iaSakPath}/:orgnummer/aktiv`, (req, res, ctx) => {
                return res(ctx.json(iaSakViBistår));
            }),
            rest.get(innloggetAnsattPath, (req, res, ctx) => {
                return res(ctx.json(brukerSomErSaksbehandler));
            }),
            ...mswHandlers,
        ],
    },
};
