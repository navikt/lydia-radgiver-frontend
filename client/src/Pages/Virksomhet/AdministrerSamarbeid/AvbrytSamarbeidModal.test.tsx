import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe } from "jest-axe";
import { IASak, spørreundersøkelseStatusEnum } from "@/domenetyper/domenetyper";
import AvbrytSamarbeidModal from "@/Pages/Virksomhet/AdministrerSamarbeid/AvbrytSamarbeidModal";
import * as spørreundersøkelse from "@features/kartlegging/api/spørreundersøkelse";
import { SpørreundersøkelseTypeEnum } from "@features/kartlegging/types/spørreundersøkelseMedInnhold";
import * as nyFlyt from "@features/sak/api/nyFlyt";
import { IaSakProsess } from "@features/sak/types/iaSakProsess";
import { dummySpørreundersøkelseliste } from "@mocks/spørreundersøkelseDummyData";

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

const alleSamarbeid = [testSamarbeid, annetSamarbeid];

const testIaSak: IASak = {
    saksnummer: "SAK-001",
    orgnr: "123456789",
    opprettetTidspunkt: new Date("2025-01-01"),
    opprettetAv: "Z123456",
    endretTidspunkt: null,
    endretAv: null,
    endretAvHendelseId: "hendelse-1",
    eidAv: null,
    status: "VURDERES",
    gyldigeNesteHendelser: [],
    lukket: false,
};

function renderModal(
    samarbeid?: IaSakProsess | null,
    iaSak?: IASak,
    samarbeidListe?: IaSakProsess[],
) {
    const ref = React.createRef<HTMLDialogElement>();
    const result = render(
        <AvbrytSamarbeidModal
            ref={ref}
            valgtSamarbeid={samarbeid}
            iaSak={iaSak}
            alleSamarbeid={samarbeidListe ?? alleSamarbeid}
        />,
    );
    ref.current?.setAttribute("open", "");
    return { ...result, ref };
}

describe("AvbrytSamarbeidModal", () => {
    let avsluttSamarbeidMock: jest.SpyInstance;

    beforeEach(() => {
        jest.clearAllMocks();
        avsluttSamarbeidMock = jest
            .spyOn(nyFlyt, "avsluttSamarbeidNyFlyt")
            .mockResolvedValue(undefined as never);
        jest.spyOn(
            spørreundersøkelse,
            "useSpørreundersøkelsesliste",
        ).mockReturnValue({
            data: [],
            loading: false,
            validating: false,
            mutate: jest.fn(),
        } as never);
    });

    afterEach(() => {
        avsluttSamarbeidMock.mockRestore();
    });

    it("Lukk-knappen lukker modalen", () => {
        const { ref } = renderModal(testSamarbeid, testIaSak);
        const [, footerLukkButton] = screen.getAllByRole("button", {
            name: "Lukk",
        });
        fireEvent.click(footerLukkButton);
        expect(ref.current?.close).toHaveBeenCalled();
    });

    it("kaller avsluttSamarbeidNyFlyt med riktig data ved klikk på Avbryt samarbeidet", async () => {
        renderModal(testSamarbeid, testIaSak);
        fireEvent.click(
            screen.getByRole("button", { name: "Avbryt samarbeidet" }),
        );
        await waitFor(() => {
            expect(avsluttSamarbeidMock).toHaveBeenCalledWith(
                "123456789",
                1,
                expect.objectContaining({
                    id: 1,
                    navn: "Avdeling Bergen",
                    status: "AVBRUTT",
                }),
            );
        });
    });

    it("kaller ikke avsluttSamarbeidNyFlyt når samarbeid mangler", async () => {
        renderModal(null, testIaSak);
        expect(
            screen.queryByRole("button", { name: "Avbryt samarbeidet" }),
        ).not.toBeInTheDocument();
    });

    it("kaller ikke avsluttSamarbeidNyFlyt når iaSak mangler", async () => {
        renderModal(testSamarbeid, undefined);
        expect(
            screen.queryByRole("button", { name: "Avbryt samarbeidet" }),
        ).not.toBeInTheDocument();
    });

    it("Avbryt-samarbeidet-knappen er deaktivert når det finnes påbegynte behovsvurderinger", () => {
        jest.spyOn(
            spørreundersøkelse,
            "useSpørreundersøkelsesliste",
        ).mockReturnValue({
            data: [
                {
                    ...dummySpørreundersøkelseliste[0],
                    type: SpørreundersøkelseTypeEnum.enum.BEHOVSVURDERING,
                    status: spørreundersøkelseStatusEnum.enum.PÅBEGYNT,
                },
            ],
            loading: false,
            validating: false,
            mutate: jest.fn(),
        } as never);

        renderModal(testSamarbeid, testIaSak);
        expect(
            screen.queryByRole("button", { name: "Avbryt samarbeidet" }),
        ).toBeDisabled();
    });

    it("lukker modalen ved feil i API-kallet", async () => {
        avsluttSamarbeidMock.mockRejectedValue(new Error("API-feil"));
        const { ref } = renderModal(testSamarbeid, testIaSak);
        fireEvent.click(
            screen.getByRole("button", { name: "Avbryt samarbeidet" }),
        );
        await waitFor(() => {
            expect(ref.current?.close).toHaveBeenCalled();
        });
    });

    it("har ingen axe-feil", async () => {
        const { container } = renderModal(testSamarbeid, testIaSak);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    describe("bekreft-flyt når det er siste samarbeid", () => {
        it("kaller ikke avsluttSamarbeidNyFlyt direkte og åpner bekreft-modal", async () => {
            renderModal(testSamarbeid, testIaSak, [testSamarbeid]);
            const [avbrytKnapp] = screen.getAllByRole("button", {
                name: "Avbryt samarbeidet",
            });
            fireEvent.click(avbrytKnapp);
            await waitFor(() => {
                expect(avsluttSamarbeidMock).not.toHaveBeenCalled();
                expect(
                    HTMLDialogElement.prototype.showModal,
                ).toHaveBeenCalled();
            });
        });

        it("kaller avsluttSamarbeidNyFlyt ved bekreftelse i bekreft-modalen", async () => {
            renderModal(testSamarbeid, testIaSak, [testSamarbeid]);
            const [, bekreftKnapp] = screen.getAllByRole("button", {
                name: "Avbryt samarbeidet",
                hidden: true,
            });
            fireEvent.click(bekreftKnapp);
            await waitFor(() => {
                expect(avsluttSamarbeidMock).toHaveBeenCalledWith(
                    "123456789",
                    1,
                    expect.objectContaining({
                        id: 1,
                        navn: "Avdeling Bergen",
                        status: "AVBRUTT",
                    }),
                    expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
                );
            });
        });
    });
});
