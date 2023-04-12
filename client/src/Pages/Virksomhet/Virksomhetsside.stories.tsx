import { Meta } from "@storybook/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { rest } from "msw";
import { virksomhetMock } from "../Prioritering/mocks/virksomhetMock";
import { sykefraværsstatistikkMock } from "../Prioritering/mocks/sykefraværsstatistikkMock";
import { iaSakKontaktes } from "./mocks/iaSakMock";
import { Virksomhetsside } from "./Virksomhetsside";
import { iaSakHistorikkPath, iaSakPath, sykefraværsstatistikkPath, virksomhetsPath } from "../../api/lydia-api";
import { samarbeidshistorikkMock } from "./mocks/iaSakHistorikkMock";

export default {
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
} as Meta<typeof Virksomhetsside>;

export const VirksomhetssideStory = () => (
    <Virksomhetsside />
);

VirksomhetssideStory.parameters = {
    msw: {
        handlers: {
            others: [
                rest.get(`${virksomhetsPath}/:orgnummer`, (req, res, ctx) => {
                    return res(ctx.json(virksomhetMock));
                }),
                rest.get(`${sykefraværsstatistikkPath}/:orgnummer`, (req, res, ctx) => {
                    return res(
                        ctx.json([sykefraværsstatistikkMock[0]])
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
            ],
        }
    },
};
