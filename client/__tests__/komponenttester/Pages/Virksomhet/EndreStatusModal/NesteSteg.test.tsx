import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import NesteSteg, {
    Knappecontainer,
    hentÅrsakFraÅrsakType,
} from "../../../../../src/Pages/Virksomhet/Virksomhetsoversikt/IASakStatus/EndreStatusModal/NesteSteg";
import { BegrunnelseFørstSeksjon } from "../../../../../src/Pages/Virksomhet/Virksomhetsoversikt/IASakStatus/EndreStatusModal/NesteSteg/BegrunnelseFørstSeksjon";
import LenkeTilFanePåSamarbeid, {
    LenkeTilBehovsvurderingFane,
    LenkeTilEvalueringsFane,
    LenkeTilSamarbeid,
} from "../../../../../src/Pages/Virksomhet/Virksomhetsoversikt/IASakStatus/EndreStatusModal/NesteSteg/LenkeTilFanePåSamarbeid";
import {
    dummyIaSak,
    dummySamarbeid,
    dummyVirksomhetsinformasjon,
} from "../../../../../__mocks__/virksomhetsMockData";
import {
    GyldigNesteHendelse,
    IASak,
} from "../../../../../src/domenetyper/domenetyper";
import { IaSakProsess } from "../../../../../src/domenetyper/iaSakProsess";

// Mock analytics
jest.mock("../../../../../src/util/analytics-klient", () => ({
    loggStatusendringPåSak: jest.fn(),
    loggSendBrukerTilKartleggingerTab: jest.fn(),
}));

// Mock API hooks
jest.mock("../../../../../src/api/lydia-api/virksomhet", () => ({
    useHentSakForVirksomhet: jest.fn(() => ({
        data: dummyIaSak,
        mutate: jest.fn(),
    })),
    useHentSakshistorikk: jest.fn(() => ({
        data: [],
        mutate: jest.fn(),
    })),
}));

jest.mock("../../../../../src/api/lydia-api/spørreundersøkelse", () => ({
    useHentSamarbeid: jest.fn(() => ({
        data: dummySamarbeid,
    })),
    useHentSpørreundersøkelser: jest.fn(() => ({
        data: [],
    })),
}));

jest.mock("../../../../../src/api/lydia-api/bruker", () => ({
    useHentBrukerinformasjon: jest.fn(() => ({
        data: { ident: "Z123456", navn: "Test Bruker" },
    })),
}));

jest.mock("../../../../../src/api/lydia-api/sak", () => ({
    nyHendelsePåSak: jest.fn(() => Promise.resolve()),
}));

// Mock VirksomhetContext
jest.mock("../../../../../src/Pages/Virksomhet/VirksomhetContext", () => ({
    useVirksomhetContext: jest.fn(() => ({
        virksomhet: dummyVirksomhetsinformasjon,
        iaSak: dummyIaSak,
    })),
}));

const mockLukkModal = jest.fn();
const mockClearNesteSteg = jest.fn();

const createMockSak = (overrides: Partial<IASak> = {}): IASak => ({
    ...dummyIaSak,
    ...overrides,
});

const createMockHendelse = (
    overrides: Partial<GyldigNesteHendelse> = {},
): GyldigNesteHendelse => ({
    saksHendelsestype: "VIRKSOMHET_ER_IKKE_AKTUELL",
    gyldigeÅrsaker: [
        {
            type: "NAV_IGANGSETTER_IKKE_TILTAK",
            navn: "NAV har besluttet å ikke starte samarbeid",
            begrunnelser: [
                {
                    type: "IKKE_DIALOG_MELLOM_PARTENE",
                    navn: "Det er ikke dokumentert dialog mellom partene",
                },
            ],
        },
    ],
    ...overrides,
});

const createMockSamarbeid = (id: number, navn: string): IaSakProsess => ({
    id,
    saksnummer: dummyIaSak.saksnummer,
    navn,
    status: "AKTIV",
    sistEndret: null,
    opprettet: null,
});

describe("Knappecontainer", () => {
    test("rendrer children", () => {
        render(
            <Knappecontainer>
                <button>Test knapp</button>
            </Knappecontainer>,
        );

        expect(
            screen.getByRole("button", { name: "Test knapp" }),
        ).toBeInTheDocument();
    });

    test("legger til ekstra className", () => {
        const { container } = render(
            <Knappecontainer className="extra-class">
                <button>Test</button>
            </Knappecontainer>,
        );

        expect(container.firstChild).toHaveClass("extra-class");
    });
});

describe("hentÅrsakFraÅrsakType", () => {
    test("finner riktig årsak fra type", () => {
        const hendelse = createMockHendelse();
        const årsak = hentÅrsakFraÅrsakType(
            "NAV_IGANGSETTER_IKKE_TILTAK",
            hendelse,
        );

        expect(årsak).toBeDefined();
        expect(årsak?.type).toBe("NAV_IGANGSETTER_IKKE_TILTAK");
    });

    test("returnerer undefined for ukjent type", () => {
        const hendelse = createMockHendelse();
        const årsak = hentÅrsakFraÅrsakType("UKJENT_TYPE", hendelse);

        expect(årsak).toBeUndefined();
    });

    test("returnerer undefined for tom gyldigeÅrsaker", () => {
        const hendelse = createMockHendelse({ gyldigeÅrsaker: [] });
        const årsak = hentÅrsakFraÅrsakType(
            "NAV_IGANGSETTER_IKKE_TILTAK",
            hendelse,
        );

        expect(årsak).toBeUndefined();
    });
});

describe("LenkeTilFanePåSamarbeid", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <BrowserRouter>{children}</BrowserRouter>
    );

    test("rendrer lenke med riktig tekst", () => {
        render(
            <LenkeTilFanePåSamarbeid samarbeidId={1} fane="behovsvurdering">
                Test lenke
            </LenkeTilFanePåSamarbeid>,
            { wrapper },
        );

        expect(
            screen.getByRole("link", { name: "Test lenke" }),
        ).toBeInTheDocument();
    });

    test("lenke har riktig href med fane parameter", () => {
        render(
            <LenkeTilFanePåSamarbeid samarbeidId={1} fane="evaluering">
                Test
            </LenkeTilFanePåSamarbeid>,
            { wrapper },
        );

        const link = screen.getByRole("link");
        expect(link).toHaveAttribute(
            "href",
            expect.stringContaining("fane=evaluering"),
        );
    });
});

describe("LenkeTilBehovsvurderingFane", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <BrowserRouter>{children}</BrowserRouter>
    );

    test("viser samarbeidsnavn som lenketekst", () => {
        const alleSamarbeid = [createMockSamarbeid(1, "Samarbeid A")];

        render(
            <LenkeTilBehovsvurderingFane
                samarbeidId={1}
                alleSamarbeid={alleSamarbeid}
            />,
            { wrapper },
        );

        expect(
            screen.getByRole("link", { name: "Samarbeid A" }),
        ).toBeInTheDocument();
    });

    test("viser 'Ukjent samarbeid' når samarbeid ikke finnes", () => {
        render(
            <LenkeTilBehovsvurderingFane
                samarbeidId={999}
                alleSamarbeid={[]}
            />,
            { wrapper },
        );

        expect(
            screen.getByRole("link", { name: "Ukjent samarbeid" }),
        ).toBeInTheDocument();
    });
});

describe("LenkeTilEvalueringsFane", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <BrowserRouter>{children}</BrowserRouter>
    );

    test("viser samarbeidsnavn som lenketekst", () => {
        const alleSamarbeid = [createMockSamarbeid(2, "Samarbeid B")];

        render(
            <LenkeTilEvalueringsFane
                samarbeidId={2}
                alleSamarbeid={alleSamarbeid}
            />,
            { wrapper },
        );

        expect(
            screen.getByRole("link", { name: "Samarbeid B" }),
        ).toBeInTheDocument();
    });
});

describe("LenkeTilSamarbeid", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <BrowserRouter>{children}</BrowserRouter>
    );

    test("rendrer lenke med children", () => {
        render(
            <LenkeTilSamarbeid samarbeidId={1}>
                Gå til samarbeid
            </LenkeTilSamarbeid>,
            { wrapper },
        );

        expect(
            screen.getByRole("link", { name: "Gå til samarbeid" }),
        ).toBeInTheDocument();
    });

    test("kaller onClick når lenken klikkes", () => {
        const onClick = jest.fn();

        render(
            <LenkeTilSamarbeid samarbeidId={1} onClick={onClick}>
                Klikk her
            </LenkeTilSamarbeid>,
            { wrapper },
        );

        fireEvent.click(screen.getByRole("link"));
        expect(onClick).toHaveBeenCalledTimes(1);
    });
});

describe("BegrunnelseFørstSeksjon", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("returnerer tomt fragment når hendelse er null", () => {
        const { container } = render(
            <BegrunnelseFørstSeksjon
                lukkModal={mockLukkModal}
                hendelse={null}
                sak={createMockSak()}
                clearNesteSteg={mockClearNesteSteg}
            />,
        );

        expect(container).toBeEmptyDOMElement();
    });

    test("viser overskrift når hendelse er satt", () => {
        const hendelse = createMockHendelse();

        render(
            <BegrunnelseFørstSeksjon
                lukkModal={mockLukkModal}
                hendelse={hendelse}
                sak={createMockSak()}
                clearNesteSteg={mockClearNesteSteg}
            />,
        );

        expect(
            screen.getByRole("heading", {
                name: /er du sikker på at du vil sette saken til/i,
            }),
        ).toBeInTheDocument();
    });
});

describe("NesteSteg", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <BrowserRouter>{children}</BrowserRouter>
    );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("returnerer null når nesteSteg er null og ingen spesielle forhold gjelder", () => {
        const { container } = render(
            <NesteSteg
                nesteSteg={{ nesteSteg: null, hendelse: null }}
                lukkModal={mockLukkModal}
                sak={createMockSak({ status: "VI_BISTÅR" })}
                clearNesteSteg={mockClearNesteSteg}
            />,
            { wrapper },
        );

        expect(container).toBeEmptyDOMElement();
    });

    test("viser BEGRUNNELSE-seksjon når nesteSteg er BEGRUNNELSE", () => {
        const hendelse = createMockHendelse();

        render(
            <NesteSteg
                nesteSteg={{ nesteSteg: "BEGRUNNELSE", hendelse }}
                lukkModal={mockLukkModal}
                sak={createMockSak()}
                clearNesteSteg={mockClearNesteSteg}
            />,
            { wrapper },
        );

        expect(
            screen.getByRole("heading", {
                name: /er du sikker på at du vil sette saken til/i,
            }),
        ).toBeInTheDocument();
    });

    test("viser BEKREFT-seksjon når nesteSteg er BEKREFT", () => {
        const hendelse: GyldigNesteHendelse = {
            saksHendelsestype: "TILBAKE",
            gyldigeÅrsaker: [],
        };

        render(
            <NesteSteg
                nesteSteg={{ nesteSteg: "BEKREFT", hendelse }}
                lukkModal={mockLukkModal}
                sak={createMockSak({ status: "FULLFØRT" })}
                clearNesteSteg={mockClearNesteSteg}
            />,
            { wrapper },
        );

        expect(
            screen.getByRole("heading", {
                name: /er du sikker på at du vil gjenåpne saken/i,
            }),
        ).toBeInTheDocument();
    });

    test("viser riktig bekreftelsestekst for TILBAKE fra IKKE_AKTUELL", () => {
        const hendelse: GyldigNesteHendelse = {
            saksHendelsestype: "TILBAKE",
            gyldigeÅrsaker: [],
        };

        render(
            <NesteSteg
                nesteSteg={{ nesteSteg: "BEKREFT", hendelse }}
                lukkModal={mockLukkModal}
                sak={createMockSak({ status: "IKKE_AKTUELL" })}
                clearNesteSteg={mockClearNesteSteg}
            />,
            { wrapper },
        );

        expect(
            screen.getByText(/setter saken tilbake til forrige status/i),
        ).toBeInTheDocument();
    });

    test("viser riktig tekst for TA_EIERSKAP_I_SAK når sak har eier", () => {
        const hendelse: GyldigNesteHendelse = {
            saksHendelsestype: "TA_EIERSKAP_I_SAK",
            gyldigeÅrsaker: [],
        };

        render(
            <NesteSteg
                nesteSteg={{ nesteSteg: "BEKREFT", hendelse }}
                lukkModal={mockLukkModal}
                sak={createMockSak({ eidAv: "A123456" })}
                clearNesteSteg={mockClearNesteSteg}
            />,
            { wrapper },
        );

        expect(
            screen.getByText(/nåværende eier blir automatisk fjernet/i),
        ).toBeInTheDocument();
    });

    test("viser avbryt-knapp i BEKREFT-seksjonen", () => {
        const hendelse: GyldigNesteHendelse = {
            saksHendelsestype: "TILBAKE",
            gyldigeÅrsaker: [],
        };

        render(
            <NesteSteg
                nesteSteg={{ nesteSteg: "BEKREFT", hendelse }}
                lukkModal={mockLukkModal}
                sak={createMockSak()}
                clearNesteSteg={mockClearNesteSteg}
            />,
            { wrapper },
        );

        const avbrytButton = screen.getByRole("button", { name: /avbryt/i });
        expect(avbrytButton).toBeInTheDocument();

        fireEvent.click(avbrytButton);
        expect(mockClearNesteSteg).toHaveBeenCalledTimes(1);
    });
});
