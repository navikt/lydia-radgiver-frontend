import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter, useParams, useSearchParams } from "react-router-dom";
import { axe } from "vitest-axe";
import {
    brukerMedGyldigToken,
    brukerMedLesetilgang,
} from "@/Pages/Prioritering/mocks/innloggetAnsattMock";
import { NyVirksomhetsside } from "@/Pages/Virksomhet";
import { useHentBrukerinformasjon } from "@features/bruker/api/bruker";
import { useHentSamarbeid } from "@features/kartlegging/api/spørreundersøkelse";
import { useHarPlan, useHentPlan } from "@features/plan/api/plan";
import {
    useHentSisteSakNyFlyt,
    useHentSpesifikkSakNyFlyt,
} from "@features/sak/api/nyFlyt";
import { dummySpørreundersøkelseliste } from "@mocks/spørreundersøkelseDummyData";
import {
    dummyIaSak,
    dummyPubliseringsinfo,
    dummySakshistorikk,
    dummySamarbeid,
    dummyVirksomhetsinformasjon,
    dummyNæringsstatistikk,
    dummySykefraværsstatistikkSiste4Kvartal,
    dummyVirksomhetsstatistikkSiste4Kvartal,
    dummyPlan,
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
        useHentVirksomhetsinformasjon: vi.fn(() => {
            return {
                data: dummyVirksomhetsinformasjon,
                loading: false,
            };
        }),
        useHentSakshistorikk: vi.fn(() => {
            return {
                data: dummySakshistorikk,
                loading: false,
                validating: false,
            };
        }),
        useHentPubliseringsinfo: vi.fn(() => {
            return {
                data: dummyPubliseringsinfo,
                loading: false,
            };
        }),
        useHentSykefraværsstatistikkForVirksomhetSisteKvartal: vi.fn(() => {
            return {
                data: dummySykefraværsstatistikkSiste4Kvartal,
                loading: false,
            };
        }),
        useHentNæringsstatistikk: vi.fn(() => {
            return {
                data: dummyNæringsstatistikk,
                loading: false,
            };
        }),
        useHentVirksomhetsstatistikkSiste4Kvartaler: vi.fn(() => {
            return {
                data: dummyVirksomhetsstatistikkSiste4Kvartal,
                loading: false,
            };
        }),
    };
});

vi.mock("@features/plan/api/plan", async () => {
    return {
        ...(await vi.importActual("@features/plan/api/plan")),
        useHentPlan: vi.fn(() => {
            return {
                data: dummyPlan,
                loading: false,
                validating: false,
            };
        }),

        useHarPlan: vi.fn(() => {
            return {
                harPlan: true,
                lastet: true,
            };
        }),
    };
});

vi.mock("@features/kartlegging/api/spørreundersøkelse", async () => {
    return {
        ...(await vi.importActual("@features/kartlegging/api/spørreundersøkelse")),
        useHentSamarbeid: vi.fn(() => {
            return {
                data: dummySamarbeid,
                loading: false,
                validating: false,
            };
        }),
        useSpørreundersøkelsesliste: vi.fn(() => {
            return {
                data: dummySpørreundersøkelseliste,
                loading: false,
                validating: false,
                mutate: vi.fn(),
            };
        }),
    };
});

vi.mock("@features/sak/api/nyFlyt", async () => {
    return {
        ...(await vi.importActual("@features/sak/api/nyFlyt")),
        useHentVirksomhetNyFlyt: vi.fn(() => ({
            data: dummyVirksomhetsinformasjon,
            loading: false,
        })),
        useHentSisteSakNyFlyt: vi.fn(() => ({
            data: dummyIaSak,
            loading: false,
        })),
        useHentSpesifikkSakNyFlyt: vi.fn(() => ({
            data: dummyIaSak,
            loading: false,
            mutate: vi.fn(),
        })),
        useHentTilstandForVirksomhetNyFlyt: vi.fn(() => ({
            data: undefined,
            loading: false,
        })),
    };
});

vi.mock("@features/bruker/api/bruker", async () => {
    return {
        ...(await vi.importActual("@features/bruker/api/bruker")),
        useHentBrukerinformasjon: vi.fn(() => {
            return {
                data: brukerMedGyldigToken,
                loading: false,
            };
        }),
    };
});

vi.mock("@features/bruker/api/team", async () => {
    return {
        ...(await vi.importActual("@features/bruker/api/team")),
        useHentTeam: vi.fn(() => {
            return {
                data: [brukerMedGyldigToken.ident, brukerMedLesetilgang.ident],
                loading: false,
            };
        }),
    };
});

vi.mock("react-router-dom", async () => {
    const originalModule = (await vi.importActual("react-router-dom"));
    return {
        ...originalModule,
        useParams: vi.fn(() => ({
            orgnummer: "840623927",
            saksnummer: dummyIaSak.saksnummer,
            prosessId: dummySamarbeid[1].id.toString(),
        })),
        useSearchParams: vi.fn(() => {
            const setSearchParams = vi.fn();
            return [new URLSearchParams(), setSearchParams];
        }),
    };
});

describe("NyVirksomhetsside", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useHentBrukerinformasjon).mockImplementation(() => ({
            data: brukerMedGyldigToken,
            loading: false,
            error: undefined,
            mutate: vi.fn(),
            validating: false,
        }));
    });

    it("Rendrer korrekt", () => {
        render(
            <BrowserRouter>
                <NyVirksomhetsside />
            </BrowserRouter>,
        );
        expect(screen.getByText("Samarbeid (8)")).toBeInTheDocument();
    });

    describe("Legg til samarbeid-knapp", () => {
        beforeEach(() => {
            vi.mocked(useHentSpesifikkSakNyFlyt).mockReturnValue({
                data: {
                    ...dummyIaSak,
                    status: "AKTIV",
                    eidAv: brukerMedGyldigToken.ident,
                },
                loading: false,
                error: undefined,
                mutate: vi.fn(),
                validating: false,
            });
            vi.mocked(useHentSisteSakNyFlyt).mockReturnValue({
                data: {
                    ...dummyIaSak,
                    status: "AKTIV",
                    eidAv: brukerMedGyldigToken.ident,
                },
                loading: false,
                error: undefined,
                mutate: vi.fn(),
                validating: false,
            });
        });

        it("Viser legg-til-samarbeid-knapp for bruker med rettigheter", () => {
            render(
                <BrowserRouter>
                    <NyVirksomhetsside />
                </BrowserRouter>,
            );
            expect(
                screen.getByTitle("Legg til nytt samarbeid"),
            ).toBeInTheDocument();
        });

        it("Viser deaktivert legg-til-samarbeid-knapp for lesebruker", () => {
            vi.mocked(useHentBrukerinformasjon).mockReturnValue({
                data: brukerMedLesetilgang,
                loading: false,
                error: undefined,
                mutate: vi.fn(),
                validating: false,
            });
            render(
                <BrowserRouter>
                    <NyVirksomhetsside />
                </BrowserRouter>,
            );
            expect(screen.getByTitle("Legg til nytt samarbeid")).toBeDisabled();
        });
    });

    describe("Kartlegging", () => {
        const aktivSak = { ...dummyIaSak, status: "AKTIV" as const };

        beforeEach(() => {
            const searchParamsSet = vi.fn();
            vi.mocked(useSearchParams).mockReturnValue([
                new URLSearchParams({ fane: "kartlegging" }),
                searchParamsSet,
            ]);
            vi.mocked(useParams).mockReturnValue({
                orgnummer: "840623927",
                prosessId: dummySamarbeid[1].id.toString(),
            });
        });

        it("Hamburgermeny har riktig innhold", async () => {
            render(
                <BrowserRouter>
                    <NyVirksomhetsside />
                </BrowserRouter>,
            );

            const samarbeidsknapp = screen.getByRole("link", {
                name: dummySamarbeid[1].navn as string,
            });
            expect(samarbeidsknapp).toBeInTheDocument();
            fireEvent.click(samarbeidsknapp);

            const faneKnapp = screen.getByRole("tab", {
                name: "Kartlegginger",
            });
            expect(faneKnapp).toBeInTheDocument();
            fireEvent.click(faneKnapp);

            const hamburgermeny = screen.getByRole("button", { name: "Meny" });
            expect(hamburgermeny).toBeInTheDocument();
            fireEvent.click(hamburgermeny);

            expect(
                await screen.findAllByRole("menuitem", {
                    name: "Brukerveileder",
                }),
            ).toHaveLength(2);
            expect(
                screen.getByRole("menuitem", { name: "Invitasjonsmal" }),
            ).toBeInTheDocument();
            expect(
                screen.getByRole("menuitem", {
                    name: "Tips og råd til gjennomføring",
                }),
            ).toBeInTheDocument();
            expect(
                await screen.findAllByRole("menuitem", { name: "IA-veileder" }),
            ).toHaveLength(2);
        });

        it("Gir 'administrer'-knapp for vanlig bruker", () => {
            render(
                <BrowserRouter>
                    <NyVirksomhetsside />
                </BrowserRouter>,
            );

            const samarbeidsknapp = screen.getByRole("link", {
                name: dummySamarbeid[1].navn as string,
            });
            expect(samarbeidsknapp).toBeInTheDocument();
            fireEvent.click(samarbeidsknapp);

            const faneKnapp = screen.getByRole("tab", {
                name: "Kartlegginger",
            });
            expect(faneKnapp).toBeInTheDocument();
            fireEvent.click(faneKnapp);

            expect(
                screen.getByRole("button", { name: "Administrer" }),
            ).toBeInTheDocument();
        });

        it("Gir knapp for ny evaluering hvis det finnes en plan", async () => {
            render(
                <BrowserRouter>
                    <NyVirksomhetsside />
                </BrowserRouter>,
            );

            const samarbeidsknapp = screen.getByRole("link", {
                name: dummySamarbeid[1].navn as string,
            });
            expect(samarbeidsknapp).toBeInTheDocument();
            fireEvent.click(samarbeidsknapp);

            const faneKnapp = screen.getByRole("tab", {
                name: "Kartlegginger",
            });
            expect(faneKnapp).toBeInTheDocument();
            fireEvent.click(faneKnapp);

            const nyEvalueringKnapp = screen.getByRole("button", {
                name: "Ny evaluering",
            });
            expect(nyEvalueringKnapp).toBeInTheDocument();
            await waitFor(() => expect(nyEvalueringKnapp).toBeEnabled());
        });

        it("Gir ikke knapp for ny evaluering hvis det ikke finnes noen plan", async () => {
            vi.mocked(useHarPlan).mockReturnValue({
                harPlan: false,
                lastet: true,
            });
            vi.mocked(useHentPlan).mockReturnValue({
                data: undefined,
                loading: false,
                validating: false,
                mutate: vi.fn(),
                error: undefined,
            });
            render(
                <BrowserRouter>
                    <NyVirksomhetsside />
                </BrowserRouter>,
            );

            const samarbeidsknapp = screen.getByRole("link", {
                name: dummySamarbeid[1].navn as string,
            });
            expect(samarbeidsknapp).toBeInTheDocument();
            fireEvent.click(samarbeidsknapp);

            const faneKnapp = screen.getByRole("tab", {
                name: "Kartlegginger",
            });
            expect(faneKnapp).toBeInTheDocument();
            fireEvent.click(faneKnapp);

            const nyEvalueringKnapp = screen.queryByRole("button", {
                name: "Ny evaluering",
            });
            expect(nyEvalueringKnapp).toBeInTheDocument();
            await waitFor(() => expect(nyEvalueringKnapp).toBeDisabled());
        });

        it("Gir alltid knapp for ny behovsvurdering uavhengig av plan", () => {
            vi.mocked(useHentSisteSakNyFlyt).mockReturnValue({
                data: aktivSak,
                loading: false,
                error: undefined,
                mutate: vi.fn(),
                validating: false,
            });
            vi.mocked(useHentSpesifikkSakNyFlyt).mockReturnValue({
                data: aktivSak,
                loading: false,
                error: undefined,
                mutate: vi.fn(),
                validating: false,
            });
            vi.mocked(useHarPlan).mockReturnValue({
                harPlan: false,
                lastet: true,
            });
            vi.mocked(useHentPlan).mockReturnValue({
                data: undefined,
                loading: false,
                validating: false,
                mutate: vi.fn(),
                error: undefined,
            });
            render(
                <BrowserRouter>
                    <NyVirksomhetsside />
                </BrowserRouter>,
            );

            const samarbeidsknapp = screen.getByRole("link", {
                name: dummySamarbeid[1].navn as string,
            });
            expect(samarbeidsknapp).toBeInTheDocument();
            fireEvent.click(samarbeidsknapp);

            const faneKnapp = screen.getByRole("tab", {
                name: "Kartlegginger",
            });
            expect(faneKnapp).toBeInTheDocument();
            fireEvent.click(faneKnapp);

            const nyBehovsvurderingKnapp = screen.getByRole("button", {
                name: "Ny behovsvurdering",
            });
            expect(nyBehovsvurderingKnapp).toBeInTheDocument();
            expect(nyBehovsvurderingKnapp).toBeEnabled();
        });

        it("Gir knapp for ny behovsvurdering når sak er AKTIV", () => {
            vi.mocked(useHentSisteSakNyFlyt).mockReturnValue({
                data: aktivSak,
                loading: false,
                error: undefined,
                mutate: vi.fn(),
                validating: false,
            });
            vi.mocked(useHentSpesifikkSakNyFlyt).mockReturnValue({
                data: aktivSak,
                loading: false,
                error: undefined,
                mutate: vi.fn(),
                validating: false,
            });
            render(
                <BrowserRouter>
                    <NyVirksomhetsside />
                </BrowserRouter>,
            );

            const samarbeidsknapp = screen.getByRole("link", {
                name: dummySamarbeid[1].navn as string,
            });
            fireEvent.click(samarbeidsknapp);
            fireEvent.click(screen.getByRole("tab", { name: "Kartlegginger" }));

            expect(
                screen.getByRole("button", { name: "Ny behovsvurdering" }),
            ).toBeEnabled();
        });

        it("Deaktiverer knapp for ny behovsvurdering når sak har ugyldig status", () => {
            const vurderesSak = {
                ...dummyIaSak,
                status: "VURDERES" as const,
            };
            vi.mocked(useHentSisteSakNyFlyt).mockReturnValue({
                data: vurderesSak,
                loading: false,
                error: undefined,
                mutate: vi.fn(),
                validating: false,
            });
            vi.mocked(useHentSpesifikkSakNyFlyt).mockReturnValue({
                data: vurderesSak,
                loading: false,
                error: undefined,
                mutate: vi.fn(),
                validating: false,
            });
            render(
                <BrowserRouter>
                    <NyVirksomhetsside />
                </BrowserRouter>,
            );

            const samarbeidsknapp = screen.getByRole("link", {
                name: dummySamarbeid[1].navn as string,
            });
            fireEvent.click(samarbeidsknapp);
            fireEvent.click(screen.getByRole("tab", { name: "Kartlegginger" }));

            expect(
                screen.getByRole("button", { name: "Ny behovsvurdering" }),
            ).toBeDisabled();
        });

        describe("Lesebruker", () => {
            beforeEach(() => {
                vi.mocked(useHentBrukerinformasjon).mockReturnValue({
                    data: brukerMedLesetilgang,
                    loading: false,
                    error: undefined,
                    mutate: vi.fn(),
                    validating: false,
                });
            });

            it("Gir ikke 'ny'-knapper for lesebruker", () => {
                render(
                    <BrowserRouter>
                        <NyVirksomhetsside />
                    </BrowserRouter>,
                );

                const samarbeidsknapp = screen.getByRole("link", {
                    name: dummySamarbeid[1].navn as string,
                });
                expect(samarbeidsknapp).toBeInTheDocument();
                fireEvent.click(samarbeidsknapp);

                const faneKnapp = screen.getByRole("tab", {
                    name: "Kartlegginger",
                });
                expect(faneKnapp).toBeInTheDocument();
                fireEvent.click(faneKnapp);

                expect(
                    screen.getByRole("button", { name: "Ny behovsvurdering" }),
                ).toBeDisabled();
                expect(
                    screen.getByRole("button", { name: "Ny evaluering" }),
                ).toBeDisabled();
            });

            it("Gir ikke 'administrer'-knapp for lesebruker", () => {
                render(
                    <BrowserRouter>
                        <NyVirksomhetsside />
                    </BrowserRouter>,
                );

                const samarbeidsknapp = screen.getByRole("link", {
                    name: dummySamarbeid[1].navn as string,
                });
                expect(samarbeidsknapp).toBeInTheDocument();
                fireEvent.click(samarbeidsknapp);

                const faneKnapp = screen.getByRole("tab", {
                    name: "Kartlegginger",
                });
                expect(faneKnapp).toBeInTheDocument();
                fireEvent.click(faneKnapp);

                expect(
                    screen.queryByRole("button", { name: "Administrer" }),
                ).not.toBeInTheDocument();
            });
        });

        describe("Avsluttet samarbeid", () => {
            beforeEach(() => {
                vi.mocked(useHentSamarbeid).mockReturnValue({
                    data: [
                        dummySamarbeid[0],
                        { ...dummySamarbeid[1], status: "FULLFØRT" },
                        dummySamarbeid[2],
                    ],
                    loading: false,
                    validating: false,
                    mutate: vi.fn(),
                    error: undefined,
                });
            });

            it.skip("Gir ikke 'administrer'-knapp på avsluttet samarbeid", async () => {
                vi.mocked(useParams).mockReturnValue({
                    orgnummer: "840623927",
                    saksnummer: dummyIaSak.saksnummer,
                    prosessId: dummySamarbeid[0].id.toString(),
                });
                const { rerender } = render(
                    <BrowserRouter>
                        <NyVirksomhetsside />
                    </BrowserRouter>,
                );

                fireEvent.click(
                    screen.getByRole("link", {
                        name: `${dummySamarbeid[0].navn}`,
                    }),
                );

                await waitFor(() =>
                    expect(
                        screen
                            .getAllByText(dummySamarbeid[1].navn as string, {
                                exact: false,
                            })
                            .filter((el) => el.className === "tittel"),
                    ).toHaveLength(0),
                );
                const samarbeidsknapp = screen.getByRole("link", {
                    name: `${dummySamarbeid[1].navn} Fullført`,
                });
                expect(samarbeidsknapp).toBeInTheDocument();
                vi.mocked(useParams).mockReturnValue({
                    orgnummer: "840623927",
                    saksnummer: dummyIaSak.saksnummer,
                    prosessId: dummySamarbeid[1].id.toString(),
                });

                fireEvent.click(samarbeidsknapp);
                rerender(
                    <BrowserRouter>
                        <NyVirksomhetsside />
                    </BrowserRouter>,
                );

                expect(
                    screen
                        .getAllByText(dummySamarbeid[1].navn as string, {
                            exact: false,
                        })
                        .filter((el) => el.className === "tittel"),
                ).toHaveLength(1);

                const faneKnapp = screen.getByRole("tab", {
                    name: "Kartlegginger",
                });
                expect(faneKnapp).toBeInTheDocument();
                fireEvent.click(faneKnapp);

                expect(
                    screen.queryByRole("button", { name: "Administrer" }),
                ).not.toBeInTheDocument();
            });

            it("Gir ikke knapp for ny evaluering selv om det finnes en plan", () => {
                render(
                    <BrowserRouter>
                        <NyVirksomhetsside />
                    </BrowserRouter>,
                );

                const samarbeidsknapp = screen.getByRole("link", {
                    name: `${dummySamarbeid[1].navn} Fullført`,
                });
                expect(samarbeidsknapp).toBeInTheDocument();
                fireEvent.click(samarbeidsknapp);

                const faneKnapp = screen.getByRole("tab", {
                    name: "Kartlegginger",
                });
                expect(faneKnapp).toBeInTheDocument();
                fireEvent.click(faneKnapp);

                expect(
                    screen.queryByRole("button", { name: "Ny evaluering" }),
                ).not.toBeInTheDocument();
            });
        });
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
