import { prettyDOM, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';

import { Virksomhetsside } from '../../../../src/Pages/Virksomhet/Virksomhetsside';
import { BrowserRouter } from 'react-router-dom';
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