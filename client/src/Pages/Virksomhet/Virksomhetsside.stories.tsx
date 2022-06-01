import {ComponentMeta} from "@storybook/react";
import {virksomhetMock} from "../Prioritering/mocks/virksomhetMock";
import {sykefraværsstatistikkMock} from "../Prioritering/mocks/sykefraværsstatistikkMock";
import {iaSakKontaktes} from "./mocks/iaSakMock";
import {sakshendelserMock} from "./mocks/iaSakshendelserMock";
import Virksomhetsside from "./Virksomhetsside";
import {rest} from "msw";
import {iaSakHentHendelserPath, iaSakPath, sykefraværsstatistikkPath, virksomhetsPath} from "../../api/lydia-api";
import {MemoryRouter, Route, Routes} from "react-router-dom";

export default {
    title: "Virksomhet/Virksomhetside",
    component: Virksomhetsside,
    decorators: [(Story) => <MemoryRouter initialEntries={["/virksomhet/123456789"]} >
            <Routes>
                <Route
                    path={"/virksomhet/:orgnummer"}
                    element={<Story/>}
                />
            </Routes>
        </MemoryRouter>]
} as ComponentMeta<typeof Virksomhetsside>;

export const VirksomhetssideStory = () => (
    <Virksomhetsside />
);

VirksomhetssideStory.parameters = {
    msw: {
        handlers: [
            rest.get(`${virksomhetsPath}/:orgnummer`, (req, res, ctx) => {
                return res(ctx.json(virksomhetMock));
            }),
            rest.get(`${sykefraværsstatistikkPath}/:orgnummer`, (req, res, ctx) => {
                return res(
                    ctx.json([sykefraværsstatistikkMock[0]])
                );
            }),
            rest.get(`${iaSakPath}/:orgnummer`, (req, res, ctx) => {
                return res(
                    ctx.json([iaSakKontaktes])
                );
            }),
            rest.get(`${iaSakHentHendelserPath}/:saksnummer`, (req, res, ctx) => {
                return res(
                    ctx.json(sakshendelserMock)
                );
            }),
        ],
    },
};
