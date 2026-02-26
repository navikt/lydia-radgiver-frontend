import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import EndreSamarbeidsnavnModal, {
    navnError,
} from "../../../../src/Pages/NyFlyt/Virksomhetsside/AdministrerSamarbeid/EndreSamarbeidsnavnModal";
import { IaSakProsess } from "../../../../src/domenetyper/iaSakProsess";

HTMLDialogElement.prototype.showModal = jest.fn();
HTMLDialogElement.prototype.close = jest.fn();

const testSamarbeid: IaSakProsess = {
    id: 1,
    saksnummer: "SAK-001",
    navn: "Avdeling Bergen",
    status: "AKTIV",
    sistEndret: new Date("2025-01-01"),
    opprettet: new Date("2025-01-01"),
};

const annetSamarbeid: IaSakProsess = {
    id: 2,
    saksnummer: "SAK-001",
    navn: "Avdeling Oslo",
    status: "AKTIV",
    sistEndret: new Date("2025-01-01"),
    opprettet: new Date("2025-01-01"),
};

function renderModal(
    samarbeid: IaSakProsess = testSamarbeid,
    alleSamarbeid?: IaSakProsess[],
) {
    const ref = React.createRef<HTMLDialogElement>();
    const result = render(
        <EndreSamarbeidsnavnModal
            ref={ref}
            samarbeid={samarbeid}
            alleSamarbeid={alleSamarbeid}
        />,
    );
    ref.current?.setAttribute("open", "");
    return result;
}

describe("navnError", () => {
    it("returnerer feil når navn er tomt", () => {
        expect(navnError("", true, "Existing")).toBe(
            "Navnet kan ikke være tomt",
        );
    });

    it("returnerer feil når navn allerede er i bruk av et annet samarbeid", () => {
        expect(navnError("Avdeling Oslo", false, "Avdeling Bergen")).toBe(
            "Navnet er allerede i bruk",
        );
    });

    it("returnerer undefined når navn er ledig og ikke tomt", () => {
        expect(navnError("Nytt navn", true, "Gammelt navn")).toBeUndefined();
    });

    it("returnerer undefined når navn er det samme som samarbeidets eget eksisterende navn", () => {
        expect(
            navnError("Avdeling Bergen", false, "Avdeling Bergen"),
        ).toBeUndefined();
    });
});

describe("EndreSamarbeidsnavnModal", () => {
    it("viser inndatafelt forhåndsutfylt med eksisterende navn", () => {
        renderModal();
        expect(screen.getByRole("textbox")).toHaveValue("Avdeling Bergen");
    });

    it("Lagre-knapp er deaktivert når navn er uendret", () => {
        renderModal();
        expect(screen.getByRole("button", { name: "Lagre" })).toBeDisabled();
    });

    it("Lagre-knapp er deaktivert når navn er tomt", () => {
        renderModal();
        fireEvent.change(screen.getByRole("textbox"), {
            target: { value: "" },
        });
        expect(screen.getByRole("button", { name: "Lagre" })).toBeDisabled();
    });

    it("Lagre-knapp aktiveres ved nytt og unikt navn", () => {
        renderModal(testSamarbeid, [testSamarbeid, annetSamarbeid]);
        fireEvent.change(screen.getByRole("textbox"), {
            target: { value: "Avdeling Trondheim" },
        });
        expect(
            screen.getByRole("button", { name: "Lagre" }),
        ).not.toBeDisabled();
    });

    it("Lagre-knapp er deaktivert når navn allerede er i bruk", () => {
        renderModal(testSamarbeid, [testSamarbeid, annetSamarbeid]);
        fireEvent.change(screen.getByRole("textbox"), {
            target: { value: "Avdeling Oslo" },
        });
        expect(screen.getByRole("button", { name: "Lagre" })).toBeDisabled();
    });

    it("viser feilmelding når navn er tomt", () => {
        renderModal();
        fireEvent.change(screen.getByRole("textbox"), {
            target: { value: "" },
        });
        expect(
            screen.getByText("Navnet kan ikke være tomt"),
        ).toBeInTheDocument();
    });

    it("viser feilmelding når navn allerede er i bruk", () => {
        renderModal(testSamarbeid, [testSamarbeid, annetSamarbeid]);
        fireEvent.change(screen.getByRole("textbox"), {
            target: { value: "Avdeling Oslo" },
        });
        expect(
            screen.getByText("Navnet er allerede i bruk"),
        ).toBeInTheDocument();
    });

    it("Avbryt setter inndatafeltet tilbake til opprinnelig navn", () => {
        renderModal();
        fireEvent.change(screen.getByRole("textbox"), {
            target: { value: "Midlertidig navn" },
        });
        expect(screen.getByRole("textbox")).toHaveValue("Midlertidig navn");

        fireEvent.click(screen.getByRole("button", { name: "Avbryt" }));

        expect(screen.getByRole("textbox")).toHaveValue("Avdeling Bergen");
    });
});
