import { Meta } from "@storybook/react";
import { Filtervisning } from "./Filtervisning";
import { filterverdierMock } from "../mocks/filterverdierMock";
import { useFiltervisningState } from "./filtervisning-reducer";
import { useEffect } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

export default {
    title: "Prioritering/Filtervisning",
    component: Filtervisning,
    decorators: [(Story) => (
        <MemoryRouter
            initialEntries={["/?sykefraversprosentFra=0.00&sykefraversprosentTil=100.00&ansatteFra=5&side=1"]}>
            <Routes>
                <Route
                    path={"/"}
                    element={<Story />}
                />
            </Routes>
        </MemoryRouter>
    )]
} as Meta<typeof Filtervisning>;

export const Hovedstory = () => {
    const filtervisning = useFiltervisningState();
    useEffect(() => {
        filtervisning.lastData({
            filterverdier: filterverdierMock,
        });
    }, []);

    return (
        <Filtervisning
            søkPåNytt={() => {
                return;
            }}
            filtervisning={filtervisning}
        />
    );
};
