import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ReactNode } from "react";
import {
    Samarbeidsperiode,
    Virksomhetshistorikk,
} from "../../../../domenetyper/historikk";
import { VirksomhetshistorikkInnhold } from ".";

jest.mock("../../../../components/NavnForNavIdent", () => ({
    NavnForNavIdentProvider: ({ children }: { children: ReactNode }) => children,
}));

jest.mock("./SamarbeidsperiodeHistorikk", () => ({
    SamarbeidsperiodeHistorikkMedDatahenting: ({
        samarbeidsperiode,
    }: {
        samarbeidsperiode: Samarbeidsperiode;
    }) => <div>{samarbeidsperiode.saksnummer}</div>,
}));

const samarbeidsperioder: Samarbeidsperiode[] = [
    {
        saksnummer: "sak-nyest",
        fraDato: new Date("2026-09-03"),
        status: "AKTIV",
    },
    {
        saksnummer: "sak-midten",
        fraDato: new Date("2026-09-02"),
        status: "AVSLUTTET",
    },
    {
        saksnummer: "sak-eldst",
        fraDato: new Date("2026-09-01"),
        status: "AVSLUTTET",
    },
];

const lagHistorikk = (
    perioder: Samarbeidsperiode[],
): Virksomhetshistorikk => ({
    hendelser: [],
    samarbeidsperioder: perioder,
});

describe("VirksomhetshistorikkInnhold", () => {
    it("beholder valgt fane ved revalidering med samme nyeste samarbeidsperiode", () => {
        const { rerender } = render(
            <VirksomhetshistorikkInnhold
                virksomhetshistorikk={lagHistorikk(samarbeidsperioder)}
                lasterVirksomhetshistorikk={false}
                orgnr="123456789"
            />,
        );

        fireEvent.click(screen.getAllByRole("tab")[2]);
        expect(screen.getAllByRole("tab")[2]).toHaveAttribute(
            "aria-selected",
            "true",
        );

        rerender(
            <VirksomhetshistorikkInnhold
                virksomhetshistorikk={lagHistorikk(
                    samarbeidsperioder.map((periode) => ({ ...periode })),
                )}
                lasterVirksomhetshistorikk={false}
                orgnr="123456789"
            />,
        );

        expect(screen.getAllByRole("tab")[2]).toHaveAttribute(
            "aria-selected",
            "true",
        );
    });

    it("velger automatisk en ny samarbeidsperiode", async () => {
        const { rerender } = render(
            <VirksomhetshistorikkInnhold
                virksomhetshistorikk={lagHistorikk(samarbeidsperioder)}
                lasterVirksomhetshistorikk={false}
                orgnr="123456789"
            />,
        );

        fireEvent.click(screen.getAllByRole("tab")[2]);

        rerender(
            <VirksomhetshistorikkInnhold
                virksomhetshistorikk={lagHistorikk([
                    {
                        saksnummer: "sak-ny",
                        fraDato: new Date("2026-09-04"),
                        status: "AKTIV",
                    },
                    ...samarbeidsperioder,
                ])}
                lasterVirksomhetshistorikk={false}
                orgnr="123456789"
            />,
        );

        await waitFor(() =>
            expect(screen.getAllByRole("tab")[0]).toHaveAttribute(
                "aria-selected",
                "true",
            ),
        );
    });
});
