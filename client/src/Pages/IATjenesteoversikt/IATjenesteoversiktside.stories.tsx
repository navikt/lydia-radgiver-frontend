import { Meta, StoryObj } from "@storybook/react";
import { IATjenesteoversiktside } from "./IATjenesteoversiktside";
import { rest } from "msw";
import { mineIATjenesterPath } from "../../api/lydia-api";
import { mswHandlers } from "../../../.storybook/mswHandlers";
import { mineIATjenesterMock } from "./mineIATjenesterMock";


const meta = {
    title: "IATjenesteoversikt/Mine IA-tjenester",
    component: IATjenesteoversiktside,
} satisfies Meta<typeof IATjenesteoversiktside>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Hovedstory: Story = {
    parameters: {
        msw: [
            rest.get(`${mineIATjenesterPath}`, (req, res, ctx) => {
                return res(ctx.json(mineIATjenesterMock));
            }),
            ...mswHandlers,
        ]
    }
}
