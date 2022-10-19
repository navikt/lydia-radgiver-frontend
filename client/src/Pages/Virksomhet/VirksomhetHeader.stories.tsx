import { ComponentMeta } from "@storybook/react";
import { virksomhetMock } from "../Prioritering/mocks/virksomhetMock";
import { sykefraværsstatistikkMock } from "../Prioritering/mocks/sykefraværsstatistikkMock";
import { iaSakKontaktes } from "./mocks/iaSakMock";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { VirksomhetHeader } from "./VirksomhetHeader";

export default {
    title: "Virksomhet/VirksomhetHeader",
    component: VirksomhetHeader,
    decorators: [(Story) => <MemoryRouter initialEntries={["/virksomhet/123456789"]}>
        <Routes>
            <Route
                path={"/virksomhet/:orgnummer"}
                element={<Story />}
            />
        </Routes>
    </MemoryRouter>]
} as ComponentMeta<typeof VirksomhetHeader>;

export const VirksomhetHeaderStory = () => {
    const doNothing = () => {
        return;
    }

    return (
        <VirksomhetHeader
            virksomhet={virksomhetMock}
            sykefraværsstatistikk={sykefraværsstatistikkMock[0]}
            iaSak={iaSakKontaktes}
            muterState={doNothing}
        />
    )
}
