import {
    fireEvent,
    render,
    screen,
    waitFor,
    within,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe } from "jest-axe";

import { NyVirksomhetsside } from "../../../../src/Pages/NyFlyt/Virksomhetsside";
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
    angreVurderingNyFlyt,
    opprettSamarbeidNyFlyt,
} from "../../../../src/api/lydia-api/nyFlyt";
import { useHentSakForVirksomhet } from "../../../../src/api/lydia-api/virksomhet";
import { useHentTeam } from "../../../../src/api/lydia-api/team";

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
                data: dummyVirksomhetsinformasjonNyFlyt,
                loading: false,
            };
        }),
        useHentSakForVirksomhet: jest.fn(() => {
            return {
                data: dummyIaSak,
                loading: false,
                mutate: jest.fn(),
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
        useHentSisteSakNyFlyt: jest.fn(() => ({
            data: undefined,
            loading: false,
        })),
        useHentVirksomhetNyFlyt: jest.fn(() => {
            return {
                data: dummyVirksomhetsinformasjonNyFlyt,
                loading: false,
            };
        }),
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
            expect(
                screen.getByText("Ingen aktive samarbeid"),
            ).toBeInTheDocument();
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
                screen.getByText(
                    "Velg en eller flere begrunnelser for hvorfor dere avslutter vurderingen av virksomheten.",
                ),
            ).toBeInTheDocument();
        });

        it("Sender data riktig på 'ønsker samarbeid senere'", async () => {
            render(
                <BrowserRouter>
                    <NyVirksomhetsside />
                </BrowserRouter>,
            );

            expect(
                screen.queryByText(
                    "Når ønsker du at virksomheten automatisk skal vurderes igjen?",
                ),
            ).not.toBeInTheDocument();

            const avsluttVurderingKnapp = screen.getByText("Avslutt vurdering");
            avsluttVurderingKnapp.click();

            const feilChackboxer = [
                screen.getByLabelText("Virksomheten har ikke svart"),
                screen.getByLabelText("Ikke dokumentert dialog mellom partene"),
                screen.getByLabelText(
                    "Intern vurdering før kontakt med virksomhet",
                ),
            ];

            feilChackboxer.forEach((checkbox) => {
                expect(checkbox).toBeInTheDocument();
                checkbox.click();
                expect(checkbox).toBeChecked();
            });

            const ønskerSamarbeidSenereCheckbox = screen.getByLabelText(
                "Virksomheten ønsker samarbeid senere",
            );
            expect(ønskerSamarbeidSenereCheckbox).toBeInTheDocument();
            ønskerSamarbeidSenereCheckbox.click();
            expect(ønskerSamarbeidSenereCheckbox).toBeChecked();
            feilChackboxer.forEach((checkbox) => {
                expect(checkbox).not.toBeChecked();
            });

            const lagreKnapp = screen.getAllByText("Lagre")[0];
            expect(lagreKnapp).toBeInTheDocument();
            lagreKnapp.click();

            expect(
                screen.getByText(
                    "Når ønsker du at virksomheten automatisk skal vurderes igjen?",
                ),
            ).toBeInTheDocument();

            expect(avsluttVurderingNyFlyt).not.toHaveBeenCalled();
            const lagreVurderingKnapp = screen.getAllByText("Lagre")[1];
            lagreVurderingKnapp.click();
            await waitFor(() =>
                expect(avsluttVurderingNyFlyt).toHaveBeenCalledTimes(1),
            );
            expect(avsluttVurderingNyFlyt).toHaveBeenCalledWith(
                dummyVirksomhetsinformasjonNyFlyt.orgnr,
                expect.objectContaining({
                    type: "VIRKSOMHETEN_SKAL_VURDERES_SENERE",
                    begrunnelser: ["VIRKSOMHETEN_ØNSKER_SAMARBEID_SENERE"],
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

            const virksomhetHarIkkeSvart = screen.getByLabelText(
                "Virksomheten har ikke svart",
            );
            const ikkeDialogMellomPartene = screen.getByLabelText(
                "Ikke dokumentert dialog mellom partene",
            );

            virksomhetHarIkkeSvart.click();
            ikkeDialogMellomPartene.click();
            expect(virksomhetHarIkkeSvart).toBeChecked();
            expect(ikkeDialogMellomPartene).toBeChecked();

            screen.getAllByText("Lagre")[0].click();

            expect(
                screen.getByText(
                    "Hvor lenge skal virksomheten stå som vurdert?",
                ),
            ).toBeInTheDocument();

            expect(avsluttVurderingNyFlyt).not.toHaveBeenCalled();
            screen.getAllByText("Lagre")[1].click();
            await waitFor(() =>
                expect(avsluttVurderingNyFlyt).toHaveBeenCalledTimes(1),
            );
            expect(avsluttVurderingNyFlyt).toHaveBeenCalledWith(
                dummyVirksomhetsinformasjonNyFlyt.orgnr,
                expect.objectContaining({
                    type: "VIRKSOMHETEN_ER_FERDIG_VURDERT",
                    begrunnelser: expect.arrayContaining([
                        "VIRKSOMHETEN_HAR_IKKE_SVART",
                        "IKKE_DOKUMENTERT_DIALOG_MELLOM_PARTENE",
                    ]),
                }),
            );
        });

        it("Angre vurdering", () => {
            jest.mocked(useHentSakForVirksomhet).mockReturnValue({
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

            render(
                <BrowserRouter>
                    <NyVirksomhetsside />
                </BrowserRouter>,
            );

            expect(screen.getByText("Angre vurdering")).toBeInTheDocument();
            expect(angreVurderingNyFlyt).not.toHaveBeenCalled();
            screen.getByText("Angre vurdering").click();
            expect(angreVurderingNyFlyt).toHaveBeenCalledTimes(1);
            expect(angreVurderingNyFlyt).toHaveBeenCalledWith(
                dummyVirksomhetsinformasjonNyFlyt.orgnr,
            );
        });

        it("Har ingen accessibilityfeil som ikke-eier", async () => {
            jest.mocked(useHentSakForVirksomhet).mockReturnValue({
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

                const leggTilKnapp = screen.getByTitle(
                    "Legg til nytt samarbeid",
                );
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

                fireEvent.click(screen.getByTitle("Legg til nytt samarbeid"));
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

                fireEvent.click(screen.getByTitle("Legg til nytt samarbeid"));
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

                fireEvent.click(screen.getByTitle("Legg til nytt samarbeid"));
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
