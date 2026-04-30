import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { axe } from "vitest-axe";
import { NyVirksomhetsside } from "@/Pages/Virksomhet";
import { useHentBrukerinformasjon } from "@features/bruker/api/bruker";
import {
    useHentTilstandForVirksomhetNyFlyt,
    vurderSakNyFlyt,
    endrePlanlagtDatoNyFlyt,
} from "@features/sak/api/nyFlyt";
import {
    dummyIaSak,
    dummyPubliseringsinfo,
    dummySakshistorikk,
    dummySamarbeid,
    dummyVirksomhetsinformasjonNyFlyt,
    dummyNæringsstatistikk,
    dummySykefraværsstatistikkSiste4Kvartal,
    dummyVirksomhetsstatistikkSiste4Kvartal,
} from "@mocks/virksomhetsMockData";

vi.mock("@/util/analytics-klient", async () => {
    const actual = (await vi.importActual("@/util/analytics-klient"));
    return {
        ...actual,
        loggSideLastet: vi.fn(),
        loggNavigertTilNyTab: vi.fn(),
    };
});

vi.mock("@features/virksomhet/api/virksomhet", async () => {
    return {
        ...(await vi.importActual("@features/virksomhet/api/virksomhet")),
        useHentVirksomhetsinformasjon: vi.fn(() => ({
            data: dummyVirksomhetsinformasjonNyFlyt,
            loading: false,
        })),
        useHentSakshistorikk: vi.fn(() => ({
            data: dummySakshistorikk,
            loading: false,
            validating: false,
            mutate: vi.fn(),
        })),
        useHentPubliseringsinfo: vi.fn(() => ({
            data: dummyPubliseringsinfo,
            loading: false,
        })),
        useHentSykefraværsstatistikkForVirksomhetSisteKvartal: vi.fn(() => ({
            data: dummySykefraværsstatistikkSiste4Kvartal,
            loading: false,
        })),
        useHentNæringsstatistikk: vi.fn(() => ({
            data: dummyNæringsstatistikk,
            loading: false,
        })),
        useHentVirksomhetsstatistikkSiste4Kvartaler: vi.fn(() => ({
            data: dummyVirksomhetsstatistikkSiste4Kvartal,
            loading: false,
        })),
    };
});

vi.mock("@features/kartlegging/api/spørreundersøkelse", async () => {
    return {
        ...(await vi.importActual("@features/kartlegging/api/spørreundersøkelse")),
        useHentSamarbeid: vi.fn(() => ({
            data: [],
            loading: false,
            validating: false,
            mutate: vi.fn(() => Promise.resolve([])),
        })),
        useSpørreundersøkelsesliste: vi.fn(() => ({
            data: [],
            loading: false,
            validating: false,
            mutate: vi.fn(),
        })),
    };
});

vi.mock("@features/sak/api/nyFlyt", async () => {
    return {
        ...(await vi.importActual("@features/sak/api/nyFlyt")),
        useHentTilstandForVirksomhetNyFlyt: vi.fn(),
        vurderSakNyFlyt: vi.fn(() => Promise.resolve()),
        endrePlanlagtDatoNyFlyt: vi.fn(() => Promise.resolve()),
        avsluttVurderingNyFlyt: vi.fn(() => Promise.resolve()),
        angreVurderingNyFlyt: vi.fn(() => Promise.resolve()),
        opprettSamarbeidNyFlyt: vi.fn(() => Promise.resolve()),
        useHentSisteSakNyFlyt: vi.fn(() => ({
            data: undefined,
            loading: false,
            mutate: vi.fn(),
        })),
        useHentSpesifikkSakNyFlyt: vi.fn(() => ({
            data: dummyIaSak,
            loading: false,
            mutate: vi.fn(),
        })),
        useHentVirksomhetNyFlyt: vi.fn(() => ({
            data: dummyVirksomhetsinformasjonNyFlyt,
            loading: false,
            mutate: vi.fn(),
        })),
        useHentHistorikkNyFlyt: vi.fn(() => ({
            data: [],
            loading: false,
            mutate: vi.fn(),
        })),
    };
});

vi.mock("@features/bruker/api/bruker", async () => {
    return {
        ...(await vi.importActual("@features/bruker/api/bruker")),
        useHentBrukerinformasjon: vi.fn(() => ({
            data: {
                ident: "Z123456",
                navn: "Test Testesen",
                epost: "",
                rolle: "Superbruker",
            },
            loading: false,
        })),
    };
});

vi.mock("@features/bruker/api/team", async () => {
    return {
        ...(await vi.importActual("@features/bruker/api/team")),
        useHentTeam: vi.fn(() => ({
            data: ["Z123456"],
            loading: false,
            mutate: vi.fn(),
        })),
    };
});

vi.mock("react-router-dom", async () => {
    const originalModule = (await vi.importActual("react-router-dom"));
    return {
        ...originalModule,
        useParams: vi.fn(() => ({
            orgnummer: dummyVirksomhetsinformasjonNyFlyt.orgnr,
            saksnummer: dummyIaSak.saksnummer,
            prosessId: dummySamarbeid[1].id.toString(),
        })),
        useSearchParams: vi.fn(() => {
            const setSearchParams = vi.fn();
            return [new URLSearchParams(), setSearchParams];
        }),
    };
});

const planlagtDato = new Date("2026-06-01");

const nesteTilstandVurderes = {
    startTilstand: "VirksomhetErVurdert" as const,
    planlagtHendelse: "VURDER_VIRKSOMHET",
    nyTilstand: "VirksomhetVurderes" as const,
    planlagtDato,
};

const nesteTilstandKlarTilVurdering = {
    startTilstand: "VirksomhetErVurdert" as const,
    planlagtHendelse: "RESET_VURDERING",
    nyTilstand: "VirksomhetKlarTilVurdering" as const,
    planlagtDato,
};

describe("NyVirksomhetsside – VirksomhetErVurdert", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("nesteTilstand: VirksomhetVurderes", () => {
        beforeEach(() => {
            vi.mocked(useHentTilstandForVirksomhetNyFlyt).mockReturnValue({
                data: {
                    orgnr: dummyVirksomhetsinformasjonNyFlyt.orgnr,
                    tilstand: "VirksomhetErVurdert",
                    nesteTilstand: nesteTilstandVurderes,
                },
                loading: false,
                error: null,
                mutate: vi.fn(),
                validating: false,
            });
        });

        it("Viser 'Vurderes automatisk'-knapp med planlagt dato", () => {
            render(
                <BrowserRouter>
                    <NyVirksomhetsside />
                </BrowserRouter>,
            );
            expect(screen.getByText(/Vurderes automatisk/)).toBeInTheDocument();
        });

        it("Åpner modal ved klikk på 'Vurderes automatisk'-knapp", () => {
            render(
                <BrowserRouter>
                    <NyVirksomhetsside />
                </BrowserRouter>,
            );
            fireEvent.click(screen.getByText(/Vurderes automatisk/));
            expect(
                screen.getByRole("dialog", { name: "Endre dato" }),
            ).toBeInTheDocument();
        });

        it("'Vurder nå'-knapp kaller vurderSakNyFlyt", async () => {
            render(
                <BrowserRouter>
                    <NyVirksomhetsside />
                </BrowserRouter>,
            );
            expect(vurderSakNyFlyt).not.toHaveBeenCalled();
            fireEvent.click(screen.getByRole("button", { name: "Vurder nå" }));
            await waitFor(() =>
                expect(vurderSakNyFlyt).toHaveBeenCalledTimes(1),
            );
            expect(vurderSakNyFlyt).toHaveBeenCalledWith(
                dummyVirksomhetsinformasjonNyFlyt.orgnr,
            );
        });

        it("'Lagre' i modal kaller endrePlanlagtDatoNyFlyt", async () => {
            render(
                <BrowserRouter>
                    <NyVirksomhetsside />
                </BrowserRouter>,
            );
            fireEvent.click(screen.getByText(/Vurderes automatisk/));
            expect(endrePlanlagtDatoNyFlyt).not.toHaveBeenCalled();
            fireEvent.click(screen.getByRole("button", { name: "Lagre" }));
            await waitFor(() =>
                expect(endrePlanlagtDatoNyFlyt).toHaveBeenCalledTimes(1),
            );
            expect(endrePlanlagtDatoNyFlyt).toHaveBeenCalledWith(
                dummyVirksomhetsinformasjonNyFlyt.orgnr,
                expect.objectContaining({
                    startTilstand: nesteTilstandVurderes.startTilstand,
                    planlagtHendelse: nesteTilstandVurderes.planlagtHendelse,
                    nyTilstand: nesteTilstandVurderes.nyTilstand,
                }),
            );
        });

        it("'Avbryt' i modal lukker modalen", () => {
            render(
                <BrowserRouter>
                    <NyVirksomhetsside />
                </BrowserRouter>,
            );
            fireEvent.click(screen.getByText(/Vurderes automatisk/));
            expect(
                screen.getByRole("dialog", { name: "Endre dato" }),
            ).toBeInTheDocument();
            fireEvent.click(screen.getByRole("button", { name: "Avbryt" }));
            expect(
                screen.queryByRole("dialog", { name: "Endre dato" }),
            ).not.toBeInTheDocument();
        });

        it("Har ingen accessibilityfeil", async () => {
            const { container } = render(
                <BrowserRouter>
                    <NyVirksomhetsside />
                </BrowserRouter>,
            );
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });

    describe("nesteTilstand: VirksomhetKlarTilVurdering", () => {
        beforeEach(() => {
            vi.mocked(useHentTilstandForVirksomhetNyFlyt).mockReturnValue({
                data: {
                    orgnr: dummyVirksomhetsinformasjonNyFlyt.orgnr,
                    tilstand: "VirksomhetErVurdert",
                    nesteTilstand: nesteTilstandKlarTilVurdering,
                },
                loading: false,
                error: null,
                mutate: vi.fn(),
                validating: false,
            });
        });

        it("Viser 'Vurder nå'-knapp og 'Vurdert frem til'-knapp", () => {
            render(
                <BrowserRouter>
                    <NyVirksomhetsside />
                </BrowserRouter>,
            );
            expect(
                screen.getByRole("button", { name: "Vurder nå" }),
            ).toBeInTheDocument();
            expect(
                screen.getByRole("button", { name: /Vurdert frem til/ }),
            ).toBeInTheDocument();
        });

        it("Åpner modal ved klikk på 'Vurdert frem til'-knapp", () => {
            render(
                <BrowserRouter>
                    <NyVirksomhetsside />
                </BrowserRouter>,
            );
            fireEvent.click(
                screen.getByRole("button", { name: /Vurdert frem til/ }),
            );
            expect(
                screen.getByRole("dialog", { name: "Endre dato" }),
            ).toBeInTheDocument();
        });

        it("'Lagre' i VurdertTil-modal kaller endrePlanlagtDatoNyFlyt", async () => {
            render(
                <BrowserRouter>
                    <NyVirksomhetsside />
                </BrowserRouter>,
            );
            fireEvent.click(
                screen.getByRole("button", { name: /Vurdert frem til/ }),
            );
            expect(endrePlanlagtDatoNyFlyt).not.toHaveBeenCalled();
            fireEvent.click(screen.getByRole("button", { name: "Lagre" }));
            await waitFor(() =>
                expect(endrePlanlagtDatoNyFlyt).toHaveBeenCalledTimes(1),
            );
            expect(endrePlanlagtDatoNyFlyt).toHaveBeenCalledWith(
                dummyVirksomhetsinformasjonNyFlyt.orgnr,
                expect.objectContaining({
                    startTilstand: nesteTilstandKlarTilVurdering.startTilstand,
                    planlagtHendelse:
                        nesteTilstandKlarTilVurdering.planlagtHendelse,
                    nyTilstand: nesteTilstandKlarTilVurdering.nyTilstand,
                }),
            );
        });

        it("'Vurder nå' kaller vurderSakNyFlyt", async () => {
            render(
                <BrowserRouter>
                    <NyVirksomhetsside />
                </BrowserRouter>,
            );
            expect(vurderSakNyFlyt).not.toHaveBeenCalled();
            fireEvent.click(screen.getByRole("button", { name: "Vurder nå" }));
            await waitFor(() =>
                expect(vurderSakNyFlyt).toHaveBeenCalledTimes(1),
            );
            expect(vurderSakNyFlyt).toHaveBeenCalledWith(
                dummyVirksomhetsinformasjonNyFlyt.orgnr,
            );
        });

        it("Har ingen accessibilityfeil", async () => {
            const { container } = render(
                <BrowserRouter>
                    <NyVirksomhetsside />
                </BrowserRouter>,
            );
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });

    describe("tilgangskontroll: 'Vurder nå' kun for Superbruker", () => {
        beforeEach(() => {
            vi.mocked(useHentTilstandForVirksomhetNyFlyt).mockReturnValue({
                data: {
                    orgnr: dummyVirksomhetsinformasjonNyFlyt.orgnr,
                    tilstand: "VirksomhetErVurdert",
                    nesteTilstand: nesteTilstandVurderes,
                },
                loading: false,
                error: null,
                mutate: vi.fn(),
                validating: false,
            });
        });

        it("'Vurder nå'-knappen er deaktivert for ikke-Superbruker", () => {
            vi.mocked(useHentBrukerinformasjon).mockReturnValue({
                data: {
                    ident: "Z123456",
                    navn: "Test Testesen",
                    epost: "",
                    tokenUtloper: 0,
                    rolle: "Lesetilgang",
                },
                loading: false,
                error: null,
                mutate: vi.fn(),
                validating: false,
            });

            render(
                <BrowserRouter>
                    <NyVirksomhetsside />
                </BrowserRouter>,
            );

            const knapp = screen.getByRole("button", { name: "Vurder nå" });
            expect(knapp).toBeDisabled();

            fireEvent.click(knapp);
            expect(vurderSakNyFlyt).not.toHaveBeenCalled();
        });

        it("'Vurder nå'-knappen er aktivert for Superbruker", () => {
            vi.mocked(useHentBrukerinformasjon).mockReturnValue({
                data: {
                    ident: "Z123456",
                    navn: "Test Testesen",
                    epost: "",
                    tokenUtloper: 0,
                    rolle: "Superbruker",
                },
                loading: false,
                error: null,
                mutate: vi.fn(),
                validating: false,
            });

            render(
                <BrowserRouter>
                    <NyVirksomhetsside />
                </BrowserRouter>,
            );

            expect(
                screen.getByRole("button", { name: "Vurder nå" }),
            ).toBeEnabled();
        });
    });
});
