describe("lagSidetittel og erIDev", () => {
	const loadLagSidetittel = async (erDev: boolean) => {
		jest.resetModules();
		jest.doMock("../../src/components/Dekoratør/Dekoratør", () => ({
			__esModule: true,
			erIDev: erDev,
			Dekoratør: () => null,
		}));

		const mod = await import("../../src/util/useTittel");
		return mod.lagSidetittel as (tittel: string) => string;
	};

	test("lagSidetittel uten DEV-prefix når erIDev=false", async () => {
		const lagSidetittel = await loadLagSidetittel(false);
		expect(lagSidetittel("søk")).toBe("Fia - søk");
	});

	test("lagSidetittel med DEV-prefix når erIDev=true", async () => {
		const lagSidetittel = await loadLagSidetittel(true);
		expect(lagSidetittel("søk")).toBe("Fia - DEV - søk");
	});
});
