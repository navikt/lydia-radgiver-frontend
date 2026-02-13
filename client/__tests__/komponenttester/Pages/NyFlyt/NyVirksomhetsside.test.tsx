import { render, screen } from "@testing-library/react";
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
import { vurderSakNyFlyt } from "../../../../src/api/lydia-api/nyFlyt";

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
            vurderSakKnapp.click();
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
