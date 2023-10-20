import { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { rest } from "msw";
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
            rest.get(`${virksomhetsPath}/:orgnummer`, (req, res, ctx) => {
                return res(ctx.json(virksomhetMock));
            }),
            rest.get(`${sykefraværsstatistikkPath}/:orgnummer/${sistekvartalPath}`, (req, res, ctx) => {
                return res(
                    ctx.json(sykefraværsstatistikkSisteKvartalMock[0])
                );
            }),
            rest.get(`${sykefraværsstatistikkPath}/:orgnummer/${siste4kvartalerPath}`, (req, res, ctx) => {
                return res(
                    ctx.json(virksomhetsstatistikkSiste4KvartalerMock[1])
                );
            }),
            rest.get(`${iaSakPath}/:orgnummer/aktiv`, (req, res, ctx) => {
                return res(
                    ctx.json(iaSakKontaktes)
                );
            }),
            rest.get(`${iaSakHistorikkPath}/:orgnummer`, (req, res, ctx) => {
                return res(
                    ctx.json(samarbeidshistorikkMock)
                );
            }),
            rest.get(`${sykefraværsstatistikkPath}/:orgnummer/${historiskStatistikkPath}`, (req, res, ctx) => {
                return res(
                    ctx.json(historiskStatistikkMock)
                );
            }),
        ],
    },
};
