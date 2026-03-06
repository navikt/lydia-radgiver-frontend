import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import SlettSamarbeidModal from "../../../../src/Pages/Virksomhet/AdministrerSamarbeid/SlettSamarbeidModal";
import { IaSakProsess } from "../../../../src/domenetyper/iaSakProsess";
import { IASak } from "../../../../src/domenetyper/domenetyper";

jest.mock("../../../../src/api/lydia-api/plan", () => ({
    useHentPlan: jest.fn(),
}));

jest.mock("../../../../src/api/lydia-api/nyFlyt", () => ({
    slettSamarbeidNyFlyt: jest.fn(),
}));

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
    const Modal = ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    );
    Modal.Body = ModalBody;
    Modal.Footer = ModalFooter;
    return { ...actual, Modal };
});

const { useHentPlan } = jest.requireMock("../../../../src/api/lydia-api/plan");
const { slettSamarbeidNyFlyt } = jest.requireMock(
    "../../../../src/api/lydia-api/nyFlyt",
);

function createMockSamarbeid(overrides?: Partial<IaSakProsess>): IaSakProsess {
    return {
        id: 1,
        saksnummer: "SAK-123",
        navn: "Test Samarbeid",
        status: "AKTIV" as const,
        sistEndret: new Date(),
        opprettet: new Date(),
        ...overrides,
    };
}

function createMockIaSak(overrides?: Partial<IASak>): IASak {
    return {
        saksnummer: "SAK-123",
        orgnr: "123456789",
        status: "VI_BISTÅR" as const,
        opprettetAv: "test-user",
        opprettetTidspunkt: new Date(),
        eidAv: null,
        endretAv: null,
        endretAvHendelseId: "hendelse-1",
        endretTidspunkt: null,
        gyldigeNesteHendelser: [],
        lukket: false,
        ...overrides,
    };
}

function renderModal(valgtSamarbeid?: IaSakProsess | null, iaSak?: IASak) {
    const ref = {
        current: { close: jest.fn() },
    } as unknown as React.RefObject<HTMLDialogElement | null>;
    render(
        <SlettSamarbeidModal
            ref={ref}
            valgtSamarbeid={valgtSamarbeid}
            iaSak={iaSak}
        />,
    );
    return ref;
}

describe("SlettSamarbeidModal", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("når samarbeid ikke har plan", () => {
        beforeEach(() => {
            useHentPlan.mockReturnValue({ data: undefined });
        });

        test("viser bekreftelsestekst når plan ikke finnes", () => {
            const samarbeid = createMockSamarbeid();
            renderModal(samarbeid, createMockIaSak());

            expect(
                screen.getByText(`Ønsker du å slette ${samarbeid.navn}?`),
            ).toBeInTheDocument();
        });

        test("kaller slettSamarbeidNyFlyt med riktig orgnr og samarbeidId ved klikk på Slett", async () => {
            slettSamarbeidNyFlyt.mockResolvedValue({});
            const iaSak = createMockIaSak();
            const samarbeid = createMockSamarbeid({ id: 42 });
            renderModal(samarbeid, iaSak);

            fireEvent.click(screen.getByText("Slett"));

            await waitFor(() => {
                expect(slettSamarbeidNyFlyt).toHaveBeenCalledWith(
                    iaSak.orgnr,
                    "42",
                );
            });
        });

        test("lukker modal etter vellykket sletting", async () => {
            slettSamarbeidNyFlyt.mockResolvedValue({});
            const ref = renderModal(createMockSamarbeid(), createMockIaSak());

            fireEvent.click(screen.getByText("Slett"));

            await waitFor(() => {
                expect(ref.current?.close).toHaveBeenCalled();
            });
        });

        test("viser feilmelding dersom sletting feiler", async () => {
            slettSamarbeidNyFlyt.mockRejectedValue(
                new Error("Noe gikk galt på serveren"),
            );
            renderModal(createMockSamarbeid(), createMockIaSak());

            fireEvent.click(screen.getByText("Slett"));

            await waitFor(() => {
                expect(
                    screen.getByText("Noe gikk galt på serveren"),
                ).toBeInTheDocument();
            });
        });

        test("viser feilmelding dersom iaSak mangler", async () => {
            renderModal(createMockSamarbeid(), undefined);

            fireEvent.click(screen.getByText("Slett"));

            await waitFor(() => {
                expect(
                    screen.getByText("Kunne ikke finne sak for samarbeid"),
                ).toBeInTheDocument();
            });
        });
    });

    describe("når samarbeid har en aktiv plan", () => {
        beforeEach(() => {
            useHentPlan.mockReturnValue({ data: { temaer: [] } });
        });

        test("viser blokkerende alert om at samarbeidet ikke kan slettes", () => {
            renderModal(createMockSamarbeid(), createMockIaSak());

            expect(
                screen.getByText("Samarbeidet kan ikke slettes fordi:"),
            ).toBeInTheDocument();
        });

        test("viser melding om aktiv samarbeidsplan", () => {
            renderModal(createMockSamarbeid(), createMockIaSak());

            expect(
                screen.getByText("Det finnes en aktiv samarbeidsplan"),
            ).toBeInTheDocument();
        });

        test("viser melding om aktiviteter i Salesforce", () => {
            renderModal(createMockSamarbeid(), createMockIaSak());

            expect(
                screen.getByText("Det finnes aktiviteter i Salesforce"),
            ).toBeInTheDocument();
        });

        test("skjuler bekreftelsesteksten for sletting", () => {
            const samarbeid = createMockSamarbeid();
            renderModal(samarbeid, createMockIaSak());

            expect(
                screen.queryByText(`Ønsker du å slette ${samarbeid.navn}?`),
            ).not.toBeInTheDocument();
        });
    });
});
