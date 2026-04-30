import {
    fireEvent,
    render,
    screen,
    waitFor,
    within,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { axe } from "vitest-axe";
import { NyVirksomhetsside } from "@/Pages/Virksomhet";
import { useHentBrukerinformasjon } from "@features/bruker/api/bruker";
import { useHentTeam } from "@features/bruker/api/team";
import {
    useHentTilstandForVirksomhetNyFlyt,
    useHentSisteSakNyFlyt,
    useHentVirksomhetNyFlyt,
    avsluttVurderingNyFlyt,
    opprettSamarbeidNyFlyt,
    useHentSpesifikkSakNyFlyt,
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
        useHentVirksomhetsinformasjon: vi.fn(() => {
            return {
                data: {
                    ...dummyVirksomhetsinformasjonNyFlyt,
                    aktivtSaksnummer: dummyIaSak.saksnummer,
                },
                loading: false,
            };
        }),
        useHentSakshistorikk: vi.fn(() => {
            return {
                data: dummySakshistorikk,
                loading: false,
                validating: false,
                mutate: vi.fn(),
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

vi.mock("@features/kartlegging/api/spørreundersøkelse", async () => {
    return {
        ...(await vi.importActual("@features/kartlegging/api/spørreundersøkelse")),
        useHentSamarbeid: vi.fn(() => {
            return {
                data: [],
                loading: false,
                validating: false,
                mutate: vi.fn(() => Promise.resolve([])),
            };
        }),
        useSpørreundersøkelsesliste: vi.fn(() => {
            return {
                data: [],
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
        useHentTilstandForVirksomhetNyFlyt: vi.fn(() => {
            return {
                data: {
                    orgnr: dummyVirksomhetsinformasjonNyFlyt.orgnr,
                    tilstand: "VirksomhetVurderes",
                },
                loading: false,
            };
        }),
        vurderSakNyFlyt: vi.fn(() => Promise.resolve()),
        avsluttVurderingNyFlyt: vi.fn(() => Promise.resolve()),
        angreVurderingNyFlyt: vi.fn(() => Promise.resolve()),
        opprettSamarbeidNyFlyt: vi.fn(() => Promise.resolve()),
        bliEierNyFlyt: vi.fn(() => Promise.resolve()),
        useHentSisteSakNyFlyt: vi.fn(() => ({
            data: dummyIaSak,
            loading: false,
            mutate: vi.fn(),
        })),
        useHentSpesifikkSakNyFlyt: vi.fn(() => ({
            data: dummyIaSak,
            loading: false,
            mutate: vi.fn(),
        })),
        useHentVirksomhetNyFlyt: vi.fn(() => {
            return {
                data: {
                    ...dummyVirksomhetsinformasjonNyFlyt,
                    aktivtSaksnummer: dummyIaSak.saksnummer,
                },
                loading: false,
                mutate: vi.fn(),
            };
        }),
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
        useHentBrukerinformasjon: vi.fn(() => {
            return {
                data: {
                    ident: "Z123456",
                    navn: "Test Testesen",
                    epost: "",
                    rolle: "Superbruker",
                },
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
                data: ["Z123456"],
                loading: false,
                mutate: vi.fn(),
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
    });

    describe("VirksomhetVurderes", () => {
        beforeAll(() => {
            vi.mocked(useHentTilstandForVirksomhetNyFlyt).mockReturnValue({
                data: {
                    orgnr: dummyVirksomhetsinformasjonNyFlyt.orgnr,
                    tilstand: "VirksomhetVurderes",
                },
                loading: false,
                error: null,
                mutate: vi.fn(),
                validating: false,
            });
        });

        it("Rendrer korrekt", () => {
            render(
                <BrowserRouter>
                    <NyVirksomhetsside />
                </BrowserRouter>,
            );
            expect(screen.getByText("Ingen samarbeid")).toBeInTheDocument();
            expect(
                screen.getByText(dummyVirksomhetsinformasjonNyFlyt.navn),
            ).toBeInTheDocument();
            const avsluttVurderingKnapp = screen.getByText("Avslutt vurdering");
            expect(avsluttVurderingKnapp).toBeInTheDocument();
            expect(avsluttVurderingKnapp).not.toBeDisabled();
        });

        it("Åpner modal for å avslutte vurdering", () => {
            render(
                <BrowserRouter>
                    <NyVirksomhetsside />
                </BrowserRouter>,
            );
            const avsluttVurderingKnapp = screen.getByText("Avslutt vurdering");
            expect(avsluttVurderingKnapp).toBeInTheDocument();
            fireEvent.click(avsluttVurderingKnapp);
            expect(
                screen.getByText("Avslutt vurdering av virksomheten"),
            ).toBeInTheDocument();
            expect(
                screen.getByLabelText("Vurder virksomheten senere"),
            ).toBeInTheDocument();
            expect(
                screen.getByLabelText("Nav har konkludert"),
            ).toBeInTheDocument();
            expect(
                screen.getByLabelText("Virksomheten har takket nei"),
            ).toBeInTheDocument();
        });

        it("Sender data riktig på 'ønsker samarbeid senere'", async () => {
            render(
                <BrowserRouter>
                    <NyVirksomhetsside />
                </BrowserRouter>,
            );

            const avsluttVurderingKnapp = screen.getByText("Avslutt vurdering");
            fireEvent.click(avsluttVurderingKnapp);

            fireEvent.click(
                screen.getByLabelText("Vurder virksomheten senere"),
            );

            fireEvent.click(
                screen.getByLabelText(
                    "Virksomheten ønsker å bli kontaktet senere",
                ),
            );

            expect(avsluttVurderingNyFlyt).not.toHaveBeenCalled();
            fireEvent.click(screen.getByText("Lagre"));
            await waitFor(() =>
                expect(avsluttVurderingNyFlyt).toHaveBeenCalledTimes(1),
            );
            expect(avsluttVurderingNyFlyt).toHaveBeenCalledWith(
                dummyVirksomhetsinformasjonNyFlyt.orgnr,
                expect.objectContaining({
                    type: "VIRKSOMHETEN_VURDERES_PÅ_ET_SENERE_TIDSPUNKT",
                    begrunnelser: [
                        "VIRKSOMHETEN_ØNSKER_Å_BLI_KONTAKTET_SENERE",
                    ],
                    dato: expect.stringMatching(/\d{4}-\d{2}-\d{2}/),
                }),
            );
        });

        it("Sender data riktig på valgte begrunnelser", async () => {
            render(
                <BrowserRouter>
                    <NyVirksomhetsside />
                </BrowserRouter>,
            );

            const avsluttVurderingKnapp = screen.getByText("Avslutt vurdering");
            fireEvent.click(avsluttVurderingKnapp);

            fireEvent.click(screen.getByLabelText("Nav har konkludert"));

            const virksomhetHarIkkeSvart = screen.getByLabelText(
                "Virksomheten har ikke svart på henvendelser",
            );
            const lavtPotensiale = screen.getByLabelText(
                "Virksomheten har for lavt potensiale til å redusere tapte dagsverk",
            );

            fireEvent.click(virksomhetHarIkkeSvart);
            fireEvent.click(lavtPotensiale);
            expect(virksomhetHarIkkeSvart).toBeChecked();
            expect(lavtPotensiale).toBeChecked();

            expect(avsluttVurderingNyFlyt).not.toHaveBeenCalled();
            fireEvent.click(screen.getByText("Lagre"));
            await waitFor(() =>
                expect(avsluttVurderingNyFlyt).toHaveBeenCalledTimes(1),
            );
            expect(avsluttVurderingNyFlyt).toHaveBeenCalledWith(
                dummyVirksomhetsinformasjonNyFlyt.orgnr,
                expect.objectContaining({
                    type: "VIRKSOMHETEN_ER_FERDIG_VURDERT_MED_INTERN_VURDERING",
                    begrunnelser: expect.arrayContaining([
                        "VIRKSOMHETEN_HAR_IKKE_SVART_PÅ_HENVENDELSER",
                        "VIRKSOMHETEN_HAR_FOR_LAVT_POTENSIALE",
                    ]),
                    dato: expect.stringMatching(/\d{4}-\d{2}-\d{2}/),
                }),
            );
        });

        it("Lagre-knappen er deaktivert når ingen årsak er valgt", () => {
            render(
                <BrowserRouter>
                    <NyVirksomhetsside />
                </BrowserRouter>,
            );
            fireEvent.click(screen.getByText("Avslutt vurdering"));
            const modal = screen.getByRole("dialog", {
                name: "Avslutt vurdering av virksomheten",
            });
            const lagreKnapp = within(modal).getByRole("button", {
                name: "Lagre",
            });
            expect(lagreKnapp).toBeInTheDocument();
            fireEvent.click(lagreKnapp);
            expect(lagreKnapp).toBeDisabled();
            expect(
                screen.getByText(
                    "Du må velge en begrunnelse for å avslutte vurderingen",
                ),
            ).toBeInTheDocument();
        });

        it("Viser feilmelding og kaller ikke avsluttVurderingNyFlyt når kanLagre er false", () => {
            render(
                <BrowserRouter>
                    <NyVirksomhetsside />
                </BrowserRouter>,
            );
            fireEvent.click(screen.getByText("Avslutt vurdering"));

            fireEvent.click(
                screen.getByLabelText("Vurder virksomheten senere"),
            );

            const modal = screen.getByRole("dialog", {
                name: "Avslutt vurdering av virksomheten",
            });
            const lagreKnapp = within(modal).getByRole("button", {
                name: "Lagre",
            });
            fireEvent.click(lagreKnapp);

            expect(
                screen.getByText(
                    "Du må velge en begrunnelse for å vurdere senere",
                ),
            ).toBeInTheDocument();
            expect(lagreKnapp).toBeDisabled();
            expect(avsluttVurderingNyFlyt).not.toHaveBeenCalled();
        });

        it("Lagre-knappen er deaktivert når begrunnelse mangler", () => {
            render(
                <BrowserRouter>
                    <NyVirksomhetsside />
                </BrowserRouter>,
            );
            fireEvent.click(screen.getByText("Avslutt vurdering"));
            fireEvent.click(
                screen.getByLabelText("Vurder virksomheten senere"),
            );
            const lagreKnapp = screen.getByRole("button", {
                name: "Lagre",
            });
            expect(lagreKnapp).toBeInTheDocument();
            fireEvent.click(lagreKnapp);
            expect(
                screen.getByText(
                    "Du må velge en begrunnelse for å vurdere senere",
                ),
            ).toBeInTheDocument();
            const modal = screen.getByRole("dialog", {
                name: "Avslutt vurdering av virksomheten",
            });
            expect(
                within(modal).getByRole("button", { name: "Lagre" }),
            ).toBeDisabled();
        });

        it("Avslutt vurdering-knappen er deaktivert for saksbehandler som ikke er eier/følger", () => {
            vi.mocked(useHentBrukerinformasjon).mockReturnValue({
                data: {
                    ident: "Z654321",
                    navn: "Saksbehandler Testesen",
                    epost: "",
                    tokenUtloper: 9999999999,
                    rolle: "Saksbehandler",
                },
                loading: false,
                error: null,
                mutate: vi.fn(),
                validating: false,
            });
            vi.mocked(useHentTeam).mockReturnValue({
                data: [],
                loading: false,
                error: null,
                mutate: vi.fn(),
                validating: false,
            });
            vi.mocked(useHentSpesifikkSakNyFlyt).mockReturnValue({
                data: { ...dummyIaSak, eidAv: "ANNEN_SAKSBEHANDLER" },
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
            const avsluttVurderingKnapp = screen.getByText("Avslutt vurdering");
            expect(avsluttVurderingKnapp.closest("button")).toBeDisabled();
        });

        it("Superbruker som ikke er eier/følger kan åpne modal men ikke lagre", () => {
            vi.mocked(useHentBrukerinformasjon).mockReturnValue({
                data: {
                    ident: "Z123456",
                    navn: "Test Testesen",
                    epost: "",
                    tokenUtloper: 9999999999,
                    rolle: "Superbruker",
                },
                loading: false,
                error: null,
                mutate: vi.fn(),
                validating: false,
            });
            vi.mocked(useHentTeam).mockReturnValue({
                data: [],
                loading: false,
                error: null,
                mutate: vi.fn(),
                validating: false,
            });
            vi.mocked(useHentSpesifikkSakNyFlyt).mockReturnValue({
                data: { ...dummyIaSak, eidAv: "ANNEN_SAKSBEHANDLER" },
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
            fireEvent.click(screen.getByText("Avslutt vurdering"));
            fireEvent.click(
                screen.getByLabelText("Vurder virksomheten senere"),
            );
            fireEvent.click(
                screen.getByLabelText(
                    "Virksomheten ønsker å bli kontaktet senere",
                ),
            );
            fireEvent.click(screen.getByText("Lagre"));
            expect(
                screen.getByText(
                    "Du må være eier eller følger for å avslutte vurderingen",
                ),
            ).toBeInTheDocument();
            const modal = screen.getByRole("dialog", {
                name: "Avslutt vurdering av virksomheten",
            });
            expect(
                within(modal).getByRole("button", { name: "Lagre" }),
            ).toBeDisabled();
        });

        it("Viser 'Følg eller ta eierskap' for ikke-eiere", () => {
            const iaSakVurderes = {
                ...dummyIaSak,
                status: "VURDERES" as const,
                eidAv: "ANNEN_SAKSBEHANDLER",
                orgnr: dummyVirksomhetsinformasjonNyFlyt.orgnr,
            };
            vi.mocked(useHentSisteSakNyFlyt).mockReturnValue({
                data: iaSakVurderes,
                loading: false,
                error: null,
                mutate: vi.fn(),
                validating: false,
            });
            vi.mocked(useHentSpesifikkSakNyFlyt).mockReturnValue({
                data: iaSakVurderes,
                loading: false,
                error: null,
                mutate: vi.fn(),
                validating: false,
            });
            vi.mocked(useHentVirksomhetNyFlyt).mockReturnValue({
                data: {
                    ...dummyVirksomhetsinformasjonNyFlyt,
                    aktivtSaksnummer: iaSakVurderes.saksnummer,
                },
                loading: false,
                error: null,
                mutate: vi.fn(),
                validating: false,
            });
            vi.mocked(useHentTeam).mockReturnValue({
                data: [],
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
                screen.getByText("Følg eller ta eierskap"),
            ).toBeInTheDocument();
        });

        it("Har ingen accessibilityfeil som ikke-eier", async () => {
            vi.mocked(useHentSpesifikkSakNyFlyt).mockReturnValue({
                data: { ...dummyIaSak, eidAv: "ANNEN_SAKSBEHANDLER" },
                loading: false,
                error: null,
                mutate: vi.fn(),
                validating: false,
            });
            vi.mocked(useHentTeam).mockReturnValue({
                data: [],
                loading: false,
                error: null,
                mutate: vi.fn(),
                validating: false,
            });

            const { container } = render(
                <BrowserRouter>
                    <NyVirksomhetsside />
                </BrowserRouter>,
            );
            const results = await axe(container);
            expect(results).toHaveNoViolations();
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

        describe("NyttSamarbeidModal", () => {
            const iaSakVurderes = {
                ...dummyIaSak,
                status: "VURDERES" as const,
                orgnr: dummyVirksomhetsinformasjonNyFlyt.orgnr,
                eidAv: "Z123456",
            };

            beforeEach(() => {
                vi.mocked(useHentBrukerinformasjon).mockReturnValue({
                    data: {
                        ident: "Z123456",
                        navn: "Test Testesen",
                        epost: "",
                        tokenUtloper: 9999999999,
                        rolle: "Superbruker",
                    },
                    loading: false,
                    error: null,
                    mutate: vi.fn(),
                    validating: false,
                });
                vi.mocked(useHentTeam).mockReturnValue({
                    data: ["Z123456"],
                    loading: false,
                    error: null,
                    mutate: vi.fn(),
                    validating: false,
                });
                vi.mocked(useHentSpesifikkSakNyFlyt).mockReturnValue({
                    data: iaSakVurderes,
                    loading: false,
                    error: null,
                    mutate: vi.fn(),
                    validating: false,
                });
                vi.mocked(useHentSisteSakNyFlyt).mockReturnValue({
                    data: iaSakVurderes,
                    loading: false,
                    error: null,
                    mutate: vi.fn(),
                    validating: false,
                });
                vi.mocked(useHentVirksomhetNyFlyt).mockReturnValue({
                    data: {
                        ...dummyVirksomhetsinformasjonNyFlyt,
                        aktivtSaksnummer: iaSakVurderes.saksnummer,
                    },
                    loading: false,
                    error: null,
                    mutate: vi.fn(),
                    validating: false,
                });
            });

            it("Viser legg til samarbeid-knapp og åpner modalen", () => {
                render(
                    <BrowserRouter>
                        <NyVirksomhetsside />
                    </BrowserRouter>,
                );

                const leggTilKnapp = screen.getByRole("button", {
                    name: "Opprett samarbeid",
                });
                expect(leggTilKnapp).toBeInTheDocument();
                fireEvent.click(leggTilKnapp);

                const modal = screen.getByRole("dialog", {
                    name: "Opprett nytt samarbeid",
                });
                expect(
                    within(modal).getByText("Opprett nytt samarbeid"),
                ).toBeInTheDocument();
                expect(within(modal).getByText("Opprett")).toBeInTheDocument();
                expect(within(modal).getByText("Avbryt")).toBeInTheDocument();
            });

            it("Kaller opprettSamarbeidNyFlyt med riktige argumenter", async () => {
                render(
                    <BrowserRouter>
                        <NyVirksomhetsside />
                    </BrowserRouter>,
                );

                fireEvent.click(
                    screen.getByRole("button", { name: "Opprett samarbeid" }),
                );
                const modal = screen.getByRole("dialog", {
                    name: "Opprett nytt samarbeid",
                });
                const input = within(modal).getByRole("textbox");
                fireEvent.change(input, {
                    target: { value: "Avdeling Oslo" },
                });
                fireEvent.click(within(modal).getByText("Opprett"));

                await waitFor(() => {
                    expect(opprettSamarbeidNyFlyt).toHaveBeenCalledTimes(1);
                });
                expect(opprettSamarbeidNyFlyt).toHaveBeenCalledWith(
                    dummyVirksomhetsinformasjonNyFlyt.orgnr,
                    expect.objectContaining({
                        saksnummer: iaSakVurderes.saksnummer,
                        navn: "Avdeling Oslo",
                        status: "AKTIV",
                    }),
                );
            });

            it("Lukker modalen ved klikk på Avbryt", () => {
                render(
                    <BrowserRouter>
                        <NyVirksomhetsside />
                    </BrowserRouter>,
                );

                fireEvent.click(
                    screen.getByRole("button", { name: "Opprett samarbeid" }),
                );
                const modal = screen.getByRole("dialog", {
                    name: "Opprett nytt samarbeid",
                });
                expect(
                    within(modal).getByText("Opprett nytt samarbeid"),
                ).toBeInTheDocument();

                fireEvent.click(within(modal).getByText("Avbryt"));
                expect(
                    screen.queryByRole("dialog", {
                        name: "Opprett nytt samarbeid",
                    }),
                ).not.toBeInTheDocument();
            });

            it("Opprett-knappen er deaktivert når navn er tomt", () => {
                render(
                    <BrowserRouter>
                        <NyVirksomhetsside />
                    </BrowserRouter>,
                );

                fireEvent.click(
                    screen.getByRole("button", { name: "Opprett samarbeid" }),
                );
                const modal = screen.getByRole("dialog", {
                    name: "Opprett nytt samarbeid",
                });
                expect(
                    within(modal).getByRole("button", { name: "Opprett" }),
                ).toBeDisabled();
            });
        });
    });
});
