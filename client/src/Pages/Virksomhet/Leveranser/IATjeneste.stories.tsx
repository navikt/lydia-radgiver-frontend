import { Meta, StoryObj } from "@storybook/react";
import { rest } from "msw";
import { iaSakViBistår } from "../mocks/iaSakMock";
import { IATjeneste } from "./IATjeneste";
import { leveranserPerIATjeneste } from "../mocks/leveranseMock";
import { mswHandlers } from "../../../../.storybook/mswHandlers";
import { iaSakPath, innloggetAnsattPath } from "../../../api/lydia-api";
import { brukerSomHarLesetilgang } from "../../Prioritering/mocks/innloggetAnsattMock";

const meta = {
    title: "Virksomhet/Leveranser/Leveranser per IATjeneste",
    component: IATjeneste,
} satisfies Meta<typeof IATjeneste>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Hovedstory: Story = {
    args: {
        iaSak: iaSakViBistår,
        iaTjenesteMedLeveranser: leveranserPerIATjeneste[0],
    },
    parameters: {
        msw: [
            rest.get(`${iaSakPath}/:orgnummer/aktiv`, (req, res, ctx) => {
                return res(ctx.json(iaSakViBistår));
            }),
            rest.get(innloggetAnsattPath, (req, res, ctx) => {
                return res(ctx.json(brukerSomHarLesetilgang));
            }),
            ...mswHandlers,
        ],
    },
};
