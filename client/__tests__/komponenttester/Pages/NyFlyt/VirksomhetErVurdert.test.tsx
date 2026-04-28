import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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
    vurderSakNyFlyt,
    endrePlanlagtDatoNyFlyt,
} from "../../../../src/api/lydia-api/nyFlyt";
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
        useHentVirksomhetsinformasjon: jest.fn(() => ({
            data: dummyVirksomhetsinformasjonNyFlyt,
            loading: false,
        })),
        useHentSakshistorikk: jest.fn(() => ({
            data: dummySakshistorikk,
            loading: false,
            validating: false,
            mutate: jest.fn(),
        })),
        useHentPubliseringsinfo: jest.fn(() => ({
            data: dummyPubliseringsinfo,
            loading: false,
        })),
        useHentSykefraværsstatistikkForVirksomhetSisteKvartal: jest.fn(() => ({
            data: dummySykefraværsstatistikkSiste4Kvartal,
            loading: false,
        })),
        useHentNæringsstatistikk: jest.fn(() => ({
            data: dummyNæringsstatistikk,
            loading: false,
        })),
        useHentVirksomhetsstatistikkSiste4Kvartaler: jest.fn(() => ({
            data: dummyVirksomhetsstatistikkSiste4Kvartal,
            loading: false,
        })),
    };
});

jest.mock("../../../../src/api/lydia-api/spørreundersøkelse", () => {
    return {
        ...jest.requireActual(
            "../../../../src/api/lydia-api/spørreundersøkelse",
        ),
        useHentSamarbeid: jest.fn(() => ({
            data: [],
            loading: false,
            validating: false,
            mutate: jest.fn(() => Promise.resolve([])),
        })),
        useSpørreundersøkelsesliste: jest.fn(() => ({
            data: [],
            loading: false,
            validating: false,
            mutate: jest.fn(),
        })),
    };
});

jest.mock("../../../../src/api/lydia-api/nyFlyt", () => {
    return {
        ...jest.requireActual("../../../../src/api/lydia-api/nyFlyt"),
        useHentTilstandForVirksomhetNyFlyt: jest.fn(),
        vurderSakNyFlyt: jest.fn(() => Promise.resolve()),
        endrePlanlagtDatoNyFlyt: jest.fn(() => Promise.resolve()),
        avsluttVurderingNyFlyt: jest.fn(() => Promise.resolve()),
        angreVurderingNyFlyt: jest.fn(() => Promise.resolve()),
        opprettSamarbeidNyFlyt: jest.fn(() => Promise.resolve()),
        useHentSisteSakNyFlyt: jest.fn(() => ({
            data: undefined,
            loading: false,
            mutate: jest.fn(),
        })),
        useHentSpesifikkSakNyFlyt: jest.fn(() => ({
            data: dummyIaSak,
            loading: false,
            mutate: jest.fn(),
        })),
        useHentVirksomhetNyFlyt: jest.fn(() => ({
            data: dummyVirksomhetsinformasjonNyFlyt,
            loading: false,
            mutate: jest.fn(),
        })),
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
        useHentBrukerinformasjon: jest.fn(() => ({
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

jest.mock("../../../../src/api/lydia-api/team", () => {
    return {
        ...jest.requireActual("../../../../src/api/lydia-api/team"),
        useHentTeam: jest.fn(() => ({
            data: ["Z123456"],
            loading: false,
            mutate: jest.fn(),
        })),
    };
});

jest.mock("react-router-dom", () => {
    const originalModule = jest.requireActual("react-router-dom");
    return {
        ...originalModule,
        useParams: jest.fn(() => ({
            orgnummer: dummyVirksomhetsinformasjonNyFlyt.orgnr,
            saksnummer: dummyIaSak.saksnummer,
            prosessId: dummySamarbeid[1].id.toString(),
        })),
        useSearchParams: jest.fn(() => {
            const setSearchParams = jest.fn();
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
        jest.clearAllMocks();
    });

    describe("nesteTilstand: VirksomhetVurderes", () => {
        beforeEach(() => {
            jest.mocked(useHentTilstandForVirksomhetNyFlyt).mockReturnValue({
                data: {
                    orgnr: dummyVirksomhetsinformasjonNyFlyt.orgnr,
                    tilstand: "VirksomhetErVurdert",
                    nesteTilstand: nesteTilstandVurderes,
                },
                loading: false,
                error: null,
                mutate: jest.fn(),
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
            jest.mocked(useHentTilstandForVirksomhetNyFlyt).mockReturnValue({
                data: {
                    orgnr: dummyVirksomhetsinformasjonNyFlyt.orgnr,
                    tilstand: "VirksomhetErVurdert",
                    nesteTilstand: nesteTilstandKlarTilVurdering,
                },
                loading: false,
                error: null,
                mutate: jest.fn(),
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
            jest.mocked(useHentTilstandForVirksomhetNyFlyt).mockReturnValue({
                data: {
                    orgnr: dummyVirksomhetsinformasjonNyFlyt.orgnr,
                    tilstand: "VirksomhetErVurdert",
                    nesteTilstand: nesteTilstandVurderes,
                },
                loading: false,
                error: null,
                mutate: jest.fn(),
                validating: false,
            });
        });

        it("'Vurder nå'-knappen er deaktivert for ikke-Superbruker", () => {
            jest.mocked(useHentBrukerinformasjon).mockReturnValue({
                data: {
                    ident: "Z123456",
                    navn: "Test Testesen",
                    epost: "",
                    tokenUtloper: 0,
                    rolle: "Lesetilgang",
                },
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

            const knapp = screen.getByRole("button", { name: "Vurder nå" });
            expect(knapp).toBeDisabled();

            fireEvent.click(knapp);
            expect(vurderSakNyFlyt).not.toHaveBeenCalled();
        });

        it("'Vurder nå'-knappen er aktivert for Superbruker", () => {
            jest.mocked(useHentBrukerinformasjon).mockReturnValue({
                data: {
                    ident: "Z123456",
                    navn: "Test Testesen",
                    epost: "",
                    tokenUtloper: 0,
                    rolle: "Superbruker",
                },
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
                screen.getByRole("button", { name: "Vurder nå" }),
            ).toBeEnabled();
        });
    });
});
