import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { act } from "react";

import { useDebounce } from "../../src/util/useDebounce";

function TestKomponent({ value, delay }: { value: string; delay: number }) {
	const debounced = useDebounce(value, delay);

	return <div data-testid="debounced-verdi">{debounced}</div>;
}

describe("useDebounce", () => {
	test("venter med å oppdatere verdien til etter forsinkelse", () => {
		jest.useFakeTimers();

		const { rerender } = render(<TestKomponent value="a" delay={200} />);

		expect(screen.getByTestId("debounced-verdi")).toHaveTextContent("a");

		rerender(<TestKomponent value="b" delay={200} />);
		rerender(<TestKomponent value="c" delay={200} />);

		act(() => {
			jest.advanceTimersByTime(199);
		});

		expect(screen.getByTestId("debounced-verdi")).toHaveTextContent("a");

		act(() => {
			jest.advanceTimersByTime(1);
		});

		expect(screen.getByTestId("debounced-verdi")).toHaveTextContent("c");

		jest.useRealTimers();
	});
});
