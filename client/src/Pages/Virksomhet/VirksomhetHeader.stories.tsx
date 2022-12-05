import { ComponentMeta } from "@storybook/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { virksomhetMock } from "../Prioritering/mocks/virksomhetMock";
import { iaSakKontaktes } from "./mocks/iaSakMock";
import { VirksomhetHeader } from "./VirksomhetHeader";

export default {
    title: "Virksomhet/Header på virksomhetssida",
    component: VirksomhetHeader,
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
} as ComponentMeta<typeof VirksomhetHeader>;

export const Hovedstory = () => (
    <VirksomhetHeader
        virksomhet={virksomhetMock}
        iaSak={iaSakKontaktes}
        muterState={() => {return}}
    />
)
