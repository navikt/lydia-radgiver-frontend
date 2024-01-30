import { Meta, StoryObj } from "@storybook/react";
import { http, HttpResponse } from "msw";
import { iaSakViBistår } from "../mocks/iaSakMock";
import { LeveranseOversikt } from "./LeveranseOversikt";
import { iaSakPath } from "../../../api/lydia-api";
import { mswHandlers } from "../../../../.storybook/mswHandlers";
import { leveranserPerIATjeneste } from "../mocks/leveranseMock";

const meta = {
    title: "Virksomhet/Leveranser/Leveranseoversikt",
    component: LeveranseOversikt,
} satisfies Meta<typeof LeveranseOversikt>

export default meta;
type Story = StoryObj<typeof meta>

export const Hovedstory: Story = {
    args: {
        iaSak: iaSakViBistår,
        lasterLeveranserPerIATjeneste: false,
        leveranserPerIATjeneste: leveranserPerIATjeneste
    },
    parameters: {
        msw: [
            http.get(`${iaSakPath}/:orgnummer/aktiv`, () => {
                return HttpResponse.json(iaSakViBistår);
            }),
            ...mswHandlers,
        ],
    },
}
