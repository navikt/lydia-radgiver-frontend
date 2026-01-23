import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Statistikkboks } from "../../../../src/Pages/Virksomhet/Statistikk/Statistikkboks";
import { formaterProsent } from "../../../../src/Pages/Virksomhet/Statistikk/Tabell/tabell-utils";

describe("Statistikkboks", () => {
    test("rendrer tittel", () => {
        render(
            <Statistikkboks
                tittel="Test tittel"
                helpTekst="Hjelpetekst"
                verdi="123"
            />,
        );
        expect(screen.getByText("Test tittel")).toBeInTheDocument();
    });

    test("rendrer verdi", () => {
        render(
            <Statistikkboks
                tittel="Test"
                helpTekst="Hjelpetekst"
                verdi="456"
            />,
        );
        expect(screen.getByText("456")).toBeInTheDocument();
    });

    test("rendrer helptext-knapp", () => {
        render(
            <Statistikkboks
                tittel="Test"
                helpTekst="Dette er hjelpetekst"
                verdi="789"
            />,
        );
        expect(
            screen.getByRole("button", { name: /Hvor kommer dette fra?/i }),
        ).toBeInTheDocument();
    });

    test("rendrer verdiSisteKvartal når den er oppgitt", () => {
        render(
            <Statistikkboks
                tittel="Test"
                helpTekst="Hjelpetekst"
                verdi="100"
                verdiSisteKvartal={{
                    verdi: "25",
                    år: 2024,
                    kvartal: 3,
                }}
            />,
        );
        expect(screen.getByText(/25 i 3. kvartal 2024/)).toBeInTheDocument();
    });

    test("skjuler verdiSisteKvartal når den ikke er oppgitt", () => {
        const { container } = render(
            <Statistikkboks
                tittel="Test"
                helpTekst="Hjelpetekst"
                verdi="100"
            />,
        );
        const hiddenElement = container.querySelector(".hidden");
        expect(hiddenElement).toBeInTheDocument();
    });

    test("bruker dt/dd elementer for semantisk markup", () => {
        const { container } = render(
            <Statistikkboks
                tittel="Arbeidsforhold"
                helpTekst="Antall arbeidsforhold"
                verdi="50"
            />,
        );
        expect(container.querySelector("dt")).toBeInTheDocument();
        expect(container.querySelectorAll("dd")).toHaveLength(2);
    });
});

describe("formaterProsent", () => {
    test("returnerer *** når prosent er maskert", () => {
        const result = formaterProsent({ erMaskert: true, prosent: 5.5 });
        expect(result).toBe("***");
    });

    test("returnerer tom streng når prosent er undefined", () => {
        const result = formaterProsent(undefined);
        expect(result).toBe("");
    });

    test("returnerer formatert prosent med komma", () => {
        const result = formaterProsent({ erMaskert: false, prosent: 5.5 });
        expect(result).toBe("5,5 %");
    });

    test("returnerer prosent uten desimaler", () => {
        const result = formaterProsent({ erMaskert: false, prosent: 10 });
        expect(result).toBe("10 %");
    });

    test("håndterer 0 prosent", () => {
        const result = formaterProsent({ erMaskert: false, prosent: 0 });
        expect(result).toBe("0 %");
    });

    test("returnerer tom streng når prosent.prosent er undefined", () => {
        const result = formaterProsent({
            erMaskert: false,
            prosent: undefined as unknown as number,
        });
        expect(result).toBe("");
    });
});
