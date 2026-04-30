import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import type { Mock } from "vitest";
import { IASak } from "@/domenetyper/domenetyper";
import SlettSamarbeidModal from "@/Pages/Virksomhet/AdministrerSamarbeid/SlettSamarbeidModal";
import { SamarbeidProvider } from "@/Pages/Virksomhet/Samarbeid/SamarbeidContext";
import { useHentPlan as useHentPlanReal } from "@features/plan/api/plan";
import { slettSamarbeidNyFlyt as slettSamarbeidNyFlytReal } from "@features/sak/api/nyFlyt";
import { IaSakProsess } from "@features/sak/types/iaSakProsess";
import { useKanUtføreHandlingPåSamarbeid as useKanUtføreHandlingPåSamarbeidReal } from "@features/virksomhet/api/virksomhet";
const useHentPlan = useHentPlanReal as unknown as Mock;
const slettSamarbeidNyFlyt = slettSamarbeidNyFlytReal as unknown as Mock;
const useKanUtføreHandlingPåSamarbeid = useKanUtføreHandlingPåSamarbeidReal as unknown as Mock;

vi.mock("@features/plan/api/plan", () => ({
    useHentPlan: vi.fn(() => ({ mutate: vi.fn() })),
}));

vi.mock("@features/sak/api/nyFlyt", () => ({
    slettSamarbeidNyFlyt: vi.fn(),
    avsluttSamarbeidNyFlyt: vi.fn(),
    useHentSisteSakNyFlyt: vi.fn(() => ({ mutate: vi.fn() })),
    useHentSpesifikkSakNyFlyt: vi.fn(() => ({ mutate: vi.fn() })),
    useHentTilstandForVirksomhetNyFlyt: vi.fn(() => ({ mutate: vi.fn() })),
}));

vi.mock("@features/virksomhet/api/virksomhet", () => ({
    useKanUtføreHandlingPåSamarbeid: vi.fn(() => ({
        data: { kanGjennomføres: true, blokkerende: [], advarsler: [] },
        mutate: vi.fn(),
    })),
    useHentSalesforceSamarbeidLenke: vi.fn(() => ({
        data: "https://tullesalesforce.com/samarbeid/1",
    })),
}));

vi.mock("@features/kartlegging/api/spørreundersøkelse", () => ({
    useHentSamarbeid: vi.fn(() => ({ mutate: vi.fn() })),
}));

vi.mock("@navikt/ds-react", async () => {
    const actual = (await vi.importActual("@navikt/ds-react"));
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

const { useHentPlan: _u1 } = await vi.importMock<{ useHentPlan: unknown }>(
    "@features/plan/api/plan",
);
const { useKanUtføreHandlingPåSamarbeid: _u2 } = await vi.importMock<{
    useKanUtføreHandlingPåSamarbeid: unknown;
}>("@features/virksomhet/api/virksomhet");
const { slettSamarbeidNyFlyt: _u3 } = await vi.importMock<{
    slettSamarbeidNyFlyt: unknown;
}>("@features/sak/api/nyFlyt");
void _u1;
void _u2;
void _u3;

function createMockSamarbeidMedId(
    id: number,
    overrides?: Partial<IaSakProsess>,
): IaSakProsess {
    return createMockSamarbeid({ id, ...overrides });
}

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

function renderModal(
    valgtSamarbeid?: IaSakProsess,
    iaSak?: IASak,
    alleSamarbeid?: IaSakProsess[],
) {
    const ref = {
        current: { close: vi.fn() },
    } as unknown as React.RefObject<HTMLDialogElement | null>;
    render(
        <SamarbeidProvider samarbeid={valgtSamarbeid}>
            <SlettSamarbeidModal
                ref={ref}
                valgtSamarbeid={valgtSamarbeid}
                iaSak={iaSak}
                alleSamarbeid={alleSamarbeid}
            />
        </SamarbeidProvider>,
    );
    return ref;
}

describe("SlettSamarbeidModal", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("når samarbeid ikke har plan", () => {
        beforeEach(() => {
            useHentPlan.mockReturnValue({ data: undefined, mutate: vi.fn() });
        });

        test("viser bekreftelsestekst når plan ikke finnes", () => {
            const samarbeid = createMockSamarbeid();
            renderModal(samarbeid, createMockIaSak());

            expect(
                screen.getByText(
                    `Ønsker du å slette samarbeidet ${samarbeid.navn}?`,
                ),
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
                    42,
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
            useKanUtføreHandlingPåSamarbeid.mockReturnValue({
                data: {
                    kanGjennomføres: false,
                    blokkerende: ["FINNES_SAMARBEIDSPLAN"],
                    advarsler: [],
                },
                mutate: vi.fn(),
            });
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
            useKanUtføreHandlingPåSamarbeid.mockReturnValueOnce({
                data: {
                    kanGjennomføres: false,
                    blokkerende: ["FINNES_SALESFORCE_AKTIVITET"],
                    advarsler: [],
                },
                mutate: vi.fn(),
            });
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

    describe("siste samarbeid", () => {
        beforeEach(() => {
            useKanUtføreHandlingPåSamarbeid.mockReturnValue({
                data: {
                    kanGjennomføres: true,
                    blokkerende: [],
                    advarsler: [],
                },
                mutate: vi.fn(),
            });
            slettSamarbeidNyFlyt.mockResolvedValue({});
        });

        test("kaller slettSamarbeidNyFlyt via BekreftSisteSamarbeidModal ved bekreftelse", async () => {
            const samarbeid = createMockSamarbeidMedId(5);
            const iaSak = createMockIaSak();
            renderModal(samarbeid, iaSak, [samarbeid]);

            fireEvent.click(
                screen.getByRole("button", { name: "Slett samarbeidet" }),
            );

            await waitFor(() => {
                expect(slettSamarbeidNyFlyt).toHaveBeenCalledWith(
                    iaSak.orgnr,
                    5,
                    expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
                );
            });
        });

        test("kaller slettSamarbeidNyFlyt direkte når det ikke er siste samarbeid", async () => {
            const samarbeid = createMockSamarbeidMedId(10);
            const annetSamarbeid = createMockSamarbeidMedId(20, {
                navn: "Annet samarbeid",
            });
            const iaSak = createMockIaSak();
            renderModal(samarbeid, iaSak, [samarbeid, annetSamarbeid]);

            fireEvent.click(screen.getByRole("button", { name: "Slett" }));

            await waitFor(() => {
                expect(slettSamarbeidNyFlyt).toHaveBeenCalledWith(
                    iaSak.orgnr,
                    10,
                );
            });
        });
    });
});
