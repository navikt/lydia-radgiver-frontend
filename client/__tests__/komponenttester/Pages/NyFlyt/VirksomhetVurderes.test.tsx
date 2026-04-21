import {
    fireEvent,
    render,
    screen,
    waitFor,
    within,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe } from "jest-axe";

import { NyVirksomhetsside } from "../../../../src/Pages/Virksomhet";
import { BrowserRouter } from "react-router-dom";
import {
    dummyIaSak,
    dummyPubliseringsinfo,
    dummySakshistorikk,
    dummySamarbeid,
    dummyVirksomhetsinformasjonNyFlyt,
    dummyNæringsstatistikk,
    dummySykefraværsstatistikkSiste4Kvartal,
    dummyVirksomhetsstatistikkSiste4Kvartal,
} from "../../../../__mocks__/virksomhetsMockData";
import {
    useHentTilstandForVirksomhetNyFlyt,
    useHentSisteSakNyFlyt,
    useHentVirksomhetNyFlyt,
    avsluttVurderingNyFlyt,
    opprettSamarbeidNyFlyt,
    useHentSpesifikkSakNyFlyt,
} from "../../../../src/api/lydia-api/nyFlyt";
import { useHentTeam } from "../../../../src/api/lydia-api/team";
import { useHentBrukerinformasjon } from "../../../../src/api/lydia-api/bruker";

jest.mock("../../../../src/util/analytics-klient", () => {
    const actual = jest.requireActual("../../../../src/util/analytics-klient");
    return {
        ...actual,
        loggSideLastet: jest.fn(),
        loggNavigertTilNyTab: jest.fn(),
    };
});

jest.mock("../../../../src/api/lydia-api/virksomhet", () => {
    return {
        ...jest.requireActual("../../../../src/api/lydia-api/virksomhet"),
        useHentVirksomhetsinformasjon: jest.fn(() => {
            return {
                data: {
                    ...dummyVirksomhetsinformasjonNyFlyt,
                    aktivtSaksnummer: dummyIaSak.saksnummer,
                },
                loading: false,
            };
        }),
        useHentSakshistorikk: jest.fn(() => {
            return {
                data: dummySakshistorikk,
                loading: false,
                validating: false,
                mutate: jest.fn(),
            };
        }),
        useHentPubliseringsinfo: jest.fn(() => {
            return {
                data: dummyPubliseringsinfo,
                loading: false,
            };
        }),
        useHentSykefraværsstatistikkForVirksomhetSisteKvartal: jest.fn(() => {
            return {
                data: dummySykefraværsstatistikkSiste4Kvartal,
                loading: false,
            };
        }),
        useHentNæringsstatistikk: jest.fn(() => {
            return {
                data: dummyNæringsstatistikk,
                loading: false,
            };
        }),
        useHentVirksomhetsstatistikkSiste4Kvartaler: jest.fn(() => {
            return {
                data: dummyVirksomhetsstatistikkSiste4Kvartal,
                loading: false,
            };
        }),
    };
});

jest.mock("../../../../src/api/lydia-api/spørreundersøkelse", () => {
    return {
        ...jest.requireActual(
            "../../../../src/api/lydia-api/spørreundersøkelse",
        ),
        useHentSamarbeid: jest.fn(() => {
            return {
                data: [],
                loading: false,
                validating: false,
                mutate: jest.fn(() => Promise.resolve([])),
            };
        }),
        useSpørreundersøkelsesliste: jest.fn(() => {
            return {
                data: [],
                loading: false,
                validating: false,
                mutate: jest.fn(),
            };
        }),
    };
});

jest.mock("../../../../src/api/lydia-api/nyFlyt", () => {
    return {
        ...jest.requireActual("../../../../src/api/lydia-api/nyFlyt"),
        useHentTilstandForVirksomhetNyFlyt: jest.fn(() => {
            return {
                data: {
                    orgnr: dummyVirksomhetsinformasjonNyFlyt.orgnr,
                    tilstand: "VirksomhetVurderes",
                },
                loading: false,
            };
        }),
        vurderSakNyFlyt: jest.fn(() => Promise.resolve()),
        avsluttVurderingNyFlyt: jest.fn(() => Promise.resolve()),
        angreVurderingNyFlyt: jest.fn(() => Promise.resolve()),
        opprettSamarbeidNyFlyt: jest.fn(() => Promise.resolve()),
        bliEierNyFlyt: jest.fn(() => Promise.resolve()),
        useHentSisteSakNyFlyt: jest.fn(() => ({
            data: dummyIaSak,
            loading: false,
            mutate: jest.fn(),
        })),
        useHentSpesifikkSakNyFlyt: jest.fn(() => ({
            data: dummyIaSak,
            loading: false,
            mutate: jest.fn(),
        })),
        useHentVirksomhetNyFlyt: jest.fn(() => {
            return {
                data: {
                    ...dummyVirksomhetsinformasjonNyFlyt,
                    aktivtSaksnummer: dummyIaSak.saksnummer,
                },
                loading: false,
                mutate: jest.fn(),
            };
        }),
        useHentHistorikkNyFlyt: jest.fn(() => ({
            data: [],
            loading: false,
            mutate: jest.fn(),
        })),
    };
});

jest.mock("../../../../src/api/lydia-api/bruker", () => {
    return {
        ...jest.requireActual("../../../../src/api/lydia-api/bruker"),
        useHentBrukerinformasjon: jest.fn(() => {
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

jest.mock("../../../../src/api/lydia-api/team", () => {
    return {
        ...jest.requireActual("../../../../src/api/lydia-api/team"),
        useHentTeam: jest.fn(() => {
            return {
                data: ["Z123456"],
                loading: false,
                mutate: jest.fn(),
            };
        }),
    };
});

jest.mock("react-router-dom", () => {
    const originalModule = jest.requireActual("react-router-dom");
    return {
        ...originalModule,
        useParams: jest.fn(() => ({
            orgnummer: "840623927",
            saksnummer: dummyIaSak.saksnummer,
            prosessId: dummySamarbeid[1].id.toString(),
        })),
        useSearchParams: jest.fn(() => {
            const setSearchParams = jest.fn();
            return [new URLSearchParams(), setSearchParams];
        }),
    };
});

describe("NyVirksomhetsside", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("VirksomhetVurderes", () => {
        beforeAll(() => {
            jest.mocked(useHentTilstandForVirksomhetNyFlyt).mockReturnValue({
                data: {
                    orgnr: dummyVirksomhetsinformasjonNyFlyt.orgnr,
                    tilstand: "VirksomhetVurderes",
                },
                loading: false,
                error: null,
                mutate: jest.fn(),
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
            avsluttVurderingKnapp.click();
            expect(
                screen.getByText("Avslutt vurdering av virksomheten"),
            ).toBeInTheDocument();
            expect(
                screen.getByLabelText("Vurder virksomheten senere"),
            ).toBeInTheDocument();
            expect(
                screen.getByLabelText(
                    "Virksomheten er ferdig vurdert med intern vurdering",
                ),
            ).toBeInTheDocument();
            expect(
                screen.getByLabelText(
                    "Virksomheten er ferdig vurdert og takket nei",
                ),
            ).toBeInTheDocument();
        });

        it("Sender data riktig på 'ønsker samarbeid senere'", async () => {
            render(
                <BrowserRouter>
                    <NyVirksomhetsside />
                </BrowserRouter>,
            );

            const avsluttVurderingKnapp = screen.getByText("Avslutt vurdering");
            avsluttVurderingKnapp.click();

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
            avsluttVurderingKnapp.click();

            fireEvent.click(
                screen.getByLabelText(
                    "Virksomheten er ferdig vurdert med intern vurdering",
                ),
            );

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
            screen.getByText("Avslutt vurdering").click();
            const modal = screen.getByRole("dialog", {
                name: "Avslutt vurdering av virksomheten",
            });
            expect(
                within(modal).getByRole("button", { name: "Lagre" }),
            ).toBeDisabled();
            expect(
                screen.getByText(
                    "Du må velge en årsak for å avslutte vurderingen",
                ),
            ).toBeInTheDocument();
        });

        it("Lagre-knappen er deaktivert når begrunnelse mangler", () => {
            render(
                <BrowserRouter>
                    <NyVirksomhetsside />
                </BrowserRouter>,
            );
            screen.getByText("Avslutt vurdering").click();
            fireEvent.click(
                screen.getByLabelText("Vurder virksomheten senere"),
            );
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
            jest.mocked(useHentBrukerinformasjon).mockReturnValue({
                data: {
                    ident: "Z654321",
                    navn: "Saksbehandler Testesen",
                    epost: "",
                    tokenUtloper: 9999999999,
                    rolle: "Saksbehandler",
                },
                loading: false,
                error: null,
                mutate: jest.fn(),
                validating: false,
            });
            jest.mocked(useHentTeam).mockReturnValue({
                data: [],
                loading: false,
                error: null,
                mutate: jest.fn(),
                validating: false,
            });
            jest.mocked(useHentSpesifikkSakNyFlyt).mockReturnValue({
                data: { ...dummyIaSak, eidAv: "ANNEN_SAKSBEHANDLER" },
                loading: false,
                error: null,
                mutate: jest.fn(),
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
            jest.mocked(useHentBrukerinformasjon).mockReturnValue({
                data: {
                    ident: "Z123456",
                    navn: "Test Testesen",
                    epost: "",
                    tokenUtloper: 9999999999,
                    rolle: "Superbruker",
                },
                loading: false,
                error: null,
                mutate: jest.fn(),
                validating: false,
            });
            jest.mocked(useHentTeam).mockReturnValue({
                data: [],
                loading: false,
                error: null,
                mutate: jest.fn(),
                validating: false,
            });
            jest.mocked(useHentSpesifikkSakNyFlyt).mockReturnValue({
                data: { ...dummyIaSak, eidAv: "ANNEN_SAKSBEHANDLER" },
                loading: false,
                error: null,
                mutate: jest.fn(),
                validating: false,
            });

            render(
                <BrowserRouter>
                    <NyVirksomhetsside />
                </BrowserRouter>,
            );
            screen.getByText("Avslutt vurdering").click();
            fireEvent.click(
                screen.getByLabelText("Vurder virksomheten senere"),
            );
            fireEvent.click(
                screen.getByLabelText(
                    "Virksomheten ønsker å bli kontaktet senere",
                ),
            );
            expect(
                screen.getByText(
                    "Du må eie eller følge saken for å kunne avslutte vurderingen",
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
            jest.mocked(useHentSisteSakNyFlyt).mockReturnValue({
                data: iaSakVurderes,
                loading: false,
                error: null,
                mutate: jest.fn(),
                validating: false,
            });
            jest.mocked(useHentSpesifikkSakNyFlyt).mockReturnValue({
                data: iaSakVurderes,
                loading: false,
                error: null,
                mutate: jest.fn(),
                validating: false,
            });
            jest.mocked(useHentVirksomhetNyFlyt).mockReturnValue({
                data: {
                    ...dummyVirksomhetsinformasjonNyFlyt,
                    aktivtSaksnummer: iaSakVurderes.saksnummer,
                },
                loading: false,
                error: null,
                mutate: jest.fn(),
                validating: false,
            });
            jest.mocked(useHentTeam).mockReturnValue({
                data: [],
                loading: false,
                error: null,
                mutate: jest.fn(),
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
            jest.mocked(useHentSpesifikkSakNyFlyt).mockReturnValue({
                data: { ...dummyIaSak, eidAv: "ANNEN_SAKSBEHANDLER" },
                loading: false,
                error: null,
                mutate: jest.fn(),
                validating: false,
            });
            jest.mocked(useHentTeam).mockReturnValue({
                data: [],
                loading: false,
                error: null,
                mutate: jest.fn(),
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
                jest.mocked(useHentBrukerinformasjon).mockReturnValue({
                    data: {
                        ident: "Z123456",
                        navn: "Test Testesen",
                        epost: "",
                        tokenUtloper: 9999999999,
                        rolle: "Superbruker",
                    },
                    loading: false,
                    error: null,
                    mutate: jest.fn(),
                    validating: false,
                });
                jest.mocked(useHentTeam).mockReturnValue({
                    data: ["Z123456"],
                    loading: false,
                    error: null,
                    mutate: jest.fn(),
                    validating: false,
                });
                jest.mocked(useHentSpesifikkSakNyFlyt).mockReturnValue({
                    data: iaSakVurderes,
                    loading: false,
                    error: null,
                    mutate: jest.fn(),
                    validating: false,
                });
                jest.mocked(useHentSisteSakNyFlyt).mockReturnValue({
                    data: iaSakVurderes,
                    loading: false,
                    error: null,
                    mutate: jest.fn(),
                    validating: false,
                });
                jest.mocked(useHentVirksomhetNyFlyt).mockReturnValue({
                    data: {
                        ...dummyVirksomhetsinformasjonNyFlyt,
                        aktivtSaksnummer: iaSakVurderes.saksnummer,
                    },
                    loading: false,
                    error: null,
                    mutate: jest.fn(),
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
