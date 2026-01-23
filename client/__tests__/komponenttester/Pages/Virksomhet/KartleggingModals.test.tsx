import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";

import { StartSpørreundersøkelseModal } from "../../../../src/Pages/Virksomhet/Kartlegging/StartSpørreundersøkelseModal";
import { FullførSpørreundersøkelseModal } from "../../../../src/Pages/Virksomhet/Kartlegging/FullførSpørreundersøkelseModal";
import { SlettSpørreundersøkelseModal } from "../../../../src/Pages/Virksomhet/Kartlegging/SlettSpørreundersøkelseModal";
import OpprettBehovsvurderingAlert from "../../../../src/Pages/Virksomhet/Kartlegging/OpprettetBehovsvurderingAlert";
import { Spørreundersøkelse } from "../../../../src/domenetyper/spørreundersøkelse";
import { BekreftValgModalProps } from "../../../../src/components/Modal/BekreftValgModal";
import { dummySpørreundersøkelseliste } from "../../../../__mocks__/spørreundersøkelseDummyData";

jest.mock("../../../../src/util/navigasjon", () => ({
    åpneSpørreundersøkelseINyFane: jest.fn(),
}));

jest.mock("../../../../src/components/Modal/BekreftValgModal", () => ({
    BekreftValgModal: ({
        title,
        description,
        jaTekst,
        åpen,
        onConfirm,
        onCancel,
        children,
    }: BekreftValgModalProps) => (
        <div>
            <h1>{title}</h1>
            {description && <p>{description}</p>}
            {åpen && <button onClick={onConfirm}>{jaTekst ?? "OK"}</button>}
            <button onClick={onCancel}>Avbryt</button>
            {children}
        </div>
    ),
}));

jest.mock(
    "../../../../src/components/Spørreundersøkelse/SpørreundersøkelseContext",
    () => ({
        useSpørreundersøkelseType: () => "BEHOVSVURDERING",
        useSpørreundersøkelse: () => ({
            spørreundersøkelseType: "BEHOVSVURDERING",
        }),
    }),
);

jest.mock(
    "../../../../src/components/Spørreundersøkelse/Spørreundersøkelseliste/utils",
    () => ({
        FormatertSpørreundersøkelseType: ({ type }: { type: string }) => (
            <span>{type}</span>
        ),
    }),
);

jest.mock("../../../../src/util/dato", () => ({
    lokalDatoMedKlokkeslett: () => "01.01.2023 kl. 10:00",
}));

const dummySpørreundersøkelse: Spørreundersøkelse =
    dummySpørreundersøkelseliste[0];

describe("StartSpørreundersøkelseModal", () => {
    test("kaller callbacks og åpner spørreundersøkelse ved bekreftelse", () => {
        const startSpørreundersøkelsen = jest.fn();
        const lukkModal = jest.fn();
        const { åpneSpørreundersøkelseINyFane } = jest.requireMock(
            "../../../../src/util/navigasjon",
        );

        render(
            <StartSpørreundersøkelseModal
                spørreundersøkelse={dummySpørreundersøkelse}
                erModalÅpen={true}
                lukkModal={lukkModal}
                startSpørreundersøkelsen={startSpørreundersøkelsen}
            />,
        );

        fireEvent.click(screen.getByText("Start"));

        expect(startSpørreundersøkelsen).toHaveBeenCalled();
        expect(åpneSpørreundersøkelseINyFane).toHaveBeenCalledWith(
            dummySpørreundersøkelse.id,
            "OPPRETTET",
        );
        expect(lukkModal).toHaveBeenCalled();
    });
});

describe("FullførSpørreundersøkelseModal", () => {
    test("viser ekstra tekst når det er nok deltakere", () => {
        const lukkModal = jest.fn();
        const fullførSpørreundersøkelse = jest.fn();

        render(
            <FullførSpørreundersøkelseModal
                erModalÅpen={true}
                lukkModal={lukkModal}
                harNokDeltakere={true}
                fullførSpørreundersøkelse={fullførSpørreundersøkelse}
            />,
        );

        expect(
            screen.getByText(
                /Minst 3 deltakere må ha svart for å kunne vise resultater/i,
            ),
        ).toBeInTheDocument();

        fireEvent.click(screen.getByText("OK"));
        expect(fullførSpørreundersøkelse).toHaveBeenCalled();
    });

    test("skjuler ekstra tekst når det ikke er nok deltakere", () => {
        const lukkModal = jest.fn();

        render(
            <FullførSpørreundersøkelseModal
                erModalÅpen={true}
                lukkModal={lukkModal}
                harNokDeltakere={false}
                fullførSpørreundersøkelse={() => undefined}
            />,
        );

        expect(
            screen.queryByText(
                /Minst 3 deltakere må ha svart for å kunne vise resultater/i,
            ),
        ).not.toBeInTheDocument();
    });
});

describe("SlettSpørreundersøkelseModal", () => {
    test("viser korrekt tittel og beskrivelse for behovsvurdering", () => {
        const lukkModal = jest.fn();
        const slettSpørreundersøkelsen = jest.fn();

        render(
            <SlettSpørreundersøkelseModal
                spørreundersøkelse={dummySpørreundersøkelse}
                erModalÅpen={true}
                lukkModal={lukkModal}
                slettSpørreundersøkelsen={slettSpørreundersøkelsen}
            />,
        );

        expect(
            screen.getByText(
                "Er du sikker på at du vil slette denne behovsvurderingen?",
            ),
        ).toBeInTheDocument();
        expect(
            screen.getByText("Behovsvurdering opprettet 01.01.2023 kl. 10:00."),
        ).toBeInTheDocument();

        fireEvent.click(screen.getByText("OK"));
        expect(slettSpørreundersøkelsen).toHaveBeenCalled();
    });
});

describe("OpprettBehovsvurderingAlert", () => {
    test("viser tekst og kaller onClose ved klikk", () => {
        const onClose = jest.fn();

        render(<OpprettBehovsvurderingAlert onClose={onClose} />);

        expect(screen.getByText(/opprettet\. Når/i)).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: /lukk/i }));
        expect(onClose).toHaveBeenCalled();
    });
});
