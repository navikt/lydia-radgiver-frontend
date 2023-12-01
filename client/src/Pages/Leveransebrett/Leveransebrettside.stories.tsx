import { Meta, StoryObj } from "@storybook/react";
import { Leveransebrettside } from "./Leveransebrettside";
import { rest } from "msw";
import { mineLeveranserPath } from "../../api/lydia-api";
import { mswHandlers } from "../../../.storybook/mswHandlers";
import { mineLeveranserMock } from "./mineLeveranserMock";


const meta = {
    title: "Leveranseoversikt/Mine Leveranser",
    component: Leveransebrettside,
} satisfies Meta<typeof Leveransebrettside>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Hovedstory: Story = {
    args: {
        mineLeveranser : mineLeveranserMock
    },
    parameters: {
        msw: [
            rest.get(`${mineLeveranserPath}`, (req, res, ctx) => {
                return res(ctx.json(mineLeveranserMock));
            }),
            ...mswHandlers,
        ]
    }
}
