import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';

import { Virksomhetsside } from '../../../../src/Pages/Virksomhet/Virksomhetsside';
import { BrowserRouter, useParams, useSearchParams } from 'react-router-dom';
import {
	dummyIaSak,
	dummyPubliseringsinfo,
	dummySakshistorikk,
	dummySamarbeid,
	dummyVirksomhetsinformasjon,
	dummyNæringsstatistikk,
	dummySykefraværsstatistikkSiste4Kvartal,
	dummyVirksomhetsstatistikkSiste4Kvartal
} from '../../../../__mocks__/virksomhetsMockData';
import { dummySpørreundersøkelseliste } from '../../../../__mocks__/spørreundersøkelseDummyData';
import { brukerMedGyldigToken, brukerMedLesetilgang } from '../../../../src/Pages/Prioritering/mocks/innloggetAnsattMock';
import { useHentBrukerinformasjon } from '../../../../src/api/lydia-api/bruker';
import { useHarPlan } from '../../../../src/api/lydia-api/plan';
import { useHentSamarbeid } from '../../../../src/api/lydia-api/spørreundersøkelse';

jest.mock('../../../../src/api/lydia-api/virksomhet', () => {
	return {
		...jest.requireActual('../../../../src/api/lydia-api/virksomhet'),
		useHentVirksomhetsinformasjon: jest.fn(() => {
			return {
				data: dummyVirksomhetsinformasjon,
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

jest.mock('../../../../src/api/lydia-api/plan', () => {
	return {
		...jest.requireActual('../../../../src/api/lydia-api/plan'),
		useHarPlan: jest.fn(() => {
			return {
				harPlan: true,
				lastet: true,
			};
		}),
	};
});

jest.mock('../../../../src/api/lydia-api/spørreundersøkelse', () => {
	return {
		...jest.requireActual('../../../../src/api/lydia-api/spørreundersøkelse'),
		useHentSamarbeid: jest.fn(() => {
			return {
				data: dummySamarbeid,
				loading: false,
				validating: false,
			};
		}),
		useSpørreundersøkelsesliste: jest.fn(() => {
			return {
				data: dummySpørreundersøkelseliste,
				loading: false,
				validating: false,
				mutate: jest.fn(),
			};
		}),
	};
});

jest.mock('../../../../src/api/lydia-api/bruker', () => {
	return {
		...jest.requireActual('../../../../src/api/lydia-api/bruker'),
		useHentBrukerinformasjon: jest.fn(() => {
			return {
				data: brukerMedGyldigToken,
				loading: false,
			};
		}),
	};
});

jest.mock('../../../../src/api/lydia-api/team', () => {
	return {
		...jest.requireActual('../../../../src/api/lydia-api/team'),
		useHentTeam: jest.fn(() => {
			return {
				data: [brukerMedGyldigToken.ident, brukerMedLesetilgang.ident],
				loading: false,
			};
		}),
	};
});

jest.mock('react-router-dom', () => {
	const originalModule = jest.requireActual('react-router-dom');
	return {
		...originalModule,
		useParams: jest.fn(() => ({
			orgnummer: '840623927',
		})),
		useSearchParams: jest.fn(() => {
			const setSearchParams = jest.fn();
			return [new URLSearchParams(), setSearchParams];
		}),
	};
});


describe('Virksomhetsside', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('Rendrer korrekt', () => {
		render(
			<BrowserRouter>
				<Virksomhetsside />
			</BrowserRouter>
		);
		expect(screen.getByText('Samarbeid (8)')).toBeInTheDocument();
	});

	describe('Kartlegging', () => {
		beforeEach(() => {
			const searchParamsSet = jest.fn();
			jest.mocked(useSearchParams).mockReturnValue([new URLSearchParams({ fane: "kartlegging" }), searchParamsSet]);
			jest.mocked(useParams).mockReturnValue({ orgnummer: '840623927', prosessId: dummySamarbeid[1].id.toString() });
		});

		it("Hamburgermeny har riktig innhold", async () => {
			render(
				<BrowserRouter>
					<Virksomhetsside />
				</BrowserRouter>
			);

			const samarbeidsknapp = screen.getByRole('link', { name: dummySamarbeid[1].navn as string });
			expect(samarbeidsknapp).toBeInTheDocument();
			samarbeidsknapp.click();

			const faneKnapp = screen.getByRole('tab', { name: 'Kartlegginger' });
			expect(faneKnapp).toBeInTheDocument();
			faneKnapp.click();

			const hamburgermeny = screen.getByRole('button', { name: 'Meny' });
			expect(hamburgermeny).toBeInTheDocument();
			hamburgermeny.click();

			expect(await screen.findAllByRole('menuitem', { name: 'Brukerveileder' })).toHaveLength(2);
			expect(screen.getByRole('menuitem', { name: 'Invitasjonsmal' })).toBeInTheDocument();
			expect(screen.getByRole('menuitem', { name: 'Tips og råd til gjennomføring' })).toBeInTheDocument();
			expect(await screen.findAllByRole('menuitem', { name: 'IA-veileder' })).toHaveLength(2);
		});

		it("Gir 'administrer'-knapp for vanlig bruker", () => {
			render(
				<BrowserRouter>
					<Virksomhetsside />
				</BrowserRouter>
			);

			const samarbeidsknapp = screen.getByRole('link', { name: dummySamarbeid[1].navn as string });
			expect(samarbeidsknapp).toBeInTheDocument();
			samarbeidsknapp.click();

			const faneKnapp = screen.getByRole('tab', { name: 'Kartlegginger' });
			expect(faneKnapp).toBeInTheDocument();
			faneKnapp.click();

			expect(screen.getByRole('button', { name: 'Administrer' })).toBeInTheDocument();
		});

		it("Gir knapp for ny evaluering hvis det finnes en plan", () => {
			render(
				<BrowserRouter>
					<Virksomhetsside />
				</BrowserRouter>
			);

			const samarbeidsknapp = screen.getByRole('link', { name: dummySamarbeid[1].navn as string });
			expect(samarbeidsknapp).toBeInTheDocument();
			samarbeidsknapp.click();

			const faneKnapp = screen.getByRole('tab', { name: 'Kartlegginger' });
			expect(faneKnapp).toBeInTheDocument();
			faneKnapp.click();

			const nyEvalueringKnapp = screen.getByRole('button', { name: 'Ny evaluering' });
			expect(nyEvalueringKnapp).toBeInTheDocument();
			waitFor(() => expect(nyEvalueringKnapp).toBeEnabled());
		});

		it("Gir ikke knapp for ny evaluering hvis det ikke finnes noen plan", () => {
			jest.mocked(useHarPlan).mockReturnValue({ harPlan: false, lastet: true });
			render(
				<BrowserRouter>
					<Virksomhetsside />
				</BrowserRouter>
			);

			const samarbeidsknapp = screen.getByRole('link', { name: dummySamarbeid[1].navn as string });
			expect(samarbeidsknapp).toBeInTheDocument();
			samarbeidsknapp.click();

			const faneKnapp = screen.getByRole('tab', { name: 'Kartlegginger' });
			expect(faneKnapp).toBeInTheDocument();
			faneKnapp.click();

			const nyEvalueringKnapp = screen.queryByRole('button', { name: 'Ny evaluering' });
			expect(nyEvalueringKnapp).toBeInTheDocument();
			waitFor(() => expect(nyEvalueringKnapp).toBeDisabled());
		});
		it.todo("Gir alltid knapp for ny behobsvurdering");

		describe('Lesebruker', () => {
			beforeEach(() => {
				jest.mocked(useHentBrukerinformasjon).mockReturnValue({
					data: brukerMedLesetilgang,
					loading: false,
					error: undefined,
					mutate: jest.fn(),
					validating: false,
				});
			});

			it("Gir ikke 'ny'-knapper for lesebruker", () => {
				render(
					<BrowserRouter>
						<Virksomhetsside />
					</BrowserRouter>
				);

				const samarbeidsknapp = screen.getByRole('link', { name: dummySamarbeid[1].navn as string });
				expect(samarbeidsknapp).toBeInTheDocument();
				samarbeidsknapp.click();

				const faneKnapp = screen.getByRole('tab', { name: 'Kartlegginger' });
				expect(faneKnapp).toBeInTheDocument();
				faneKnapp.click();

				expect(screen.getByRole('button', { name: 'Ny behovsvurdering' })).toBeDisabled();
				expect(screen.getByRole('button', { name: 'Ny evaluering' })).toBeDisabled();
			});

			it("Gir ikke 'administrer'-knapp for lesebruker", () => {
				render(
					<BrowserRouter>
						<Virksomhetsside />
					</BrowserRouter>
				);

				const samarbeidsknapp = screen.getByRole('link', { name: dummySamarbeid[1].navn as string });
				expect(samarbeidsknapp).toBeInTheDocument();
				samarbeidsknapp.click();

				const faneKnapp = screen.getByRole('tab', { name: 'Kartlegginger' });
				expect(faneKnapp).toBeInTheDocument();
				faneKnapp.click();

				expect(screen.queryByRole('button', { name: 'Administrer' })).not.toBeInTheDocument();
			});
		});

		describe('Avsluttet samarbeid', () => {
			beforeEach(() => {
				jest.mocked(useHentSamarbeid).mockReturnValue({
					data: [{ ...dummySamarbeid[1], status: 'FULLFØRT' }],
					loading: false,
					validating: false,
					mutate: jest.fn(),
					error: undefined,
				});
			});
			it("Gir ikke 'administrer'-knapp på avsluttet samarbeid", () => {
				render(
					<BrowserRouter>
						<Virksomhetsside />
					</BrowserRouter>
				);

				expect(screen.getAllByText(dummySamarbeid[1].navn as string, { exact: false }).filter(el => el.className === "title")).toHaveLength(0);
				const samarbeidsknapp = screen.getByRole('link', { name: `${dummySamarbeid[1].navn} Fullført` });
				expect(samarbeidsknapp).toBeInTheDocument();
				samarbeidsknapp.click();
				waitFor(() => expect(screen.getAllByText(dummySamarbeid[1].navn as string, { exact: false }).filter(el => el.className === "title")).toHaveLength(1)); // En i knappen

				const faneKnapp = screen.getByRole('tab', { name: 'Kartlegginger' });
				expect(faneKnapp).toBeInTheDocument();
				faneKnapp.click();

				expect(screen.queryByRole('button', { name: 'Administrer' })).not.toBeInTheDocument();
			});

			it("Gir ikke knapp for ny evaluering selv om det finnes en plan", () => {
				render(
					<BrowserRouter>
						<Virksomhetsside />
					</BrowserRouter>
				);

				const samarbeidsknapp = screen.getByRole('link', { name: `${dummySamarbeid[1].navn} Fullført` });
				expect(samarbeidsknapp).toBeInTheDocument();
				samarbeidsknapp.click();

				const faneKnapp = screen.getByRole('tab', { name: 'Kartlegginger' });
				expect(faneKnapp).toBeInTheDocument();
				faneKnapp.click();

				expect(screen.queryByRole('button', { name: 'Ny evaluering' })).not.toBeInTheDocument();
			});
		});
	});


	it.failing('Har ingen accessibilityfeil', async () => {
		const { container } = render(
			<BrowserRouter>
				<Virksomhetsside />
			</BrowserRouter>
		);
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});
});