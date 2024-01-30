import { Meta, StoryObj } from "@storybook/react";
import { IATjenesteoversiktside } from "./IATjenesteoversiktside";
import { http, HttpResponse } from "msw";
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
            http.get(`${mineIATjenesterPath}`, () => {
                return HttpResponse.json(mineIATjenesterMock);
            }),
            ...mswHandlers,
        ]
    }
}
