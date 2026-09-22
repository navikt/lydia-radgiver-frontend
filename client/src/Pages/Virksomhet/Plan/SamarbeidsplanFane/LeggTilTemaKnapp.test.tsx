import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import LeggTilTemaKnapp from "./LeggTilTemaKnapp";
import { IaSakProsess } from "../../../../domenetyper/iaSakProsess";
import { Plan, PlanTema } from "../../../../domenetyper/plan";
import * as bruker from "../../../../api/lydia-api/bruker";

jest.mock("src/util/analytics-klient", () => ({
    loggModalÅpnet: jest.fn(),
    loggEndringAvPlan: jest.fn(),
}));

jest.mock("src/api/lydia-api/bruker", () => ({
    ...jest.requireActual("src/api/lydia-api/bruker"),
    useHentBrukerinformasjon: jest.fn(),
}));

// jsdom mangler disse, og komponenten kaller dem uansett når alerten vises.
window.HTMLElement.prototype.scrollIntoView = jest.fn();
window.matchMedia =
    window.matchMedia ||
    (() => ({
        matches: false,
        addListener: jest.fn(),
        removeListener: jest.fn(),
    }));

const testSamarbeid: IaSakProsess = {
    id: 42,
    saksnummer: "SAK-001",
    navn: "Test samarbeid",
    status: "AKTIV",
    sistEndret: new Date("2025-01-01"),
    opprettet: new Date("2025-01-01"),
};

function lagUndertema(
    overrides: Partial<PlanTema["undertemaer"][number]> = {},
): PlanTema["undertemaer"][number] {
    return {
        id: 1,
        navn: "Kartlegging",
        målsetning: "",
        inkludert: false,
        status: null,
        startDato: null,
        sluttDato: null,
        harAktiviteterISalesforce: false,
        ...overrides,
    };
}

function lagTemaliste(planErTom: boolean): PlanTema[] {
    return [
        {
            id: 1,
            navn: "Sykefraværsarbeid",
            inkludert: !planErTom,
            undertemaer: [
                lagUndertema({ inkludert: !planErTom }),
                lagUndertema({ id: 2, navn: "Oppfølging" }),
            ],
        },
    ];
}

function lagPlan({
    planErTom = true,
    publisert,
}: {
    planErTom?: boolean;
    publisert: boolean;
}): Plan {
    return {
        id: "plan-1",
        sistEndret: new Date("2025-01-01"),
        sistPublisert: publisert ? new Date("2025-01-01") : null,
        temaer: lagTemaliste(planErTom),
        publiseringStatus: publisert ? "PUBLISERT" : "IKKE_PUBLISERT",
        harEndringerSidenSistPublisert: false,
    };
}

function renderKnapp(samarbeidsplan: Plan) {
    return render(
        <LeggTilTemaKnapp
            orgnummer="123456789"
            saksnummer="SAK-001"
            samarbeid={testSamarbeid}
            samarbeidsplan={samarbeidsplan}
            hentPlanIgjen={jest.fn()}
            kanEndrePlan={true}
            sakErIRettStatus={true}
        />,
    );
}

function åpneModal() {
    fireEvent.click(screen.getByRole("button", { name: "Rediger plan" }));
}

describe("LeggTilTemaKnapp", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        jest.mocked(bruker.useHentBrukerinformasjon).mockReturnValue({
            data: {
                ident: "Z123456",
                navn: "Test Testesen",
                epost: "",
                rolle: "Superbruker",
                tokenUtloper: 99999999999,
            },
            loading: false,
            error: undefined,
            mutate: jest.fn(),
            validating: false,
        } as never);
    });

    test("kan ikke slette planen når den er publisert", () => {
        renderKnapp(lagPlan({ planErTom: true, publisert: true }));
        åpneModal();

        expect(
            screen.getByRole("button", { name: "Slett plan" }),
        ).toBeDisabled();
    });

    test("kan slette planen når den ikke er publisert", () => {
        renderKnapp(lagPlan({ planErTom: true, publisert: false }));
        åpneModal();

        expect(
            screen.getByRole("button", { name: "Slett plan" }),
        ).not.toBeDisabled();
    });

    test("viser alert når planen er tom og publisert", () => {
        renderKnapp(lagPlan({ planErTom: true, publisert: true }));
        åpneModal();

        expect(screen.getByText("Planen kan ikke slettes")).toBeInTheDocument();
    });

    test("scroller alerten inn i synsfeltet når den vises", () => {
        renderKnapp(lagPlan({ planErTom: true, publisert: true }));
        åpneModal();

        const alertTittel = screen.getByText("Planen kan ikke slettes");
        const alert = alertTittel.closest("section") as HTMLElement;

        expect(alert.scrollIntoView).toHaveBeenCalledTimes(1);
    });

    test("viser ikke alert når planen ikke er publisert", () => {
        renderKnapp(lagPlan({ planErTom: true, publisert: false }));
        åpneModal();

        expect(
            screen.queryByText("Planen kan ikke slettes"),
        ).not.toBeInTheDocument();
    });

    test("viser ikke alert når planen ikke er tom, selv om den er publisert", () => {
        renderKnapp(lagPlan({ planErTom: false, publisert: true }));
        åpneModal();

        expect(
            screen.queryByText("Planen kan ikke slettes"),
        ).not.toBeInTheDocument();
    });

    test("lukker alerten når lukkeknappen klikkes", () => {
        renderKnapp(lagPlan({ planErTom: true, publisert: true }));
        åpneModal();

        const alertTittel = screen.getByText("Planen kan ikke slettes");
        expect(alertTittel).toBeInTheDocument();

        const alert = alertTittel.closest("section") as HTMLElement;
        fireEvent.click(within(alert).getByRole("button", { name: "Lukk" }));

        expect(
            screen.queryByText("Planen kan ikke slettes"),
        ).not.toBeInTheDocument();
    });
});
