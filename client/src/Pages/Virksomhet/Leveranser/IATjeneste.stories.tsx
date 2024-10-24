import { Meta, StoryObj } from "@storybook/react";
import { http, HttpResponse } from "msw";
import { iaSakViBistår } from "../mocks/iaSakMock";
import { IATjeneste } from "./IATjeneste";
import { leveranserPerIATjeneste } from "../mocks/leveranseMock";
import { mswHandlers } from "../../../../.storybook/mswHandlers";
import { iaSakPath } from "../../../api/lydia-api/paths";

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
            http.get(`${iaSakPath}/:orgnummer/aktiv`, () => {
                return HttpResponse.json(iaSakViBistår);
            }),
            ...mswHandlers,
        ],
    },
};
