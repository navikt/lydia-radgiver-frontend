import { Meta } from "@storybook/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { http, HttpResponse } from "msw";
import "@navikt/ds-css";
import { Prioriteringsside } from "./Prioriteringsside";
import { filterverdierPath, sykefraværsstatistikkPath, } from "../../api/lydia-api";
import { filterverdierMock } from "./mocks/filterverdierMock";
import { sykefraværsstatistikkMock } from "./mocks/sykefraværsstatistikkMock";

export default {
    title: "Prioritering/Prioriteringsside",
    component: Prioriteringsside,
    decorators: [(Story) => (
        <MemoryRouter
            initialEntries={["/?sykefravarsprosentFra=0.00&sykefravarsprosentTil=100.00&ansatteFra=5&side=1"]}>
            <Routes>
                <Route
                    path={"/"}
                    element={<Story />}
                />
            </Routes>
        </MemoryRouter>
    )]
} as Meta<typeof Prioriteringsside>;

export const PrioriteringssideMedDataStory = () => (<Prioriteringsside />);

PrioriteringssideMedDataStory.parameters = {
    msw: {
        handlers: [
            http.get(filterverdierPath, () => {
                return HttpResponse.json(filterverdierMock);
            }),
            http.get(sykefraværsstatistikkPath, () => {
                return HttpResponse.json({
                    data: sykefraværsstatistikkMock,
                    total: 500000,
                })
            }),
        ],
    },
};


export const PrioriteringssideUtenResultaterFraSøkStory = () => (<Prioriteringsside />);

PrioriteringssideUtenResultaterFraSøkStory.parameters = {
    msw: {
        handlers: [
            http.get(filterverdierPath, () => {
                return HttpResponse.json(filterverdierMock);
            }),
            http.get(sykefraværsstatistikkPath, () => {
                return HttpResponse.json({
                    data: [],
                    total: 0,
                });
            }),
        ],
    },
};
