import { Meta, StoryObj } from "@storybook/react";
import { rest } from "msw";
import { LeggTilLeveranse } from "./LeggTilLeveranse";
import { iaSakViBistår } from "../mocks/iaSakMock";
import { iaSakPath } from "../../../api/lydia-api";
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
            ...mswHandlers,
        ],
    },
};
