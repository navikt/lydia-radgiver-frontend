import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import {
	muligeHandlinger,
	type MuligSamarbeidsgandling,
} from "../../src/domenetyper/samarbeidsEndring";
import { useBøyningerAvSamarbeidshandling } from "../../src/util/formatering/useBøyninger";

function TestKomponent({
	handling,
}: {
	handling: MuligSamarbeidsgandling;
}) {
	const bøyninger = useBøyningerAvSamarbeidshandling(handling);

	return (
		<div>
			<span data-testid="infinitiv">{bøyninger.infinitiv}</span>
			<span data-testid="imperativ">{bøyninger.imperativ}</span>
			<span data-testid="presensPerfektum">
				{bøyninger.presensPerfektum}
			</span>
		</div>
	);
}

describe("useBøyningerAvSamarbeidshandling", () => {
	test("gir riktige bøyninger for fullføres", () => {
		render(<TestKomponent handling={muligeHandlinger.enum.fullfores} />);

		expect(screen.getByTestId("infinitiv")).toHaveTextContent("fullføre");
		expect(screen.getByTestId("imperativ")).toHaveTextContent("fullfør");
		expect(screen.getByTestId("presensPerfektum")).toHaveTextContent(
			"fullført",
		);
	});

	test("gir riktige bøyninger for avbrytes", () => {
		render(<TestKomponent handling={muligeHandlinger.enum.avbrytes} />);

		expect(screen.getByTestId("infinitiv")).toHaveTextContent("avbryte");
		expect(screen.getByTestId("imperativ")).toHaveTextContent("avbryt");
		expect(screen.getByTestId("presensPerfektum")).toHaveTextContent(
			"avbrutt",
		);
	});

	test("gir riktige bøyninger for slettes", () => {
		render(<TestKomponent handling={muligeHandlinger.enum.slettes} />);

		expect(screen.getByTestId("infinitiv")).toHaveTextContent("slette");
		expect(screen.getByTestId("imperativ")).toHaveTextContent("slett");
		expect(screen.getByTestId("presensPerfektum")).toHaveTextContent(
			"slettet",
		);
	});
});
