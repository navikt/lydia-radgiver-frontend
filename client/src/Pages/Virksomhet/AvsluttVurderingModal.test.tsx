import {
    fireEvent,
    render,
    screen,
    waitFor,
    within,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { NyVirksomhetsside } from "@/Pages/Virksomhet";
import { useHentBrukerinformasjon } from "@features/bruker/api/bruker";
import { useHentTeam } from "@features/bruker/api/team";
import {
    useHentTilstandForVirksomhetNyFlyt,
    useHentSisteSakNyFlyt,
    avsluttVurderingNyFlyt,
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

function åpneAvsluttVurderingModal() {
    fireEvent.click(screen.getByText("Avslutt vurdering"));
}

describe("AvsluttVurderingModal", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

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

        vi.mocked(useHentBrukerinformasjon).mockReturnValue({
            data: {
                ident: "Z123456",
                navn: "Test Testesen",
                epost: "",
                rolle: "Superbruker",
                tokenUtloper: 99999999999,
            },
            loading: false,
            error: null,
            mutate: vi.fn(),
            validating: false,
        });
    });

    it("Sender data riktig på 'Nav har ikke kapasitet nå'", async () => {
        render(
            <BrowserRouter>
                <NyVirksomhetsside />
            </BrowserRouter>,
        );

        åpneAvsluttVurderingModal();

        fireEvent.click(screen.getByLabelText("Vurder virksomheten senere"));
        fireEvent.click(screen.getByLabelText("Nav har ikke kapasitet nå"));

        expect(avsluttVurderingNyFlyt).not.toHaveBeenCalled();
        fireEvent.click(screen.getByText("Lagre"));
        await waitFor(() =>
            expect(avsluttVurderingNyFlyt).toHaveBeenCalledTimes(1),
        );
        expect(avsluttVurderingNyFlyt).toHaveBeenCalledWith(
            dummyVirksomhetsinformasjonNyFlyt.orgnr,
            expect.objectContaining({
                type: "VIRKSOMHETEN_VURDERES_PÅ_ET_SENERE_TIDSPUNKT",
                begrunnelser: ["NAV_HAR_IKKE_KAPASITET_NÅ"],
                dato: expect.stringMatching(/\d{4}-\d{2}-\d{2}/),
            }),
        );
    });

    it("Sender data riktig på 'takket nei' med valgte begrunnelser", async () => {
        render(
            <BrowserRouter>
                <NyVirksomhetsside />
            </BrowserRouter>,
        );

        åpneAvsluttVurderingModal();

        fireEvent.click(screen.getByLabelText("Virksomheten har takket nei"));

        fireEvent.click(
            screen.getByLabelText(
                "Virksomheten er ikke motivert eller har ikke kapasitet",
            ),
        );
        fireEvent.click(
            screen.getByLabelText(
                "Virksomheten samarbeider med andre eller gjør egne tiltak",
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
                type: "VIRKSOMHETEN_ER_FERDIG_VURDERT_OG_TAKKET_NEI",
                begrunnelser: expect.arrayContaining([
                    "VIRKSOMHETEN_ER_IKKE_MOTIVERT_ELLER_HAR_IKKE_KAPASITET",
                    "VIRKSOMHETEN_SAMARBEIDER_MED_ANDRE_ELLER_GJØR_EGNE_TILTAK",
                ]),
                dato: expect.stringMatching(/\d{4}-\d{2}-\d{2}/),
            }),
        );
    });

    it("Bytting av årsak nullstiller begrunnelser", () => {
        render(
            <BrowserRouter>
                <NyVirksomhetsside />
            </BrowserRouter>,
        );

        åpneAvsluttVurderingModal();

        fireEvent.click(screen.getByLabelText("Nav har konkludert"));
        fireEvent.click(
            screen.getByLabelText(
                "Virksomheten har ikke svart på henvendelser",
            ),
        );
        expect(
            screen.getByLabelText(
                "Virksomheten har ikke svart på henvendelser",
            ),
        ).toBeChecked();

        fireEvent.click(screen.getByLabelText("Vurder virksomheten senere"));

        expect(
            screen.queryByLabelText(
                "Virksomheten har ikke svart på henvendelser",
            ),
        ).not.toBeInTheDocument();
    });

    it("Lagre-knappen er disabled uten valg", () => {
        render(
            <BrowserRouter>
                <NyVirksomhetsside />
            </BrowserRouter>,
        );

        åpneAvsluttVurderingModal();

        const lagreKnapp = screen.getByRole("button", { name: "Lagre" });
        fireEvent.click(lagreKnapp);
        expect(lagreKnapp).toBeDisabled();
    });

    it("Lagre-knappen er enabled etter valg av årsak og begrunnelse", () => {
        render(
            <BrowserRouter>
                <NyVirksomhetsside />
            </BrowserRouter>,
        );

        åpneAvsluttVurderingModal();

        const lagreKnapp = screen.getByRole("button", { name: "Lagre" });
        fireEvent.click(lagreKnapp);
        expect(lagreKnapp).toBeDisabled();

        fireEvent.click(screen.getByLabelText("Vurder virksomheten senere"));
        expect(screen.getByRole("button", { name: "Lagre" })).toBeDisabled();

        fireEvent.click(
            screen.getByLabelText("Virksomheten ønsker å bli kontaktet senere"),
        );
        expect(
            screen.getByRole("button", { name: "Lagre" }),
        ).not.toBeDisabled();
    });

    it("Viser advarsel når bruker ikke eier eller følger saken", () => {
        vi.mocked(useHentSpesifikkSakNyFlyt).mockReturnValue({
            data: { ...dummyIaSak, eidAv: "ANNEN_SAKSBEHANDLER" },
            loading: false,
            error: null,
            mutate: vi.fn(),
            validating: false,
        });
        vi.mocked(useHentSisteSakNyFlyt).mockReturnValue({
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

        render(
            <BrowserRouter>
                <NyVirksomhetsside />
            </BrowserRouter>,
        );

        åpneAvsluttVurderingModal();

        const lagreKnapp = screen.getByRole("button", { name: "Lagre" });
        fireEvent.click(lagreKnapp);
        expect(lagreKnapp).toBeDisabled();

        expect(
            screen.getByText(
                "Du må være eier eller følger for å avslutte vurderingen",
            ),
        ).toBeInTheDocument();
    });

    it("Avbryt lukker modalen", () => {
        render(
            <BrowserRouter>
                <NyVirksomhetsside />
            </BrowserRouter>,
        );

        åpneAvsluttVurderingModal();

        const modal = screen.getByRole("dialog", {
            name: "Avslutt vurdering av virksomheten",
        });
        expect(modal).toBeInTheDocument();

        fireEvent.click(within(modal).getByRole("button", { name: "Avbryt" }));
        expect(
            screen.queryByRole("dialog", {
                name: "Avslutt vurdering av virksomheten",
            }),
        ).not.toBeInTheDocument();
    });

    it("Angre vurdering-knapp finnes i modalen", () => {
        render(
            <BrowserRouter>
                <NyVirksomhetsside />
            </BrowserRouter>,
        );

        åpneAvsluttVurderingModal();

        expect(
            screen.getByRole("button", { name: "Angre vurdering" }),
        ).toBeInTheDocument();
    });
});
