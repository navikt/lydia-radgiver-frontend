import { Meta } from "@storybook/react";
import { http, HttpResponse } from "msw";
import {
    sykefraværsstatistikkBransjeMock,
    sykefraværsstatistikkSisteKvartalMock,
    virksomhetsstatistikkSiste4KvartalerMock,
} from "../../Prioritering/mocks/sykefraværsstatistikkMock";
import { Sykefraværsstatistikk } from "./Sykefraværsstatistikk";
import {
    bransjePath,
    siste4kvartalerPath,
    sistekvartalPath,
    sykefraværsstatistikkPath,
} from "../../../api/lydia-api/paths";
import { Næring } from "../../../domenetyper/virksomhet";
import { mswHandlers } from "../../../../.storybook/mswHandlers";

export default {
    title: "Virksomhet/Virksomhetsoversikt/Sykefraværsstatistikk for en virksomhet",
    component: Sykefraværsstatistikk,
    parameters: {
        backgrounds: {
            default: "white",
        },
    },
} as Meta<typeof Sykefraværsstatistikk>;

const orgnummer = "999123456";
const jordbruk: Næring = {
    navn: "Jordbruk",
    kode: "01",
};

export const Hovedstory = () => (
    <Sykefraværsstatistikk
        orgnummer={orgnummer}
        bransje={"BRANSJE"}
        næring={jordbruk}
    />
);

Hovedstory.parameters = {
    msw: {
        handlers: [
            ...mswHandlers,
            http.get(
                `${sykefraværsstatistikkPath}/:orgnummer/${siste4kvartalerPath}`,
                () => {
                    return HttpResponse.json(
                        virksomhetsstatistikkSiste4KvartalerMock[0],
                    );
                },
            ),
            http.get(
                `${sykefraværsstatistikkPath}/:orgnummer/${sistekvartalPath}`,
                () => {
                    return HttpResponse.json(
                        sykefraværsstatistikkSisteKvartalMock[0],
                    );
                },
            ),
            http.get(
                `${sykefraværsstatistikkPath}/${bransjePath}/:bransjekode`,
                () => {
                    return HttpResponse.json(sykefraværsstatistikkBransjeMock);
                },
            ),
        ],
    },
};

export const ForVirksomhetUtenBransje = () => (
    <Sykefraværsstatistikk
        orgnummer={orgnummer}
        bransje={null}
        næring={jordbruk}
    />
);

ForVirksomhetUtenBransje.parameters = {
    msw: {
        handlers: [
            ...mswHandlers,
            http.get(
                `${sykefraværsstatistikkPath}/:orgnummer/${siste4kvartalerPath}`,
                () => {
                    return HttpResponse.json(
                        virksomhetsstatistikkSiste4KvartalerMock[2],
                    );
                },
            ),
            http.get(
                `${sykefraværsstatistikkPath}/:orgnummer/${sistekvartalPath}`,
                () => {
                    return HttpResponse.json(
                        sykefraværsstatistikkSisteKvartalMock[0],
                    );
                },
            ),
            http.get(
                `${sykefraværsstatistikkPath}/${bransjePath}/:bransjekode`,
                () => {
                    return HttpResponse.json(sykefraværsstatistikkBransjeMock);
                },
            ),
        ],
    },
};

export const MedStatistikkFraKunToKvartal = () => (
    <Sykefraværsstatistikk
        orgnummer={orgnummer}
        bransje={"BRANSJE"}
        næring={jordbruk}
    />
);

MedStatistikkFraKunToKvartal.parameters = {
    msw: {
        handlers: [
            ...mswHandlers,
            http.get(
                `${sykefraværsstatistikkPath}/:orgnummer/${siste4kvartalerPath}`,
                () => {
                    return HttpResponse.json(
                        virksomhetsstatistikkSiste4KvartalerMock[2],
                    );
                },
            ),
            http.get(
                `${sykefraværsstatistikkPath}/:orgnummer/${sistekvartalPath}`,
                () => {
                    return HttpResponse.json(
                        sykefraværsstatistikkSisteKvartalMock[0],
                    );
                },
            ),
            http.get(
                `${sykefraværsstatistikkPath}/${bransjePath}/:bransjekode`,
                () => {
                    return HttpResponse.json(sykefraværsstatistikkBransjeMock);
                },
            ),
        ],
    },
};
