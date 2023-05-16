import { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { virksomhetMock } from "../../Prioritering/mocks/virksomhetMock";
import { iaSakKontaktes } from "../mocks/iaSakMock";
import { Virksomhetsoversikt } from "./Virksomhetsoversikt";

const meta = {
    title: "Virksomhet/Virksomhetsoversikt/Virksomhetsoversikt",
    component: Virksomhetsoversikt,
    decorators: [(Story) => (
        <MemoryRouter initialEntries={["/virksomhet/123456789"]}>
            <Routes>
                <Route
                    path={"/virksomhet/:orgnummer"}
                    element={<Story />}
                />
            </Routes>
        </MemoryRouter>
    )]
} satisfies Meta<typeof Virksomhetsoversikt>;

export default meta;
type Story = StoryObj<typeof meta>

export const Hovedstory: Story = {
    args: {
        virksomhet: virksomhetMock,
        iaSak: iaSakKontaktes,
    }
}
