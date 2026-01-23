import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { useTittel } from "../../src/util/useTittel";

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

describe("lagSidetittel og erIDev", () => {
    test("lagSidetittel uten DEV-prefix når erIDev=false", async () => {
        const lagSidetittel = await loadLagSidetittel(false);
        expect(lagSidetittel("søk")).toBe("Fia - søk");
    });

    test("lagSidetittel med DEV-prefix når erIDev=true", async () => {
        const lagSidetittel = await loadLagSidetittel(true);
        expect(lagSidetittel("søk")).toBe("Fia - DEV - søk");
    });
});

function TestTittelKomponent({ defaultTittel }: { defaultTittel: string }) {
    const { oppdaterTittel } = useTittel(defaultTittel);

    return (
        <button
            data-testid="oppdater-tittel-knapp"
            onClick={() => oppdaterTittel("Ny tittel")}
        >
            Oppdater tittel
        </button>
    );
}

describe("useTittel", () => {
    test("setter document.title til defaultTittel ved mount", () => {
        render(<TestTittelKomponent defaultTittel="Starttittel" />);

        expect(document.title).toBe("Starttittel");
    });

    test("oppdaterTittel oppdaterer document.title", () => {
        render(<TestTittelKomponent defaultTittel="Starttittel" />);

        fireEvent.click(screen.getByTestId("oppdater-tittel-knapp"));

        expect(document.title).toBe("Ny tittel");
    });
});
