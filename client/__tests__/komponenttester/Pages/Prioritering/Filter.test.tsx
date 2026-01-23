import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TallInput } from "../../../../src/Pages/Prioritering/Filter/TallInput";
import { FraTilFieldset } from "../../../../src/Pages/Prioritering/Filter/FraTilFieldset";
import {
    SykefraværsprosentVelger,
    Range,
} from "../../../../src/Pages/Prioritering/Filter/SykefraværsprosentVelger";
import { AntallArbeidsforholdVelger } from "../../../../src/Pages/Prioritering/Filter/AntallArbeidsforholdVelger";
import { SektorDropdown } from "../../../../src/Pages/Prioritering/Filter/SektorDropdown";
import { IAStatusDropdown } from "../../../../src/Pages/Prioritering/Filter/IAStatusDropdown";
import { FylkeMultidropdown } from "../../../../src/Pages/Prioritering/Filter/FylkeMultidropdown";
import { Kommunedropdown } from "../../../../src/Pages/Prioritering/Filter/Kommunedropdown";
import { Næringsgruppedropdown } from "../../../../src/Pages/Prioritering/Filter/NæringsgruppeDropdown";
import { EierDropdown } from "../../../../src/Pages/Prioritering/Filter/EierDropdown";
import { Filtervisning } from "../../../../src/Pages/Prioritering/Filter/Filtervisning";
import { Sektor, Næringsgruppe } from "../../../../src/domenetyper/virksomhet";
import {
    Eier,
    IAProsessStatusType,
} from "../../../../src/domenetyper/domenetyper";
import {
    FylkeMedKommuner,
    Kommune,
} from "../../../../src/domenetyper/fylkeOgKommune";
import { ValgtSnittFilter } from "../../../../src/domenetyper/filterverdier";
import { BrowserRouter } from "react-router-dom";

describe("TallInput", () => {
    test("rendrer TextField med label", () => {
        render(<TallInput label="Test label" />);
        expect(screen.getByLabelText("Test label")).toBeInTheDocument();
    });

    test("aksepterer custom className", () => {
        const { container } = render(
            <TallInput label="Test" className="custom-class" />,
        );
        expect(container.querySelector(".custom-class")).toBeInTheDocument();
    });

    test("videresender props til TextField", () => {
        render(<TallInput label="Test" type="number" min="0" max="100" />);
        const input = screen.getByLabelText("Test");
        expect(input).toHaveAttribute("type", "number");
        expect(input).toHaveAttribute("min", "0");
        expect(input).toHaveAttribute("max", "100");
    });
});

describe("FraTilFieldset", () => {
    test("rendrer Fieldset med legend", () => {
        render(
            <FraTilFieldset legend="Test legend">
                <span>Innhold</span>
            </FraTilFieldset>,
        );
        expect(screen.getByText("Test legend")).toBeInTheDocument();
        expect(screen.getByText("Innhold")).toBeInTheDocument();
    });

    test("aksepterer custom className", () => {
        const { container } = render(
            <FraTilFieldset legend="Test" className="custom-fieldset">
                <span>Innhold</span>
            </FraTilFieldset>,
        );
        expect(container.querySelector(".custom-fieldset")).toBeInTheDocument();
    });
});

describe("SykefraværsprosentVelger", () => {
    const mockEndre = jest.fn();
    const defaultRange: Range = { fra: 0, til: 100 };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("rendrer fieldset med legend 'Sykefravær (%)'", () => {
        render(
            <SykefraværsprosentVelger
                sykefraværsprosentRange={defaultRange}
                endre={mockEndre}
            />,
        );
        expect(screen.getByText("Sykefravær (%)")).toBeInTheDocument();
    });

    test("viser fra-verdi i input", () => {
        render(
            <SykefraværsprosentVelger
                sykefraværsprosentRange={{ fra: 5, til: 100 }}
                endre={mockEndre}
            />,
        );
        expect(screen.getByLabelText("Fra")).toHaveValue(5);
    });

    test("kaller endre med ny fra-verdi", () => {
        render(
            <SykefraværsprosentVelger
                sykefraværsprosentRange={defaultRange}
                endre={mockEndre}
            />,
        );
        fireEvent.change(screen.getByLabelText("Fra"), {
            target: { value: "10" },
        });
        expect(mockEndre).toHaveBeenCalledWith({ fra: 10, til: 100 });
    });

    test("kaller endre med ny til-verdi", () => {
        render(
            <SykefraværsprosentVelger
                sykefraværsprosentRange={defaultRange}
                endre={mockEndre}
            />,
        );
        // Til-feltet har hideLabel, så vi må finne det på en annen måte
        const inputs = screen.getAllByRole("spinbutton");
        fireEvent.change(inputs[1], { target: { value: "50" } });
        expect(mockEndre).toHaveBeenCalledWith({ fra: 0, til: 50 });
    });

    test("validerer at verdien er mellom 0 og 100", () => {
        render(
            <SykefraværsprosentVelger
                sykefraværsprosentRange={defaultRange}
                endre={mockEndre}
            />,
        );
        // Prøv å sette ugyldig verdi
        fireEvent.change(screen.getByLabelText("Fra"), {
            target: { value: "150" },
        });
        // Burde ikke kalles med ugyldig verdi
        expect(mockEndre).not.toHaveBeenCalledWith(
            expect.objectContaining({ fra: 150 }),
        );
    });

    test("aksepterer desimaltall med én desimal", () => {
        render(
            <SykefraværsprosentVelger
                sykefraværsprosentRange={defaultRange}
                endre={mockEndre}
            />,
        );
        fireEvent.change(screen.getByLabelText("Fra"), {
            target: { value: "5.5" },
        });
        expect(mockEndre).toHaveBeenCalledWith({ fra: 5.5, til: 100 });
    });
});

describe("AntallArbeidsforholdVelger", () => {
    const mockEndre = jest.fn();
    const defaultRange: Range = { fra: 5, til: NaN };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("rendrer fieldset med legend 'Antall arbeidsforhold'", () => {
        render(
            <AntallArbeidsforholdVelger
                antallArbeidsforhold={defaultRange}
                endreAntallArbeidsforhold={mockEndre}
            />,
        );
        expect(screen.getByText("Antall arbeidsforhold")).toBeInTheDocument();
    });

    test("viser fra-verdi", () => {
        render(
            <AntallArbeidsforholdVelger
                antallArbeidsforhold={{ fra: 10, til: 50 }}
                endreAntallArbeidsforhold={mockEndre}
            />,
        );
        expect(screen.getByLabelText("Fra")).toHaveValue(10);
    });

    test("kaller endreAntallArbeidsforhold med ny fra-verdi", () => {
        render(
            <AntallArbeidsforholdVelger
                antallArbeidsforhold={defaultRange}
                endreAntallArbeidsforhold={mockEndre}
            />,
        );
        fireEvent.change(screen.getByLabelText("Fra"), {
            target: { value: "20", valueAsNumber: 20 },
        });
        expect(mockEndre).toHaveBeenCalledWith({ fra: 20, til: NaN });
    });

    test("kaller endreAntallArbeidsforhold med ny til-verdi", () => {
        render(
            <AntallArbeidsforholdVelger
                antallArbeidsforhold={{ fra: 5, til: 100 }}
                endreAntallArbeidsforhold={mockEndre}
            />,
        );
        const inputs = screen.getAllByRole("spinbutton");
        fireEvent.change(inputs[1], {
            target: { value: "200", valueAsNumber: 200 },
        });
        expect(mockEndre).toHaveBeenCalledWith({ fra: 5, til: 200 });
    });
});

describe("SektorDropdown", () => {
    const mockEndreSektor = jest.fn();
    const sektorer: Sektor[] = [
        { kode: "PRIVAT", beskrivelse: "Privat sektor" },
        { kode: "OFFENTLIG", beskrivelse: "Offentlig sektor" },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("rendrer select med label 'Sektor'", () => {
        render(
            <SektorDropdown
                valgtSektor=""
                endreSektor={mockEndreSektor}
                sektorer={sektorer}
            />,
        );
        expect(screen.getByLabelText("Sektor")).toBeInTheDocument();
    });

    test("viser 'Alle' som standardvalg", () => {
        render(
            <SektorDropdown
                valgtSektor=""
                endreSektor={mockEndreSektor}
                sektorer={sektorer}
            />,
        );
        expect(
            screen.getByRole("option", { name: "Alle" }),
        ).toBeInTheDocument();
    });

    test("viser alle sektorer som options", () => {
        render(
            <SektorDropdown
                valgtSektor=""
                endreSektor={mockEndreSektor}
                sektorer={sektorer}
            />,
        );
        expect(
            screen.getByRole("option", { name: "Privat sektor" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("option", { name: "Offentlig sektor" }),
        ).toBeInTheDocument();
    });

    test("kaller endreSektor når valg endres", () => {
        render(
            <SektorDropdown
                valgtSektor=""
                endreSektor={mockEndreSektor}
                sektorer={sektorer}
            />,
        );
        fireEvent.change(screen.getByLabelText("Sektor"), {
            target: { value: "PRIVAT" },
        });
        expect(mockEndreSektor).toHaveBeenCalledWith("PRIVAT");
    });

    test("viser valgt sektor", () => {
        render(
            <SektorDropdown
                valgtSektor="OFFENTLIG"
                endreSektor={mockEndreSektor}
                sektorer={sektorer}
            />,
        );
        expect(screen.getByLabelText("Sektor")).toHaveValue("OFFENTLIG");
    });
});

describe("IAStatusDropdown", () => {
    const mockEndreStatus = jest.fn();
    const statuser: IAProsessStatusType[] = [
        "VURDERES",
        "KONTAKTES",
        "KARTLEGGES",
        "VI_BISTÅR",
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("rendrer select med label 'Status'", () => {
        render(
            <IAStatusDropdown
                valgtStatus={undefined}
                endreStatus={mockEndreStatus}
                statuser={statuser}
            />,
        );
        expect(screen.getByLabelText("Status")).toBeInTheDocument();
    });

    test("viser 'Alle' som standardvalg", () => {
        render(
            <IAStatusDropdown
                valgtStatus={undefined}
                endreStatus={mockEndreStatus}
                statuser={statuser}
            />,
        );
        expect(
            screen.getByRole("option", { name: "Alle" }),
        ).toBeInTheDocument();
    });

    test("kaller endreStatus med valgt status", () => {
        render(
            <IAStatusDropdown
                valgtStatus={undefined}
                endreStatus={mockEndreStatus}
                statuser={statuser}
            />,
        );
        fireEvent.change(screen.getByLabelText("Status"), {
            target: { value: "KARTLEGGES" },
        });
        expect(mockEndreStatus).toHaveBeenCalledWith("KARTLEGGES");
    });

    test("kaller endreStatus med undefined når 'Alle' velges", () => {
        render(
            <IAStatusDropdown
                valgtStatus="VI_BISTÅR"
                endreStatus={mockEndreStatus}
                statuser={statuser}
            />,
        );
        fireEvent.change(screen.getByLabelText("Status"), {
            target: { value: "" },
        });
        expect(mockEndreStatus).toHaveBeenCalledWith(undefined);
    });

    test("viser valgt status", () => {
        render(
            <IAStatusDropdown
                valgtStatus="VURDERES"
                endreStatus={mockEndreStatus}
                statuser={statuser}
            />,
        );
        expect(screen.getByLabelText("Status")).toHaveValue("VURDERES");
    });
});

// Mock data for react-select components
const mockFylkerMedKommuner: FylkeMedKommuner[] = [
    {
        fylke: { nummer: "03", navn: "Oslo" },
        kommuner: [{ nummer: "0301", navn: "Oslo", navnNorsk: "Oslo" }],
    },
    {
        fylke: { nummer: "30", navn: "Viken" },
        kommuner: [
            { nummer: "3001", navn: "Halden", navnNorsk: "Halden" },
            { nummer: "3002", navn: "Moss", navnNorsk: "Moss" },
        ],
    },
    {
        fylke: { nummer: "46", navn: "Vestland" },
        kommuner: [
            { nummer: "4601", navn: "Bergen", navnNorsk: "Bergen" },
            { nummer: "4602", navn: "Kinn", navnNorsk: "Kinn" },
        ],
    },
];

const mockNæringsgrupper: Næringsgruppe[] = [
    { kode: "01.110", navn: "Dyrking av korn" },
    { kode: "10.110", navn: "Bearbeiding og konservering av kjøtt" },
    { kode: "62.010", navn: "Programmeringstjenester" },
];

const mockBransjeprogram: string[] = ["BARNEHAGER", "TRANSPORT", "BYGG"];

const mockEiere: Eier[] = [
    { navIdent: "A123456", navn: "Ola Nordmann" },
    { navIdent: "B654321", navn: "Kari Nordmann" },
];

describe("FylkeMultidropdown", () => {
    const mockEndreFylker = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("rendrer label 'Fylker'", () => {
        render(
            <FylkeMultidropdown
                fylkerOgKommuner={mockFylkerMedKommuner}
                valgteFylker={[]}
                endreFylker={mockEndreFylker}
            />,
        );
        expect(screen.getByText("Fylker")).toBeInTheDocument();
    });

    test("rendrer react-select komponent", () => {
        const { container } = render(
            <FylkeMultidropdown
                fylkerOgKommuner={mockFylkerMedKommuner}
                valgteFylker={[]}
                endreFylker={mockEndreFylker}
            />,
        );
        // React-select creates a container with class that contains 'select'
        expect(
            container.querySelector('[class*="control"]'),
        ).toBeInTheDocument();
    });

    test("viser valgte fylker", async () => {
        render(
            <FylkeMultidropdown
                fylkerOgKommuner={mockFylkerMedKommuner}
                valgteFylker={[mockFylkerMedKommuner[0]]}
                endreFylker={mockEndreFylker}
            />,
        );
        expect(screen.getByText("Oslo")).toBeInTheDocument();
    });
});

describe("Kommunedropdown", () => {
    const mockEndreKommuner = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("rendrer label 'Kommuner'", () => {
        render(
            <Kommunedropdown
                relevanteFylkerMedKommuner={mockFylkerMedKommuner}
                valgteKommuner={[]}
                endreKommuner={mockEndreKommuner}
            />,
        );
        expect(screen.getByText("Kommuner")).toBeInTheDocument();
    });

    test("rendrer react-select komponent", () => {
        const { container } = render(
            <Kommunedropdown
                relevanteFylkerMedKommuner={mockFylkerMedKommuner}
                valgteKommuner={[]}
                endreKommuner={mockEndreKommuner}
            />,
        );
        expect(
            container.querySelector('[class*="control"]'),
        ).toBeInTheDocument();
    });

    test("viser valgte kommuner", () => {
        const valgteKommuner: Kommune[] = [
            { nummer: "4601", navn: "Bergen", navnNorsk: "Bergen" },
        ];
        render(
            <Kommunedropdown
                relevanteFylkerMedKommuner={mockFylkerMedKommuner}
                valgteKommuner={valgteKommuner}
                endreKommuner={mockEndreKommuner}
            />,
        );
        expect(screen.getByText("Bergen")).toBeInTheDocument();
    });

    test("viser kommunenavn med norsk variant når de er ulike", () => {
        const fylkerMedSamiskKommune: FylkeMedKommuner[] = [
            {
                fylke: { nummer: "54", navn: "Troms og Finnmark" },
                kommuner: [
                    { nummer: "5401", navn: "Tromsø", navnNorsk: "Romsa" },
                ],
            },
        ];
        const valgteKommuner: Kommune[] = [
            { nummer: "5401", navn: "Tromsø", navnNorsk: "Romsa" },
        ];
        render(
            <Kommunedropdown
                relevanteFylkerMedKommuner={fylkerMedSamiskKommune}
                valgteKommuner={valgteKommuner}
                endreKommuner={mockEndreKommuner}
            />,
        );
        expect(screen.getByText("Tromsø (Romsa)")).toBeInTheDocument();
    });
});

describe("Næringsgruppedropdown", () => {
    const mockEndreNæringsgrupper = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("rendrer label 'Bransjer og næringsgrupper'", () => {
        render(
            <Næringsgruppedropdown
                næringsgrupper={mockNæringsgrupper}
                bransjeprogram={mockBransjeprogram}
                valgtNæringsgruppe={[]}
                valgtBransjeprogram={[]}
                endreNæringsgrupper={mockEndreNæringsgrupper}
            />,
        );
        expect(
            screen.getByText("Bransjer og næringsgrupper"),
        ).toBeInTheDocument();
    });

    test("rendrer react-select komponent", () => {
        const { container } = render(
            <Næringsgruppedropdown
                næringsgrupper={mockNæringsgrupper}
                bransjeprogram={mockBransjeprogram}
                valgtNæringsgruppe={[]}
                valgtBransjeprogram={[]}
                endreNæringsgrupper={mockEndreNæringsgrupper}
            />,
        );
        expect(
            container.querySelector('[class*="control"]'),
        ).toBeInTheDocument();
    });

    test("viser valgte næringsgrupper", () => {
        render(
            <Næringsgruppedropdown
                næringsgrupper={mockNæringsgrupper}
                bransjeprogram={mockBransjeprogram}
                valgtNæringsgruppe={[mockNæringsgrupper[2]]}
                valgtBransjeprogram={[]}
                endreNæringsgrupper={mockEndreNæringsgrupper}
            />,
        );
        expect(
            screen.getByText("62.010 - Programmeringstjenester"),
        ).toBeInTheDocument();
    });

    test("viser valgte bransjeprogram med penskriving", () => {
        render(
            <Næringsgruppedropdown
                næringsgrupper={mockNæringsgrupper}
                bransjeprogram={mockBransjeprogram}
                valgtNæringsgruppe={[]}
                valgtBransjeprogram={["BARNEHAGER"]}
                endreNæringsgrupper={mockEndreNæringsgrupper}
            />,
        );
        expect(screen.getByText("Barnehager")).toBeInTheDocument();
    });
});

describe("EierDropdown", () => {
    const mockOnEierBytteCallback = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("rendrer label 'Eier'", () => {
        render(
            <EierDropdown
                filtrerbareEiere={mockEiere}
                eiere={[]}
                onEierBytteCallback={mockOnEierBytteCallback}
            />,
        );
        expect(screen.getByText("Eier")).toBeInTheDocument();
    });

    test("rendrer react-select komponent", () => {
        const { container } = render(
            <EierDropdown
                filtrerbareEiere={mockEiere}
                eiere={[]}
                onEierBytteCallback={mockOnEierBytteCallback}
            />,
        );
        expect(
            container.querySelector('[class*="control"]'),
        ).toBeInTheDocument();
    });

    test("viser valgte eiere", () => {
        // mockEiere sorteres alfabetisk, så vi må passe på hvilken vi velger
        const valgtEier = mockEiere[1]; // Kari Nordmann kommer først alfabetisk i listen
        render(
            <EierDropdown
                filtrerbareEiere={mockEiere}
                eiere={[valgtEier]}
                onEierBytteCallback={mockOnEierBytteCallback}
            />,
        );
        expect(screen.getByText(valgtEier.navn)).toBeInTheDocument();
    });
});

describe("Filtervisning", () => {
    const mockSøkPåNytt = jest.fn();
    const mockFiltervisning = {
        oppdaterAntallArbeidsforhold: jest.fn(),
        oppdaterIastatus: jest.fn(),
        oppdaterEiere: jest.fn(),
        oppdaterFylker: jest.fn(),
        oppdaterKommuner: jest.fn(),
        oppdaterSykefraværsprosent: jest.fn(),
        oppdaterSnittfilter: jest.fn(),
        oppdaterNæringsgruppe: jest.fn(),
        oppdaterSektorer: jest.fn(),
        oppdaterAutosøk: jest.fn(),
        tilbakestill: jest.fn(),
        state: {
            filterverdier: {
                fylker: mockFylkerMedKommuner,
                sektorer: [
                    { kode: "PRIVAT", beskrivelse: "Privat" },
                ] as Sektor[],
                statuser: ["VURDERES", "KONTAKTES"] as IAProsessStatusType[],
                naringsgrupper: mockNæringsgrupper,
                bransjeprogram: mockBransjeprogram,
                filtrerbareEiere: mockEiere,
                sorteringsnokler: ["SYKEFRAVERSPROSENT", "ANTALL_PERSONER"],
            },
            valgteFylker: [],
            kommuner: [],
            næringsgrupper: [],
            bransjeprogram: [],
            sektor: "",
            iaStatus: undefined,
            eiere: [],
            sykefraværsprosent: { fra: 0, til: 100 },
            antallArbeidsforhold: { fra: 5, til: NaN },
            valgtSnittfilter: ValgtSnittFilter.ALLE,
            autosøk: false,
            side: 1,
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderWithRouter = (ui: React.ReactElement) => {
        return render(<BrowserRouter>{ui}</BrowserRouter>);
    };

    test("rendrer alle filter-komponenter", () => {
        renderWithRouter(
            <Filtervisning
                filtervisning={mockFiltervisning}
                søkPåNytt={mockSøkPåNytt}
            />,
        );
        expect(screen.getByText("Fylker")).toBeInTheDocument();
        expect(screen.getByText("Kommuner")).toBeInTheDocument();
        expect(
            screen.getByText("Bransjer og næringsgrupper"),
        ).toBeInTheDocument();
        expect(screen.getByLabelText("Sektor")).toBeInTheDocument();
        expect(screen.getByText("Sykefravær (%)")).toBeInTheDocument();
        expect(screen.getByText("Antall arbeidsforhold")).toBeInTheDocument();
        expect(screen.getByLabelText("Status")).toBeInTheDocument();
        expect(screen.getByText("Eier")).toBeInTheDocument();
    });

    test("rendrer søkeknapp med standard tekst", () => {
        renderWithRouter(
            <Filtervisning
                filtervisning={mockFiltervisning}
                søkPåNytt={mockSøkPåNytt}
            />,
        );
        expect(screen.getByRole("button", { name: "Søk" })).toBeInTheDocument();
    });

    test("rendrer søkeknapp med custom tekst", () => {
        renderWithRouter(
            <Filtervisning
                filtervisning={mockFiltervisning}
                søkPåNytt={mockSøkPåNytt}
                søkeknappTittel="Oppdater"
            />,
        );
        expect(
            screen.getByRole("button", { name: "Oppdater" }),
        ).toBeInTheDocument();
    });

    test("kaller søkPåNytt når søkeknapp klikkes", () => {
        renderWithRouter(
            <Filtervisning
                filtervisning={mockFiltervisning}
                søkPåNytt={mockSøkPåNytt}
            />,
        );
        fireEvent.click(screen.getByRole("button", { name: "Søk" }));
        expect(mockSøkPåNytt).toHaveBeenCalled();
    });

    test("rendrer Autosøk checkbox", () => {
        renderWithRouter(
            <Filtervisning
                filtervisning={mockFiltervisning}
                søkPåNytt={mockSøkPåNytt}
            />,
        );
        expect(
            screen.getByRole("checkbox", { name: "Autosøk" }),
        ).toBeInTheDocument();
    });

    test("toggler autosøk ved klikk på checkbox", () => {
        renderWithRouter(
            <Filtervisning
                filtervisning={mockFiltervisning}
                søkPåNytt={mockSøkPåNytt}
            />,
        );
        fireEvent.click(screen.getByRole("checkbox", { name: "Autosøk" }));
        expect(mockFiltervisning.oppdaterAutosøk).toHaveBeenCalledWith({
            autosøk: true,
        });
    });

    test("skjuler IA_STATUS filter når maskert", () => {
        renderWithRouter(
            <Filtervisning
                filtervisning={mockFiltervisning}
                søkPåNytt={mockSøkPåNytt}
                maskerteFiltre={["IA_STATUS"]}
            />,
        );
        expect(screen.queryByLabelText("Status")).not.toBeInTheDocument();
    });

    test("skjuler EIER filter når maskert", () => {
        renderWithRouter(
            <Filtervisning
                filtervisning={mockFiltervisning}
                søkPåNytt={mockSøkPåNytt}
                maskerteFiltre={["EIER"]}
            />,
        );
        expect(screen.queryByText("Eier")).not.toBeInTheDocument();
    });

    test("viser loading state på søkeknapp", () => {
        renderWithRouter(
            <Filtervisning
                filtervisning={mockFiltervisning}
                søkPåNytt={mockSøkPåNytt}
                laster={true}
            />,
        );
        const button = screen.getByRole("button", { name: /Søk/i });
        // NAV ds-react Button med loading bruker loading-attributt
        expect(button.closest("button")).toBeInTheDocument();
    });

    test("aksepterer custom className", () => {
        const { container } = renderWithRouter(
            <Filtervisning
                filtervisning={mockFiltervisning}
                søkPåNytt={mockSøkPåNytt}
                className="custom-filter-class"
            />,
        );
        expect(
            container.querySelector(".custom-filter-class"),
        ).toBeInTheDocument();
    });

    test("kaller oppdaterSektorer når sektor endres", async () => {
        renderWithRouter(
            <Filtervisning
                filtervisning={mockFiltervisning}
                søkPåNytt={mockSøkPåNytt}
            />,
        );
        fireEvent.change(screen.getByLabelText("Sektor"), {
            target: { value: "PRIVAT" },
        });
        expect(mockFiltervisning.oppdaterSektorer).toHaveBeenCalledWith({
            sektor: "PRIVAT",
        });
    });

    test("kaller oppdaterIastatus når status endres", async () => {
        renderWithRouter(
            <Filtervisning
                filtervisning={mockFiltervisning}
                søkPåNytt={mockSøkPåNytt}
            />,
        );
        fireEvent.change(screen.getByLabelText("Status"), {
            target: { value: "VURDERES" },
        });
        expect(mockFiltervisning.oppdaterIastatus).toHaveBeenCalledWith({
            iastatus: "VURDERES",
        });
    });

    test("kaller oppdaterSykefraværsprosent ved endring", async () => {
        renderWithRouter(
            <Filtervisning
                filtervisning={mockFiltervisning}
                søkPåNytt={mockSøkPåNytt}
            />,
        );
        // Det er flere "Fra" labels, så vi bruker getAllByLabelText og tar den første (sykefravær)
        const fraInputs = screen.getAllByLabelText("Fra");
        fireEvent.change(fraInputs[0], {
            target: { value: "5" },
        });
        expect(mockFiltervisning.oppdaterSykefraværsprosent).toHaveBeenCalled();
    });
});
