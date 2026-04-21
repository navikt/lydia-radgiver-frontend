import {
    fireEvent,
    render,
    screen,
    waitFor,
    within,
} from "@testing-library/react";
import "@testing-library/jest-dom";

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
    avsluttVurderingNyFlyt,
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

function åpneAvsluttVurderingModal() {
    const avsluttVurderingKnapp = screen.getByText("Avslutt vurdering");
    avsluttVurderingKnapp.click();
}

describe("AvsluttVurderingModal", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

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

        jest.mocked(useHentBrukerinformasjon).mockReturnValue({
            data: {
                ident: "Z123456",
                navn: "Test Testesen",
                epost: "",
                rolle: "Superbruker",
                tokenUtloper: 99999999999,
            },
            loading: false,
            error: null,
            mutate: jest.fn(),
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
        expect(lagreKnapp).toBeDisabled();
    });

    it("Lagre-knappen er enabled etter valg av årsak og begrunnelse", () => {
        render(
            <BrowserRouter>
                <NyVirksomhetsside />
            </BrowserRouter>,
        );

        åpneAvsluttVurderingModal();

        expect(screen.getByRole("button", { name: "Lagre" })).toBeDisabled();

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
        jest.mocked(useHentSpesifikkSakNyFlyt).mockReturnValue({
            data: { ...dummyIaSak, eidAv: "ANNEN_SAKSBEHANDLER" },
            loading: false,
            error: null,
            mutate: jest.fn(),
            validating: false,
        });
        jest.mocked(useHentSisteSakNyFlyt).mockReturnValue({
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

        åpneAvsluttVurderingModal();

        expect(
            screen.getByText(
                "Du må være eier eller følger for å avslutte vurderingen",
            ),
        ).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Lagre" })).toBeDisabled();
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
