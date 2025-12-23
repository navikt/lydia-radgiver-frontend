import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { act } from "react";

import { DokumentStatusEnum } from "../../src/domenetyper/domenetyper";
import { Spørreundersøkelse } from "../../src/domenetyper/spørreundersøkelse";
import { usePollingAvKartleggingVedAvsluttetStatus } from "../../src/util/usePollingAvKartleggingVedAvsluttetStatus";


type PubliseringStatus = Spørreundersøkelse["publiseringStatus"];

function TestPollingKomponent({
    status,
    publiseringStatus,
    hentKartleggingPåNytt,
}: {
    status: string;
    publiseringStatus: PubliseringStatus;
    hentKartleggingPåNytt: () => void;
}) {
    const spørreundersøkelse: Pick<
        Spørreundersøkelse,
        "publiseringStatus"
    > = {
        publiseringStatus,
    };

    const { henterKartleggingPånytt, forsøkPåÅHenteKartlegging } =
        usePollingAvKartleggingVedAvsluttetStatus(
            status,
            spørreundersøkelse as Spørreundersøkelse,
            hentKartleggingPåNytt,
        );

    return (
        <>
            <span data-testid="henter">
                {henterKartleggingPånytt ? "true" : "false"}
            </span>
            <span data-testid="forsok">{forsøkPåÅHenteKartlegging}</span>
        </>
    );
}

describe("usePollingAvKartleggingVedAvsluttetStatus", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test("starter polling når status er AVSLUTTET og publiseringStatus er OPPRETTET", () => {
        const hentKartleggingPåNytt = jest.fn();

        render(
            <TestPollingKomponent
                status="AVSLUTTET"
                publiseringStatus={DokumentStatusEnum.enum.OPPRETTET}
                hentKartleggingPåNytt={hentKartleggingPåNytt}
            />,
        );

        // Etter mount skal vi være i "henter"-modus og første forsøk registrert
        expect(screen.getByTestId("henter")).toHaveTextContent("true");
        expect(screen.getByTestId("forsok")).toHaveTextContent("1");
    });

    test("starter ikke polling når betingelser ikke er oppfylt", () => {
        const hentKartleggingPåNytt = jest.fn();

        render(
            <TestPollingKomponent
                status="PÅBEGYNT"
                publiseringStatus={DokumentStatusEnum.enum.OPPRETTET}
                hentKartleggingPåNytt={hentKartleggingPåNytt}
            />,
        );

        act(() => {
            jest.advanceTimersByTime(10000);
        });

        expect(hentKartleggingPåNytt).not.toHaveBeenCalled();
        expect(screen.getByTestId("forsok")).toHaveTextContent("0");
    });
})
