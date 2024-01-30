import { Meta, StoryObj } from "@storybook/react";
import {
    fjernetVirksomhetMock,
    slettetVirksomhetMock,
    virksomhetMock,
} from "../Prioritering/mocks/virksomhetMock";
import { VirksomhetsVisning } from "./VirksomhetsVisning";
import { http, HttpResponse } from "msw";
import {
    historiskStatistikkPath,
    iaSakPath,
    sykefraværsstatistikkPath,
} from "../../api/lydia-api";
import { iaSakFullførtOgLukket, iaSakKontaktes } from "./mocks/iaSakMock";
import { mswHandlers } from "../../../.storybook/mswHandlers";
import { historiskStatistikkMock } from "../Prioritering/mocks/sykefraværsstatistikkMock";
import { MemoryRouter, Routes, Route } from "react-router-dom";

const meta = {
    title: "Virksomhet/Visning av en virksomhet",
    component: VirksomhetsVisning,
    decorators: [
        (Story) => (
            <MemoryRouter initialEntries={["/virksomhet/123456789"]}>
                <Routes>
                    <Route
                        path={"/virksomhet/:orgnummer"}
                        element={<Story />}
                    />
                </Routes>
            </MemoryRouter>
        ),
    ],
} satisfies Meta<typeof VirksomhetsVisning>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Hovedstory: Story = {
    args: {
        virksomhet: virksomhetMock,
    },
};

Hovedstory.parameters = {
    msw: {
        handlers: [
            ...mswHandlers,
            http.get(`${iaSakPath}/:orgnummer/aktiv`, () => {
                return HttpResponse.json(iaSakKontaktes);
            }),
            http.get(
                `${sykefraværsstatistikkPath}/:orgnummer/${historiskStatistikkPath}`,
                () => {
                    return HttpResponse.json(historiskStatistikkMock);
                },
            ),
        ],
    },
};

export const VirksomhetSomErSlettet: Story = {
    args: {
        virksomhet: slettetVirksomhetMock,
    },
};

VirksomhetSomErSlettet.parameters = {
    msw: {
        handlers: [
            ...mswHandlers,
            http.get(`${iaSakPath}/:orgnummer/aktiv`, () => {
                return HttpResponse.json(iaSakKontaktes);
            }),
            http.get(
                `${sykefraværsstatistikkPath}/:orgnummer/${historiskStatistikkPath}`,
                () => {
                    return HttpResponse.json(historiskStatistikkMock);
                },
            ),
        ],
    },
};

export const VirksomhetSomErFjernet: Story = {
    args: {
        virksomhet: fjernetVirksomhetMock,
    },
};

VirksomhetSomErFjernet.parameters = {
    msw: {
        handlers: [
            ...mswHandlers,
            http.get(`${iaSakPath}/:orgnummer/aktiv`, () => {
                return HttpResponse.json(iaSakKontaktes);
            }),
            http.get(
                `${sykefraværsstatistikkPath}/:orgnummer/${historiskStatistikkPath}`,
                () => {
                    return HttpResponse.json(historiskStatistikkMock);
                },
            ),
        ],
    },
};

export const VirksomhetMedSakSomErLukket: Story = {
    args: {
        virksomhet: virksomhetMock,
    },
};

VirksomhetMedSakSomErLukket.parameters = {
    msw: {
        handlers: [
            ...mswHandlers,
            http.get(`${iaSakPath}/:orgnummer/aktiv`, () => {
                return HttpResponse.json(iaSakFullførtOgLukket);
            }),
            http.get(
                `${sykefraværsstatistikkPath}/:orgnummer/${historiskStatistikkPath}`,
                () => {
                    return HttpResponse.json(historiskStatistikkMock);
                },
            ),
        ],
    },
};

export const VirksomhetUtenSak: Story = {
    args: {
        virksomhet: virksomhetMock,
    },
};

VirksomhetUtenSak.parameters = {
    msw: {
        handlers: [
            ...mswHandlers,
            http.get(`${iaSakPath}/:orgnummer/aktiv`, () => {
                return HttpResponse.json(null, { status: 204 });
            }),
            http.get(
                `${sykefraværsstatistikkPath}/:orgnummer/${historiskStatistikkPath}`,
                () => {
                    return HttpResponse.json(historiskStatistikkMock);
                },
            ),
        ],
    },
};
