import React from "react";
import { renderHook } from "@testing-library/react";

import VirksomhetContext, {
	useErPåAktivSak,
	useErPåInaktivSak,
	useVirksomhetContext,
	type VirksomhetContextType,
} from "../../src/Pages/Virksomhet/VirksomhetContext";
import {
	dummyIaSak,
	dummyVirksomhetsinformasjon,
} from "../../__mocks__/virksomhetsMockData";

function wrapperWithContext(value: Partial<VirksomhetContextType> = {}) {
	const defaultValue: VirksomhetContextType = {
		virksomhet: dummyVirksomhetsinformasjon,
		iaSak: dummyIaSak,
		lasterIaSak: false,
		fane: "oversikt",
		setFane: () => undefined,
		spørreundersøkelseId: null,
	};

	const Wrapper = ({ children }: { children: React.ReactNode }) => (
		<VirksomhetContext.Provider value={{ ...defaultValue, ...value }}>
			{children}
		</VirksomhetContext.Provider>
	);
	return Wrapper;
}

describe("useVirksomhetContext", () => {
	test("kaster feil uten provider", () => {
		expect(() => renderHook(() => useVirksomhetContext())).toThrow(
			"useVirksomhetContext må brukes innenfor en VirksomhetContextProvider",
		);
	});

	test("returnerer context når provider er satt", () => {
		const { result } = renderHook(() => useVirksomhetContext(), {
			wrapper: wrapperWithContext(),
		});

		expect(result.current.virksomhet).toBe(dummyVirksomhetsinformasjon);
		expect(result.current.iaSak).toBe(dummyIaSak);
	});
});

describe("useErPåAktivSak", () => {
	test("returnerer true når saksnummer matcher aktivt saksnummer", () => {
		const { result } = renderHook(() => useErPåAktivSak(), {
			wrapper: wrapperWithContext(),
		});

		expect(result.current).toBe(true);
	});

	test("returnerer false når saksnummer ikke matcher", () => {
		const { result } = renderHook(
			() => useErPåAktivSak(),
			{
				wrapper: wrapperWithContext({
					iaSak: { ...dummyIaSak, saksnummer: "annet" },
				}),
			},
		);

		expect(result.current).toBe(false);
	});

	test("returnerer false når context mangler", () => {
		const { result } = renderHook(() => useErPåAktivSak());

		expect(result.current).toBe(false);
	});
});

describe("useErPåInaktivSak", () => {
	test("returnerer true når saksnummer er ulikt aktivt saksnummer", () => {
		const { result } = renderHook(
			() => useErPåInaktivSak(),
			{
				wrapper: wrapperWithContext({
					iaSak: { ...dummyIaSak, saksnummer: "annet" },
				}),
			},
		);

		expect(result.current).toBe(true);
	});

	test("returnerer false når saksnummer er likt aktivt saksnummer", () => {
		const { result } = renderHook(() => useErPåInaktivSak(), {
			wrapper: wrapperWithContext(),
		});

		expect(result.current).toBe(false);
	});

	test("kaster feil når context mangler", () => {
		expect(() => renderHook(() => useErPåInaktivSak())).toThrow(
			"useVirksomhetContext må brukes innenfor en VirksomhetContextProvider",
		);
	});
});
