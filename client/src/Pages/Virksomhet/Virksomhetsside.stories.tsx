import { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { http, HttpResponse } from "msw";
import { virksomhetMock } from "../Prioritering/mocks/virksomhetMock";
import {
    historiskStatistikkMock,
    sykefraværsstatistikkSisteKvartalMock,
    virksomhetsstatistikkSiste4KvartalerMock
} from "../Prioritering/mocks/sykefraværsstatistikkMock";
import { iaSakKontaktes } from "./mocks/iaSakMock";
import { Virksomhetsside } from "./Virksomhetsside";
import {
    historiskStatistikkPath,
    iaSakHistorikkPath,
    iaSakPath,
    siste4kvartalerPath,
    sistekvartalPath,
    sykefraværsstatistikkPath,
    virksomhetsPath
} from "../../api/lydia-api";
import { samarbeidshistorikkMock } from "./mocks/iaSakHistorikkMock";
import { mswHandlers } from "../../../.storybook/mswHandlers";

const meta = {
    title: "Virksomhet/Virksomhetside",
    component: Virksomhetsside,
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
} satisfies Meta<typeof Virksomhetsside>;

export default meta;
type Story = StoryObj<typeof meta>

export const VirksomhetssideStory: Story = {
    args: {}
}

VirksomhetssideStory.parameters = {
    msw: {
        handlers: [
            ...mswHandlers,
            http.get(`${virksomhetsPath}/:orgnummer`, () => {
                return HttpResponse.json(virksomhetMock);
            }),
            http.get(`${sykefraværsstatistikkPath}/:orgnummer/${sistekvartalPath}`, () => {
                return HttpResponse.json(sykefraværsstatistikkSisteKvartalMock[0]);
            }),
            http.get(`${sykefraværsstatistikkPath}/:orgnummer/${siste4kvartalerPath}`, () => {
                return HttpResponse.json(virksomhetsstatistikkSiste4KvartalerMock[1]);
            }),
            http.get(`${iaSakPath}/:orgnummer/aktiv`, () => {
                return HttpResponse.json(iaSakKontaktes);
            }),
            http.get(`${iaSakHistorikkPath}/:orgnummer`, () => {
                return HttpResponse.json(samarbeidshistorikkMock);
            }),
            http.get(`${sykefraværsstatistikkPath}/:orgnummer/${historiskStatistikkPath}`, () => {
                return HttpResponse.json(historiskStatistikkMock);
            }),
        ],
    },
};
