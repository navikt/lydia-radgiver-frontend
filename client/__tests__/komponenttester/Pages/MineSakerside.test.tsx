import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import { MineSakerside, EIER_FØLGER_FILTER_VALUES } from "../../../src/Pages/MineSaker/MineSakerside";
import { Sorteringsknapper } from "../../../src/Pages/MineSaker/Sorteringsknapper";
import { loggMineSakerFilterEndringMedAnalytics } from "../../../src/Pages/MineSaker/loggFilterEndringMedAnalytics";
import { MineSakerFilterKategorier } from "../../../src/util/analytics-klient";
import { IAProsessStatusType } from "../../../src/domenetyper/domenetyper";

// Mock API hooks
jest.mock("../../../src/api/lydia-api/bruker", () => ({
	useHentBrukerinformasjon: jest.fn(() => ({
		data: { ident: "A123456", navn: "Test Bruker" },
	})),
}));

const mockMineSaker = [
	{
		orgnavn: "Bedrift A",
		iaSak: {
			saksnummer: "SAK-1",
			orgnr: "123456789",
			status: "VI_BISTÅR" as const,
			eidAv: "A123456",
			opprettetTidspunkt: new Date("2024-01-01"),
			endretTidspunkt: new Date("2024-06-01"),
		},
	},
	{
		orgnavn: "Bedrift B",
		iaSak: {
			saksnummer: "SAK-2",
			orgnr: "987654321",
			status: "KARTLEGGES" as const,
			eidAv: "B654321",
			opprettetTidspunkt: new Date("2024-02-01"),
			endretTidspunkt: new Date("2024-05-01"),
		},
	},
	{
		orgnavn: "Bedrift C",
		iaSak: {
			saksnummer: "SAK-3",
			orgnr: "111222333",
			status: "FULLFØRT" as const,
			eidAv: "A123456",
			opprettetTidspunkt: new Date("2024-03-01"),
			endretTidspunkt: null,
		},
	},
];

jest.mock("../../../src/api/lydia-api/sak", () => ({
	useHentMineSaker: jest.fn(() => ({
		data: mockMineSaker,
	})),
}));

// Mock analytics
jest.mock("../../../src/util/analytics-klient", () => ({
	loggSideLastet: jest.fn(),
	loggBrukerRedirigertMedSøkAlert: jest.fn(),
	loggBrukerFulgteRedirectlenkeMedSøk: jest.fn(),
	loggMineSakerFilter: jest.fn(),
	MineSakerFilterKategorier: {
		ARKIVERTE_SAKER: "ARKIVERTE_SAKER",
		STATUS: "STATUS",
		ORGSØK: "ORGSØK",
		KNYTNING: "KNYTNING",
	},
}));

// Mock react-router-dom useLocation
jest.mock("react-router-dom", () => ({
	...jest.requireActual("react-router-dom"),
	useLocation: jest.fn(() => ({ state: null })),
}));

// Mock filter component (complex dependencies)
jest.mock("../../../src/Pages/MineSaker/Filter/FiltreringMineSaker", () => ({
	__esModule: true,
	default: ({ setFiltre }: { setFiltre: { setStatusFilter: (val: IAProsessStatusType[]) => void; setSøkFilter: (val: string) => void; setEierFølgerFilter: (val: string[]) => void } }) => (
		<div data-testid="filtrering-minesaker">
			<button onClick={() => setFiltre.setStatusFilter(["VI_BISTÅR"])}>
				Filtrer VI_BISTÅR
			</button>
			<button onClick={() => setFiltre.setSøkFilter("Bedrift A")}>
				Søk Bedrift A
			</button>
			<button onClick={() => setFiltre.setEierFølgerFilter(["eier"])}>
				Filtrer eier
			</button>
		</div>
	),
}));

// Mock MineSakerKort
jest.mock("../../../src/Pages/MineSaker/MineSakerKort", () => ({
	MineSakerKort: ({ orgnavn, iaSak }: { orgnavn: string; iaSak: { saksnummer: string } }) => (
		<div data-testid={`sak-kort-${iaSak.saksnummer}`}>{orgnavn}</div>
	),
}));

describe("EIER_FØLGER_FILTER_VALUES", () => {
	test("inneholder eier og følger", () => {
		expect(EIER_FØLGER_FILTER_VALUES).toContain("eier");
		expect(EIER_FØLGER_FILTER_VALUES).toContain("følger");
		expect(EIER_FØLGER_FILTER_VALUES).toHaveLength(2);
	});
});

describe("MineSakerside", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("rendrer overskrift 'Mine virksomheter'", () => {
		render(
			<BrowserRouter>
				<MineSakerside />
			</BrowserRouter>
		);
		expect(
			screen.getByRole("heading", { name: /Mine virksomheter/i })
		).toBeInTheDocument();
	});

	test("viser sakskort for hver sak som ikke er arkivert", () => {
		render(
			<BrowserRouter>
				<MineSakerside />
			</BrowserRouter>
		);
		// FULLFØRT er en arkivstatus, så den skal ikke vises som default
		expect(screen.getByTestId("sak-kort-SAK-1")).toBeInTheDocument();
		expect(screen.getByTestId("sak-kort-SAK-2")).toBeInTheDocument();
	});

	test("viser 'Fant ingen saker' når liste er tom", () => {
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const { useHentMineSaker } = require("../../../src/api/lydia-api/sak");
		useHentMineSaker.mockReturnValueOnce({ data: [] });

		render(
			<BrowserRouter>
				<MineSakerside />
			</BrowserRouter>
		);
		expect(screen.getByText(/Fant ingen saker/i)).toBeInTheDocument();
	});

	test("filtrerer saker basert på statusfilter", () => {
		render(
			<BrowserRouter>
				<MineSakerside />
			</BrowserRouter>
		);

		// Klikk på filtreringsknappen for VI_BISTÅR
		fireEvent.click(screen.getByText("Filtrer VI_BISTÅR"));

		// Bare sak med VI_BISTÅR status skal vises
		expect(screen.getByTestId("sak-kort-SAK-1")).toBeInTheDocument();
		expect(screen.queryByTestId("sak-kort-SAK-2")).not.toBeInTheDocument();
	});

	test("filtrerer saker basert på søkefilter", () => {
		render(
			<BrowserRouter>
				<MineSakerside />
			</BrowserRouter>
		);

		fireEvent.click(screen.getByText("Søk Bedrift A"));

		expect(screen.getByTestId("sak-kort-SAK-1")).toBeInTheDocument();
		expect(screen.queryByTestId("sak-kort-SAK-2")).not.toBeInTheDocument();
	});

	test("rendrer sorteringsknapper", () => {
		render(
			<BrowserRouter>
				<MineSakerside />
			</BrowserRouter>
		);
		expect(
			screen.getByRole("button", { name: /Alfabetisk rekkefølge/i })
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /Sist endret/i })
		).toBeInTheDocument();
	});

	test("rendrer filtreringskomponent", () => {
		render(
			<BrowserRouter>
				<MineSakerside />
			</BrowserRouter>
		);
		expect(screen.getByTestId("filtrering-minesaker")).toBeInTheDocument();
	});
});

describe("Sorteringsknapper", () => {
	const mockOnSortChange = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("rendrer knapper for alfabetisk og dato-sortering", () => {
		render(<Sorteringsknapper onSortChange={mockOnSortChange} />);
		expect(
			screen.getByRole("button", { name: /Alfabetisk rekkefølge/i })
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /Sist endret/i })
		).toBeInTheDocument();
	});

	test("kaller onSortChange med date og false ved mount", () => {
		render(<Sorteringsknapper onSortChange={mockOnSortChange} />);
		expect(mockOnSortChange).toHaveBeenCalledWith("date", false);
	});

	test("bytter til alfabetisk sortering når knappen klikkes", () => {
		render(<Sorteringsknapper onSortChange={mockOnSortChange} />);
		fireEvent.click(
			screen.getByRole("button", { name: /Alfabetisk rekkefølge/i })
		);
		expect(mockOnSortChange).toHaveBeenCalledWith("alphabetical", false);
	});

	test("toggle stigende/synkende ved gjentatt klikk på samme sortering", () => {
		render(<Sorteringsknapper onSortChange={mockOnSortChange} />);

		// Første klikk på date - bytter til ascending
		fireEvent.click(screen.getByRole("button", { name: /Sist endret/i }));
		expect(mockOnSortChange).toHaveBeenCalledWith("date", true);

		// Andre klikk på date - tilbake til descending
		fireEvent.click(screen.getByRole("button", { name: /Sist endret/i }));
		expect(mockOnSortChange).toHaveBeenCalledWith("date", false);
	});
});

describe("loggMineSakerFilterEndringMedAnalytics", () => {
	const mockLoggMineSakerFilter = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const analytics = require("../../../src/util/analytics-klient");
		analytics.loggMineSakerFilter = mockLoggMineSakerFilter;
	});

	test("logger STATUS når statusfilter er satt til ikke-arkivstatus", () => {
		loggMineSakerFilterEndringMedAnalytics(["VI_BISTÅR"], "", []);
		expect(mockLoggMineSakerFilter).toHaveBeenCalledWith([
			MineSakerFilterKategorier.STATUS,
		]);
	});

	test("logger ARKIVERTE_SAKER når statusfilter inkluderer arkivstatus", () => {
		loggMineSakerFilterEndringMedAnalytics(["FULLFØRT"], "", []);
		expect(mockLoggMineSakerFilter).toHaveBeenCalledWith([
			MineSakerFilterKategorier.ARKIVERTE_SAKER,
		]);
	});

	test("logger ORGSØK når søkefilter er satt", () => {
		loggMineSakerFilterEndringMedAnalytics([], "test", []);
		expect(mockLoggMineSakerFilter).toHaveBeenCalledWith([
			MineSakerFilterKategorier.ORGSØK,
		]);
	});

	test("logger KNYTNING når eier/følger-filter er satt", () => {
		loggMineSakerFilterEndringMedAnalytics([], "", ["eier"]);
		expect(mockLoggMineSakerFilter).toHaveBeenCalledWith([
			MineSakerFilterKategorier.KNYTNING,
		]);
	});

	test("logger flere kategorier når flere filtre er aktive", () => {
		loggMineSakerFilterEndringMedAnalytics(["VI_BISTÅR"], "test", ["eier"]);
		expect(mockLoggMineSakerFilter).toHaveBeenCalledWith(
			expect.arrayContaining([
				MineSakerFilterKategorier.STATUS,
				MineSakerFilterKategorier.ORGSØK,
				MineSakerFilterKategorier.KNYTNING,
			])
		);
	});

	test("logger tom array når ingen filtre er aktive", () => {
		loggMineSakerFilterEndringMedAnalytics([], "", []);
		expect(mockLoggMineSakerFilter).toHaveBeenCalledWith([]);
	});
});
