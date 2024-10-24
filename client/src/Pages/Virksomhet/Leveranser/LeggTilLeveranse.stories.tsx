import { Meta, StoryObj } from "@storybook/react";
import { http, HttpResponse } from "msw";
import { LeggTilLeveranse } from "./LeggTilLeveranse";
import { iaSakViBistår } from "../mocks/iaSakMock";
import { iaSakPath } from "../../../api/lydia-api/paths";
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
            http.get(`${iaSakPath}/:orgnummer/aktiv`, () => {
                return HttpResponse.json(iaSakViBistår);
            }),
            ...mswHandlers,
        ],
    },
};
