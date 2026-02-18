import { render, screen, waitFor } from "@testing-library/react";
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
    vurderSakNyFlyt,
    avsluttVurderingNyFlyt,
    angreVurderingNyFlyt,
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
            };
        }),
        useHentSakshistorikk: jest.fn(() => {
            return {
                data: dummySakshistorikk,
                loading: false,
                validating: false,
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
                    tilstand: "VirksomhetKlarTilVurdering",
                },
                loading: false,
            };
        }),
        vurderSakNyFlyt: jest.fn(() => Promise.resolve()),
        avsluttVurderingNyFlyt: jest.fn(() => Promise.resolve()),
        angreVurderingNyFlyt: jest.fn(() => Promise.resolve()),
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

    describe("VirksomhetKlarTilVurdering", () => {
        beforeAll(() => {
            jest.mocked(useHentTilstandForVirksomhetNyFlyt).mockReturnValue({
                data: {
                    orgnr: dummyVirksomhetsinformasjonNyFlyt.orgnr,
                    tilstand: "VirksomhetKlarTilVurdering",
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
            expect(screen.getByText("Vurder virksomheten")).toBeInTheDocument();
        });

        it("Vurder sak funker som det skal", async () => {
            const { getByText } = render(
                <BrowserRouter>
                    <NyVirksomhetsside />
                </BrowserRouter>,
            );
            expect(vurderSakNyFlyt).not.toHaveBeenCalled();
            const vurderSakKnapp = getByText("Vurder virksomheten");
            expect(vurderSakKnapp).toBeInTheDocument();
            expect(vurderSakKnapp).not.toBeDisabled();
            vurderSakKnapp.click();
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

            // Modal nr.2 skal ikke være åpen enda.
            expect(
                screen.queryByText(
                    "Når ønsker du at virksomheten automatisk skal vurderes igjen?",
                ),
            ).not.toBeInTheDocument();

            const avsluttVurderingKnapp = screen.getByText("Avslutt vurdering");
            avsluttVurderingKnapp.click();

            // Start med å markere noen "feil"
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

            // Modal nr.2 skal være åpen nå.
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
    });
});
