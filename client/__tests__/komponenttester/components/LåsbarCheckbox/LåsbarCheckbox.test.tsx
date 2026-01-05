/** @jest-environment jsdom */

import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import LåsbarCheckbox from "../../../../src/components/LåsbarCheckbox";

jest.mock("@navikt/aksel-icons", () => ({
	PadlockLockedIcon: ({ title }: { title?: string }) => (
		<span data-testid="padlock-icon">{title}</span>
	),
}));

jest.mock("@navikt/ds-react", () => ({
	...jest.requireActual("@navikt/ds-react"),
	Checkbox: ({
		children,
		value,
		onChange,
		readOnly,
		className,
	}: {
		children?: React.ReactNode;
		value?: string;
		onChange?: () => void;
		readOnly?: boolean;
		className?: string;
	}) => (
		<label className={className}>
			<input
				type="checkbox"
				value={value}
				onChange={readOnly ? undefined : onChange}
				readOnly={readOnly}
			/>
			{children}
		</label>
	),
	Tooltip: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}));

describe("LåsbarCheckbox", () => {
	test("kaller onChange når den ikke er låst", () => {
		const onChange = jest.fn();

		render(
			<LåsbarCheckbox låst={false} value="val" onChange={onChange}>
				Innhold
			</LåsbarCheckbox>,
		);

		const checkbox = screen.getByRole("checkbox");
		fireEvent.click(checkbox);

		expect(onChange).toHaveBeenCalled();
	});

	test("viser ikon når låst med tooltip", () => {
		render(
			<LåsbarCheckbox låst={true} value="val" tooltipText="Låst">
				Innhold
			</LåsbarCheckbox>,
		);

		const ikon = screen.getByTestId("padlock-icon");

		expect(ikon).toBeInTheDocument();
		expect(ikon).toHaveTextContent("rad er låst");
	});

	test("viser ikon når låst uten tooltip", () => {
		render(
			<LåsbarCheckbox låst={true} value="val">
				Innhold
			</LåsbarCheckbox>,
		);

		const ikon = screen.getByTestId("padlock-icon");

		expect(ikon).toBeInTheDocument();
	});
});
