import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import OpprettPlanKnapp from "../../../../src/Pages/Virksomhet/Plan/SamarbeidsplanFane/OpprettPlanKnapp";
import { IaSakProsess } from "../../../../src/domenetyper/iaSakProsess";
import { PlanMal } from "../../../../src/domenetyper/plan";
import * as nyFlyt from "../../../../src/api/lydia-api/nyFlyt";
import * as plan from "../../../../src/api/lydia-api/plan";
import * as spørreundersøkelse from "../../../../src/api/lydia-api/spørreundersøkelse";

jest.mock("@navikt/ds-react", () => {
    const actual = jest.requireActual("@navikt/ds-react");
    const ModalBody = ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    );
    ModalBody.displayName = "Modal.Body";
    const ModalFooter = ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    );
    ModalFooter.displayName = "Modal.Footer";
    const Modal = ({
        open,
        children,
    }: {
        open: boolean;
        children: React.ReactNode;
    }) => (open ? <div role="dialog">{children}</div> : null);
    Modal.Body = ModalBody;
    Modal.Footer = ModalFooter;
    return { ...actual, Modal };
});

jest.mock("../../../../src/util/analytics-klient", () => ({
    loggModalÅpnet: jest.fn(),
}));

const testSamarbeid: IaSakProsess = {
    id: 42,
    saksnummer: "SAK-001",
    navn: "Test samarbeid",
    status: "AKTIV",
    sistEndret: new Date("2025-01-01"),
    opprettet: new Date("2025-01-01"),
};

const testPlanMal: PlanMal = {
    tema: [
        {
            rekkefølge: 1,
            navn: "Sykefraværsarbeid",
            inkludert: false,
            innhold: [
                {
                    rekkefølge: 1,
                    navn: "Kartlegging",
                    inkludert: false,
                    startDato: null,
                    sluttDato: null,
                },
                {
                    rekkefølge: 2,
                    navn: "Oppfølging",
                    inkludert: false,
                    startDato: null,
                    sluttDato: null,
                },
            ],
        },
        {
            rekkefølge: 2,
            navn: "Arbeidsmiljø",
            inkludert: false,
            innhold: [
                {
                    rekkefølge: 1,
                    navn: "Risikovurdering",
                    inkludert: false,
                    startDato: null,
                    sluttDato: null,
                },
            ],
        },
    ],
};

function renderKnapp({
    kanEndrePlan = true,
    sakErIRettStatus = true,
    planMal = testPlanMal,
}: {
    kanEndrePlan?: boolean;
    sakErIRettStatus?: boolean;
    planMal?: PlanMal;
} = {}) {
    return render(
        <OpprettPlanKnapp
            orgnummer="123456789"
            saksnummer="SAK-001"
            samarbeid={testSamarbeid}
            kanEndrePlan={kanEndrePlan}
            sakErIRettStatus={sakErIRettStatus}
            planMal={planMal}
        />,
    );
}

describe("OpprettPlanKnapp", () => {
    let opprettSamarbeidsplanMock: jest.SpyInstance;

    beforeEach(() => {
        jest.clearAllMocks();

        opprettSamarbeidsplanMock = jest
            .spyOn(nyFlyt, "opprettSamarbeidsplanNyFlyt")
            .mockResolvedValue(undefined as never);

        jest.spyOn(plan, "useHentPlan").mockReturnValue({
            data: undefined,
            error: undefined,
            loading: false,
            validating: false,
            mutate: jest.fn(),
        } as never);

        jest.spyOn(spørreundersøkelse, "useHentSamarbeid").mockReturnValue({
            data: [],
            error: undefined,
            loading: false,
            validating: false,
            mutate: jest.fn(),
        } as never);
    });

    test("viser 'Opprett plan'-knapp", () => {
        renderKnapp();
        expect(
            screen.getByRole("button", { name: "Opprett plan" }),
        ).toBeInTheDocument();
    });

    test("knappen er deaktivert når kanEndrePlan er false", () => {
        renderKnapp({ kanEndrePlan: false });
        expect(
            screen.getByRole("button", { name: "Opprett plan" }),
        ).toBeDisabled();
    });

    test("knappen er deaktivert når sakErIRettStatus er false", () => {
        renderKnapp({ sakErIRettStatus: false });
        expect(
            screen.getByRole("button", { name: "Opprett plan" }),
        ).toBeDisabled();
    });

    test("åpner modal ved klikk på knappen", () => {
        renderKnapp();
        fireEvent.click(screen.getByRole("button", { name: "Opprett plan" }));
        expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    test("viser temaer fra planmalen i modalen", () => {
        renderKnapp();
        fireEvent.click(screen.getByRole("button", { name: "Opprett plan" }));
        expect(
            screen.getByRole("group", { name: "Sykefraværsarbeid" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("group", { name: "Arbeidsmiljø" }),
        ).toBeInTheDocument();
    });

    test("viser feilmelding når Lagre klikkes uten å velge tema", () => {
        renderKnapp();
        fireEvent.click(screen.getByRole("button", { name: "Opprett plan" }));
        fireEvent.click(screen.getByRole("button", { name: "Lagre" }));
        expect(
            screen.getByText("Du må velge minst ett tema."),
        ).toBeInTheDocument();
    });

    test("kaller opprettSamarbeidsplanNyFlyt med riktig orgnummer og samarbeidId etter temavalg", async () => {
        renderKnapp();
        fireEvent.click(screen.getByRole("button", { name: "Opprett plan" }));
        fireEvent.click(screen.getByRole("checkbox", { name: "Kartlegging" }));
        fireEvent.click(screen.getByRole("button", { name: "Lagre" }));

        await waitFor(() => {
            expect(opprettSamarbeidsplanMock).toHaveBeenCalledWith(
                "123456789",
                "SAK-001",
                "42",
                expect.objectContaining({
                    tema: expect.arrayContaining([
                        expect.objectContaining({
                            navn: "Sykefraværsarbeid",
                            inkludert: true,
                        }),
                    ]),
                }),
            );
        });
    });

    test("lukker modalen etter lagring", async () => {
        renderKnapp();
        fireEvent.click(screen.getByRole("button", { name: "Opprett plan" }));
        fireEvent.click(screen.getByRole("checkbox", { name: "Kartlegging" }));
        fireEvent.click(screen.getByRole("button", { name: "Lagre" }));

        await waitFor(() => {
            expect(
                screen.queryByRole("dialog", { name: "Opprett plan" }),
            ).not.toBeInTheDocument();
        });
    });

    test("Avbryt-knappen lukker modalen", () => {
        renderKnapp();
        fireEvent.click(screen.getByRole("button", { name: "Opprett plan" }));
        fireEvent.click(screen.getByRole("button", { name: "Avbryt" }));
        expect(
            screen.queryByRole("dialog", { name: "Opprett plan" }),
        ).not.toBeInTheDocument();
    });
});
