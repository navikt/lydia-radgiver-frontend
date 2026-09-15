/** @jest-environment jsdom */

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe } from "jest-axe";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import Nyheter from "./";
import { lokalDato } from "../../util/dato";
import type { NyheterInnhold } from "./Nyhetsdata";

const testnyheter: NyheterInnhold[] = [
    {
        id: 3,
        tittel: "Nyeste nyhet",
        ingress: "Ingress for nyeste nyhet",
        shortIngress: "Kort ingress for nyeste nyhet",
        dato: new Date("2026-08-10"),
    },
    {
        id: 2,
        tittel: "Mellomste nyhet",
        ingress: "Ingress for mellomste nyhet",
        dato: new Date("2026-06-04"),
    },
    {
        id: 1,
        tittel: "Eldste nyhet",
        ingress: "Ingress for eldste nyhet",
        dato: new Date("2026-06-01"),
    },
];

jest.mock("./Nyhetsdata", () => ({
    get UFILTRERT_NYHETSLISTE() {
        return testnyheter;
    },
}));

function renderNyheter(sti: string) {
    return render(
        <MemoryRouter initialEntries={[sti]}>
            <Routes>
                <Route path="/nyheter/:nyhetsId?" element={<Nyheter />} />
            </Routes>
        </MemoryRouter>,
    );
}

describe("Nyhetssiden", () => {
    test("viser alle nyhetene i lista", () => {
        renderNyheter("/nyheter");

        testnyheter.forEach((nyhet) => {
            expect(
                screen.getByRole("link", { name: nyhet.tittel }),
            ).toHaveAttribute("href", `/nyheter/${nyhet.id}`);
        });
    });

    test("viser ingen detaljer når ingen nyhet er valgt", () => {
        renderNyheter("/nyheter");

        expect(
            screen.queryByText(testnyheter[0].ingress),
        ).not.toBeInTheDocument();
    });

    test("viser detaljer for valgt nyhet", () => {
        const valgtNyhet = testnyheter[1];

        renderNyheter(`/nyheter/${valgtNyhet.id}`);

        expect(
            screen.getByRole("heading", { name: valgtNyhet.tittel }),
        ).toBeInTheDocument();
        expect(screen.getByText(valgtNyhet.ingress)).toBeInTheDocument();
        expect(
            screen.getByText(lokalDato(valgtNyhet.dato)),
        ).toBeInTheDocument();
    });

    test("viser ingen detaljer for ukjent nyhets-id", () => {
        renderNyheter("/nyheter/999");

        expect(screen.getAllByRole("link")).toHaveLength(testnyheter.length);
        testnyheter.forEach((nyhet) => {
            expect(screen.queryByText(nyhet.ingress)).not.toBeInTheDocument();
        });
    });

    test("markerer valgt nyhet som aktiv lenke", () => {
        const valgtNyhet = testnyheter[0];

        renderNyheter(`/nyheter/${valgtNyhet.id}`);

        expect(
            screen.getByRole("link", { name: valgtNyhet.tittel }),
        ).toHaveClass("aktivLenke");
        expect(
            screen.getByRole("link", { name: testnyheter[1].tittel }),
        ).not.toHaveClass("aktivLenke");
    });

    test("har ingen accessibilityfeil", async () => {
        const { container } = renderNyheter(`/nyheter/${testnyheter[0].id}`);

        expect(await axe(container)).toHaveNoViolations();
    });
});
