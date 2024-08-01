import { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { http, HttpResponse } from "msw";
import { virksomhetMock } from "../../Prioritering/mocks/virksomhetMock";
import { iaSakKontaktes } from "../mocks/iaSakMock";
import { Virksomhetsoversikt } from "./Virksomhetsoversikt";
import { iaSakPath } from "../../../api/lydia-api";
import { mswHandlers } from "../../../../.storybook/mswHandlers";
import VirksomhetContext from "../VirksomhetContext";
import React from "react";
import { Virksomhet } from "../../../domenetyper/virksomhet";
import { IASak } from "../../../domenetyper/domenetyper";


const VirksomhetsoversiktMedContext = ({ virksomhet, iaSak }: { virksomhet: Virksomhet, iaSak: IASak }) => {
    const [fane, setFane] = React.useState("statistikk");
    return (
        <VirksomhetContext.Provider value={{
            virksomhet,
            iaSak,
            lasterIaSak: false,
            fane,
            setFane,
            kartleggingId: "123456789",
            setVisKonfetti: () => null,
            visKonfetti: false,
        }}>
            <Virksomhetsoversikt />
        </VirksomhetContext.Provider>
    );
}

const meta = {
    title: "Virksomhet/Virksomhetsoversikt/Virksomhetsoversikt",
    component: VirksomhetsoversiktMedContext,
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
    },
    parameters: {
        msw: [
            ...mswHandlers,
            http.get(`${iaSakPath}/:orgnummer/aktiv`, () => {
                return HttpResponse.json(iaSakKontaktes);
            }),
        ],
    },
}
