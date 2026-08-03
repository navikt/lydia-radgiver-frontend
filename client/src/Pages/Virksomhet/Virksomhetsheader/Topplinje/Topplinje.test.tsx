import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Topplinje } from "./index";
import { Virksomhet } from "../../../../domenetyper/virksomhet";

jest.mock("../../../../api/lydia-api/nyFlyt", () => ({
    useHentTilstandForVirksomhetNyFlyt: jest.fn(),
}));

jest.mock("../../../../api/lydia-api/virksomhet", () => ({
    useHentSalesforceUrl: jest.fn(),
}));

import { useHentTilstandForVirksomhetNyFlyt } from "../../../../api/lydia-api/nyFlyt";
import { useHentSalesforceUrl } from "../../../../api/lydia-api/virksomhet";

const virksomhet: Virksomhet = {
    orgnr: "123456789",
    navn: "Test AS",
    adresse: ["Testgaten 1"],
    postnummer: "0001",
    poststed: "OSLO",
    næring: { navn: "Somatiske sykehus", kode: "86.101" },
    næringsundergruppe1: { navn: "Sykehustjenester", kode: "86.1" },
    næringsundergruppe2: null,
    næringsundergruppe3: null,
    bransje: null,
    status: "FJERNET",
    aktivtSaksnummer: null,
};

describe("Topplinje — VirksomhetErAvregistrertIBrreg", () => {
    beforeEach(() => {
        (useHentTilstandForVirksomhetNyFlyt as jest.Mock).mockReturnValue({
            data: {
                orgnr: virksomhet.orgnr,
                tilstand: "VirksomhetErAvregistrertIBrreg",
                nesteTilstand: null,
            },
            loading: false,
        });
        (useHentSalesforceUrl as jest.Mock).mockReturnValue({
            data: { url: "https://salesforce.example.com/123456789" },
        });
    });

    it("viser Salesforce-lenke", () => {
        render(<Topplinje virksomhet={virksomhet} />);
        expect(
            screen.getByText("Salesforce - virksomhet"),
        ).toBeInTheDocument();
    });

    it("viser ingen handlingsknapper", () => {
        render(<Topplinje virksomhet={virksomhet} />);
        expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
});
