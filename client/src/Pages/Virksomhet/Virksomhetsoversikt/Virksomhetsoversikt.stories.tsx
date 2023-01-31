import { ComponentMeta } from "@storybook/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { virksomhetMock } from "../../Prioritering/mocks/virksomhetMock";
import { iaSakKontaktes } from "../mocks/iaSakMock";
import { Virksomhetsoversikt } from "./Virksomhetsoversikt";

export default {
    title: "Virksomhet/Virksomhetsoversikt/Oversikt over virksomhet og sak",
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
} as ComponentMeta<typeof Virksomhetsoversikt>;

export const Hovedstory = () => (
    <Virksomhetsoversikt
        virksomhet={virksomhetMock}
        iaSak={iaSakKontaktes}
        muterState={() => {return}}
    />
)
