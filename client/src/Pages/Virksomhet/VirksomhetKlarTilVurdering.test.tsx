import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { axe } from "vitest-axe";
import { NyVirksomhetsside } from "@/Pages/Virksomhet";
import {
    useHentTilstandForVirksomhetNyFlyt,
    vurderSakNyFlyt,
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
                    tilstand: "VirksomhetKlarTilVurdering",
                },
                loading: false,
            };
        }),
        vurderSakNyFlyt: vi.fn(() => Promise.resolve()),
        avsluttVurderingNyFlyt: vi.fn(() => Promise.resolve()),
        angreVurderingNyFlyt: vi.fn(() => Promise.resolve()),
        opprettSamarbeidNyFlyt: vi.fn(() => Promise.resolve()),
        useHentSisteSakNyFlyt: vi.fn(() => ({
            data: dummyIaSak,
            loading: false,
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
            };
        }),
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

    describe("VirksomhetKlarTilVurdering", () => {
        beforeAll(() => {
            vi.mocked(useHentTilstandForVirksomhetNyFlyt).mockReturnValue({
                data: {
                    orgnr: dummyVirksomhetsinformasjonNyFlyt.orgnr,
                    tilstand: "VirksomhetKlarTilVurdering",
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
});
