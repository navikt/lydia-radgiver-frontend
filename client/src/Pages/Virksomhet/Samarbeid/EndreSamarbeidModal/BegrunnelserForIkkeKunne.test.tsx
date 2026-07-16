import { render, screen, renderHook } from "@testing-library/react";
import "@testing-library/jest-dom";
import BegrunnelserForIkkeKunne, {
    usePrettyType,
} from "./BegrunnelserForIkkeKunne";
import { KanIkkeGjennomføreBegrunnelse } from "../../../../domenetyper/samarbeidsEndring";

describe("usePrettyType hook", () => {
    test("returnerer riktig tekst for fullfores", () => {
        const { result } = renderHook(() => usePrettyType("fullfores"));
        expect(result.current.capitalized).toBe("Fullfør");
        expect(result.current.uncapitalized).toBe("fullfør");
    });

    test("returnerer riktig tekst for slettes", () => {
        const { result } = renderHook(() => usePrettyType("slettes"));
        expect(result.current.capitalized).toBe("Slett");
        expect(result.current.uncapitalized).toBe("slett");
    });

    test("returnerer riktig tekst for avbrytes", () => {
        const { result } = renderHook(() => usePrettyType("avbrytes"));
        expect(result.current.capitalized).toBe("Avbryt");
        expect(result.current.uncapitalized).toBe("avbryt");
    });
});

describe("BegrunnelserForIkkeKunne", () => {
    test("returnerer null når begrunnelser er undefined", () => {
        const { container } = render(
            <BegrunnelserForIkkeKunne
                begrunnelser={undefined}
                type="fullfores"
            />,
        );
        expect(container.firstChild).toBeNull();
    });

    test("returnerer null når begrunnelser er tom liste", () => {
        const { container } = render(
            <BegrunnelserForIkkeKunne begrunnelser={[]} type="fullfores" />,
        );
        expect(container.firstChild).toBeNull();
    });

    test("viser blokkerende alert med error variant", () => {
        render(
            <BegrunnelserForIkkeKunne
                begrunnelser={["FINNES_BEHOVSVURDERING"]}
                type="fullfores"
                blokkerende={true}
            />,
        );
        expect(
            screen.getByText(/Samarbeidet kan ikke fullføres:/i),
        ).toBeInTheDocument();
    });

    test("viser advarsel alert med warning variant", () => {
        render(
            <BegrunnelserForIkkeKunne
                begrunnelser={["INGEN_EVALUERING"]}
                type="fullfores"
                blokkerende={false}
            />,
        );
        expect(
            screen.getByText(/Er du sikker på at du ønsker å fullføre?/i),
        ).toBeInTheDocument();
    });

    test("mapper begrunnelse FINNES_SALESFORCE_AKTIVITET korrekt", () => {
        render(
            <BegrunnelserForIkkeKunne
                begrunnelser={["FINNES_SALESFORCE_AKTIVITET"]}
                type="slettes"
                blokkerende={true}
            />,
        );
        expect(
            screen.getByText("Aktiviteter i Salesforce"),
        ).toBeInTheDocument();
    });

    test("mapper begrunnelse FINNES_BEHOVSVURDERING korrekt", () => {
        render(
            <BegrunnelserForIkkeKunne
                begrunnelser={["FINNES_BEHOVSVURDERING"]}
                type="slettes"
                blokkerende={true}
            />,
        );
        expect(
            screen.getByText("Det en påbegynt behovsvurdering"),
        ).toBeInTheDocument();
    });

    test("mapper begrunnelse FINNES_SAMARBEIDSPLAN korrekt", () => {
        render(
            <BegrunnelserForIkkeKunne
                begrunnelser={["FINNES_SAMARBEIDSPLAN"]}
                type="slettes"
                blokkerende={true}
            />,
        );
        expect(screen.getByText("Aktiv samarbeidsplan")).toBeInTheDocument();
    });

    test("mapper begrunnelse INGEN_EVALUERING korrekt", () => {
        render(
            <BegrunnelserForIkkeKunne
                begrunnelser={["INGEN_EVALUERING"]}
                type="fullfores"
            />,
        );
        expect(
            screen.getByText(
                "Det er ikke gjennomført evaluering, vil du fortsatt fullføre?",
            ),
        ).toBeInTheDocument();
    });

    test("mapper begrunnelse SAK_I_FEIL_STATUS korrekt", () => {
        render(
            <BegrunnelserForIkkeKunne
                begrunnelser={["SAK_I_FEIL_STATUS"]}
                type="fullfores"
                blokkerende={true}
            />,
        );
        expect(
            screen.getByText("Virksomheten må være aktiv"),
        ).toBeInTheDocument();
    });

    test("viser flere begrunnelser i liste", () => {
        const begrunnelser: KanIkkeGjennomføreBegrunnelse[] = [
            "FINNES_BEHOVSVURDERING",
            "FINNES_SAMARBEIDSPLAN",
        ];
        render(
            <BegrunnelserForIkkeKunne
                begrunnelser={begrunnelser}
                type="slettes"
                blokkerende={true}
            />,
        );
        expect(
            screen.getByText("Det en påbegynt behovsvurdering"),
        ).toBeInTheDocument();
        expect(screen.getByText("Aktiv samarbeidsplan")).toBeInTheDocument();
    });

    test("viser riktig tekst for avbryt-handling", () => {
        render(
            <BegrunnelserForIkkeKunne
                begrunnelser={["AKTIV_BEHOVSVURDERING"]}
                type="avbrytes"
                blokkerende={true}
            />,
        );
        expect(
            screen.getByText(/Samarbeidet kan ikke avbryti?es:/i),
        ).toBeInTheDocument();
    });
});
