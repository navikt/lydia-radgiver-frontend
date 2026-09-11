/** @jest-environment jsdom */

import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe } from "jest-axe";

import Nyheter from "./Nyheter";
import { lokalDato } from "../../util/dato";
import type { NyheterInnhold } from "../../Pages/Nyheter/Nyhetsdata";

const NÅ = new Date("2026-09-11T12:00:00Z");

let testnyheter: NyheterInnhold[] = [];

jest.mock("../../Pages/Nyheter/Nyhetsdata", () => ({
    get FILTRERT_SORTERT_NYHETSLISTE() {
        return testnyheter;
    },
}));

function nyhet(overstyringer: Partial<NyheterInnhold> = {}): NyheterInnhold {
    return {
        id: 1,
        tittel: "En nyhet",
        ingress: "Ingress for nyheten",
        dato: NÅ,
        ...overstyringer,
    };
}

function dagerSiden(dager: number) {
    return new Date(NÅ.getTime() - dager * 24 * 60 * 60 * 1000);
}

beforeEach(() => {
    jest.useFakeTimers({ doNotFake: ["queueMicrotask"] });
    jest.setSystemTime(NÅ);
});

afterEach(() => {
    jest.useRealTimers();
    testnyheter = [];
});

describe("Nyhetsvarsel i dekoratøren", () => {
    test("rendrer ingenting når det ikke finnes nyheter", () => {
        const { container } = render(<Nyheter />);

        expect(container).toBeEmptyDOMElement();
    });

    test("varsler om uleste nyheter når nyeste nyhet er under en uke gammel", () => {
        testnyheter = [
            nyhet({ id: 2, dato: dagerSiden(2) }),
            nyhet({ id: 1, dato: dagerSiden(100) }),
        ];

        render(<Nyheter />);

        expect(screen.getByTitle("Uleste nyheter")).toBeInTheDocument();
    });

    test("varsler ikke når nyeste nyhet er eldre enn en uke", () => {
        testnyheter = [
            nyhet({ id: 2, dato: dagerSiden(8) }),
            nyhet({ id: 1, dato: dagerSiden(100) }),
        ];

        render(<Nyheter />);

        expect(screen.getByTitle("Ingen uleste nyheter")).toBeInTheDocument();
    });

    test("viser nyhetene med lenke, dato og ingress når menyen åpnes", () => {
        const nyestMedKortIngress = nyhet({
            id: 2,
            tittel: "Nyeste nyhet",
            ingress: "Lang ingress",
            shortIngress: "Kort ingress",
            dato: dagerSiden(1),
        });
        const eldstUtenKortIngress = nyhet({
            id: 1,
            tittel: "Eldste nyhet",
            ingress: "Ingress for eldste nyhet",
            dato: dagerSiden(30),
        });
        testnyheter = [nyestMedKortIngress, eldstUtenKortIngress];

        render(<Nyheter />);
        fireEvent.click(screen.getByRole("button"));

        expect(
            screen.getByRole("menuitem", { name: /Nyeste nyhet/ }),
        ).toHaveAttribute("href", "/nyheter/2");
        expect(
            screen.getByRole("menuitem", { name: /Eldste nyhet/ }),
        ).toHaveAttribute("href", "/nyheter/1");

        expect(screen.getByText("Kort ingress")).toBeInTheDocument();
        expect(screen.queryByText("Lang ingress")).not.toBeInTheDocument();
        expect(
            screen.getByText(eldstUtenKortIngress.ingress),
        ).toBeInTheDocument();

        expect(
            screen.getByText(lokalDato(nyestMedKortIngress.dato)),
        ).toBeInTheDocument();
    });

    test("har ingen accessibilityfeil", async () => {
        testnyheter = [nyhet({ dato: dagerSiden(1) })];

        const { container } = render(<Nyheter />);
        jest.useRealTimers(); // axe henger på fake timers

        expect(await axe(container)).toHaveNoViolations();
    });
});
