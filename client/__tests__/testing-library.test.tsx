import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

const mockfunc = jest.fn();

function Testkomponent({ lagAxeFeil = false }: { lagAxeFeil?: boolean }) {
	return (
		<div>
			<div>Dette er en testkomponent. Testing-library burde kunne finne tekstinnholdet.</div>
			<button onClick={mockfunc}>Klikk meg</button>
			{/* eslint-disable-next-line jsx-a11y/alt-text */}
			{lagAxeFeil && <img src="#" />}
		</div>
	);
}

describe('Testkomponent', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('Rendrer korrekt', () => {
		render(<Testkomponent />);
		expect(screen.getByText('Dette er en testkomponent.', { exact: false })).toBeInTheDocument();
	});

	it('Testing av mockfunksjoner', () => {
		render(<Testkomponent />);

		expect(mockfunc).not.toHaveBeenCalled();

		const button = screen.getByText('Klikk meg');
		button.click();

		expect(mockfunc).toHaveBeenCalled();
	});

	it('Mocks cleares mellom tester (krever at du kjører alle tester)', () => {
		render(<Testkomponent />);

		expect(mockfunc).not.toHaveBeenCalled();

		const button = screen.getByText('Klikk meg');
		button.click();

		expect(mockfunc).toHaveBeenCalled();
	});

	it("Fanger opp axe-feil", async () => {
		const { container } = render(<Testkomponent lagAxeFeil />);
		const results = await axe(container);
		expect(results).not.toHaveNoViolations();
	});

	it("Gir ikke axe-feil når komponenten er korrekt", async () => {
		const { container } = render(<Testkomponent />);
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});
});